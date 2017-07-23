function UnitsCollection(failProbability = 0, nextTeam, nextTeamFail) {
    this.onProcess = 0;
    this.done = 0;
    this.que = 0;
    this.failed = 0;
    this.failProbability = failProbability;
    this._nextTeam = nextTeam;
    this._nextTeamFail = nextTeamFail;
    this.units = new Array();
    this.unitsCount = 3;
}


UnitsCollection.prototype.checkUnitsCount = function() {
    let counter = this.unitsCount
    counter -= this.units.length;
    if (counter == 0) {
        return
    }
    if (counter > 0) {
        for (let i = 0; i < counter; i++) {
            this.units.push(new Unit(8))
        }
    }
    else {
        for (let i = 0; i < Math.abs(counter); i++) {
            if (this.units[this.units.length - 1].busy == false)
                this.units.pop()
        }
    }
}

UnitsCollection.prototype.next = function next() {
    if (this.failProbability == 0 || Math.random() > this.failProbability) {
        if (this._nextTeam != undefined) {
            this.onProcess--;
            this.done++;
            collections.call(this._nextTeam)
                // this._nextTeam.addTask()
        }
    }
    else if (this._nextTeamFail != undefined) {
        this.onProcess--;
        this.failed++;
        collections.call(this._nextTeamFail)
    }
    else {
        this.failed++;
        this.onProcess--;
    }

};

UnitsCollection.prototype.addUnit = function(unit) {
    this.units.push(unit)
}

UnitsCollection.prototype.addNextTeam = function(nextTeam) {
    this._nextTeam = nextTeam;
}


UnitsCollection.prototype.addTask = function() {
    return ++this.que;
};

UnitsCollection.prototype.doTask = function() {
    if (this.que > 0) {
        let units = this.units.filter((element) => !element.busy)
            // if (units.length > 0) {
            // units
        units.forEach((el) => {
            if (el.addTask()) {
                this.onProcess++;
                this.que--;
            }
        })
        return units.length
            // }
    }
    return false
};

UnitsCollection.prototype.tick = function() {
    let that = this;
    this.checkUnitsCount()
        // if (this.que > 0) {
    this.doTask()
        // }

    this.units.forEach(function(el) {
        if (el.tick()) {
            that.next()
        }
    })
};


var collections = {
    writters: null,
    qaTeam1: null,
    qaTeam2: null,
    rcTeam: null,
    send: {
        addTask: function() {
            FlowController.lettersOutput++
        }
    },
    trash: {
        addTask: function() {
            FlowController.lettersTrash++
        }
    },
    tick: function() {
        this.writters.tick();
        this.qaTeam1.tick();
        this.rcTeam.tick();
        this.qaTeam2.tick();
    },
    call: function(val) {
        // if (UnitsCollection.prototype.isPrototypeOf(this[val])) {
        if (this[val] != undefined) {
            try {
                this[val].addTask()
            }
            catch (e) {}
        }
    }
}

collections.writters = new UnitsCollection(0, "qaTeam1");
// collections.writters.setUnits(4)
// collections.writters.addUnit(new Unit("Clark", 5));
// collections.writters.addUnit(new Unit("Jane", 10));
// collections.writters.addUnit(new Unit("Jane", 10));
// collections.writters.addUnit(new Unit("Jane", 10));
// collections.writters.addUnit(new Unit("Jane", 10));
// collections.writters.addUnit(new Unit("Jane", 10));
// collections.writters.addUnit(new Unit("Jane", 10));

collections.qaTeam1 = new UnitsCollection(0.1, "qaTeam2", "rcTeam");
// collections.qaTeam1.addUnit(new Unit("Tony", 8));
// collections.qaTeam1.addUnit(new Unit("Stark", 8));


collections.rcTeam = new UnitsCollection(0.5, "qaTeam2", "writters");
// collections.rcTeam.addUnit(new Unit("Bob", 13));

collections.qaTeam2 = new UnitsCollection(0.1, "send", "rcTeam");
// collections.qaTeam2.addUnit(new Unit("Brian", 5));
// collections.qaTeam2.addUnit(new Unit("Mirla", 5));
// collections.qaTeam2.addUnit(new Unit("Bonie", 5));

// collections.lastTeam = new UnitsCollection();
// collections.lastTeam.addUnit(new Unit("Sender", 10));
