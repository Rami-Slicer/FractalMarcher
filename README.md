# FractalMarcher

FractalMarcher: a C++ fractal rendering engine inspired by CodeParade's PySpace.

*NOTE: FractalMarcher is extremely WIP.*

## Compiling

To compile FractalMarcher, you'll need CMake and SFML:  
`sudo apt install cmake libsfml-dev`

Clone the repository, and `cd` into it:  
`git clone https://github.com/Rami-Slicer/FractalMarcher.git`


## About

FractalMarcher is built with C++, OpenGL and SFML, and is built for rendering fractals. Shown below is an example of a famous 2D fractal, the Mandelbrot set.  
<img src="https://upload.wikimedia.org/wikipedia/commons/2/21/Mandel_zoom_00_mandelbrot_set.jpg" alt="Mandelbrot set" width="400"/> <br/>
<a href="https://commons.wikimedia.org/wiki/File:Mandel_zoom_00_mandelbrot_set.jpg" title="via Wikimedia Commons">Created by Wolfgang Beyer with the program Ultra Fractal 3.</a> / <a href="http://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA</a>

As you might expect, there are also 3D versions of these fractals, and tons more that are exclusive to 3D. See, for example, the bulbous Mandelbulb which is basically a 3D version of the Mandlebrot set, but with a power of 8 instead of 2:  
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Power_8_mandelbulb_fractal_overview.jpg/852px-Power_8_mandelbulb_fractal_overview.jpg" alt="Mandelbrot set" width="426"/> <br/>
<a href="https://commons.wikimedia.org/wiki/File:Power_8_mandelbulb_fractal_overview.jpg" title="via Wikimedia Commons">Ondřej Karlík</a> / <a href="https://creativecommons.org/licenses/by-sa/3.0">CC BY-SA</a>

## Credits
Much of the methods used here are from [this blog](http://blog.hvidtfeldts.net/index.php/2011/06/distance-estimated-3d-fractals-part-i/).
I *heavily* recommend reading it if you are interested in fractals or if you want to know how this works.
