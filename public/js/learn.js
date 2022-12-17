const userdataPromise = window.dataLoader.getUserData();
const setName = window.location.search.split('?set=')[1];
var set, index, correct = 1, termIndex = 0, termList = [], active = true;

const colors = {
    correctColor: "rgb(13, 216, 13)",
    textCorrectColor: "rgb(9, 164, 9)",
    incorrectColor: "red",
    textIncorrectColor: "rgb(186, 0, 0)",
    defaultColor: ""
}

function deactivate() {
    active = false;
    Array.from($class("button")).forEach(e => e.style.color = "var(--lightgray)")
}

function activate() {
    active = true;
    Array.from($class("button")).forEach(e => e.style.color = "")
}

function populateValues() {
    $('term').innerText = termList[termIndex][0];
    let indexes = drawRandoms(termList.length - 1, termIndex);
    // let indexes = [1, 2, 3, 4]
    for (i in indexes) {
        $(`answer${Number(i) + 1}`).innerText = termList[indexes[i]][1];
        $(`answer${Number(i) + 1}`).style.borderColor = colors.defaultColor;
    }
    activate();
}

function markCorrect(button) {
    button.style.borderColor = colors.correctColor;
    button.style.color = colors.textCorrectColor;
}

function markIncorrect(button) {
    button.style.borderColor = colors.incorrectColor;
    button.style.color = colors.textIncorrectColor;
}

function answerButton(value) {
    if (!active) return;
    termIndex++;
    //correct
    deactivate();
    if (value == correct + 1) {
        markCorrect($(`answer${value}`));
        setTimeout(() => {
            populateValues();
        }, 1000)
    } else {
        console.log("wrong")
        markCorrect($(`answer${correct + 1}`));
        markIncorrect($(`answer${value}`));
        $('popupCon').style.display = "flex"
        $('popupCon').animate(
            [
                {
                    transform: 'translateY(400px)',
                    opacity: 0
                },
                {
                    transform: 'translateY(0)',
                    opacity: 1
                }
            ],
            {
                duration: 500,
                iterations: 1,
                easing: 'ease-out'
            }
        )
    }
}

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

function $(id) {
    return document.getElementById(id)
}

function $class(className) {
    return document.getElementsByClassName(className);
}

$('back').addEventListener('click', () => { link(`./sets.html?set=${setName}`) });
$('popup').addEventListener('click', () => { $('popupCon').style.display = "none"; populateValues(); })

for (let i = 1; i <= 4; i++) {
    $(`answer${i}`).addEventListener('click', function () { answerButton(this.id[this.id.length - 1]) })
}

userdataPromise.then((userdata) => {
    try {
        set = getSet(userdata, setName);
    } catch (error) {
        document.body.innerHTML = 'no set found';
        console.error(error);
        return;
    }
    index = userdata.sets.findIndex((e) => {
        return e === set;
    });
    termList = genTermArr(set);
    populateValues();
});
