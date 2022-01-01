import { ipcRenderer } from "electron";

export default class ProgressBar {
    public static setValue(value: number) {
        ipcRenderer.send("set-progress-bar", value);
    }
}