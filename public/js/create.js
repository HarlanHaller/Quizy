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

function $(id) {
    return document.getElementById(id);
}

generateRow("testTerm", "test Definition");