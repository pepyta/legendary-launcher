import { IDownloadManagerElement, onDisk, onNetwork, onProgress, enqueue, pause, remove } from "renderer/redux/download-manager";
import store from "renderer/redux/store";
import LegendaryLibrary from "./LegendaryLibrary";

class DownloadManagerHandler {
    private shouldStartNext = true;

    public async enqueue(app: IDownloadManagerElement) {
        const state = store.getState();
        if(state.downloadManager.inProgress) await this.pause();

        store.dispatch(enqueue(app)); 

        LegendaryLibrary.install(app, {
            onFinish: () => {
                if(this.shouldStartNext) {
                    store.dispatch(remove(app));
                    // todo: optimize to not rerender everything
                    LegendaryLibrary.getAll();
                    this.next();
                } else {
                    this.shouldStartNext = true;
                }
            },
            onNetwork: (raw, decompressed) => store.dispatch(onNetwork({ raw, decompressed })),
            onDisk: (read, write) => store.dispatch(onDisk({ read, write })),
            onProgress: (percent, elapsed, eta) => store.dispatch(onProgress({ percent, elapsed, eta })),
        });
    }

    public async pause() {
        const state = store.getState();
        if(!state.downloadManager.inProgress) return;
        this.shouldStartNext = false;
        console.log("waiting to pause...");
        store.dispatch(pause());
        await LegendaryLibrary.pause(state.downloadManager.inProgress.app.app_name);
        console.log("paused");
        return;
    }

    public async remove(app: IDownloadManagerElement) {
        store.dispatch(remove(app));
    }

    public async resume() {
        const state = store.getState();
        if(state.downloadManager.queue.length === 0) throw new Error("No game in queue!");
        await this.enqueue(state.downloadManager.queue[0]);
    }

    public async next() {
        const ls = store.getState().downloadManager.queue;
        if(ls.length == 0) return;
        return await this.enqueue(ls[0]);
    }
}

if(!global["DownloadManager"]) {
    global["DownloadManager"] = new DownloadManagerHandler();
}

const DownloadManager: DownloadManagerHandler = global["DownloadManager"];
export default DownloadManager;