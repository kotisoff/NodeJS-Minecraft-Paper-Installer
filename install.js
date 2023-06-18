// ======= Update URL from here: https://gist.github.com/osipxd/6119732e30059241c2192c4a8d2218d9 ======= //
const paper_versions_url = "https://gist.githubusercontent.com/osipxd/6119732e30059241c2192c4a8d2218d9/raw/8c0f84a55895d09b2b5aee259d3d207f1814eae1/paper-versions.json"
// ===================================================================================================== //

import fs from "node:fs"
import https from "node:https"
import readline from "node:readline"

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const prompt = (str) => new Promise(resolve => { rl.question(str, resolve) });

const download = async(dest,url) => {
    await new Promise(resolve => {
        const file = fs.createWriteStream(dest);
        https.get(url, res => {
            var stream = res.pipe(file);
            stream.on("drain",()=>{
                console.log("Downloaded: "+Math.floor(stream.bytesWritten/1024)+"KB...")
                process.stdout.moveCursor(0,-1)
            })
            stream.on("finish", () => {
                process.stdout.clearLine()
                console.log("Total file size: "+Math.floor(stream.bytesWritten/1024)+"KB")
                file.close(resolve);
            });
        });
    })
}

let color = {
    byNum: (mess, fgNum, bgNum) => {
        mess = mess || '';
        fgNum = fgNum === undefined ? 31 : fgNum;
        bgNum = bgNum === undefined ? 49 : bgNum;
        return '\u001b[' + fgNum + 'm' + '\u001b[' + bgNum + 'm' + mess + '\u001b[39m\u001b[49m';
    },
    black: (mess, fgNum) => color.byNum(mess, 30, fgNum),
    red: (mess, fgNum) => color.byNum(mess, 31, fgNum),
    green: (mess, fgNum) => color.byNum(mess, 32, fgNum),
    yellow: (mess, fgNum) => color.byNum(mess, 33, fgNum),
    blue: (mess, fgNum) => color.byNum(mess, 34, fgNum),
    magenta: (mess, fgNum) => color.byNum(mess, 35, fgNum),
    cyan: (mess, fgNum) => color.byNum(mess, 36, fgNum),
    white: (mess, fgNum) => color.byNum(mess, 37, fgNum)
};

if (!fs.existsSync('./paper-versions.json')) {
    console.log(color.cyan("Downloading \"paper-versions.json\"..."))
    await download("paper-versions.json",paper_versions_url)
}
const paper = await JSON.parse(fs.readFileSync("./paper-versions.json"))

console.log(color.green('Paper installer for Termux | v0.1'));
console.log(color.yellow('Latest paper for now:'), paper.latest);
console.log(color.cyan('Leave prompt blank to show versions.'));
console.log(color.cyan('Type "exit" or "e" to leave process'));
const checkPrompt = async () => {
    let ver = await prompt("Enter version to install: ") ?? "";
    if (ver == 'exit' || ver == 'e' || ver == null) return rl.close();
    let text = [], check = false
    for (let v in paper.versions) {
        if (ver == v) check = true
        text.push(v);
    };
    if (!check) {
        text = text.join(', ');
        console.log(color.green('Versions avalible: '), text);
        return checkPrompt();
    }
    else {
        console.log(color.magenta('Downloading Paper ' + ver + '...'));
        try {
            fs.mkdirSync('../mcserver');
        } catch {
            rl.close()
            return console.log("Files already exist.")
        }
        await download('../mcserver/server.jar',paper.versions[ver])
        fs.writeFileSync("../mcserver/start.sh", "java -var server.jar", e => { });
        fs.writeFileSync("../mcserver/start.bat", "@echo off\njava -var server.jar", e => { });
        console.log(color.green('Paper downloaded successfully!'));
        rl.close()
    }
}
checkPrompt();

// Thanks
//          @dustinpfister for ansi colors function
//          @osipxd for "paper-versions.json" file
