/* FractalMarcher: a realtime 3D fractal rendering engine inspired by CodeParade's PySpace.
 * Check it out too! https://github.com/HackerPoet/PySpace
 */

#include "res.hpp"
#include "util.hpp"
#include <SFML/Graphics.hpp>
#include <iostream>
#include <string>

float shader_param[] = {0.1, 1.0, 2.0, 6.0, 6.0, 1.0};
float camera_param[2] = {0,0};
float camera_position[3] = {0,0,0};

float rotate_speed = 0.1;
float movement_speed = 0.1;

int main()
{
    // create the window
    sf::RenderWindow window(sf::VideoMode(800, 600), "My window");

    // run the program as long as the window is open
    while (window.isOpen())
    {
        // check all the window's events that were triggered since the last iteration of the loop
        sf::Event event;
        while (window.pollEvent(event))
        {
            // "close requested" event: we close the window
            if (event.type == sf::Event::Closed)
                window.close();
        }

        // clear the window with black color
        window.clear(sf::Color::Black);

        // create rectangle to use the shader on
        sf::Vector2f window_size = sf::Vector2f(window.getSize());
        sf::RectangleShape render_rect(window_size);

        // create a shader object
        sf::Shader shader;
        
        // load the shader if it exists
        if (!shader.loadFromFile(fragment_shader, sf::Shader::Fragment))
        {
            // give an error if it doesn't exist and exit 
            std::cout << "Couldn't load shader file; please make sure it exists" << std::endl;
            return 0;
        }

        shader.setUniform("screen_size", window_size);

        // change fractal params
        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Insert))
        {

            shader_param[0] += 0.001;
        } else if (sf::Keyboard::isKeyPressed(sf::Keyboard::Delete))
        {

            shader_param[0] -= 0.001;
        }

        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Home))
        {

            shader_param[1] += 0.001;
        } else if (sf::Keyboard::isKeyPressed(sf::Keyboard::End))
        {

            shader_param[1] -= 0.001;
        }

        // change camera params

        if (sf::Keyboard::isKeyPressed(sf::Keyboard::J))
        {

            camera_param[1] += rotate_speed;
        } else if (sf::Keyboard::isKeyPressed(sf::Keyboard::L))
        {

            camera_param[1] -= rotate_speed;
        }

        if (sf::Keyboard::isKeyPressed(sf::Keyboard::I))
        {

            camera_param[0] += rotate_speed;
        } else if (sf::Keyboard::isKeyPressed(sf::Keyboard::K))
        {

            camera_param[0] -= rotate_speed;
        }

        // camera movement

        if (sf::Keyboard::isKeyPressed(sf::Keyboard::W))
        {

            camera_position[2] += movement_speed;
        } else if (sf::Keyboard::isKeyPressed(sf::Keyboard::S))
        {

            camera_position[2] -= movement_speed;
        }

        if (sf::Keyboard::isKeyPressed(sf::Keyboard::A))
        {

            camera_position[0] += movement_speed;
        } else if (sf::Keyboard::isKeyPressed(sf::Keyboard::D))
        {

            camera_position[0] -= movement_speed;
        }

        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Space))
        {

            camera_position[1] += movement_speed;
        } else if (sf::Keyboard::isKeyPressed(sf::Keyboard::LShift))
        {

            camera_position[1] -= movement_speed;
        }


        shader.setUniform("a",shader_param[0]);
        shader.setUniform("b",shader_param[1]);
        shader.setUniform("rotate_camera",sf::Vector2f(camera_param[0],camera_param[1]));
        shader.setUniform("eye_pos",sf::Vector3f(camera_position[0],camera_position[1],camera_position[2]));
        // load Roboto Mono so we can draw info text.
        sf::Font font;
        if (!font.loadFromFile(roboto_mono))
        {
            // give an error if it doesn't exist and exit 
            std::cout << "Couldn't load font; please make sure it exists" << std::endl;
        }

        // draw everything here...
        window.draw(render_rect, &shader);

        // end the current frame
        window.display();
    }

    return 0;
}
