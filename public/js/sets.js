const userdataPromise = window.dataLoader.getUserData();
const setName = window.location.search.split("?set=")[1];
var set, index;

document.getElementById("sortOptions").addEventListener("change", function () {
    console.log(this.value);
    //TODO implement alternate sorting methods
})

function objLen(obj) {
    return Object.keys(obj).length;
}

function createElem(type, parent, Text, attributes) {
    Text = Text || "";
    let elem = document.createElement(type)
    elem.innerText = Text;
    for (let i in attributes) {
        elem.setAttribute(i, attributes[i]);
    }
    parent.appendChild(elem);
    return elem;
}

function getSet(userdata, setName) {
    for (let i of userdata.sets) {
        if (i.metadata.name == setName) return i;
    }
    throw "not a set";
}

function generateTermList(terms, definitions) {
    for (let i = 0; i < terms.length; i++) {
        let row = createElem("div", document.getElementById("termList"), "", { "class": "term" });
        createElem("p", createElem("div", createElem("div", row)), terms[i]);
        createElem("p", createElem("div", createElem("div", row)), definitions[i])
    }
}

userdataPromise.then((userdata) => {
    try {
        set = getSet(userdata, setName);
    } catch (error) {
        document.body.innerHTML = "no set found";
        console.error("not a valid set");
        return;
    }
    index = userdata.sets.findIndex((e) => { return e === set })
    let termList = document.getElementById("termList")
    if (objLen(set.cards.notStudied) > 0) {
        createElem("h4", createElem("div", termList, "", { "class": "subheader" }), `Not Studied (${objLen(set.cards.notStudied)})`);
        generateTermList(Object.keys(set.cards.notStudied), Object.values(set.cards.notStudied));
    }
    if (objLen(set.cards.Studying) > 0) {
        createElem("h4", createElem("div", termList, "", { "class": "subheader" }), `Studying (${objLen(set.cards.Studying)})`);
        generateTermList(Object.keys(set.cards.Studying), Object.values(set.cards.Studying));
    }
    if (objLen(set.cards.Mastered) > 0) {
        createElem("h4", createElem("div", termList, "", { "class": "subheader" }), `Mastered (${objLen(set.cards.Mastered)})`);
        generateTermList(Object.keys(set.cards.Mastered), Object.values(set.cards.Mastered));
    }
});

document.getElementById("setTitle").innerText = setName;
window.dataLoader.setLastOpened(setName);