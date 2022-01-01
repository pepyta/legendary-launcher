import { homedir, platform } from "os";
import path from "path";
import { isPackaged } from 'electron-is-packaged';

const isProd = process.env.NODE_ENV === "production";
const isWindows = platform() === "win32";
const getLegendaryBin = () => {
    const fixAsar = (str: string) => {
        if(!str.includes("app.asar.unpacked")) {
            return str.replace("app.asar", "app.asar.unpacked");
        }

        return str;
    };

    const binariesPath =
        isProd && isPackaged // the path to a bundled electron app.
            ? path.join(process.resourcesPath, '/app.asar.unpacked', '/bin', platform())
            : path.join(process.cwd(), '/resources', '/bin', platform());

    return fixAsar(path.resolve(
        path.join(binariesPath, isWindows ? "/legendary.exe" : "/legendary")
    ));
}

const LegendaryConstants = {
    configFilePath: `${homedir()}/.config/legendary`,
    bin: getLegendaryBin(),
};

export default LegendaryConstants;