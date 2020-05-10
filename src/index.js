import "./styles.css";
import { isOverlapping } from "./utils/index";

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
    
    if (isInvalidText(input_text)) {
        return;
    }

    word_rectangles = decomposeExistingWords(word_rectangles);

    // CASE (B): word is already in the word cloud
    // CASE (C): new word to be added

    word_rectangles = addWord(word_rectangles, input_text);

    // STEP #2: centralize Wordcloud such that it's more of a cloud and less of a random space
    // TODO!
    word_rectangles = centralizeWordRectangles(word_rectangles, canvas);

    display();
}

function centralizeWordRectangles(input_word_rectangles, canvas) {

    let output_word_rectangles = centrify(input_word_rectangles, canvas)
    return output_word_rectangles
}

function centrify(input_word_rectangles, canvas) {

    let output_word_rectangles = []

    let total_x = 0;
    let total_y = 0;

    for (let word_rect of input_word_rectangles) {
        total_x += word_rect.mid_x;
        total_y += word_rect.mid_y;
    }

    let average_x = total_x / input_word_rectangles.length;
    let average_y = total_y / input_word_rectangles.length;

    let delta_x = average_x - canvas.width / 2;
    let delta_y = average_y - canvas.height / 2;

    for (let word_rect of input_word_rectangles) {

        let new_word_rect = Object.assign(Object.create(word_rect), word_rect);
        new_word_rect.move(-delta_x, -delta_y);
        output_word_rectangles.push(new_word_rect);
    }

    return output_word_rectangles;
}

function isInvalidText(input_text) {
    return input_text == "";
}

function addWord(input_word_rectangles, input_text) {

    let output_word_rectangles;

    let isNewWord = !checkIfWordExist(input_word_rectangles, input_text);

    if (isNewWord) {
        output_word_rectangles = addNonOverlappingWord(input_word_rectangles, input_text);
    } else {
        output_word_rectangles = incrementExistingWord(input_word_rectangles, input_text);
    }

    return output_word_rectangles;
}

function incrementExistingWord(input_word_rectangles, input_text) {

    let output_word_rectangles = [];

    for (let word_rect of input_word_rectangles) {

        let new_word_rect = Object.assign(Object.create(word_rect), word_rect);
        
        if (new_word_rect.word == input_text) {
            new_word_rect.incrementSize();
        }

        output_word_rectangles.push(new_word_rect);
    }

    return output_word_rectangles;
} 

function decomposeExistingWords(input_word_rectangles) {

    let output_word_rectangles = [];

    for (let word_rect of input_word_rectangles) {

        let decomposed_word_rect = Object.assign(
            Object.create(word_rect), word_rect
        );
        decomposed_word_rect.decrementSize();
        output_word_rectangles.push(decomposed_word_rect);

    }

    return output_word_rectangles;

}

function checkIfWordExist(input_word_rectangles, input_text) {

    for (let word_rect of input_word_rectangles) {
        if (word_rect.word == input_text) {
            return true;
        }
    }

    return false;
}

function addNonOverlappingWord(input_word_rectangles, input_text) {

    let output_word_rectangles = Object.assign([], input_word_rectangles);

    let newWordRect;
    let overlappingCurrentWords = true;

    while (overlappingCurrentWords) {

        let margin = 0.2
    
        let mid_x = ((1 - 2 * margin) * Math.random() + margin) * canvas.width;
        let mid_y = ((1 - 2 * margin) * Math.random() + margin) * canvas.height;
        const height = 30;

        overlappingCurrentWords = false;

        newWordRect = new WordRectangle(input_text, mid_x, mid_y, height)

        for (let wordRect of output_word_rectangles) {
            if (isOverlapping(newWordRect, wordRect)) {
                overlappingCurrentWords = true;
            } 
        }
    }

    output_word_rectangles.push(newWordRect);

    return output_word_rectangles;
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

    move(x_shift, y_shift) {
        this.mid_x = this.mid_x + x_shift;
        this.mid_y = this.mid_y + y_shift;
    }

    incrementSize() {
        this.height = Math.ceil(this.height * 1.2);
    }

    decrementSize() {
        this.height = this.height - 1;
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