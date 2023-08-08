var board;
var gameWidth = 16
var gameHeight = 16
var bombs = 40

var bombCounter = bombs

//16x30 w/ 99
//16x16 w/ 40
//9x9 w/ 10

var flagImg;
var bombImg;

var squareSize = 25

var gameLost = false
var gameWon = false
var startingScreen = true
var firstClick = true

const TILE_STATUSES = {
  HIDDEN: "hidden",
  UNCOVERED: "uncovered",
  FLAGGED: "flagged",
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER)
  rectMode(CENTER)
  textAlign(CENTER, CENTER)

  flagImg = loadImage('images/flag.png')
  bombImg = loadImage('images/bomb.png')

  board = new Board(gameWidth, gameHeight, bombs)

  for (let element of document.getElementsByClassName("p5Canvas")) {
    element.addEventListener("contextmenu", (e) => e.preventDefault());
  }
}

function draw() {
  background(220)

  if (startingScreen) {
    //want a rectangle, buttons for each size, and a option for custom size
    //all will go away and variables will be set
    rect(windowWidth / 2, windowHeight / 2, 300, 400, 20)
    
    return
  }

  if (gameLost) {
    //uncover all tiles
    background(255, 0, 0)
    for (let i = 0; i < board.height; i++) {
      let row = board.grid[i]
      for (let j = 0; j < board.width; j++) {
        row[j].status = TILE_STATUSES.UNCOVERED
      }
    }
  }

  if (gameWon && !gameLost) {
    background(0, 255, 0)
  }

  board.show()
}

function mouseReleased() {
  let currSquare = board.getSquareByCoord(mouseX, mouseY)
  if (currSquare === null) {
    return
  }

  if (firstClick) {
    board.placeBombsAndNumbers(currSquare)
    firstClick = false
  }
  // print("(x, y): ", currSquare.x, ", ", currSquare.y, ")")
  if (mouseButton === LEFT) {
    if (currSquare.status === TILE_STATUSES.FLAGGED) {
      return
    }
    uncoverSquare(currSquare.x, currSquare.y)
  }
  else if (mouseButton === RIGHT) {
    //need to disable default pop up menu and get right click to work
    // document.addEventListener('contextmenu', event => event.preventDefault());
    if (currSquare.status === TILE_STATUSES.FLAGGED) {
      currSquare.status = TILE_STATUSES.HIDDEN
      bombCounter += 1
    }
    else if (currSquare.status === TILE_STATUSES.HIDDEN) {
      currSquare.status = TILE_STATUSES.FLAGGED
      bombCounter -= 1
    }
    
  }

  gameWon = board.gameWon()
}

function uncoverSquare(x, y) {
  // print("Uncovering square")
  let currSquare = board.getSquareAt(x, y)
  if (currSquare === null || currSquare.status === TILE_STATUSES.UNCOVERED || currSquare.status === TILE_STATUSES.FLAGGED) {
    return
  }
  if (currSquare.hasBomb) {
    gameLost = true
    return
  }
  currSquare.status = TILE_STATUSES.UNCOVERED
  if (currSquare.number === 0 && !currSquare.hasBomb) {
    for (let i = -1; i <= 1; i++) {
      // let row = board.grid[this.y + i]
      for (let j = -1; j <= 1; j++) {
        if (x + j < 0 || x + j >= board.width || y + i < 0 || y + i >= board.height) {
            continue
        }
        // print("(x, y): (", this.x + i, ", ", this.y + j, ")")
        
        uncoverSquare(x + j, y + i)
      }
    }
  }
}


