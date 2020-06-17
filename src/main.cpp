/* FractalMarcher: a realtime 3D fractal rendering engine based on CodeParades PySpace.
 * Check it out too! https://github.com/HackerPoet/PySpace
 */

#include "res.hpp"
#include <SFML/Graphics.hpp>
#include <iostream>

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
            // error...
        }
        // draw everything here...
        window.draw(render_rect, &shader);
        
        // end the current frame
        window.display();
    }

    return 0;
}
