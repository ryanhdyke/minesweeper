class Square {
    constructor(x, y, hasBomb) {
        this.x = x
        this.y = y
        this.hasBomb = hasBomb
        this.number = 0
        this.status = TILE_STATUSES.HIDDEN

        this.xpx = 0
        this.ypx = 0
    }

    calculateNumber(board) {
        if (this.hasBomb) {
            return -1
        }
        let bombsTouched = 0
        for (let i = -1; i <= 1; i++) {
            let row = board.grid[this.y + i]
            for (let j = -1; j <= 1; j++) {
                if (this.x + j < 0 || this.x + j >= board.width || this.y + i < 0 || this.y + i >= board.height) {
                    continue
                }
                // print("(x, y): (", this.x + i, ", ", this.y + j, ")")
                
                let square = row[this.x + j]
                
                if (square.hasBomb) {
                    bombsTouched += 1
                }
            }
        }
        // print("Square at (", this.x, ", ", this.y, "): ", bombsTouched)
        return bombsTouched
    }

    show(startingXpx, startingYpx) {
        // print("SHowing square")
        //need to also account for the positioning
        this.xpx = startingXpx + (this.x * squareSize)
        this.ypx = startingYpx + (this.y * squareSize)
        if (this.status === TILE_STATUSES.HIDDEN) {
            //draw a gray square
            fill(175)
            stroke(0)
            strokeWeight(1)
            rect(this.xpx, this.ypx, squareSize, squareSize)
        }
        else if (this.status === TILE_STATUSES.FLAGGED) {
            //draw a gray square with a flag on top
            //draw a red square for now
            fill(175)
            stroke(0)
            strokeWeight(1)
            rect(this.xpx, this.ypx, squareSize, squareSize)
            image(flagImg, this.xpx + (squareSize / 2), this.ypx + (squareSize / 2), 20, 20)
        }
        else  { //if (this.status === TILE_STATUSES.UNCOVERED) {
            //it is uncovered
            //if it is a bomb, you lose and game over
            //    then uncover all tiles (set all status to uncovered)
            //draw a lighter gray square with a number in it
            //if the number is zero, do not display the number
            fill(150)
            stroke(0)
            strokeWeight(1)
            rect(this.xpx, this.ypx, squareSize, squareSize)
            if (this.hasBomb) {
                image(bombImg, this.xpx + (squareSize / 2), this.ypx + (squareSize / 2), 20, 20)
            }

            if (this.number != 0 && !this.hasBomb) {
                fill(0)
                stroke(0)
                strokeWeight(0)
                textSize(24)
                text(str(this.number), this.xpx + (squareSize / 2), this.ypx + (squareSize / 2) + 2)
            }
            
        }
    }

    isSquareByCoord(xpx, ypx) {
        return (xpx > this.xpx && xpx < this.xpx + squareSize && ypx > this.ypx && ypx < this.ypx + squareSize)
    }
}