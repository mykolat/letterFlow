function UnitsCollection(failProbability = 0, nextTeam, nextTeamFail) {
    this.onProcess = 0;
    this.done = 0;
    this.ready = 0;
    this.que = 0;
    this.failed = 0;
    this.failProbability = failProbability;
    this._nextTeam = nextTeam;
    this._nextTeamFail = nextTeamFail;
    this.units = new Array();
    this.unitsCount = 3;
}


UnitsCollection.prototype.checkUnitsCount = function() {
    let counter = this.unitsCount - this.units.length;

    if (counter == 0) {
        return
    }

    for (let i = 0; i < counter; i++) {
        this.units.push(new Unit())
    }

    if (counter < 0) {
        counter = Math.abs(counter)
        for (let i = 0; i < counter; i++) {
            if (this.units[this.units.length - 1].busy == false)
                this.units.pop()
        }
    }
}

UnitsCollection.prototype.next = function next() {
    if (this.ready > 0) {
        let failed = 0,
            done;
        if (this.failProbability > 0)
            for (var i = 0; i < this.ready; i++)
                failed += Math.random() < this.failProbability
        done = this.ready - failed;

        if (this._nextTeam != undefined && done > 0) {
            this.done += done;
            collections.call(this._nextTeam, done)
        }
        if (this._nextTeamFail != undefined && failed > 0) {
            console.log(failed)
            this.failed += failed;
            collections.call(this._nextTeamFail, failed)
        }
        this.ready = 0
    }
};

UnitsCollection.prototype.addUnit = function(unit) {
    this.units.push(unit)
}

UnitsCollection.prototype.addNextTeam = function(nextTeam) {
    this._nextTeam = nextTeam;
}


UnitsCollection.prototype.addTask = function(value) {
    return this.que += value;
};

UnitsCollection.prototype.doTask = function() {
    if (this.que > 0) {
        let availableUnits = this.units.filter((element) => !element.busy),
            currentQue = this.que,
            onProcess = this.onProcess;

        availableUnits.every((el) => {
            if (currentQue > 0 && el.addTask()) {
                onProcess++;
                currentQue--;
                return true
            }
            else {
                return false
            }
        });
        this.que = currentQue;
        this.onProcess = onProcess;
    }
};

UnitsCollection.prototype.tick = function() {
    let that = this,
        busyUnits = this.units.filter((el) => el.busy);
    // currentReady = this.ready;
    // currentOnProcess = 0;





    // currentOnProcess = this.onProcess;
    busyUnits.forEach((el) => {
        if (el.tick()) {
            this.ready++;
            this.onProcess--;
        }
    })
    this.checkUnitsCount()
    this.doTask();

    // this.ready = currentReady;
    // this.onProcess = currentOnProcess;

    this.next();
};


var collections = {
    writters: null,
    qaTeam1: null,
    qaTeam2: null,
    rcTeam: null,
    send: {
        addTask: function(count) {
            FlowController.lettersOutput += count
        }
    },
    trash: {
        addTask: function(count) {
            FlowController.lettersRewritten++;
            collections.writters.addTask(count);
        }
    },
    tick: function() {
        this.writters.tick();
        this.qaTeam1.tick();
        this.rcTeam.tick();
        this.qaTeam2.tick();
    },
    call: function(val, count) {
        if (this[val] != undefined) {
            try {
                this[val].addTask(count)
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


collections.rcTeam = new UnitsCollection(0.5, "qaTeam2", "trash");
// collections.rcTeam.addUnit(new Unit("Bob", 13));

collections.qaTeam2 = new UnitsCollection(0.1, "send", "rcTeam");
// collections.qaTeam2.addUnit(new Unit("Brian", 5));
// collections.qaTeam2.addUnit(new Unit("Mirla", 5));
// collections.qaTeam2.addUnit(new Unit("Bonie", 5));

// collections.lastTeam = new UnitsCollection();
// collections.lastTeam.addUnit(new Unit("Sender", 10));
