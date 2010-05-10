$(document).ready(function() {

var sounds_n_circles = function() {


    /*--------------------------------------------------------------------------------------------
                                            ARTBOARD CLASS                    
    --------------------------------------------------------------------------------------------*/
    var artboard_builder = function() {
        var circles = [],
            selected_circle = null,
            cursor = 'move';
        
        
        return {
            find_clicked_circles: function(x, y) {
                clicked_circles = [];
                for (var i=0; i < circles.length; i++) {

                    if ( circles[i].area_includes(x, y) ) {
                        clicked_circles.push(circles[i]);
                    };
                };
                return clicked_circles;
            },
            unselect_all: function() {
                for (var i=0; i < circles.length; i++) {
                    circles[i].selected(false);                    
                };
                artboard.selected_circle = null;                
            },
            find_smallest_circle: function(circles_array) {
                var smallest_circle = circles_array[0];
                for (var i=0; i < circles_array.length; i++) {
                    if (circles_array[i].radius < smallest_circle.radius) {
                        smallest_circle = circles_array[i];
                    }
                };
                return smallest_circle;
            },
            circles: circles,
            selected_circle: selected_circle,
            cursor: cursor
        }
    };
    
    /*--------------------------------------------------------------------------------------------
                                            CIRCLES CLASS
    --------------------------------------------------------------------------------------------*/    
    var circle = function(x, y, radius) {
      
        var radius = radius,
            selected = false,
            hidden = false,
            color = circle_color,
            x = x,
            y = y;
        
        return {
            display: function() {
                if (!hidden) {
                    if (selected) {
                        animations.selected_circle(this);
                    } else {
                        animations.unselected_circle(this);
                    };                    
                };
            },
            selected: function(boolean_flag) {
                selected = boolean_flag;
            },
            hidden: function(boolean_flag) {
                hidden = boolean_flag;
            },            
            area_includes: function(clicked_x, clicked_y) {
                var distance = p.dist(clicked_x,clicked_y, x,y);
                return distance < radius
            },
            radius: radius,
            x: x,
            y: y
        }
        
    };
    
    /*--------------------------------------------------------------------------------------------
                                        ANIMATIONS FUNCTIONS                    
    --------------------------------------------------------------------------------------------*/
    var animations = function() {
        var stroke_weight = 4;
        
        return {
            drawing_circle: function() {
                var radius = p.dist(new_circle_x, new_circle_y, p.mouseX, p.mouseY);
                var diameter = (radius * 2) - stroke_weight;
            
                p.stroke(circle_color);
                p.strokeWeight(stroke_weight);
                p.fill(selected_circle_color);                
                p.ellipse(new_circle_x, new_circle_y, diameter, diameter);
            },
            moving_circle: function(radius) {
                var diameter = (radius * 2) - stroke_weight;            

                animations.crosshairs(p.mouseX, p.mouseY);
                p.stroke(circle_color);
                p.strokeWeight(stroke_weight);
                p.fill(selected_circle_color)
                p.ellipse(p.mouseX, p.mouseY, diameter, diameter);

            },
            selected_circle: function(circle) {
                p.fill(selected_circle_color);
                p.stroke(full_circle_color);
                p.strokeWeight(stroke_weight);
                p.ellipse(circle.x, circle.y, circle.radius*2, circle.radius*2);
                animations.crosshairs(circle.x, circle.y);
            },
            unselected_circle: function(circle){
                p.fill(circle_color);
                p.stroke(full_circle_color);
                p.strokeWeight(0);
                p.ellipse(circle.x, circle.y, circle.radius*2, circle.radius*2);  
            },
            crosshairs: function(x, y) {
                // draw container circle
                p.noStroke();
                p.fill(full_circle_color)
                p.ellipse(x, y, 20, 20);
            
                // draw crosshairs
                p.stroke(full_selected_circle_color);
                p.strokeWeight(1);

                p.line(x-4,y, x+4,y);       // horizontal line
                p.line(x,y-4, x,y+4);       // vetical line
                p.line(x-1,y+3, x+1,y+3);   // north cross
                p.line(x+1,y-3, x-1,y-3);   // south cross
                p.line(x+3,y+1, x+3,y-1);   // east cross
                p.line(x-3,y+1, x-3,y-1);   // west cross
            }
        }    
    }();


    /*--------------------------------------------------------------------------------------------
                                            SHARED VARIABLES
    --------------------------------------------------------------------------------------------*/
    var p = Processing('sounds_n_circles', ''),
        creating_circle = false,
        new_circle_x = null,
        new_circle_y = null,
        canvas = $('canvas#sounds_n_circles'),
        full_circle_color = p.color(193, 20, 64),
        full_selected_circle_color = p.color(245, 217, 224),
        circle_color = p.color(193, 20, 64, 127),
        selected_circle_color = p.color(193, 20, 64, 40),
        artboard = artboard_builder();

    p.setup = function() {
        p.size(958, 400);
        p.smooth();
    };
    p.draw = function() {
        p.background(255);
        canvas.css('cursor', artboard.cursor)
         
        for (var i=0; i < artboard.circles.length; i++) {
            artboard.circles[i].display();
        };
        
        if (creating_circle) {
            animations.drawing_circle();
        };
        if (false) {
            animations.moving_circle(100);
        };
        
    };
    p.mousePressed = function() {
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
            artboard.circles.push(new_circle);
        };           
        creating_circle = false;
    }
    canvas.dblclick(function(e) {
      	var clicked_x = e.pageX - this.offsetLeft,
      	    clicked_y = e.pageY - this.offsetTop;

        
        artboard.unselect_all();
        
        var clicked_circles = artboard.find_clicked_circles(clicked_x, clicked_y);
        
        if (clicked_circles.length > 0) {
            if (clicked_circles.length === 1) { 
                artboard.selected_circle = clicked_circles[0];
            } else {
                artboard.selected_circle = artboard.find_smallest_circle(clicked_circles);
            };
            artboard.selected_circle.selected(true);
        };

    });
    canvas.mousemove(function(e) {


        if (artboard.selected_circle) {
            var position_x = e.pageX - this.offsetLeft,
                position_y = e.pageY - this.offsetTop;
            
            var distance_from_center_pt = p.dist(artboard.selected_circle.x, artboard.selected_circle.y, position_x, position_y);
            
            if (distance_from_center_pt < 20) {
                artboard.cursor = 'move';
            } else {
                artboard.cursor = 'default';                
            };
          	
        } else {
            artboard.cursor = 'default';
        };

    });
        
    p.init('true');

}();
    
});

