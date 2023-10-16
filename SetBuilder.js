/* eslint-disable no-undef */
let text = process.argv[2];
let lineSplit = process.argv[3];
let termSplit = process.argv[4];
let name = process.argv[5];
let termsArr = text.split(lineSplit);

console.log("{");
console.log("\t\"cards\": {");
console.log("\t\t\"notStudied\": {");

let out = "";
for (let i in termsArr) {
    let term = termsArr[i].split(termSplit);
    out = `"${term[0]}": "${term[1]}"`;
    if (i !== String(termsArr.length-1)) out += ",";
    console.log("\t\t\t" + out);
}

console.log("\t\t},");
console.log("\t\t\"studying\": {},");
console.log("\t\t\"mastered\": {}");
console.log("\t},");

console.log("\t\"metadata\": {");
console.log(`\t\t"name": "${name},"`);
console.log("\t\t\"answerMode\": \"multipleChoice\"");
console.log("\t}");
console.log("}");