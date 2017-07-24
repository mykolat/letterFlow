function Unit() {
    this.name = chance.name();
    // this.speed = FlowController.unitsSpeed;
    this.busy = false;
    this.timeout = 0;
    this.done = 0;
}

Unit.prototype.tick = function tick() {
    if (this.timeout > FlowController.time && this.busy) {
        return false
    }
    else {
        return this.produce()
    }
}

Unit.prototype.addTask = function() {
    if (!this.busy) {
        this.timeout = FlowController.time + FlowController.unitsSpeed;
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
