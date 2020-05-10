import "./styles.css";

const ENTER_KEY_CODE = 13

let canvas = document.getElementById("word_cloud_canvas");
let ctx = canvas.getContext("2d");

let word_rectangles = [];

const button = document.querySelector('button');
button.addEventListener('click', update_word_cloud);
const input_text_element = document.getElementById("input_text");

input_text_element.addEventListener("keyup", function (event) {

    if (event.keyCode === ENTER_KEY_CODE) {
        button.click()
    }

});

function update_word_cloud() {

    // STEP #1: Process the word that the user inputs
    // CASE (A): word is invalid
    // CASE (B): word is already in the word cloud
    // CASE (C): new word to be added

    let input_text = input_text_element.value;
    document.getElementById("input_text").value = "";
    
    if (input_text === "") {
        return;
    }
    
    for (let word_rect of word_rectangles) {

        if (word_rect.word == input_text) {
            word_rect.incrementSize();
            display();
            return;
        } else {
            word_rect.decrementSize();
        }
    }

    let margin = 0.2

    let mid_x = ((1 - 2 * margin) * Math.random() + margin) * canvas.width;
    let mid_y = ((1 - 2 * margin) * Math.random() + margin) * canvas.height;
    const height = 30;


    word_rectangles.push(
        new WordRectangle(input_text, mid_x, mid_y, height)
    );

    display();
}

function display() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let wordRect of word_rectangles) {
        wordRect.draw();
    }
}

class WordRectangle {

    constructor(word, mid_x, mid_y, height) {

        this.word = word;
        this.mid_x = mid_x;
        this.mid_y = mid_y;
        this.height = height;

    }

    incrementSize() {
        this.height = Math.ceil(this.height * 1.2);
    }

    decrementSize() {
        this.height = Math.floor(this.height * 0.95);
    }

    getLength() {
        return this.height * Math.ceil(this.word.length / 3 ) 
    }
    
    // top left corner coordinates
    get_x1() {
        return this.mid_x - this.getLength() * 0.5;
    }
    get_y1() {
        return this.mid_y - this.height * 0.5
    }

    
    // bottom right corner coordinates
    get_x2() {
        return this.mid_x + this.getLength() * 0.5;
    }
    get_y2() {
        return this.mid_y + this.height * 0.5;
    }

    getRectangle() {
        return new Rectangle(
            this.get_x1(), this.get_y1(), this.get_x2(), this.get_y2()
        )
    }

    getWordObject() {
        return new Word(
            this.word, this.get_x1(), this.get_y1(), this.get_x2(), this.get_y2()
        )
    }

    draw() {
        this.getRectangle().draw();
        this.getWordObject().draw();
    }

}

class Rectangle {
    constructor(x1, y1, x2, y2) {

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;

    }

    draw() {

        ctx.beginPath();
        ctx.strokeRect(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);
        ctx.stroke();
        ctx.closePath();
    }
}

class Word {

    constructor(word, x1, y1, x2, y2) {

        this.word = word;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;

    }

    draw() {

        const center_x = (this.x2 - this.x1) * 0.5 + this.x1;
        const base_y = (this.y2 - this.y1) * 0.75 + this.y1;

        let fontSize = Math.floor((this.y2 - this.y1) * 0.75);
        const fontFormat = "px Segoe UI Light";

        ctx.font = "" + fontSize + fontFormat;
        ctx.textAlign = "center";

        let metrics = ctx.measureText(this.word);
        let textWidth = metrics.width;

        while (textWidth > this.x2 - this.x1) {

            fontSize -= 1
            ctx.font = "" + fontSize + fontFormat;

            metrics = ctx.measureText(this.word);
            textWidth = metrics.width;

        }

        ctx.fillText(this.word, center_x, base_y);

    }
}