var FlowController = {
  time: 0,
  lettersOutput: 0,
  lettersRewritten: 0,
  lettersInput: 100,
  speed: 100,
  unitsSpeed: 10,
  tick: function() {
    this.time++;
    this.pushLetter()
    this.teams.tick()
      // this.qualityCheck.tick()
    setTimeout(() => {
      this.tick()
    }, this.speed)
  },
  pushLetter: function() {
    if (this.lettersInput > 0 && this.teams.writters.addTask()) {
      this.lettersInput--
    }
  },
  teams: collections //?
}

FlowController.tick();


var flag = true;
var data = Bind({
  maillift: FlowController,
}, {
  maillift: {
    callback: function() {
      if (flag) {
        flag = false;
        setTimeout(() => {
          document.querySelector('#output').innerHTML = escape(JSON.stringify(this.__export(), '', 2));
          flag = true;

        }, 0)
      }
    },
  },

  'maillift.lettersInput': '.letters',
  'maillift.lettersOutput': '.lettersOutput',
  'maillift.speed': '.speed',
  'maillift.unitsSpeed': '.unitsSpeed',
  // 'maillift.lettersTrash': '.lettersTrash',
  'maillift.teams.writters.onProcess': 'div.writters .onProcess',
  'maillift.teams.writters.done': 'div.writters .done',
  'maillift.teams.writters.que': 'div.writters .que',
  'maillift.teams.writters.failed': 'div.writters .failed',
  'maillift.teams.writters.failProbability': 'div.writters .failProbability',
  'maillift.teams.writters.unitsCount': 'div.writters .unitsCount',

  'maillift.teams.qaTeam1.onProcess': 'div.qaTeam1 .onProcess',
  'maillift.teams.qaTeam1.done': 'div.qaTeam1 .done',
  'maillift.teams.qaTeam1.que': 'div.qaTeam1 .que',
  'maillift.teams.qaTeam1.failed': 'div.qaTeam1 .failed',
  'maillift.teams.qaTeam1.failProbability': 'div.qaTeam1 .failProbability',
  'maillift.teams.qaTeam1.unitsCount': 'div.qaTeam1 .unitsCount',

  'maillift.teams.qaTeam2.onProcess': 'div.qaTeam2 .onProcess',
  'maillift.teams.qaTeam2.done': 'div.qaTeam2 .done',
  'maillift.teams.qaTeam2.que': 'div.qaTeam2 .que',
  'maillift.teams.qaTeam2.failed': 'div.qaTeam2 .failed',
  'maillift.teams.qaTeam2.failProbability': 'div.qaTeam2 .failProbability',
  'maillift.teams.qaTeam2.unitsCount': 'div.qaTeam2 .unitsCount',


  'maillift.teams.rcTeam.onProcess': 'div.rcTeam .onProcess',
  'maillift.teams.rcTeam.done': 'div.rcTeam .done',
  'maillift.teams.rcTeam.que': 'div.rcTeam .que',
  'maillift.teams.rcTeam.failed': 'div.rcTeam .failed',
  'maillift.teams.rcTeam.failProbability': 'div.rcTeam .failProbability',
  'maillift.teams.rcTeam.unitsCount': 'div.rcTeam .unitsCount',

  // 'maillift.teams.writters': {
  //   dom: 'ul.teams',
  //   transform: function(val) {

  //     return escape(JSON.stringify(val, '', 2));
  //   }
  // },
  // maillift: {
  //   dom: 'ul.teams',
  //   transform: function (name) {

  //     return '<li>' + name + '</li>';
  //   }
  // }

});

// helper to dump the object in a <pre>
function escape(s) {
  return (s || '').replace(/[<>]/g, function(m) {
    return {
      '<': '&lt;',
      '>': '&gt;',
    }[m]
  })
}
