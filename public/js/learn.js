//a promise that resolves with the user data
const userdataPromise = window.dataLoader.getUserData();
//the sets name
const setName = window.location.search.split('?set=')[1];
//functions to be set in the promise (bad code) (are partially created for intellisense)
var study = (term) => { }, master = (term) => { };
//vars for the set and index of that set (set in userdata promise handling)
var set, index;
//the correct button
var correct = 1;
//the list of all [term, definition]s
var termList = [];
//the current terms index
var termIndex = 0;
//control's if the buttons can be clicked
var active = true;
//answer with term or definition (0 term 1 def)
var termOrDef = 0
//write or button mode (0 button, 1 write)
var answerMode = 1;
//TODO implement

const colors = {
    correctColor: "rgb(13, 216, 13)",
    textCorrectColor: "rgb(9, 164, 9)",
    backgroundCorrectColor: "rgba(75 241 75 / 49%)",
    incorrectColor: "red",
    textIncorrectColor: "rgb(186, 0, 0)",
    backgroundIncorrectColor: "#dc000042",
    defaultColor: ""
}

const animations = {
    popupIn: {
        keyframes: [
            {
                transform: 'translateY(400px)',
                opacity: 0
            },
            {
                transform: 'translateY(0)',
                opacity: 1
            }
        ],
        timing: {
            duration: 500,
            iterations: 1,
            easing: 'ease-out'
        }
    }
}

//deactivates or activates (below) the inputs
function deactivate() {
    active = false;
    Array.from($class("button")).forEach(e => e.style.color = "var(--lightgray)");
    let elem = $('text');
    let parent = elem.parentElement;
    elem.setAttribute("disabled", "");
    parent.style.setProperty("--text-enabled", "transparent");
}

function activate() {
    active = true;
    Array.from($class("button")).forEach(e => e.style.color = "");
    let elem = $('text');
    let parent = elem.parentElement;
    parent.style = "";
    elem.style = "";
    elem.removeAttribute("disabled");
}


// populates the button values 
// and uses draw randoms to set the content (calls activate)
function populateValuesButtons() {
    $('term').innerText = termList[termIndex][termOrDef];
    let indexes = drawRandoms(termList.length - 1, termIndex);
    // let indexes = [1, 2, 3, 4]
    for (i in indexes) {
        $(`answer${Number(i) + 1}`).innerText = termList[indexes[i]][inv(termOrDef)];
        $(`answer${Number(i) + 1}`).style.borderColor = colors.defaultColor;
    }
    activate();
}

function populateValuesWritten() {
    console.log("called");
    $('term').innerText = termList[termIndex][termOrDef];
    $('text').value = '';
    $('correctTextContainer').style.display = "none";
    $('correctText').innerText = termList[termIndex][inv(termOrDef)];
    $('writingButtons').style = "";
    activate();
    $('text').focus();
}

//styles elements correct or incorrect (below) called with element
function markCorrect(elem) {
    elem.style.borderColor = colors.correctColor;
    elem.style.color = colors.textCorrectColor;
}

function markIncorrect(elem) {
    elem.style.borderColor = colors.incorrectColor;
    elem.style.color = colors.textIncorrectColor;
}

function markCorrectWritten() {
    deactivate();
    let elem = $('text');
    let parent = elem.parentElement;
    parent.style.backgroundColor = colors.backgroundCorrectColor;
    parent.style.borderColor = colors.correctColor;
    elem.style.color = colors.textCorrectColor;
}

function markIncorrectWritten() {
    deactivate();
    let elem = $('text');
    let parent = elem.parentElement;
    parent.style.backgroundColor = colors.backgroundIncorrectColor;
    parent.style.borderColor = colors.incorrectColor;
    elem.style.color = colors.textIncorrectColor;
}

function promptNext() {
    $('popupCon').style.display = "flex";
    $('popupCon').animate(
        animations.popupIn.keyframes,
        animations.popupIn.timing
    );
}

//answer handler for button mode.
//pram is the index of the correct button
function answerButton(value) {
    if (!active) return;
    termIndex++;
    deactivate();
    if (value == correct + 1) {
        //correct
        markCorrect($(`answer${value}`));
        setTimeout(() => {
            populateValuesButtons();
        }, 1000)
    } else {
        //incorrect
        markCorrect($(`answer${correct + 1}`));
        markIncorrect($(`answer${value}`));
        promptNext();
    }
}

function answerWritten() {
    if (!active) return;
    value = $('text').value;
    console.log(termList[termIndex][inv(termOrDef)]);
    if (value == termList[termIndex][inv(termOrDef)]) {
        markCorrectWritten();
        setTimeout(() => {
            populateValuesWritten();
        }, 1000)
    } else {
        markIncorrectWritten();
        $('writingButtons').style.display = "none";
        promptNext()
        $("writingButtons").style.display = 'none';
        $('correctTextContainer').style.display = 'block';
    }
    termIndex++;
}

//gets indexes for buttons
function drawRandoms(max, currentIndex) {
    let outPuts = [];
    while (outPuts.length < 4) {
        let temp = Math.round(max * Math.random())
        if (!outPuts.includes(temp) && temp != currentIndex) { outPuts.push(temp); }
    }
    correct = Math.round(3 * Math.random())
    outPuts[correct] = currentIndex;
    return outPuts;
}
//helpers
function genTermArr(kSet) {
    let temp = [];
    for (part in kSet.cards) {
        for (item in kSet.cards[part]) {
            temp.push([item, kSet.cards[part][item]]);
        }
    }
    return temp;
}

function getSet(userdata, setName) {
    for (let i of userdata.sets) {
        if (i.metadata.name == setName) return i;
    }
    throw 'not a set';
}

function link(href) {
    window.location.assign(href)
}

function inv(num) {
    return Math.abs(num - 1);
}
//dumb homebrew jquery
function $(id) {
    return document.getElementById(id)
}

function $class(className) {
    return document.getElementsByClassName(className);
}

//event handlers
$('back').addEventListener('click', () => { link(`./sets.html?set=${setName}`) });
$('popup').addEventListener('click', () => { $('popupCon').style.display = "none"; answerMode == 0 ? populateValuesButtons() : populateValuesWritten(); });
$('activateOptions').addEventListener('click', () => { $('options').style.display = "flex" })
$('exit').addEventListener('click', () => { $('options').style.display = "none" })
$('submit').addEventListener('click', answerWritten)

document.addEventListener('keydown', (e) => {
    if (e.key != 'Enter' || answerMode != 1) return;
    if (active) { answerWritten(); return;}
    if (!active) { $('popupCon').style.display = "none"; populateValuesWritten(); return; }
});

for (let i = 1; i <= 4; i++) {
    $(`answer${i}`).addEventListener('click', function () { answerButton(this.id[this.id.length - 1]) })
}


//data promise handling
userdataPromise.then((userdata) => {
    //basic setup
    try {
        set = getSet(userdata, setName);
    } catch (error) {
        // document.body.innerHTML = 'no set found';
        console.error(error);
        return;
    }
    index = userdata.sets.findIndex((e) => {
        return e === set;
    });

    //set the funcs
    study = (term, definition) => { set.cards.studying[term] = definition }
    mastered = (term, definition) => { set.cards.mastered[term] = definition }

    // initialize
    termList = genTermArr(set);
    answerMode == 0 ? populateValuesButtons() : populateValuesWritten();
});
