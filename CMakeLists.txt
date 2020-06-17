cmake_minimum_required(VERSION 3.0.0)
project(fractalmarcher VERSION 0.1.0)

include(CTest)
enable_testing()

add_executable(fractalmarcher 
               src/main.cpp)


set(CPACK_PROJECT_NAME ${PROJECT_NAME})
set(CPACK_PROJECT_VERSION ${PROJECT_VERSION})

find_package(SFML 2.5 COMPONENTS graphics window system)

include_directories(include/)


target_link_libraries(fractalmarcher sfml-graphics sfml-system sfml-window)


include(CPack)
