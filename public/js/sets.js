const userdataPromise = window.dataLoader.getUserData();
const setName = window.location.search.split("?set=")[1];
var set, index;
userdataPromise.then((userdata) => {
    set = createNameToSet(userdata)[setName];
    index = userdata.sets.findIndex((e) => { return e === set })
});

function createNameToSet(userdata) {
    let temp = {};
    for (let i of userdata.sets) {
        temp[i.metadata.name] = i;
    }
    return temp;
}

document.getElementById("setTitle").innerText = setName;
console.log(typeof (setName))
window.dataLoader.setLastOpened(setName);