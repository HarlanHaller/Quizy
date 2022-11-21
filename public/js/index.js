const userdata = window.dataLoader.getUserData();
const lastOpened = document.getElementById("suggested");

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

function link(elem) {
    window.location.assign("./sets.html?set=" + elem.innerText);
}

console.log(userdata.metadata['last-opened'])
createElem("div", lastOpened, userdata.metadata["last-opened"]).addEventListener("click", e => { link(e.srcElement) });