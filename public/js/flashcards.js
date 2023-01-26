const userdataPromise = window.dataLoader.getUserData();
const setName = window.location.search.split("?set=")[1];
var termIndex = 0;
var set, termList = [];

const rightArrow = (e, duration) => {
    termIndex++;
    renderTerm();
    $("card").animate(
        [
            {
                transform: "translateX(200px)",
                opacity: 0
            },
            {
                transform: "translateX(0)",
                opacity: 1
            }
        ],
        {
            duration: duration,
            iterations: 1,
            easing: "ease-out"
        }
    );
};

const leftArrow = (e, duration) => {
    termIndex--;
    renderTerm();
    $("card").animate(
        [
            {
                transform: "translateX(-200px)",
                opacity: 0
            },
            {
                transform: "translateX(0)",
                opacity: 1
            }
        ],
        {
            duration: duration,
            iterations: 1,
            easing: "ease-out"
        }
    );
};

const flipCard = (e) => {
    let badTargets = ["leftArrow", "rightArrow", "gg-arrow-long-right", "gg-arrow-long-left"];
    if (!badTargets.includes(e.target.className)) {
        $("card").className == "flip-card animations"
            ? ($("card").className = "flip-card animations flipped")
            : ($("card").className = "flip-card animations");
    }
};


document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowLeft":
            leftArrow(e, 100);
            break;
        case "ArrowRight":
            rightArrow(e, 100);
            break;
        case " ":
            flipCard(e);
            break;
        default:
            break;
    }
});

$("card").addEventListener("click", function (e) { flipCard(e); });
Array.from($class("rightArrow")).forEach((e) => e.addEventListener("click", () => { rightArrow(e, 300); }));
Array.from($class("leftArrow")).forEach((e) => e.addEventListener("click", () => { leftArrow(e, 300); }));
$("back").addEventListener("click", () => { link(`./sets.html?set=${setName}`); });

function $(id) {
    return document.getElementById(id);
}

function $class(className) {
    return document.getElementsByClassName(className);
}

function getSet(userdata, setName) {
    for (let i of userdata.sets) {
        if (i.metadata.name == setName) return i;
    }
    throw "not a set";
}

function genTermArr(kSet) {
    let temp = [];
    for (let part in kSet.cards) {
        for (let item in kSet.cards[part]) {
            temp.push([item, kSet.cards[part][item]]);
        }
    }
    return temp;
}

function renderTerm() {
    termIndex = termIndex >= 0 ? (termIndex >= termList.length ? 0 : termIndex) : termList.length - 1;
    $("term").innerText = termList[termIndex][0];
    $("definition").innerText = termList[termIndex][1];
}

function link(href) {
    window.location.assign(href);
}

userdataPromise.then((userdata) => {
    try {
        set = getSet(userdata, setName);
    } catch (error) {
        document.body.innerHTML = "no set found";
        console.error(error);
        return;
    }
    termList = genTermArr(set);
    renderTerm();
});