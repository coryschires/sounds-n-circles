$(document).ready(function() {

    var sounds_n_circles = function() {
        
        var p = Processing('sounds_n_circles', ''),
            creating_circle = false,
            new_circle_x = null,
            new_circle_y = null,         
            
            full_circle_color = p.color(193, 20, 64),
            full_selected_circle_color = p.color(245, 217, 224),            
            
            
            circle_color = p.color(193, 20, 64, 127),
            selected_circle_color = p.color(193, 20, 64, 40),
            circles = [];

        p.setup = function() {
            p.size(958, 400);
            p.smooth();
        };
        p.draw = function() {
            p.background(255);    
            for (var i=0; i < circles.length; i++) {
                circles[i].display();
            };
            
            if (creating_circle) {
                animations.draw_circle();
            };
            
        };
        p.mousePressed = function() {
            if (p.mouseButton == p.RIGHT) {
                circles[0].selected(true);
            };
            if (p.mouseButton == p.LEFT) {
                creating_circle = true;
                new_circle_x = p.mouseX;
                new_circle_y = p.mouseY;                
            };
  
        }
        p.mouseReleased = function() {
            
            if (creating_circle && new_circle_x != p.mouseX && new_circle_y != p.mouseY) {
                var radius = p.dist(new_circle_x, new_circle_y, p.mouseX, p.mouseY)
                new_circle = circle(new_circle_x, new_circle_y, radius);
                circles.push(new_circle);
            };           
            creating_circle = false;
        }


        // circle class
        var circle = function(x, y, radius) {
          
            var radius = radius,
                selected = false,
                color = circle_color,
                x = x,
                y = y;
            
            return {
                display: function() {
                    var display_color = selected ? selected_circle_color : circle_color;
                    var display_stroke_weight = selected ? 4 : 0 
                    
                    p.fill(display_color);
                    p.stroke(full_circle_color);
                    p.strokeWeight(display_stroke_weight);
                    p.ellipse(x, y, radius*2, radius*2);
                    
                    // draw move indicator
                    if (selected) {
                        animations.crosshairs(x, y)
                    };
                    
                },
                selected: function(boolean_flag) {
                    selected = boolean_flag;
                },
                move: function() {
                    
                }
            }
            
        };
        
        var animations = {
            draw_circle: function() {
                var radius = p.dist(new_circle_x, new_circle_y, p.mouseX, p.mouseY);
                var stroke_weight = 4;
                var diameter = (radius * 2) - stroke_weight;
                
                p.stroke(circle_color);
                p.strokeWeight(stroke_weight);
                p.fill(selected_circle_color)
                p.ellipse(new_circle_x, new_circle_y, diameter, diameter);
            },
            find_selected: function(circles_array) {
                for (var i=0; i < circles_array.length; i++) {                    
                    if (circles_array[i].selected) {
                        return circles_array[i]
                    };
                };
                return false;
            },
            crosshairs: function(x, y) {
                // draw container circle
                p.noStroke();
                p.fill(full_circle_color)
                p.ellipse(x, y, 25, 25);
                
                // draw crosshairs
                p.stroke(full_selected_circle_color);
                p.strokeWeight(1);

                p.line(x-6,y, x+6,y); 
                p.line(x,y-6, x,y+6);
                
                p.line(x-4,y+2, x-4,y-2);
                p.line(x+4,y+2, x+4,y-2);
                p.line(x-5,y+1, x-5,y-1);
                p.line(x+5,y+1, x+5,y-1);
                                         
                p.line(x-2,y+4, x+2,y+4);
                p.line(x+2,y-4, x-2,y-4);
                p.line(x-1,y+5, x+1,y+5);
                p.line(x+1,y-5, x-1,y-5);

            }
            
        }
            
        p.init('true');
    
    }();
    
});

