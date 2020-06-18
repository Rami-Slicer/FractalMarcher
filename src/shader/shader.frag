#version 400

uniform sampler2D texture;
uniform vec2 screen_size;
uniform float a;
uniform float b;
uniform vec2 rotate_camera;
uniform vec3 eye_pos;

precision mediump float;



vec3 light1Pos = vec3(0.0,500.0,1000.0);
vec3 light2Pos = vec3(0.0,-500.0,-1000.0);

const int MAX_MARCHING_ITER = 255;
const int MAX_DE_ITER = 8;
const float MIN_DIST = 0.0;
const float MAX_DIST = 10000.0;
const float FOV = 70.0;
const vec3 BACKGROUND_COLOR = vec3(0,1.0,0.5);
const float EPSILON = 0.01;
//
// Distance esimators
//


// distance estimator for sphere
float sphereDE(vec3 p) {
	return length(p)-1.0;
}

float boxDE( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float SierpenskiDE(vec3 z)
{
	float Scale = 1.0;
	vec3 a1 = vec3(1,1,1);
	vec3 a2 = vec3(-1,-1,1);
	vec3 a3 = vec3(1,-1,-1);
	vec3 a4 = vec3(-1,1,-1);
	vec3 c;
	int n = 0;
	float dist, d;
	while (n < MAX_DE_ITER) {
		 c = a1; dist = length(z-a1);
	        d = length(z-a2); if (d < dist) { c = a2; dist=d; }
		 d = length(z-a3); if (d < dist) { c = a3; dist=d; }
		 d = length(z-a4); if (d < dist) { c = a4; dist=d; }
		z = Scale*z-c*(Scale-1.0);
		n++;
	}

	return length(z) * pow(Scale, float(-n));
}

//
// Folds
//

void planeFold(inout vec3 z, vec3 n, float d) {
	z.xyz -= 2.0 * min(0.0, dot(z.xyz, n) - d) * n;
}
void absFold(inout vec3 z, vec3 c) {
	z.xyz = abs(z.xyz - c) + c;
}
void sierpinskiFold(inout vec3 z) {
	z.xy -= min(z.x + z.y, 0.0);
	z.xz -= min(z.x + z.z, 0.0);
	z.yz -= min(z.y + z.z, 0.0);
}
void mengerFold(inout vec3 z) {
	float a = min(z.x - z.y, 0.0);
	z.x -= a;
	z.y += a;
	a = min(z.x - z.z, 0.0);
	z.x -= a;
	z.z += a;
	a = min(z.y - z.z, 0.0);
	z.y -= a;
	z.z += a;
}
void sphereFold(inout vec3 z, float minR, float maxR) {
	float r2 = dot(z.xyz, z.xyz);
	z *= max(maxR / max(minR, r2), 1.0);
}
void boxFold(inout vec3 z, vec3 r) {
	z.xyz = clamp(z.xyz, -r, r) * 2.0 - z.xyz;
}
void rotX(inout vec3 z, float s, float c) {
	z.yz = vec2(c*z.y + s*z.z, c*z.z - s*z.y);
}
void rotY(inout vec3 z, float s, float c) {
	z.xz = vec2(c*z.x - s*z.z, c*z.z + s*z.x);
}
void rotZ(inout vec3 z, float s, float c) {
	z.xy = vec2(c*z.x + s*z.y, c*z.y - s*z.x);
}
void rotX(inout vec3 z, float a) {
	rotX(z, sin(a), cos(a));
}
void rotY(inout vec3 z, float a) {
	rotY(z, sin(a), cos(a));
}
void rotZ(inout vec3 z, float a) {
	rotZ(z, sin(a), cos(a));
}

// another scene DE, kinda weird
// float sceneDE(vec3 p) {
// 	for(int i = 0; i<MAX_DE_ITER; i++) {
// 		boxFold(p,vec3(1.0));
// 		sphereFold(p,1.5,1.0);
// 		p *= vec3(1.1);
// 		rotX(p,a);
// 		rotZ(p,b);
// 	}
// 	return boxDE(p,vec3(1.0));
// }

// scene distance estimator; folds go here
float sceneDE(vec3 p) {
	for(int i = 0; i<MAX_DE_ITER; i++) {
		boxFold(p,vec3(1.0));
		sphereFold(p,0.5,a);
		p *= vec3(1.1);
		rotZ(p,b);
	}
	return boxDE(p,vec3(1.0));
}

vec3 rayDirection(float fieldOfView, vec2 size, vec2 fragCoord) {
	vec2 xy = fragCoord - size / 2.0;
	float z = size.y / tan(radians(fieldOfView) / 2.0);
	return normalize(vec3(xy, -z));
}

// from the syntopia blog, marches the ray, and outputs a primitive version of ambient occlusion 
float march(vec3 eye, vec3 marchingDirection, float start, float end) {
	float depth = start;
	
	for (int i = 0; i < MAX_MARCHING_ITER; i++) {
		float dist = sceneDE(eye + depth * marchingDirection);
		if (dist < EPSILON) {
			// We're inside the scene surface!
			return depth;
		}
		// Move along the view ray
		depth += dist;
		
		if (depth >= end) {
			// Gone too far; give up
			return end;
		}
	}
	
	return end;
}

vec3 estimateNormal(vec3 p) {
    return normalize(vec3(
        sceneDE(vec3(p.x + EPSILON, p.y, p.z)) - sceneDE(vec3(p.x - EPSILON, p.y, p.z)),
        sceneDE(vec3(p.x, p.y + EPSILON, p.z)) - sceneDE(vec3(p.x, p.y - EPSILON, p.z)),
        sceneDE(vec3(p.x, p.y, p.z  + EPSILON)) - sceneDE(vec3(p.x, p.y, p.z - EPSILON))
    ));
}


vec3 phongContribForLight(vec3 k_d, vec3 k_s, float alpha, vec3 p, vec3 eye,
                          vec3 lightPos, vec3 lightIntensity) {
    vec3 N = estimateNormal(p);
    vec3 L = normalize(lightPos - p);
    vec3 V = normalize(eye - p);
    vec3 R = normalize(reflect(-L, N));
    
    float dotLN = dot(L, N);
    float dotRV = dot(R, V);
    
    if (dotLN < 0.0) {
        // Light not visible from this point on the surface
        return vec3(0.0, 0.0, 0.0);
    } 
    
    if (dotRV < 0.0) {
        // Light reflection in opposite direction as viewer, apply only diffuse
        // component
        return lightIntensity * (k_d * dotLN);
    }
    return lightIntensity * (k_d * dotLN + k_s * pow(dotRV, alpha));
}

/**
 * Lighting via Phong illumination.
 * 
 * The vec3 returned is the RGB color of that point after lighting is applied.
 * k_a: Ambient color
 * k_d: Diffuse color
 * k_s: Specular color
 * alpha: Shininess coefficient
 * p: position of point being lit
 * eye: the position of the camera
 *
 * See https://en.wikipedia.org/wiki/Phong_reflection_model#Description
 */
vec3 phongIllumination(vec3 k_a, vec3 k_d, vec3 k_s, float alpha, vec3 p, vec3 eye) {
    const vec3 ambientLight = 0.5 * vec3(1.0, 1.0, 1.0);
    vec3 color = ambientLight * k_a;
    

    vec3 light1Intensity = vec3(0.7, 0.7, 0.7);
    
    color += phongContribForLight(k_d, k_s, alpha, p, eye,
                                  light1Pos,
                                  light1Intensity);
    
    vec3 light2Intensity = vec3(0.4, 0.4, 0.4);

    color += phongContribForLight(k_d, k_s, alpha, p, eye,
                                  light2Pos,
                                  light2Intensity);    
    return color;
}

mat3 rotationXY( vec2 angle ) {
	vec2 c = cos( angle );
	vec2 s = sin( angle );
	
	return mat3(
		vec3(c.y,  0.0, -s.y),
		vec3(s.y * s.x,  c.x,  c.y * s.x),
		vec3(s.y * c.x, -s.x,  c.y * c.x)
	);
}


void main()
{
	
	vec3 eye = vec3(0.0,10.0,10.0)+eye_pos;
	vec3 dir = rayDirection(FOV,screen_size,gl_FragCoord.xy);

	mat3 rot = rotationXY(rotate_camera * vec2( 0.01, -0.01 ));
	dir = rot * dir;

	float dist = march(eye,dir,MIN_DIST,MAX_DIST);
	vec4 pixel;

	vec3 p = eye + dist * dir;
	
	vec3 K_a = vec3(0.5, 0.5, 0.2);
	vec3 K_d = vec3(1.0,0.5,0.1);
	vec3 K_s = vec3(1.0, 1.0, 1.0);
	float shininess = 10.0;

	if (dist >= MAX_DIST) {
		pixel.rbg = BACKGROUND_COLOR;
	} else {
		pixel.rbg = phongIllumination(K_a, K_d, K_s, shininess, p, eye);
	}

    gl_FragColor = pixel;
}
