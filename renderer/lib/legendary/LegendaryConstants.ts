import { homedir, platform } from "os";
import path from "path";
import { app } from "electron";


const isWindows = platform() === "win32";
const getLegendaryBin = () => {
    const fixAsar = (str: string) => {
        if(!str.includes("app.asar.unpacked")) {
            str.replace("app.asar", "app.asar.unpacked");
        }

        return str;
    };

    const bin = fixAsar(path.join(
        process.cwd(),
        '/resources/bin/',
        process.platform,
        isWindows ? '/legendary.exe' : '/legendary'
    ));
    
    console.log(bin);

    if (bin.includes(' ')) {
        return `"${bin}"`
    }

    return bin;
}

const LegendaryConstants = {
    configFilePath: `${homedir()}/.config/legendary`,
    bin: getLegendaryBin(),
};

export default LegendaryConstants;