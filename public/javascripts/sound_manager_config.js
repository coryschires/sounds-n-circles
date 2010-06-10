soundManager.url = 'swf/';
soundManager.useFlashBlock = false;
soundManager.useHTML5Audio = true;
soundManager.debugMode = false;
useConsole = true;    

soundManager.onready(function(oStatus) {
    sounds = soundManager.createSound({
        id: 'bell',
        url: 'sounds/bell.wav'
    });
});