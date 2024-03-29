const userdataPromise = window.dataLoader.getUserData();
const lastOpened = document.getElementById("suggested");

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

function link(elem) {
    window.location.assign("./sets.html?set=" + elem.innerText);
}

userdataPromise.then((userdata) => {
    if (userdata.metadata["last-opened"] !== null) {
        createElem("button", lastOpened, userdata.metadata["last-opened"], {"class": "lastOpened"})
            .addEventListener("click", e => {
                link(e.target);
            });
    } else {
        lastOpened.style = "display:none";
    }
});