function Unit(speed = 5) {
    this.name = chance.name();
    this.speed = speed;
    this.busy = false;
    this.timeout = 0;
    this.done = 0;
    // this.sent = 0;
}

Unit.prototype.tick = function tick() {
    if (this.timeout > 0 && this.busy) {
        this.timeout--;
        return false
    }
    else {
        return this.produce()
    }

    //  if (this.done > 0) {
    //     this.done--;
    //     this.sent++;
    //     return true
    // }
    // return false
}

Unit.prototype.addTask = function() {
    if (!this.busy) {
        this.timeout = this.speed;
        this.busy = true;
        return true
    }
    return false
}


Unit.prototype.addParent = function(parent) {
    this.parent = parent
}

Unit.prototype.produce = function() {
    if (this.busy) {
        this.busy = false;
        this.done++;
        return true
    }
    return false
}
