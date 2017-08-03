class Unit {
    constructor() {
        this.name = chance.name();
        this.busy = false;
        this.timeout = 0;
        this.done = 0;
    }

    tick() {
        if (this.timeout > FlowController.time && this.busy) {
            return false
        }
        else {
            return this.produce()
        }
    }

    addTask() {
        if (!this.busy) {
            this.timeout = FlowController.time + FlowController.unitsSpeed;
            this.busy = true;
            return true
        }
        return false
    }

    produce() {
        if (this.busy) {
            this.busy = false;
            this.done++;
            return true
        }
        return false
    }
}
