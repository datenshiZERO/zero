Store = new Persist.Store('High Score');

Cell = function (state, game, x, y) {
  this.state = state;
  this.grid = state.grid;
  this.game = game;
  this.x = x;
  this.y = y;


  this.circle = game.add.sprite(10 + (x * 120), 328 + (y * 120), 'circles');
  for (var i = 0; i < 9; i++) {
    this.circle.animations.add('' + (i + 1), [ i ]);
  }
  this.circle.animations.add('x', [ 9, 10, 9, 10, 9], 20);

  this.roll();
  this.circle.inputEnabled = true;
  this.circle.events.onInputDown.add(this.click, this);

  this.connector = game.add.sprite(x * 120, 320 + (y * 120), 'connectors');
  this.connector.scale.setTo(2, 2);

  this.connector.animations.add('none', [ 0 ]);
  this.connector.animations.add('dot', [ 1 ]);
  this.connector.animations.add('up', [ 2 ]);
  this.connector.animations.add('right', [ 3 ]);
  this.connector.animations.add('down', [ 4 ]);
  this.connector.animations.add('left', [ 5 ]);
  this.connector.animations.add('up-right', [ 6 ]);
  this.connector.animations.add('right-down', [ 7 ]);
  this.connector.animations.add('down-left', [ 8 ]);
  this.connector.animations.add('left-up', [ 9 ]);
  this.connector.animations.add('up-down', [ 10 ]);
  this.connector.animations.add('right-left', [ 11 ]);
  this.connector.animations.add('right-up', [ 6 ]);
  this.connector.animations.add('down-right', [ 7 ]);
  this.connector.animations.add('left-down', [ 8 ]);
  this.connector.animations.add('up-left', [ 9 ]);
  this.connector.animations.add('down-up', [ 10 ]);
  this.connector.animations.add('left-right', [ 11 ]);
  this.connector.animations.add('blink', [ 13, 12, 13, 12, 0 ], 20);

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
    this.connector.play('blink');
    this.roll();
  },

  click: function () {
    // ignore clicks when game is not running
    // or when blockers are clicked
    if (!this.state.gameRunning || this.value === 0) {
      return;
    }

    if (this.state.taggingStarted) {
      var clicked = this;

      if (this.state.tagEnd.prev === this) {
        clicked = this.state.tagEnd;
      }
      if (this.state.tagEnd === clicked) {
        if (clicked.prev === null) {
          this.state.taggingStarted = false;
          this.state.tagEnd = null;
          clicked.tagged = false;
          clicked.clearConnector();
        } else {
          this.state.tagEnd = clicked.prev;
          clicked.tagged = false;
          clicked.prev.displayConnectorEnd();
          clicked.prev = null;
          clicked.clearConnector();
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

    this.stage.backgroundColor = '#ddd';

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

    this.add.text(180, 110, "SCORE", { font: "30px Roboto Mono", fill: "#222"}).anchor.setTo(0.5, 0.5);
    this.add.text(780, 110, "TIME LEFT", { font: "30px Roboto Mono", fill: "#222"}).anchor.setTo(0.5, 0.5);
    this.add.text(480, 80, "SUM", { font: "30px Roboto Mono", fill: "#222"}).anchor.setTo(0.5, 0.5);

    this.scoreText = this.add.text(180, 160, this.score, { font: "60px 'Roboto Mono'", fill: "#444"});
    this.scoreText.anchor.setTo(0.5, 0.5);

    this.addScoreText = this.add.text(180, 160, "", { font: "50px 'Roboto Mono'", fill: "#080"});
    this.addScoreText.anchor.setTo(0.5, 0.5);

    this.timeText = this.add.text(780, 160, this.timeLimit, { font: "60px Roboto Mono", fill: "#444"});
    this.timeText.anchor.setTo(0.5, 0.5);

    this.addTimeText = this.add.text(780, 160, "", { font: "50px 'Roboto Mono'", fill: "#080"});
    this.addTimeText.anchor.setTo(0.5, 0.5);

    this.sumText = this.add.text(480, 165, '?', { font: "150px 'Roboto Mono'", fill: "#222"});
    this.sumText.anchor.setTo(0.5, 0.5);

    this.pointsText = this.add.text(480, 250, "0 digits, 0 points", { font: "30px Roboto Mono", fill: "#222"});
    this.pointsText.anchor.setTo(0.5, 0.5);

    this.time.reset();

    this.primeTable = [ false,
      false, true, true, false, true, false, true, false, false, false,
      true, false, true, false, false, false, true, false, true, false,
      false, false, true, false, false, false, false, false, true, false,
      true, false, false, false, false, false, true, false, false, false,
      true, false, true, false, false, false, true, false, false, false,
      false, false, true, false, false, false, false, false, true, false,
      true, false, false, false
    ];
    this.blockers = [];
  },

  update: function () {
    var timeLeft = this.timeLimit - this.time.totalElapsedSeconds();
    if (timeLeft > 0 && this.blockers.length < 64) { 
      var text = Math.floor(timeLeft);
      if (text !== this.timeText.text) {
        this.timeText.text = text;
      }

      if (this.timeText.style.fill === '#444' && timeLeft < 16) {
        this.timeText.style.fill = '#d44';
        this.timeText.style.font = '700 65px Roboto Mono';
      } else if (this.timeText.style.fill === '#d44' && timeLeft > 16) {
        this.timeText.style.fill = '#444';
        this.timeText.style.font = '60px Roboto Mono';
      } 
    } else if (this.gameRunning) {
      this.gameRunning = false;

      if (timeLeft <= 0) {
        this.timeText.text = "0";
      }

      this.overlay = this.add.sprite(0, 0, "overlay");

      var highScore = Store.get("highScore");
      if (highScore !== null) {
        if (this.score > parseInt(highScore)) {
          this.add.text(480, 580, "New High Score!", { font: "56px Roboto Mono", fill: "#222"}).anchor.setTo(0.5, 0.5);
          Store.set("highScore", this.score);
        }
        this.add.text(480, 690, "Your previous high score was:", { font: "30px Roboto Mono", fill: "#222"}).anchor.setTo(0.5, 0.5);
        this.add.text(480, 760, highScore, { font: "56px Roboto Mono", fill: "#222"}).anchor.setTo(0.5, 0.5);
      } else {
        this.add.text(480, 580, "New High Score!", { font: "56px Roboto Mono", fill: "#222"}).anchor.setTo(0.5, 0.5);
        Store.set("highScore", this.score);
      }
      
      this.add.text(480, 400, "Game Over", { font: "64px Roboto Mono", fill: "#222"}).anchor.setTo(0.5, 0.5);

      this.time.events.add(2000, function () {
        this.add.text(480, 950, "Tap/click to return to main menu", { font: "30px Roboto Mono", fill: "#222"}).anchor.setTo(0.5, 0.5);
        this.overlay.inputEnabled = true;
        this.overlay.events.onInputDown.add(this.quitGame, this);
      }, this);
    }

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

      this.score += this.calculatePoints(sum);
      this.scoreText.text = this.score;

      this.addScoreText.text = "+" + this.calculatePoints(sum);
      this.addScoreText.alpha = 1;
      this.addScoreText.y = 100;
      this.add.tween(this.addScoreText).to( { alpha: 0, y: 20 }, 3000, Phaser.Easing.Linear.None, true);


      // TODO if prime, roll for removal of blocks but no bonus time
      // else, roll for creation of blocks

      if (this.primeTable[length]) {
        this.rollBlockRemoval(length);
      } else {
        this.rollBlockCreation(length);

        this.timeLimit += length * 2;

        this.addTimeText.text = "+" + length * 2;
        this.addTimeText.alpha = 1;
        this.addTimeText.y = 100;
        this.add.tween(this.addTimeText).to( { alpha: 0, y: 20 }, 3000, Phaser.Easing.Linear.None, true);
      }

      cur = this.tagEnd;
      while (cur !== null) {
        var prev = cur.prev;
        cur.reroll();
        cur = prev;
      }
      this.taggingStarted = false;
      this.tagEnd = null;
      
      this.sumText.text = "?";
      this.pointsText.text = "0 digits, 0 points";
    } else {
      if (sum === 0) {
        this.sumText.text = "?";
        this.pointsText.text = "0 digits, 0 points";
      } else {
        this.sumText.text = sum % 10;
        this.pointsText.text = length + " digit" + (length == 1 ? "" : "s") + 
          (this.primeTable[length + 1] ? " (prime next)" : "") + ", " + 
          this.calculatePoints(sum) + " point" + (this.calculatePoints(sum) == 1 ? "" : "s");
      }
    }
  },

  calculatePoints: function (sum) {
    return Math.pow(Math.floor(sum / 10), 3);
  },

  rollBlockRemoval: function (length) {
    //console.log(this.blockers);
    if (this.blockers.length === 0) {
      return;
    }
    for (var i = 0; i < length; i++) {
      // per digit, there's a 1 in 5 chance of removing a block
      if (Math.random() * 5 < 1) {
        var delIdx = Math.floor(Math.random() * this.blockers.length);
        // reroll selected
        this.blockers[delIdx].roll();
        // remove from list
        this.blockers.splice(delIdx, 1);
        // TODO clearing graphic

        if (this.blockers.length === 0) {
          return;
        }
      }
    }
  },

  rollBlockCreation: function (length) {
    //console.log(this.blockers);
    for (var i = 0; i < length; i++) {
      // per digit, there's a 1 in 10 chance of removing a block
      if (Math.random() * 10 < 1) {
        var cell = null;
        while (cell === null) {
          var x = Math.floor(Math.random() * 8);
          var y = Math.floor(Math.random() * 8);
          if (this.grid[x][y].value !== 0) {
            cell = this.grid[x][y];
          }
        }

        cell.value = 0;
        cell.circle.play('x');

        this.blockers.push(cell);

        if (this.blockers.length === 64) {
          return;
        }
      }
    }
  },

  quitGame: function (pointer) {

    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

    //  Then let's go back to the main menu.
    this.state.start('MainMenu');

  }

};
