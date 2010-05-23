$(document).ready(function() {

var sounds_n_circles = function() {


    /*--------------------------------------------------------------------------------------------
                                            ARTBOARD CLASS                    
    --------------------------------------------------------------------------------------------*/
    var artboard_builder = function() {
        var that = {};
        
        // public instance variables
        that.circle_being_moved = false;
        that.circle_being_resized = false;
        that.circle_being_created = false;
        that.cursor = 'default';
        
        
        // public instance methods
        that.find_clicked_circles = function(x, y) {
            var clicked_circles = [];
            for (var i=0; i < circles.length; i++) {

                if ( circles[i].area_includes(x, y) ) {
                    clicked_circles.push(circles[i]);
                };
            };
            return clicked_circles;
        };
        that.unselect_all = function() {
            for (var i=0; i < circles.length; i++) {
                circles[i].selected = false;                    
            };
            selected_circle = null;                
        };        
        that.find_smallest_circle = function(circles_array) {
            var smallest_circle = circles_array[0];
            for (var i=0; i < circles_array.length; i++) {
                if (circles_array[i].radius < smallest_circle.radius) {
                    smallest_circle = circles_array[i];
                }
            };
            return smallest_circle;
        };
        that.determine_cursor = function() {

            // don't run if the circle is being moved or resized
            if (that.circle_being_moved || that.circle_being_resized ) { return that.cursor; };
            
            var cursor = 'default';       

            if (selected_circle) {
                var distance_from_pole = p.dist(selected_circle.x, selected_circle.y, p.mouseX, p.mouseY),
                    resizing = distance_from_pole > selected_circle.radius && distance_from_pole < selected_circle.radius + 4;

                // get polar coords for selected circle
                var a = find_polor_coords(22.5, selected_circle),
                    b = find_polor_coords(67.5, selected_circle),
                    c = find_polor_coords(112.5, selected_circle),
                    d = find_polor_coords(157.5, selected_circle),
                    e = find_polor_coords(202.5, selected_circle),
                    f = find_polor_coords(247.5, selected_circle),
                    g = find_polor_coords(292.5, selected_circle),
                    h = find_polor_coords(337.5, selected_circle);
                
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

            that.cursor = cursor;
        };
        
        // private methods        
        var find_polor_coords = function(theta, circle) {
            var angle = p.radians(theta),
                radius = circle.radius,
                oppsite = p.sin(angle) * radius,
                adjacent = p.cos(angle) * radius;
            return {
                x: adjacent+circle.x,
                y: oppsite+circle.y
            }                
        };
        
        return that;

    };
    
    /*--------------------------------------------------------------------------------------------
                                            CIRCLE CLASS
    --------------------------------------------------------------------------------------------*/    
      function circle(x, y, radius) {
        var that = {};
        
        // public instance variables
        that.radius = radius;
        that.selected = false;
        that.hidden = false;
        that.x = x;
        that.y = y;

        that.reset_location = function() {
            that.x = p.mouseX;
            that.y = p.mouseY;
        };        


        that.display = function() {
            if (!that.hidden) {
                if (that.selected) {
                    animations.selected_circle(that);
                } else {
                    animations.unselected_circle(that);
                };                    
            };
        };
        that.delete = function() {
            
            console.log(circles.length);
            
            // function to delete a circle from the global circles array.
            // possibly extend Array.prototype ?
        };
        that.area_includes = function(clicked_x, clicked_y) {
            var distance = p.dist(clicked_x,clicked_y, that.x, that.y);
            return distance < that.radius;
        };
        
        return that;
    };
    
    /*--------------------------------------------------------------------------------------------
                                        ANIMATIONS FUNCTIONS                    
    --------------------------------------------------------------------------------------------*/
    var animations = function() {
        var that = {};
        
        // public instance methods
        that.drawing_circle = function() {
            var radius = p.dist(new_circle_x, new_circle_y, p.mouseX, p.mouseY);
            var diameter = (radius * 2) - stroke_weight;
        
            p.stroke(circle_color);
            p.strokeWeight(stroke_weight);
            p.fill(selected_circle_color);                
            p.ellipse(new_circle_x, new_circle_y, diameter, diameter);
        };
        that.moving_circle = function(circle) {
            var diameter = (circle.radius * 2) - stroke_weight;            

            crosshairs(p.mouseX, p.mouseY, full_circle_color);
            p.stroke(circle_color);
            p.strokeWeight(stroke_weight);
            p.fill(selected_circle_color)
            p.ellipse(p.mouseX, p.mouseY, diameter, diameter);
        };
        that.resizing_circle = function(circle) {
            var radius = p.dist(circle.x, circle.y, p.mouseX, p.mouseY);                
            var diameter = (radius * 2) - stroke_weight;

            crosshairs(circle.x, circle.y, circle_color);
            p.stroke(full_circle_color);
            p.strokeWeight(stroke_weight);
            p.fill(selected_circle_color)
            p.ellipse(circle.x, circle.y, diameter, diameter);
        };
        that.selected_circle = function(circle) {
            var diameter = circle.radius *2;
            p.fill(selected_circle_color);
            p.stroke(full_circle_color);
            p.strokeWeight(stroke_weight);
            p.ellipse(circle.x, circle.y, diameter, diameter);
            crosshairs(circle.x, circle.y, full_circle_color);
        };
        that.unselected_circle = function(circle){
            var diameter = circle.radius *2;
            p.fill(circle_color);
            p.stroke(full_circle_color);
            p.strokeWeight(0);
            p.ellipse(circle.x, circle.y, diameter, diameter);  
        };
        
        // private methods
        var crosshairs = function(x, y, color) {
            // draw container circle
            p.noStroke();
            p.fill(color)
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
        };
        
        return that;
    }();


    /*--------------------------------------------------------------------------------------------
                                            SHARED VARIABLES
    --------------------------------------------------------------------------------------------*/
    // application wide variables
    var p = Processing('sounds_n_circles', ''),
        new_circle_x = null,
        new_circle_y = null,
        
        canvas = $('canvas#sounds_n_circles'),
        selected_circle = null,
        circles = [],

        stroke_weight = 4,
        
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
            
        for (var i=0; i < circles.length; i++) {
            circles[i].display();
        };
        
        if (artboard.circle_being_created) {
            animations.drawing_circle();
        };
        
        if (artboard.circle_being_resized) {
            animations.resizing_circle(selected_circle);
        };

        if (artboard.circle_being_moved) {
            animations.moving_circle(selected_circle);            
        };
        
        artboard.determine_cursor();
        canvas.css('cursor', artboard.cursor);
    };

    p.mousePressed = function() {
        if (p.mouseButton == p.LEFT) {
            
            // circle is being moved
            if (artboard.cursor == "move") {
                artboard.circle_being_moved = true;
                selected_circle.hidden = true;
            
            // circle is being resized
            } else if (artboard.cursor.match("resize")) {
                artboard.circle_being_resized = true;
                selected_circle.hidden = true;
            
            // cricle is being created
            } else {
                artboard.circle_being_created = true;
                new_circle_x = p.mouseX;
                new_circle_y = p.mouseY;                
            };
        };       
    };

    p.mouseReleased = function() {
                
        // circle is being moved
        if (artboard.circle_being_moved) {
            selected_circle.reset_location(p.mouseX, p.mouseY)
            selected_circle.hidden = false;
        };
        // circle is being resized
        if (artboard.circle_being_resized) {
            selected_circle.radius = p.dist(selected_circle.x, selected_circle.y, p.mouseX, p.mouseY);
            selected_circle.hidden = false;
        };
        // circle is being created
        if (artboard.circle_being_created && new_circle_x !== p.mouseX && new_circle_y !== p.mouseY) {
            var radius = p.dist(new_circle_x, new_circle_y, p.mouseX, p.mouseY);
            circles.push( circle(new_circle_x, new_circle_y, radius) );
        };
                
        artboard.circle_being_resized = false;        
        artboard.circle_being_created = false;
        artboard.circle_being_moved = false;        
    };

    canvas.dblclick(function(e) {
        var clicked_x = e.pageX - this.offsetLeft,
            clicked_y = e.pageY - this.offsetTop;
    
        artboard.unselect_all();
        
        var clicked_circles = artboard.find_clicked_circles(clicked_x, clicked_y);
        
        if (clicked_circles.length > 0) {
            if (clicked_circles.length === 1) {
                selected_circle = clicked_circles[0];
            } else {
                selected_circle = artboard.find_smallest_circle(clicked_circles);
            };
            selected_circle.selected = true;
        };
    });
    $(document).keypress(function(e) {
        if (e.which === 8) {
            selected_circle.delete();
        };
    });
    
    p.init('true');

}();
    
});