const args = process.argv.slice(2)
const util = require('node:util');
function exec(command,flag){
	if(!flag) flag='none'
	try{
		const res = require('node:child_process').execSync(command).toString();
		if(flag!='hide') console.log(res)
	}catch(err){
		if(flag=='hide') return
		err.status;
		err.message;
		err.stdout;
		err.stderr;
	}
}

try{require('./paper-versions.json')}
catch{
	exec('wget https://gist.githubusercontent.com/osipxd/6119732e30059241c2192c4a8d2218d9/raw/0c2093fedfc89b855cbc1d560ec6f0d9b6e5b971/paper-versions.json','hide')
}
const paper = require('./paper-versions.json');
const prompt = require('prompt-sync')();
const colors = require('colors');

console.log('Paper installer for Termux | v0.1'.bgWhite.green);
console.log('Latest paper for now:'.yellow,paper.latest);
console.log('Leave prompt blank to install latest.'.gray)
console.log('Type "exit" or "e" to leave process'.gray)
function checkPrompt(){
	let ver = prompt('Enter version to install: ',paper.latest);
	if(ver=='exit'||ver=='e'||ver==null) return
	let text = [], check = false
	for(let v in paper.versions){
		if(ver==v) check = true
		text.push(v);
	};
	if(!check){
		text=text.join(', ');
		console.log('Versions avalible: '.green,text.gray);
		checkPrompt()
	}
	else{
		console.log(('Downloading Paper '+ver+'...').gray)
		let flag = args[0] ?? 'hide'
		exec('mkdir ~/mcserver',flag)
		exec('wget -O server.js '+paper.versions[ver],flag)
		exec('mv server.js ~/mcserver/',flag)
		exec('echo java -jar server.js >> ~/mcserver/start.sh',flag)
//		exec('cp ~/mcserver/start.sh ~/mcserver/start.bat',flag)
		console.log('Paper downloaded successfully!'.green)
	}
}
checkPrompt()
