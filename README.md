# NodeJS-Minecraft-Paper-Installer

##Windows and Linux

Installation
- Install NodeJS and Java.
- Download repo files.
- Run `node install` in project folder.
Using
- Run start.bat or start.sh file in mcserver folder (It's in folder before project folder. Maybe Downloads?)

##Termux

To install: `cd ~; yes | apt update && yes | apt upgrade; yes | apt install nodejs-lts openjdk-17 wget git; git clone https://github.com/kotisoff/Paper-Installer-for-Termux.git; cd Paper-Installer-for-Termux; npm install; node install.js;cd ..;rm -r Paper-Installer-for-Termux -f`

To run: `bash ~/mcserver/start.sh`
