Cell = function (state, game, x, y) {
  this.state = state;
  this.grid = state.grid;
  this.game = game;
  this.x = x;
  this.y = y;


  this.circle = game.add.sprite(5 + (x * 60), 164 + (y * 60), 'circles');
  for (var i = 0; i < 9; i++) {
    this.circle.animations.add('' + (i + 1), [ i ], 20, false);
  }

  this.roll();
  this.circle.inputEnabled = true;
  this.circle.events.onInputDown.add(this.click, this);

  this.connector = game.add.sprite(x * 60, 160 + (y * 60), 'connectors');

  this.connector.animations.add('none', [ 0 ], 20, false);
  this.connector.animations.add('dot', [ 1 ], 20, false);
  this.connector.animations.add('up', [ 2 ], 20, false);
  this.connector.animations.add('right', [ 3 ], 20, false);
  this.connector.animations.add('down', [ 4 ], 20, false);
  this.connector.animations.add('left', [ 5 ], 20, false);
  this.connector.animations.add('up-right', [ 6 ], 20, false);
  this.connector.animations.add('right-down', [ 7 ], 20, false);
  this.connector.animations.add('down-left', [ 8 ], 20, false);
  this.connector.animations.add('left-up', [ 9 ], 20, false);
  this.connector.animations.add('up-down', [ 10 ], 20, false);
  this.connector.animations.add('right-left', [ 11 ], 20, false);
  this.connector.animations.add('right-up', [ 6 ], 20, false);
  this.connector.animations.add('down-right', [ 7 ], 20, false);
  this.connector.animations.add('left-down', [ 8 ], 20, false);
  this.connector.animations.add('up-left', [ 9 ], 20, false);
  this.connector.animations.add('down-up', [ 10 ], 20, false);
  this.connector.animations.add('left-right', [ 11 ], 20, false);

  this.tagged = false;
  this.prev = null;

};

Cell.prototype = {
  roll: function() {
    this.value = (Math.floor(Math.random() * 9) + 1);
    this.circle.play('' + this.value);
  },

  reroll: function() {
    this.prev = null;
    this.tagged = false;
    this.clearConnector();
    this.roll();
  },

  click: function () {
    if (!this.state.gameRunning) {
      return;
    }

    if (this.state.taggingStarted) {
      if (this.state.tagEnd === this) {
        if (this.prev === null) {
          this.state.taggingStarted = false;
          this.state.tagEnd = null;
          this.tagged = false;
          this.clearConnector();
        } else {
          this.state.tagEnd = this.prev;
          this.tagged = false;
          this.prev.displayConnectorEnd();
          this.prev = null;
          this.clearConnector();
        }
      } else if (this.tagged === true) {
        return;
      } else if (this.adjacentTo(this.state.tagEnd)) {
        this.prev = this.state.tagEnd;
        this.prev.displayConnectorMid(this);
        this.state.tagEnd = this;
        this.displayConnectorEnd();
        this.tagged = true;
      }
    } else {
      this.state.taggingStarted = true;
      this.state.tagEnd = this;
      this.tagged = true;
      this.displayConnectorEnd();
    }
    this.state.checkSum();
    //console.log(this.grid[this.x - 1][this.y - 1])
  },

  adjacentTo: function(endCell) {
    return ((Math.abs(this.x - endCell.x) < 2 && this.y === endCell.y) || 
            (Math.abs(this.y - endCell.y) < 2 && this.x === endCell.x));
  },

  clearConnector: function() {
    this.connector.play('none');
  },

  displayConnectorMid: function(next) {
    var direction = "";
    if (this.rightOf(next)) {
      direction = 'left';
    }
    if (this.leftOf(next)) {
      direction = 'right';
    }
    if (this.bottomOf(next)) {
      direction = 'up';
    }
    if (this.topOf(next)) {
      direction = 'down';
    }
    if (this.prev === null) {
      this.connector.play(direction);
    } else {
      if (this.rightOf(this.prev)) {
        this.connector.play(direction + '-left');
      } else if (this.leftOf(this.prev)) {
        this.connector.play(direction + '-right');
      } else if (this.bottomOf(this.prev)) {
        this.connector.play(direction + '-up');
      } else if (this.topOf(this.prev)) {
        this.connector.play(direction + '-down');
      }
    }
  },

  displayConnectorEnd: function() {
    if (this.prev === null) {
      this.connector.play('dot');
    } else if (this.rightOf(this.prev)) {
      this.connector.play('left');
    } else if (this.leftOf(this.prev)) {
      this.connector.play('right');
    } else if (this.bottomOf(this.prev)) {
      this.connector.play('up');
    } else if (this.topOf(this.prev)) {
      this.connector.play('down');
    }
  },

  rightOf: function(other) {
    return (this.x === other.x + 1 && this.y === other.y);
  },

  leftOf: function(other) {
    return (this.x === other.x - 1 && this.y === other.y);
  },

  bottomOf: function(other) {
    return (this.y === other.y + 1 && this.x === other.x);
  },

  topOf: function(other) {
    return (this.y === other.y - 1 && this.x === other.x);
  }

};


BasicGame.Game = function (game) {

};

BasicGame.Game.prototype = {

  create: function () {
    this.grid = [];
    for (var x = 0; x < 8; x++) {
      var column = [];
      for (var y = 0; y < 8; y++) {
        var cell = new Cell(this, this.game, x, y);
        column.push(cell);
      }
      this.grid.push(column);
    }
    this.gameRunning = true;
    this.taggingStarted = false;
    this.tagEnd = null;

    this.score = 0;
    this.timeLimit = 60;

    this.scoreText = this.add.text(20, 20, "Score: " + this.score, { font: "20px monospace", fill: "#fff"});
    this.timeText = this.add.text(20, 50, "Time Left: ", { font: "20px monospace", fill: "#fff"});
    this.sumText = this.add.text(320, 20, "Sum: 0", { font: "20px monospace", fill: "#fff"});
    this.lengthText = this.add.text(320, 50, "Length: 0", { font: "20px monospace", fill: "#fff"});
    this.messageText = this.add.text(20, 100, "", { font: "16px monospace", fill: "#fff"});
  },

  update: function () {
    var timeLeft = this.timeLimit - this.time.totalElapsedSeconds();
    if (timeLeft > 0) {
      var text = "Time Left: " + Math.floor(timeLeft);
      if (text !== this.timeText.text) {
        this.timeText.text = text;
      }
    } else {
      this.gameRunning = false;
      this.timeText.text = "Time Left: 0";
      this.messageText.text = "Game over";
    }

    //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
  },

  checkSum: function () {
    var length = 0;
    var sum = 0;
    var cur = this.tagEnd;
    while (cur !== null) {
      sum += cur.value;
      length++;
      cur = cur.prev;
    }
    if (length > 1 && sum % 10 === 0) {

      var score = Math.pow(sum / 10 + 1, 3);

      this.score += score;
      this.scoreText.text = "Score: " + this.score;

      this.timeLimit += length;

      this.messageText.text = "Normal combo: " + score + " points, bonus " + length + " secs";

      // if prime, raise to 4, double time bonus

      cur = this.tagEnd;
      while (cur !== null) {
        var prev = cur.prev;
        cur.reroll();
        cur = prev;
      }
      this.taggingStarted = false;
      this.tagEnd = null;
      this.sumText.text = "Sum: 0";
      this.lengthText.text = "Length: 0";
    } else {
      this.sumText.text = "Sum: " + sum;
      this.lengthText.text = "Length: " + length;
    }
  },
  
  quitGame: function (pointer) {

    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

    //  Then let's go back to the main menu.
    this.state.start('MainMenu');

  }

};
