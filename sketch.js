var wordSize = 30
var testWord
var wordPadding = 10
var words = []
var wordInput
var fillerWords = [
	"INSERT ALL",
    "a",
	"an",
	"and",
	"the",
	"it",
	"in",
	"on",
    "of",
	"than",
	"that",
	"this",
	"is",
    "if",
	"was",
	"my",
	"your",
    "you", "me", "i",
	"has",
	"had",
    "have",
	"to",
]
var stage = "INPUT"
var binBBox
var clearButton
let font

function randPosInBounds(boundPercent) {
	let w = width * boundPercent
	let h = height * boundPercent

	let offsetX = Math.floor(Math.random() * w)
	let offsetY = Math.floor(Math.random() * h)

	return { x: offsetX, y: offsetY }
}

function isInBounds(x, y, bbox) {
	let isInX = x > bbox.x && x < bbox.x + bbox.w
	let isInY = y > bbox.y && y < bbox.y + bbox.h
	return isInX && isInY
}

function mousePressed() {
	for (let word of words) {
		if (word.bbox) {
			if (isInBounds(mouseX, mouseY, word.bbox) && !word.locked) {
				word.isHeld = true
			}
		}
	}
}

function mouseReleased() {
	for (let word of words) {
		if (isInBounds(mouseX, mouseY, binBBox) && word.isHeld) {
			word.binned = true
		}
		word.isHeld = false
	}
}

function keyPressed() {
	if (keyCode === ENTER || keyCode === 32) {
		if (wordInput.value() != "" && wordInput.value() != " ") {
			new Word(wordInput.value())
			wordInput.value("")
		}
	}
	if (keyCode === 32) {
		for (let word of words) {
			if (isInBounds(mouseX, mouseY, word.bbox)) {
				word.locked = !word.locked
			}
		}
	}
}

class Word {
	constructor(word) {
		this.word = word
		this.locked = false
		this.pos = randPosInBounds(0.6)
		this.isHeld = false
		this.binned = false
		this.locked = false
		//console.log('New Word: ' + this.word, this)
		this.number = words.length + 1
		words.push(this)
	}

	Draw() {
		if (!this.binned) {
			let bbox = font.textBounds(this.word, this.pos.x, this.pos.y)
			this.bbox = bbox
			if (this.locked) {
				stroke(0)
			} else {
				noStroke()  
			}
            if (this.isHeld)
            {
                noStroke
                fill(60)
                rect(
                    (bbox.x - wordPadding / 2) + 5,
                    (bbox.y - wordPadding / 2) + 5,
                    bbox.w + wordPadding,
                    bbox.h + wordPadding
                )
            }
            fill(235, this.pos.y / 3, 77)
			strokeWeight(1)
			rect(
				bbox.x - wordPadding / 2,
				bbox.y - wordPadding / 2,
				bbox.w + wordPadding,
				bbox.h + wordPadding
			)
			noStroke()
			fill(0)
			text(this.word, this.pos.x, this.pos.y)
		}
	}

	Move() {
		if (this.isHeld && !this.binned && !this.locked) {
			this.pos.x = mouseX - this.bbox.w / 2
			this.pos.y = mouseY + this.bbox.h / 2
		}
	}
}

function preload() {
	font = loadFont("assets/Chopsticks.otf")
}

function getRandomInt(max) {
	return Math.floor(Math.random() * max)
}

function setup() {
	createScaledCanvas(0.9)
	textFont(font)
	textSize(wordSize)
	//testWord = new Word("Test")

	binBBox = {
		x: 25,
		y: height - 75,
		w: 50,
		h: 50,
	}

	wordInput = createInput()
	wordInput.position(width / 2 - wordInput.width / 4, height)

	randButton = createButton("Random")
	randButton.position(
		width / 2 - wordInput.width / 4,
		height + wordInput.height
	)
	randButton.mousePressed(function () {
		let randWord = randomWords[getRandomInt(randomWords.length)]
		new Word(randWord)
	})

    fiverandButton = createButton("5")
	fiverandButton.position(
		width/2 + randButton.width,
		height + wordInput.height
	)
	fiverandButton.mousePressed(function () {
        for (let i = 0; i<5; i++)
        {
            let randWord = randomWords[getRandomInt(randomWords.length)]
            new Word(randWord)            
        }

	})


	let i = 0
	for (let filler of fillerWords) {
		i++
		let b = createButton(filler)
		b.position(canvasPos.x + 10, height- 50 - 30 * i)
		b.mousePressed(function () {
            if (filler === "INSERT ALL")
            {
                for (let i = 1; i< fillerWords.length; i++)
                {
                    new Word(fillerWords[i])
                }
            }
            else {
			    new Word(filler)
            }
		})
	}

	clearButton = createButton("Clear")
	clearButton.position(
		canvasPos.x + binBBox.x + binBBox.w + 25,
		canvasPos.y + binBBox.y + binBBox.h / 4
	)
	clearButton.mousePressed(function () {
		let newWords = []
		for (let word of words) {
			if (word.locked) {
				newWords.push(word)
			} else {
				word.binned = true
			}
		}
		words = newWords
	})

	sortButton = createButton("Sort")
	sortButton.position(
		canvasPos.x + binBBox.x + binBBox.w + 75,
		canvasPos.y + binBBox.y + binBBox.h / 4
	)
	sortButton.mousePressed(function () {
		let x = 0
		let y = 25
		let lastWidth = 0
		for (let word of words) {
            x += lastWidth + 75
            if (!word.locked)
            {
                if (y == 25) {
                    y += word.bbox.h
                }
                if (x + word.bbox.w + 75 > width) {
                    x = 75
                    y += word.bbox.h*2
                }
                lastWidth = word.bbox.w
                word.pos.x = x
                word.pos.y = y
            }                
        }

	})

    unlockButton = createButton("Unlock all")
	unlockButton.position(
		canvasPos.x + binBBox.x + binBBox.w + 120,
		canvasPos.y + binBBox.y + binBBox.h / 4
	)
	unlockButton.mousePressed(function () {
        for (let word of words)
        {word.locked=false}
	})

    lockButton = createButton("Lock all")
	lockButton.position(
		canvasPos.x + binBBox.x + binBBox.w + 200,
		canvasPos.y + binBBox.y + binBBox.h / 4
	)
	lockButton.mousePressed(function () {
        for (let word of words)
        {word.locked=true}
	})
}

function drawBin() {
	fill(255)
	stroke(0)
	rect(binBBox.x, binBBox.y, binBBox.w, binBBox.h)
	fill(0)
	noStroke()
	text("BIN", binBBox.x + 10, binBBox.y + binBBox.h / 1.5)
}

function draw() {
	background(100)
	drawBin()
	for (let word of words) {
		word.Draw()
		word.Move()
	}
}
