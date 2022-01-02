import { https } from "follow-redirects";
import fs from "fs";
import { app } from "electron";
import path from "path";
import { platform } from "os";
import unzip from "unzipper";
import { exec, execSync } from "child_process";

const links: {
    [key: string]: {
        url: string;
        unzip: boolean;
        dest: {
            download: string;
            extracted: string;
        };
    }
} = {
    win32: {
        url: "https://github.com/derrod/legendary/releases/download/0.20.22/legendary.exe",
        unzip: false,
        dest: {
            download: "legendary.exe",
            extracted: "legendary.exe",
        },
    },
    linux: {
        url: "https://github.com/derrod/legendary/releases/download/0.20.22/legendary",
        unzip: false,
        dest: {
            download: "legendary",
            extracted: "legendary",
        },
    },
    darwin: {
        url: "https://github.com/derrod/legendary/releases/download/0.20.22/legendary_macOS.zip",
        unzip: true,
        dest: {
            download: "legendary.zip",
            extracted: "legendary",
        },
    },
};

export class LegendaryInstaller {
    private link = links[platform()];

    private static log(str: string) {
        console.log(`[Legendary Installer] ${str}`);
    }

    public addToPath() {
        LegendaryInstaller.log("Setting path variable...");
        if(platform() === "win32") {
            execSync(`$env:Path += ";${app.getPath("userData")}"`, {
                shell: "powershell.exe"
            });
        } else {
            execSync(`PATH=$PATH:${app.getPath("userData")}"`, {
                shell: "/bin/bash"
            });
        }
    }

    private fixPermission() {
        if(platform() === "win32") return;
        LegendaryInstaller.log(`Fixing permission for "${this.getBinaryPath()}"`);
        execSync(`chmod +x ${this.getBinaryPath()}`);
    }

    private async download() {
        const path = this.getDownloadPath();
        const file = fs.createWriteStream(path);
        LegendaryInstaller.log(`Download starting... (path: ${path})`);

        return new Promise((resolve, reject) => {
            const request = https.get(this.link.url, response => {
                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to get '${this.link.url}' (${response.statusCode})`));
                    return;
                }

                response.pipe(file);
            });

            // The destination stream is ended by the time it's called
            file.on('finish', () => {
                LegendaryInstaller.log(`Download finished! (path: ${path})`);
                this.fixPermission();
                resolve(null);
            });

            request.on('error', err => {
                fs.unlink(path, () => reject(err));
            });

            file.on('error', err => {
                fs.unlink(path, () => reject(err));
            });

            request.end();
        });
    }

    private isInstalled() {
        return fs.existsSync(path.join(app.getPath("userData"), this.link.dest.extracted));
    }

    private getExtractPath() {
        return app.getPath("userData");
    }

    private getDownloadPath() {
        return path.join(app.getPath("userData"), this.link.dest.download);
    }

    public getBinaryPath() {
        const str = path.join(app.getPath("userData"), this.link.dest.extracted);
        if(platform() === "win32") {
            return `"${str}"`;
        }

        return str;
    }

    private async unzip() {
        LegendaryInstaller.log(`Unzipping starting...`);
        return new Promise((resolve, reject) => {
            fs.createReadStream(this.getDownloadPath())
                .pipe(unzip.Extract({
                    path: this.getExtractPath(),
                }))
                .on("close", () => {
                    LegendaryInstaller.log(`Unzipping finished!`);
                    this.fixPermission();
                    fs.unlinkSync(this.getDownloadPath());
                    resolve(null);
                })
                .on("error", (e) => reject(e));
        });
    }

    public async init() {
        if(!this.isInstalled()) {
            await this.install();
        }
        
        this.addToPath();
    }

    private async install() {
        await this.download();
        if (this.link.unzip) await this.unzip();
        return;
    }
}

const installer = new LegendaryInstaller();
export default installer;