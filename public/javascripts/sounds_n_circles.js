$(document).ready(function() {

var sounds_n_circles = function() {


    /*--------------------------------------------------------------------------------------------
                                            ARTBOARD CLASS                    
    --------------------------------------------------------------------------------------------*/
    var artboard_builder = function() {
        var circles = [],
            selected_circle = null,
            canvas = $('canvas#sounds_n_circles');
        
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
            find_polor_coords: function(theta, circle) {
                var angle = p.radians(theta),
                    radius = circle.radius,
                    oppsite = p.sin(angle) * radius,
                    adjacent = p.cos(angle) * radius;
                return {
                    x: adjacent+circle.x,
                    y: oppsite+circle.y
                }                
            },
            determine_cursor: function() {
                var cursor = 'default';       

                if (artboard.selected_circle) {
                    var circle = artboard.selected_circle,
                        distance_from_pole = p.dist(circle.x, circle.y, p.mouseX, p.mouseY),
                        resizing = distance_from_pole > circle.radius && distance_from_pole < circle.radius + 4;

                    // get polar coords for selected circle
                    var a = artboard.find_polor_coords(22.5, circle),
                        b = artboard.find_polor_coords(67.5, circle),
                        c = artboard.find_polor_coords(112.5, circle),
                        d = artboard.find_polor_coords(157.5, circle),
                        e = artboard.find_polor_coords(202.5, circle),
                        f = artboard.find_polor_coords(247.5, circle),
                        g = artboard.find_polor_coords(292.5, circle),
                        h = artboard.find_polor_coords(337.5, circle);
                    
                    // booleans for cursor conditions
                    var moving = distance_from_pole <= 20,
                        south_east = p.mouseY > a.y && p.mouseY < b.y && p.mouseX > b.x && resizing,
                        south = p.mouseY > b.y && resizing,
                        south_west = p.mouseY < c.y && p.mouseY > d.y && p.mouseX < c.x && resizing,
                        west = p.mouseX < d.x && resizing,
                        north_west = p.mouseY < e.y && p.mouseY > f.y && p.mouseX < f.x && resizing,
                        north = p.mouseY < f.y && resizing,
                        north_east = p.mouseY > g.y && p.mouseY < h.y && p.mouseX > g.x && resizing,
                        east = p.mouseY > h.y && p.mouseY < a.y && p.mouseX > h.x && resizing;
                    
                    // conditionally set cursor style
                    if (moving) { cursor = 'move'; };
                    if (south_east) { cursor = 'se-resize'; };
                    if (south) { cursor = 's-resize'; };                    
                    if (south_west) { cursor = 'sw-resize'; };
                    if (west) { cursor = 'w-resize'; };
                    if (north_west) { cursor = 'nw-resize'; };
                    if (north) { cursor = 'n-resize'; };
                    if (north_east) { cursor = 'ne-resize'; };
                    if (east) { cursor = 'e-resize'; };
                    
                };
                return cursor;
            },
            canvas: canvas,
            circles: circles,
            selected_circle: selected_circle
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
         
        for (var i=0; i < artboard.circles.length; i++) {
            artboard.circles[i].display();
        };
        
        if (creating_circle) {
            animations.drawing_circle();
        };
        if (false) {
            animations.moving_circle(100);
        };
        
        
        artboard.canvas.css('cursor', artboard.determine_cursor());

        
    };
    p.mousePressed = function() {
        if (p.mouseButton == p.LEFT) {
            creating_circle = true;
            new_circle_x = p.mouseX;
            new_circle_y = p.mouseY;                
        };
    };
    p.mouseReleased = function() {
        
        if (creating_circle && new_circle_x != p.mouseX && new_circle_y != p.mouseY) {
            var radius = p.dist(new_circle_x, new_circle_y, p.mouseX, p.mouseY)
            new_circle = circle(new_circle_x, new_circle_y, radius);
            artboard.circles.push(new_circle);
        };           
        creating_circle = false;
    };
    artboard.canvas.dblclick(function(e) {
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
        
    p.init('true');

}();
    
});

