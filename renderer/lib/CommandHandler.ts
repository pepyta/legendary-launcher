import { ipcRenderer } from "electron";

interface ICallbackList {
    onError?: (data: any) => void;
    onData?: (data: any) => void;
    onClose?: () => void;
};

type ResponseType = "error" | "data" | "close";

const CommandHandler = {
    generateId: () => `${Math.random()}`,
    send: (args: string, callbacks: ICallbackList) => {
        const id = CommandHandler.generateId();
        ipcRenderer.send("command-handler", id, args.split(" "));
    
        ipcRenderer.on(`command-handler-response-${id}`, (event, type: ResponseType, resp: any) => {
            if(callbacks.onClose && type == "close") {
                callbacks.onClose();
                ipcRenderer.removeAllListeners(`command-handler-response-${id}`);
            }
            if(callbacks.onData && type == "data") callbacks.onData(resp);
            if(callbacks.onError && type == "error") callbacks.onError(resp);
        });
    },
};

export default CommandHandler;