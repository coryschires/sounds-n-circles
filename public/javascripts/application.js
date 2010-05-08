$(document).ready(function() {

    // toggle text on pause/play button
    $('#pause_play').click(function() {
        var button = $(this);
        if (button.text() === "play") {
            button.text('pause');
        } else {
            button.text('play');            
        };
        return false;
    });

}); // end of doc ready