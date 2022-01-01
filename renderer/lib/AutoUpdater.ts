import { ipcRenderer } from "electron";
import { ProgressInfo, UpdateInfo } from "electron-updater";
import { AutoUpdaterActions } from "renderer/redux/auto-updater";
import store from "renderer/redux/store";

class AutoUpdater {
    constructor() {
        if(process.env.NODE_ENV === "production") {
            this.checkForUpdatesAndNotify();
        } else {
            console.log(process.env.NODE_ENV);
            store.dispatch(
                AutoUpdaterActions.setState({
                    state: "development-mode",
                })
            );
        }

        this.onError(
            (error) => {
                store.dispatch(
                    AutoUpdaterActions.setState({
                        state: "error",
                        error,
                    })
                );
            }
        );

        this.onCheckingForUpdate(() => 
            store.dispatch(
                AutoUpdaterActions.setState({
                    state: "checking-for-update"
                })
            )
        );

        this.onDownloadProgress((progress, bytesPerSecond, percent, total, transferred) => {
            store.dispatch(
                AutoUpdaterActions.setState({
                    state: "download-progress",
                    progress,
                    bytesPerSecond,
                    total,
                    transferred,
                    percent,
                })
            );
        });

        this.onUpdateAvailable((info) => 
            store.dispatch(
                AutoUpdaterActions.setState({
                    state: "update-available",
                    info,
                })
            )
        );

        this.onUpdateNotAvailable((info) => 
            store.dispatch(
                AutoUpdaterActions.setState({
                    state: "update-not-available",
                    info,
                })
            )
        );
    }

    public checkForUpdatesAndNotify() {
        ipcRenderer.send("check-for-updates-and-notify");
    }

    public quitAndInstall() {
        ipcRenderer.send("quit-and-install");
    }

    public onError(listener: (error: Error) => void) {
        ipcRenderer.on("auto-updater", (e, cmd, args) => {
            if(cmd !== "error") return;
            listener(args[0]);
        });
    }

    public onCheckingForUpdate(listener: () => void) {
        ipcRenderer.on("auto-updater", (e, cmd, args) => {
            if(cmd !== "checking-for-update") return;
            listener();
        });
    }

    public onUpdateAvailable(listener: (info: UpdateInfo) => void) {
        ipcRenderer.on("auto-updater", (e, cmd, args) => {
            if(cmd !== "update-available") return;
            listener(args[0]);
        });
    }

    public onUpdateNotAvailable(listener: (info: UpdateInfo) => void) {
        ipcRenderer.on("auto-updater", (e, cmd, args) => {
            if(cmd !== "update-not-available") return;
            listener(args[0]);
        });
    }

    public onDownloadProgress(listener: (progress: ProgressInfo, bytesPerSecond: number, percent: number, total: number, transferred: number) => void) {
        ipcRenderer.on("auto-updater", (e, cmd, args: [ProgressInfo, number, number, number, number]) => {
            if(cmd !== "download-progress") return;
            listener(...args);
        });
    }
    public onUpdateDownloaded(listener: (info: UpdateInfo) => void) {
        ipcRenderer.on("auto-updater", (e, cmd, args) => {
            if(cmd !== "update-downloaded") return;
            listener(args[0]);
        });
    }
}

if(!global["auto-updater"] && global.window) {
    global["auto-updater"] = new AutoUpdater();
}
const autoUpdater: AutoUpdater = global["auto-updater"];
export default autoUpdater;