class Board {
    constructor(width, height, totalBombs) {
        this.width = width
        this.height = height
        this.totalBombs = totalBombs

        this.grid = []

        let bombArray = this.generateBombs()

        for (let i = 0; i < this.height; i++) {
            let row = []
            for (let j = 0; j < this.width; j++) {
                let hasBomb = false
                if (this.pointInArray(bombArray, j, i)) {
                    // print("Bomb marked")
                    hasBomb = true
                }
                row.push(new Square(j, i, hasBomb))
            }
            this.grid.push(row)
        }

        this.generateNumbers()
    }

    show() {
        //figure out starting x and y for the row
        let boardWidthpx = this.width * squareSize
        let boardHeightpx = this.height * squareSize

        let centerX = windowWidth / 2
        let centerY = windowHeight / 2

        let startingXpx = centerX - (boardWidthpx / 2)
        let startingYpx = centerY - (boardHeightpx / 2)

        //draw bomb counter
        strokeWeight(0)
        fill(0)
        textSize(32)
        text(str("Bombs left: " + bombCounter), windowWidth / 2, startingYpx - 40)

        //draw bigger border around board
        rectMode(CENTER)
        strokeWeight(3)
        rect(centerX, centerY, boardWidthpx, boardHeightpx)
        rectMode(CORNER)
        for (let i = 0; i < this.height; i++) {
            let row = this.grid[i]
            
            for (let j = 0; j < this.width; j++) {
                row[j].show(startingXpx, startingYpx)
            }
        }
    }

    generateBombs() {
        let bombArray = []

        let i = 0
        while (i < this.totalBombs) {
            //generate a x and y position for the bomb
            //if duplicate, redraw
            let bombX = Math.floor(Math.random() * this.width)
            let bombY = Math.floor(Math.random() * this.height)
            if (!this.pointInArray(bombArray, bombX, bombY)) {
                bombArray.push([bombX, bombY])
                i += 1
            }
        }
        return bombArray
    }

    pointInArray(arr, x, y) {
        if (arr.length === 0) {
            return false
        }
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][0] === x && arr[i][1] === y) {
                return true
            }
        }
        return false
    }

    generateNumbers() {

        for (let i = 0; i < this.height; i++) {
            let row = this.grid[i]
            for (let j = 0; j < this.width; j++) {
                // print("(x, y): (", j, ", ", i, ")")
                let square = row[j]
                if (square.hasBomb) {
                    continue
                }
                let num = square.calculateNumber(this)
                
                square.number = num
            }
        }
    }

    getSquareAt(x, y) {
        for (let i = 0; i < this.height; i++) {
            if (i === y) {
                let row = this.grid[i]
                for (let j = 0; j < this.width; j++) {
                    // print("(x, y): (", j, ", ", i, ")")
                    if (j === x) {
                        let square = row[j]
                        return square
                    }
                }
            }
            
        }
        return null
    }

    getSquareByCoord(xpx, ypx) {
        for (let i = 0; i < this.height; i++) {
            let row = this.grid[i]
            for (let j = 0; j < this.width; j++) {
                let square = row[j]
                if (square.isSquareByCoord(xpx, ypx)) {
                    return square
                }
            }
        }
        return null
    }

    gameWon() {
        for (let i = 0; i < this.height; i++) {
            let row = this.grid[i]
            for (let j = 0; j < this.width; j++) {
                let currSquare = row[j]
                if ((currSquare.status === TILE_STATUSES.HIDDEN || currSquare.status === TILE_STATUSES.FLAGGED) &&
                    !currSquare.hasBomb) {
                        return false
                }
            }
        }
        return true
    }

}