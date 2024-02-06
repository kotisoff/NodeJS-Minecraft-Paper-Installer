# NodeJS-Minecraft-Paper-Installer

## Windows and Linux

Installation
- Install [NodeJS](https://nodejs.org/en) and [Java](https://adoptium.net/).
- Download [repo files](https://github.com/kotisoff/NodeJS-Minecraft-Paper-Installer/releases).
- Run `node install` in project folder.

Usage
- Run start.bat or start.sh file in mcserver folder (It's in folder before project folder. Maybe Downloads?)

## Termux

Installation
- Run `cd ~ && yes | apt update && yes | apt upgrade; yes | apt install nodejs-lts openjdk-17 wget git && git clone https://github.com/kotisoff/NodeJS-Minecraft-Paper-Installer.git mcpaperinstaller && mv ~/mcpaperinstaller/install.mjs ~/ && node install && rm -r mcpaperinstaller -f`
- Choose your version

Usage
- Run `bash ~/mcserver/start.sh` or start.sh in ~/mcserver directory
- (You can add `alias mcserver="bash ~/mcserver_YOURVERSION/start.sh"` in your .bashrc to run server by just typing `mcserver`.

## !!! Directory of minecraft server will be in script folder.
