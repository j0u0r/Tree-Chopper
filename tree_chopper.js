const canvas = document.getElementById("game-canvas");
const c = canvas.getContext("2d");

// canvas reso
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// mid point
const midx = canvas.width / 2;

// 1 unit of height
const unit = (canvas.height - 10) / 22;

// branch pos (lowest -> highest)
var branchpos = [unit * 19];
for (let i = 18; i >= 0; i--) {
  branchpos.push(unit * i);
}

class Sky {
  constructor() {
    c.fillStyle = "#89cff0";
    c.fillRect(0, 0, canvas.width, canvas.height);
  }
}

class Tree {
  constructor() {
    // tree drawing
    c.fillStyle = "#964B00";
    c.fillRect(midx - 70, 0, 140, canvas.height);
  }
}

class Branch {
  constructor(bool, arr) {
    this.bool = bool;
    this.arrsize = arr.length;
    c.fillStyle = "#87d37c";
    // left
    if (this.bool == true) {
      c.fillRect(midx - 270, branchpos[this.arrsize - 1], 200, unit);
    }
    // right
    else if (this.bool == false) {
      c.fillRect(midx + 70, branchpos[this.arrsize - 1], 200, unit);
    }
  }
}

class Grass {
  constructor() {
    c.fillStyle = "#337771";
    c.fillRect(0, unit * 21 + 10, canvas.width, unit);
  }
}

class Player {
  constructor(input) {
    this.input = input;
    if (this.input == true) {
      c.fillStyle = "#ffb6c1";
      c.fillRect(midx - 150, unit * 19 + 10, 50, unit * 2);
      c.fillStyle = "#000000";
      c.fillRect(midx - 150, unit * 19 + 10, 50, 20);
      c.fillStyle = "#e11b22";
      c.fillRect(midx - 150, unit * 20 + 10, 50, unit);
    } else if (this.input == false) {
      c.fillStyle = "#ffb6c1";
      c.fillRect(midx + 100, unit * 19 + 10, 50, unit * 2);
      c.fillStyle = "#000000";
      c.fillRect(midx + 100, unit * 19 + 10, 50, 20);
      c.fillStyle = "#e11b22";
      c.fillRect(midx + 100, unit * 20 + 10, 50, unit);
    }
  }

  checkCollide(branches) {
    for (let z = 0; z < branches.length; z++) {
      if (this.input == branches[z]) {
        return true;
      }
    }
    return false;
  }
}

class Score {
  constructor() {
    this.score = 0;
  }

  update(res) {
    if (res == false) {
      this.score += 1;
    } else if (res == true) {
      document.getElementById('game-canvas').remove()
      document.getElementById('scorediv').remove()
      document.getElementById("finalscore").innerHTML = this.score;
      document.getElementById("gameover").style.display = 'block';
      document.getElementById("retry").addEventListener("click", () => {
        location.reload();
      });
    }
    document.getElementById("score").innerHTML = this.score;
  }

  reset() {
    this.score = 0;
  }
}

function LorR(number, arr) {
  const arrsize = arr.length;
  //   1st branch
  if (arrsize == 0) {
    if (number <= 5) {
      return true;
    } else if (number <= 10 && number > 5) {
      return false;
    }
    // subsequent branches (60/40 chance for opposite branch)
  } else if (arrsize > 0) {
    var prev = arr[arrsize - 2];
    if (number <= 6) {
      return !prev;
    } else if (number <= 10 && number > 6) {
      return prev;
    }
  }
}

function generateBranches() {
  var arr = [];
  var hitarr = new Array(1);
  // loop 10 times
  for (let a = 0; arr.length < branchpos.length && a < 10; a++) {
    // random int from 1 to 10
    var num = Math.floor(Math.random() * (10 - 1) + 1);
    var newbranch = LorR(num, arr);
    arr.push(newbranch, "hi");
    new Branch(arr[arr.length - 2], arr);
    if (a == 0) {
      hitarr.push(newbranch);
    }
  }
  return [arr, hitarr];
}

function updateBranches(arr, hitarr) {
  c.clearRect(0, 0, canvas.width, canvas.height);
  createEnv();
  hitarr.splice(0, 1);
  hitarr.push(arr[0]);
  arr.splice(0, 1);
  new Branch(hitarr[1], new Array(1));

  var num = Math.floor(Math.random() * (10 - 1) + 1);
  arr.push(LorR(num, arr), "hi");

  for (let b = 0; b < arr.length; b++) {
    if (arr[b] != "hi") {
      new Branch(arr[b], new Array(b + 2));
    }
  }
  return hitarr;
}

function createEnv() {
  new Sky();
  new Tree();
  new Grass();
}

var score = new Score();

function startGame() {
  createEnv();
  score.reset();
  document.getElementById("score").innerHTML = 0;
  var [arr, hitarr] = generateBranches();

  // read user input
  document.addEventListener("keydown", (e) => {
    switch (e.key.toLocaleUpperCase()) {
      case "ARROWLEFT":
      case "A":
        var branches = updateBranches(arr, hitarr);
        var input = new Player(true);
        score.update(input.checkCollide(branches));
        break;
      case "ARROWRIGHT":
      case "D":
        var branches = updateBranches(arr, hitarr);
        var input = new Player(false);
        score.update(input.checkCollide(branches));
        break;
    }
  });
}

window.addEventListener("load", () => {
  startGame();
});
