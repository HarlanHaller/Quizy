const userdataPromise = window.dataLoader.getUserData();
const setName = window.location.search.split("?set=")[1];
var set, index;
var termList = [];

function $(id) {
    return document.getElementById(id)
}

$("sortOptions").addEventListener("change", function () {
    console.log(this.value);
    //TODO implement alternate sorting methods
})

$("Flashcards").addEventListener("click", () => link(`./flashcards.html?set=${setName}`));
$("Learn").addEventListener("click", () => link(`./learn.html?set=${setName}`));

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
        termList.push([terms[i], definitions[i]])
        let row = createElem("div", $("termList"), "", { "class": "term" });
        createElem("p", createElem("div", createElem("div", row)), terms[i]);
        createElem("p", createElem("div", createElem("div", row)), definitions[i])
    }
}

function link(url) {
    window.location.assign(url);
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
    let termContainer = $("termList")
    if (objLen(set.cards.notStudied) > 0) {
        createElem("h4", createElem("div", termContainer, "", { "class": "subheader" }), `Not Studied (${objLen(set.cards.notStudied)})`);
        generateTermList(Object.keys(set.cards.notStudied), Object.values(set.cards.notStudied));
    }
    if (objLen(set.cards.studying) > 0) {
        createElem("h4", createElem("div", termContainer, "", { "class": "subheader" }), `Studying (${objLen(set.cards.studying)})`);
        generateTermList(Object.keys(set.cards.studying), Object.values(set.cards.studying));
    }
    if (objLen(set.cards.mastered) > 0) {
        createElem("h4", createElem("div", termContainer, "", { "class": "subheader" }), `Mastered (${objLen(set.cards.mastered)})`);
        generateTermList(Object.keys(set.cards.mastered), Object.values(set.cards.mastered));
    }
    $('termCount').innerHTML += ` ${termList.length}`
});

document.getElementById("setTitle").innerText = setName;
window.dataLoader.setLastOpened(setName);