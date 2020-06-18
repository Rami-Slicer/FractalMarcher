#include "util.hpp"

// This function is here to make the text section a bit more compact. It will probably be put into util.hpp, but it can stay in main for now.
sf::Text generate_text(std::string text_string, sf::Vector2f position, sf::Font &font, int size, 
                                                                       sf::Color color,
                                                                       sf::Uint32 style) {
    sf::Text text;
    // set the text's position
    text.setPosition(position);

    // we select the font using the "font" parameter
    text.setFont(font);

    // use the "text_string" parameter to set the text
    text.setString(text_string);

    // for simplicity, the size will be 12 pixels unless you tell the function otherwise
    text.setCharacterSize(size);

    // for simplicity, the color will be black unless another color is specified.
    text.setFillColor(color);

    // the style will default to sf::Text::Regular, but can be changed.
    text.setStyle(style);
    
    return text;
}
