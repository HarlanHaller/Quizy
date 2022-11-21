const userdata = window.dataLoader.getUserData();
const sets = userdata.sets
const virtSetTable = [];

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

function generateVirtTable() {
    let tempRow = [];
    for (let i = 0; i < sets.length; i++) {
        if (tempRow.push(sets[i]) == 3) {
            virtSetTable.push(tempRow);
            tempRow = [];
        }
    };
    if (tempRow.length > 0) virtSetTable.push(tempRow);
}

function createSetGrid() {
    if (virtSetTable.length < 0) {
        createElem("p", document.getElementById("setGrid"), "You have no sets", { "class": "noSets" });
    }
    for (let row of virtSetTable) {
        let elem = createElem("tr", document.getElementById("setGrid"));
        for (let set of row) {
            createElem("td", elem, set.metadata.name).addEventListener("click", e => { link(e.srcElement) });
            // createElem("a", createElem("td", elem), set.metadata.name, { "href": `./sets?set=${set.metadata.name}` })
        }
    }
}

function link(elem) {
    window.location.assign("./sets.html?set=" + elem.innerText);
}

generateVirtTable();
createSetGrid();