// import "./styles.css";
import { DynamicWordCloud } from "dynamic_wordcloud";
const ENTER_KEY_CODE = 13

const stopwords = ["i","me","my","myself","we","our","ours","ourselves","you","your","yours","yourself","yourselves","he","him","his","himself","she","her","hers","herself","it","its","itself","they","them","their","theirs","themselves","what","which","who","whom","this","that","these","those","am","is","are","was","were","be","been","being","have","has","had","having","do","does","did","doing","a","an","the","and","but","if","or","because","as","until","while","of","at","by","for","with","about","against","between","into","through","during","before","after","above","below","to","from","up","down","in","out","on","off","over","under","again","further","then","once","here","there","when","where","why","how","all","any","both","each","few","more","most","other","some","such","no","nor","not","only","own","same","so"
,"than","too","very","s","t","can","will","just","don","should","now"];

let class_canvas = document.getElementById("word_cloud_class_canvas");

class_canvas.width = innerWidth * 0.8;
class_canvas.height = innerHeight * 0.7;

let dynamicWordCloud = new DynamicWordCloud(class_canvas);

dynamicWordCloud.animate();

const enter_button = document.querySelectorAll('button')[0];
const clear_button = document.querySelectorAll('button')[1];

enter_button.addEventListener('click', parse_input);
clear_button.addEventListener('click', clear_state);

const input_text_element = document.getElementById("input_text");
let input_queue = [];

input_text_element.addEventListener("keyup", function (event) {

    if (event.keyCode === ENTER_KEY_CODE) {
        enter_button.click()
    }
});

function clear_state() {
    dynamicWordCloud.word_objects = [];
    input_queue = [];
    document.getElementById("input_text").value = "";
    display();
}

function isInvalidText(input_text) {
    return input_text == "";
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function parse_input() {

    let input_text = input_text_element.value;
    document.getElementById("input_text").value = "";

    if (isInvalidText(input_text)) {
        return;
    }

    let punctuation_removed = input_text.replace(/[\[\].,\/#!$%\^&\*;:{}=\-_`~()1234567890]/g,"");
    
    let input_list = punctuation_removed.split(" ")

    input_queue = input_queue.concat(input_list);

    while (input_queue.length != 0) {

        let next_word = input_queue.shift();
        next_word = next_word.toLowerCase();
        let size = stopwords.includes(next_word) ? dynamicWordCloud.canvas.height * 0.06 : dynamicWordCloud.canvas.height * 0.14;

        dynamicWordCloud.update_word_cloud(next_word, size);

        await sleep(200);
    }
}