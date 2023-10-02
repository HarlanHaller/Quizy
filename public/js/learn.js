//a promise that resolves with the user data
const userdataPromise = window.dataLoader.getUserData();
//the sets name
const setName = window.location.search.split("?set=")[1];
//functions to be set in the promise (bad code) (are partially created for intellisense)
var study = async (term) => { term; }, master = async  (term) => { term; };
//insures all study or master promises are resolved when needed
var lastStudyPromise = new Promise(() => {});
//check if we are interRound
var isInterRound = false;
//vars for the set and index of that set (set in userdata promise handling)
var set;
//the correct button
var correct = 1;
//the list of all [term, definition]s being used in the current round
var roundTerms = [];
//separated list (into not studied studding mastered)
const termList = {
    notStudied: [["", "", "notStudied"]],
    studying: [["", "", "studying"]],
    mastered: [["", "", "mastered"]]

};
//term list without sections
var termListNoSection = [];
//the current terms index (with roundTerm);
var termIndex = 0;
//control's if the buttons can be clicked
var active = true;
//answer with term or definition (0 term 1 def)
var termOrDef = 0;
//write or button mode (0 button, 1 write)
var answerMode = 0;

//parameters
const MAX_STUDYING_PER_ROUND = 3;
const CARDS_PER_ROUND = 7;

const colors = {
    correctColor: "rgb(13, 216, 13)",
    textCorrectColor: "rgb(9, 164, 9)",
    backgroundCorrectColor: "rgba(75 241 75 / 49%)",
    incorrectColor: "red",
    textIncorrectColor: "rgb(186, 0, 0)",
    backgroundIncorrectColor: "#dc000042",
    defaultColor: ""
};

const animations = {
    popupIn: {
        keyframes: [
            {
                transform: "translateY(400px)",
                opacity: 0
            },
            {
                transform: "translateY(0)",
                opacity: 1
            }
        ],
        timing: {
            duration: 500,
            iterations: 1,
            easing: "ease-out"
        }
    }
};

//deactivates or activates (below) the inputs
function deactivate() {
    active = false;
    Array.from($class("button")).forEach(e => e.classList.add("button-deactivated"));
    let elem = $("text");
    let parent = elem.parentElement;
    elem.setAttribute("disabled", "");
    parent.style.setProperty("--text-enabled", "transparent");
}

function activate() {
    active = true;
    Array.from($class("button")).forEach(e => {
        e.classList.remove("button-deactivated"); 
        e.style = "";
    });
    let elem = $("text");
    let parent = elem.parentElement;
    parent.style = "";
    elem.style = "";
    elem.removeAttribute("disabled");
}


// populates the button values 
// and uses draw randoms to set the content (calls activate)
async function populateValuesButtons() {
    if(isInterRound) return;
    if(await nextRound()) return;
    $("buttons").style = "";
    $("writing").style.display = "none";
    $("term").innerText = roundTerms[termIndex][termOrDef];
    const { values, correctIndex} = drawRandoms(termListNoSection.length - 1, roundTerms[termIndex]);
    correct = correctIndex;
    
    for (let i in values) {
        $(`answer${Number(i) + 1}`).innerText = values[i][inv(termOrDef)];
        $(`answer${Number(i) + 1}`).style.borderColor = colors.defaultColor;
    }
    $("progress").style.width = `${(termIndex + 1) / roundTerms.length * 100}%`;
    activate();
}

async function populateValuesWritten() {
    if (isInterRound) return;
    if (await nextRound()) return;
    $("buttons").style.display = "none";
    $("writing").style = "none";
    $("term").innerText = roundTerms[termIndex][termOrDef];
    $("text").value = "";
    $("correctTextContainer").style.display = "none";
    $("correctText").innerText = roundTerms[termIndex][inv(termOrDef)];
    $("writingButtons").style = "";
    $("progress").style.width = `${(termIndex + 1) / roundTerms.length * 100}%`;
    activate();
    $("text").focus();
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
    let elem = $("text");
    let parent = elem.parentElement;
    parent.style.backgroundColor = colors.backgroundCorrectColor;
    parent.style.borderColor = colors.correctColor;
    elem.style.color = colors.textCorrectColor;
}

function markIncorrectWritten() {
    deactivate();
    let elem = $("text");
    if (elem.value == "") elem.value = "didn't know";
    let parent = elem.parentElement;
    parent.style.backgroundColor = colors.backgroundIncorrectColor;
    parent.style.borderColor = colors.incorrectColor;
    elem.style.color = colors.textIncorrectColor;
}

function promptNext(callBack) {
    $("popup").addEventListener("click", callBack);

    console.log($("popupCon").style.display);
    if($("popupCon").style.display == "flex") return;
    $("popupCon").style.display = "flex";

    $("popupCon").animate(
        animations.popupIn.keyframes,
        animations.popupIn.timing
    );
}

const nextQuestionHandler = () => { 
    $("popupCon").style.display = "none"; 
    selectivePopulate();
};

const nextRoundTransitionHandler = () => {
    $("popupCon").style.display = "none"; 
    $("learn-card").style = "";
    $("interRoundContainer").style = "";
    isInterRound = false;
    generateRoundTerms();
    selectivePopulate();
};

async function nextRound() {
    if(termIndex !== roundTerms.length) return false;
    isInterRound = true;
    await lastStudyPromise;
    termIndex = 0;

    
    //remove existing cards and enable desired
    $("learn-card").style.display = "none";
    $("interRoundContainer").style.display = "block";


    createHTMLTermList();
    console.log($("popupCon").style.display === "flex");
    promptNext(nextRoundTransitionHandler);
    return true;
}

//answer handler for button mode.
//pram is the index of the correct button
function answerButton(value) {
    if (!active) return;
    deactivate();
    $(`answer${value}`).blur();
    if (value == correct + 1) {
        //correct
        markCorrect($(`answer${value}`));

        setTimeout(() => {
            populateValuesButtons();
        }, 1000);

        roundTerms[termIndex] = studyOrMasterTerm(roundTerms[termIndex]);
        
    } else {
        //incorrect
        markCorrect($(`answer${correct + 1}`));
        markIncorrect($(`answer${value}`));
        promptNext(nextQuestionHandler);
    }
    termIndex++;
}

function answerWritten() {
    if (!active) return;
    let value = $("text").value;
    if (value == roundTerms[termIndex][inv(termOrDef)]) {
        markCorrectWritten();

        setTimeout(() => {
            populateValuesWritten();
        }, 1000);

        roundTerms[termIndex] = studyOrMasterTerm(roundTerms[termIndex]);

    } else {
        markIncorrectWritten();
        $("writingButtons").style.display = "none";
        promptNext(nextQuestionHandler);
        $("writingButtons").style.display = "none";
        $("correctTextContainer").style.display = "block";
    }
    termIndex++;
}

function studyOrMasterTerm(term) {
    switch (term[2]) {
        case "notStudied":
            lastStudyPromise = study(term);
            return [term[0], term[1], "studying"];
        case "studying":
            lastStudyPromise = master(term);
            return[term[0], term[1], "mastered"];
    }

}

function generateRoundTerms() {
    roundTerms = [];
    termIndex = 0;
    for (let i = 0; i < CARDS_PER_ROUND - Math.min(MAX_STUDYING_PER_ROUND, termList.studying.length); i++) {
        if (termList.notStudied[i] == undefined) break;
        roundTerms.push(termList.notStudied[i]);
    }
    for (let i = 0; i < CARDS_PER_ROUND - roundTerms.length; i++) {
        if (termList.studying[i] == undefined) break;
        roundTerms.push(termList.studying[i]);
    }
}

//gets indexes for buttons
function drawRandoms(maxIndex, correct) {
    let outPutsIs = [];
    var outPuts = [];
    let counter = 0;
    while (counter < termListNoSection.length) {
        counter++;
        let temp = Math.floor(maxIndex * Math.random());
        if (!outPutsIs.includes(temp) && termListNoSection[temp][inv(termOrDef)] != correct[inv(termOrDef)]) 
        { outPutsIs.push(temp); }
        if (outPutsIs.length == 4) break;
    }
    let correctIndex = Math.floor(4 * Math.random());
    for (let i in outPutsIs) {
        outPuts[i] = termListNoSection[outPutsIs[i]];
    }
    outPuts[correctIndex] = correct;
    return {values: outPuts, correctIndex: correctIndex};
}

//helpers
function genTermArr(kSet) {
    for (let part in kSet.cards) {
        termList[part].pop(); //removes intellisense declarations.
        for (let item in kSet.cards[part]) {
            termList[part].push([item, kSet.cards[part][item], part]);
            termListNoSection.push([item, kSet.cards[part][item], part]);
        }
    }
}

function createHTMLTermList() {
    let termContainer = $("termList");

    termContainer.innerHTML = "";

    for (let term of roundTerms) {
        let row = createElem("div", termContainer, "", { "class": "term" });
        createElem("p", createElem("div", createElem("div", row)), term[0]);
        createElem("p", createElem("div", createElem("div", row)), term[1]);
        let studyPhase = createElem("p", createElem("div", createElem("div", row)), "", {"class": term[2]});
        switch(term[2]) {
            case "notStudied":
                studyPhase.innerText = "Not studied";
                break;
            case "studying":
                studyPhase.innerText = "Studying";
                break;
            case "mastered":
                studyPhase.innerText = "Mastered";
                break;

        }
    }
}

function getSet(userdata, setName) {
    for (let i of userdata.sets) {
        if (i.metadata.name == setName) return i;
    }
    throw new Error("not a set");
}

function findArr(target, source) {
    if (!Array.isArray(source)) throw new Error("source is not an array");
    for (let index in source) {
        if ( JSON.stringify(source[index]) == JSON.stringify(target)) return index;
    }
}

function objLen(obj) {
    return Object.keys(obj).length;
}

function createElem(type, parent, Text, attributes) {
    Text = Text || "";
    let elem = document.createElement(type);
    elem.innerText = Text;
    for (let i in attributes) {
        elem.setAttribute(i, attributes[i]);
    }
    parent.appendChild(elem);
    return elem;
}

function selectivePopulate() {
    answerMode == 0 ? populateValuesButtons() : populateValuesWritten();
}

function link(href) {
    window.location.assign(href);
}

function inv(num) {
    return Math.abs(num - 1);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

//dumb homebrew jquery
function $(id) {
    return document.getElementById(id);
}

function $class(className) {
    return document.getElementsByClassName(className);
}

//event handlers
$("back").addEventListener("click", () => { link(`./sets.html?set=${setName}`); });
$("popup").addEventListener("click", () => { $("popupCon").style.display = "none"; answerMode == 0 ? populateValuesButtons() : populateValuesWritten(); });
$("activateOptions").addEventListener("click", () => { $("options").style.display = "flex"; });
$("exit").addEventListener("click", () => { $("options").style.display = "none"; });
$("submit").addEventListener("click", answerWritten);
$("dontKnow").addEventListener("click", () => { $("text").value = ""; answerWritten(); });
$("modeSelect").addEventListener("change", function() {this.value == "Multiple Choice" ? answerMode = 0 : answerMode = 1; selectivePopulate();});

for (let i = 1; i <= 4; i++) {
    $(`answer${i}`).addEventListener("click", function () {if (active) { answerButton(this.id[this.id.length - 1]); }}, true);
}

document.addEventListener("keydown", (e) => {
    if (e.key != "Enter") return;
    // if (e.target.className == "button") e.preventDefault();
    if (active && answerMode == 1) { answerWritten(); return; }
    if (!active) { $("popup").dispatchEvent( new MouseEvent("click")); }
}, true);

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

    //set the funcs
    study = async (term) => { 
        let tempTerm = termList.notStudied.splice(findArr(term, termList.notStudied), 1)[0];
        tempTerm.pop();
        tempTerm.push("studying");
        termList.studying.push(tempTerm); 
        window.dataLoader.study(setName, term);
    };

    master = async (term) => { 
        let tempTerm = termList.studying.splice(findArr(term, termList.studying), 1)[0];
        tempTerm.pop();
        tempTerm.push("mastered");
        termList.mastered.push(tempTerm); 
        window.dataLoader.master(setName, term);
    };

    // initialize
    genTermArr(set); //creates termList.
    generateRoundTerms();
    selectivePopulate();
    createHTMLTermList();
});