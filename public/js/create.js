const termList = [];

const animations = {
    fadeOutError: {
        keyframes: [
            {
                opacity: 1
            },
            {
                opacity: 0
            }
        ],
        timing: {
            duration: 3000,
            iterations: 1,
            easing: "cubic-bezier(0.38, 0.92, 0.7, 1)"
        }
    }
};

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

function generateRow(term, definition) {
    let row = createElem("div", $("termList"), "", { "class": "term" });
    createElem("p", createElem("div", createElem("div", row)), term);
    createElem("p", createElem("div", createElem("div", row)), definition);
}

function termError(msg) {
    $("error").innerText = msg;
}

function hideError() {
    $("error").animate(animations.fadeOutError.keyframes, animations.fadeOutError.timing)
        .onfinish = () => {$("error").innerText ="";};
}

function $(id) {
    return document.getElementById(id);
}

$("addTerm").addEventListener("click", function() {
    let termEle = $("tempTerm");
    let defEle = $("tempDef");
    let term = termEle.value;
    let def = defEle.value;
    if (def === "" || term === "") {
        termError("You must have a value for term and definition");
        setTimeout(hideError, 250);
        return;
    }
    termList.append([term, def]);
    generateRow(term, def);
    termEle.value = "";
    defEle.value = "";
});

generateRow("testTerm", "test Definition");