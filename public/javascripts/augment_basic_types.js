// give all types basic 'method' function for adding new methods
Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
};

// find the index of a item within an array
Array.method('index', function (member) {
    var index;
    for (var i=0; i < this.length; i++) {
        if (this[i] === member) { index = i };
    };
    return index;
});

Processing.method('circle', function (x, y, radius) {
    return Processing.ellipse(x, y, radius*2, radius*2);
});