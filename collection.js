class UnitsCollection {
    constructor(config) {
        this.onProcess = 0;
        this.done = 0;
        this.ready = 0;
        this.que = 0;
        this.failed = 0;
        this.failProbability = config.failProbability || 0;
        this._nextTeam = config.nextTeam;
        this._nextTeamFail = config.nextTeamFail;
        this.units = new Array();
        this.unitsCount = config.unitsCount || 3;
    }

    checkUnitsCount() {
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

    next() {
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
                // console.log(failed)
                this.failed += failed;
                collections.call(this._nextTeamFail, failed)
            }
            this.ready = 0
        }
    }
    addUnit(unit) {
        this.units.push(unit)
    }
    addNextTeam(nextTeam) {
        this._nextTeam = nextTeam;
    }

    addTask(value) {
        return this.que += value;
    }

    doTask() {
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
    }

    tick() {
        let that = this,
            busyUnits = this.units.filter((el) => el.busy),
            // ready = this.ready;
            currentReady = this.ready,
            currentOnProcess = this.onProcess;





        // currentOnProcess = this.onProcess;
        busyUnits.forEach((el) => {
            if (el.tick()) {
                currentReady++
                currentOnProcess--;
            }
        })
        this.ready = currentReady;
        this.onProcess = currentOnProcess;

        this.checkUnitsCount()
        this.doTask();

        // this.ready = currentReady;
        // this.onProcess = currentOnProcess;

        this.next();
    };
}


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

collections.writters = new UnitsCollection({
    failProbability: 0,
    nextTeam: "qaTeam1",
    unitsCount: 5
});

collections.qaTeam1 = new UnitsCollection({
    failProbability: 0.1,
    nextTeam: "qaTeam2",
    nextTeamFail: "rcTeam",
    unitsCount: 5
});

collections.rcTeam = new UnitsCollection({
    failProbability: 0.5,
    nextTeam: "qaTeam2",
    nextTeamFail: "trash",
    unitsCount: 1
});

collections.qaTeam2 = new UnitsCollection({
    failProbability: 0.1,
    nextTeam: "send",
    nextTeamFail: "rcTeam",
    unitsCount: 5
});
