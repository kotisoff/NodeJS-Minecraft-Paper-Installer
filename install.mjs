import fs from "node:fs";
import https from "node:https";
import readline from "node:readline";
import path from "node:path";

console.clear();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/** @returns { Promise<string> } */
const prompt = (str) =>
  new Promise((resolve) => {
    rl.question(str, resolve);
  });

/** @returns { Promise<string> } */
const get_paper_versions_url = async () =>
  await new Promise(async (resolve) => {
    const githubusercontent = "https://gist.githubusercontent.com";
    const regex =
      /\/[A-Za-z]+\/[A-Za-z0-9]+\/raw\/[A-Za-z0-9]+\/paper-versions\.json/i;

    https.get(
      "https://gist.github.com/osipxd/6119732e30059241c2192c4a8d2218d9",
      (res) => {
        const data = [];

        res.on("data", (buf) => {
          data.push(buf.toString());
        });

        res.on("error", (e) => {
          console.log(color.red("Error:\n" + e));
          console.log(color.red("Process exit."));
          process.exit(-1);
        });

        res.on("close", () => {
          const page = data.join("");
          resolve(githubusercontent + regex.exec(page)[0]);
        });
      }
    );
  });

/** @returns { Promise<{latest:string, versions:[string]} | undefined> } */
const get_json = async (link = "") =>
  await new Promise(async (resolve) => {
    https.get(link, (res) => {
      const data = [];

      res.on("data", (buf) => {
        data.push(buf.toString());
      });

      res.on("error", (e) => {
        console.log(color.red("Error:\n" + e));
        console.log(color.red("Process exit."));
        process.exit(-1);
      });

      res.on("close", () => {
        const page = data.join("");
        try {
          resolve(JSON.parse(page));
        } catch (e) {
          console.log(color.red("Page is not an JSON!"), e);
          resolve();
        }
      });
    });
  });

const download = async (dest, url) => {
  await new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      let stream = res.pipe(file);
      stream.on("drain", () => {
        console.log(
          "Downloaded: " + Math.floor(stream.bytesWritten / 1024) + "KB..."
        );
        process.stdout.moveCursor(0, -1);
      });
      stream.on("finish", () => {
        process.stdout.clearLine();
        console.log(
          "Total file size: " + Math.floor(stream.bytesWritten / 1024) + "KB"
        );
        file.close(resolve);
      });
    });
  });
};

let color = {
  byNum: (mess, fgNum, bgNum) => {
    mess = mess || "";
    fgNum = fgNum === undefined ? 31 : fgNum;
    bgNum = bgNum === undefined ? 49 : bgNum;
    return (
      "\u001b[" +
      fgNum +
      "m" +
      "\u001b[" +
      bgNum +
      "m" +
      mess +
      "\u001b[39m\u001b[49m"
    );
  },
  black: (mess, fgNum) => color.byNum(mess, 30, fgNum),
  red: (mess, fgNum) => color.byNum(mess, 31, fgNum),
  green: (mess, fgNum) => color.byNum(mess, 32, fgNum),
  yellow: (mess, fgNum) => color.byNum(mess, 33, fgNum),
  blue: (mess, fgNum) => color.byNum(mess, 34, fgNum),
  magenta: (mess, fgNum) => color.byNum(mess, 35, fgNum),
  cyan: (mess, fgNum) => color.byNum(mess, 36, fgNum),
  white: (mess, fgNum) => color.byNum(mess, 37, fgNum),
};

const updateData = async () => {
  process.stdout.write("Getting: url");
  const url = await get_paper_versions_url();
  process.stdout.moveCursor(-3);
  process.stdout.write("json");
  const paper = await get_json(url);
  if (!paper) {
    console.log(color.red("\nPaper list is unavalible.\nProcess exit."));
    process.exit();
  }
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  console.log(color.green("Getting: done.\n"));
  return { url, paper };
};

let tmpdata = { url: "", paper: { latest: "", versions: [""] }, done: false };

const text = [
  color.green("Paper installer for Termux | v0.2"),
  color.cyan('Type "exit" or "e" to leave process'),
];
text.forEach((i) => console.log(i));

const checkPrompt = async () => {
  const { url, paper } = !tmpdata.done ? await updateData() : tmpdata;
  tmpdata.url = url;
  tmpdata.paper = paper;
  tmpdata.done = true;
  const versions = Object.keys(paper.versions);

  console.log(color.yellow("Latest paper:"), paper.latest);
  console.log(color.green("Versions avalible:"), versions.join(", "));

  let ver = (await prompt(color.yellow("Enter version to install: "))) ?? "";

  if (ver == "exit" || ver == "e" || ver == null) return rl.close();
  if (ver == "latest") ver = paper.latest;
  if (!versions.includes(ver)) {
    console.clear();
    text.forEach((i) => console.log(i));
    console.log(color.cyan("Write down any version, please!\n"));
    return checkPrompt();
  }

  console.log(color.magenta("Downloading Paper " + ver + "..."));

  const mcserver = "./mcserver_" + ver;

  // Create folder and download server file

  try {
    fs.mkdirSync(mcserver);
  } catch {
    rl.close();
    return console.log("Files already exist.");
  }
  await download(path.join(mcserver, "server.jar"), paper.versions[ver]);

  // Create run files

  fs.writeFileSync(
    path.join(mcserver, "start.sh"),
    "java -Xmx1024M -Xms1024M -jar server.jar -nogui\npause",
    (e) => {}
  );
  fs.writeFileSync(
    path.join(mcserver, "start.bat"),
    "@echo off\njava -Xmx1024M -Xms1024M -jar server.jar -nogui\npause",
    (e) => {}
  );

  // eula

  const eula = `#${new Date()}\neula=true`;
  const eulaAgreed =
    (
      await prompt(
        color.yellow(
          "Do you agree with mojang eula? (https://aka.ms/MinecraftEULA) (y/n): "
        )
      )
    ).toLowerCase() == "y";
  if (eulaAgreed) {
    fs.writeFileSync(path.join(mcserver, "eula.txt"), eula);
    console.log(color.green("Eula agreed!"));
  } else
    console.log(
      color.red("Eula disagreed! Agree after server installation next time!")
    );

  //done

  console.log(color.green("Paper downloaded successfully!"));
  console.log(color.green("Have a great time in the game! :)"));
  rl.close();
};
checkPrompt();

// Thanks to:
//   • @dustinpfister for ansi colors function
//   • @osipxd for "paper-versions.json"
