#pragma once
#include <SFML/Graphics.hpp>

// This function is here to make the text section a bit more compact. It will probably be put into util.hpp, but it can stay in main for now.
sf::Text generate_text(std::string text_string, sf::Vector2f position, sf::Font &font, int size=12, 
                                                                       sf::Color color=sf::Color::White,
                                                                       sf::Uint32 style=sf::Text::Regular);