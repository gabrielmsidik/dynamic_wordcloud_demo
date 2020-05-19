// import "./styles.css";
import { DynamicWordCloud } from "dynamic_wordcloud";
const ENTER_KEY_CODE = 13

const stopwords = ["i","me","my","myself","we","our","ours","ourselves","you","your","yours","yourself","yourselves","he","him","his","himself","she","her","hers","herself","it","its","itself","they","them","their","theirs","themselves","what","which","who","whom","this","that","these","those","am","is","are","was","were","be","been","being","have","has","had","having","do","does","did","doing","a","an","the","and","but","if","or","because","as","until","while","of","at","by","for","with","about","against","between","into","through","during","before","after","above","below","to","from","up","down","in","out","on","off","over","under","again","further","then","once","here","there","when","where","why","how","all","any","both","each","few","more","most","other","some","such","no","nor","not","only","own","same","so"
,"than","too","very","s","t","can","will","just","don","should","now"];

let classCanvas = document.getElementById("word_cloud_class_canvas");

classCanvas.width = innerWidth * 0.8;
classCanvas.height = innerHeight * 0.7;

let dynamicWordCloud = new DynamicWordCloud(classCanvas);

dynamicWordCloud.animate();

const enterButton = document.querySelectorAll('button')[0];
const clearButton = document.querySelectorAll('button')[1];

enterButton.addEventListener('click', parse_input);
clearButton.addEventListener('click', clear_state);

const inputTextElement = document.getElementById("input_text");
let inputQueue = [];

inputTextElement.addEventListener("keyup", function (event) {

    if (event.keyCode === ENTER_KEY_CODE) {
        enterButton.click()
    }
});

function clear_state() {
    dynamicWordCloud.word_objects = [];
    inputQueue = [];
    document.getElementById("input_text").value = "";
    display();
}

function isInvalidText(inputText) {
    return inputText == "";
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function parse_input() {

    let inputText = inputTextElement.value;
    document.getElementById("input_text").value = "";

    if (isInvalidText(inputText)) {
        return;
    }

    let punctuationRemoved = inputText.replace(/[\[\].,\/#!$%\^&\*;:{}=\-_`~()1234567890]/g,"");
    
    let inputList = punctuationRemoved.split(" ")

    inputQueue = inputQueue.concat(inputList);

    while (inputQueue.length != 0) {

        let nextWord = inputQueue.shift();
        nextWord = nextWord.toLowerCase();
        let size = stopwords.includes(nextWord) ? dynamicWordCloud.canvas.height * 0.06 : dynamicWordCloud.canvas.height * 0.14;

        dynamicWordCloud.update_word_cloud(nextWord, size);

        await sleep(200);
    }
}