# NodeJS-Minecraft-Paper-Installer

##Windows and Linux

Installation
- Install NodeJS and Java.
- Download repo files.
- Run `node install` in project folder.
Using
- Run start.bat or start.sh file in mcserver folder (It's in folder before project folder. Maybe Downloads?)

##Termux

Installation
- Run `cd ~; yes | apt update && yes | apt upgrade; yes | apt install nodejs-lts openjdk-17 wget git; git clone https://github.com/kotisoff/Paper-Installer-for-Termux.git; cd Paper-Installer-for-Termux; node install.js;cd ..;rm -r Paper-Installer-for-Termux -f`
- Choose your version

Usage
- Run `bash ~/mcserver/start.sh` or start.sh in ~/mcserver directory
(You can add `alias mcserver="bash ~/mcserver/start.sh"` in your .bashrc to run server by just typing `mcserver`.