import { ipcRenderer } from "electron";
import LegendaryConstants from "./legendary/LegendaryConstants";

interface ICallbackList {
    onError?: (data: any) => void;
    onData?: (data: any) => void;
    onClose?: () => void;
};

type ResponseType = "error" | "data" | "close" | "pid";

const CommandHandler = {
    generateId: () => `${Math.random()}`,
    send: async (args: string, callbacks: ICallbackList) => {
        console.log(LegendaryConstants.bin);
        return await CommandHandler.dispatch([LegendaryConstants.bin, ...args.split(" ")], callbacks);
    },
    execSync: (cmd: string) => {
        ipcRenderer.send("command-handler-exec-sync", cmd);
    },
    dispatch: (args: string[], callbacks: ICallbackList): Promise<number> => {
        return new Promise((resolve) => {
            const id = CommandHandler.generateId();
            ipcRenderer.send("command-handler", id, args);
        
            ipcRenderer.on(`command-handler-response-${id}`, (event, type: ResponseType, resp: any) => {
                if(callbacks.onClose && type == "close") {
                    callbacks.onClose();
                    ipcRenderer.removeAllListeners(`command-handler-response-${id}`);
                }
                if(callbacks.onData && type == "data") callbacks.onData(resp);
                if(callbacks.onError && type == "error") callbacks.onError(resp);
                if(type == "pid") resolve(resp);
            });
        });
    },
};

export default CommandHandler;