const userdataPromise = window.dataLoader.getUserData();
const setName = window.location.search.split("?set=")[1];
var set, index;

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
    // let header = createElem("div", document.getElementById("termList"), "", { "class": "term termHeader" });
    // createElem("p", header, "Terms:");
    for (let i = 0; i < terms.length; i++) {
        let row = createElem("div", document.getElementById("termList"), "", { "class": "term" });
        createElem("p", row, terms[i]);
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
    generateTermList(Object.keys(set.cards), Object.values(set.cards));
});

document.getElementById("setTitle").innerText = setName;
window.dataLoader.setLastOpened(setName);