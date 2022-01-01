import { IGameData, InstallArgs } from "@lib/legendary/LegendaryLibrary";
import ProgressBar from "@lib/ProgressBar";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IDownloadManagerElement {
    app: IGameData;
    args?: InstallArgs;
};

export interface DiskState {
    read: string;
    write: string;
};

export interface NetworkState {
    raw: string;
    decompressed: string;
};

export interface ProgressState {
    percent: number;
    elapsed: string;
    eta: string;
};

type StateType = {
    inProgress?: IDownloadManagerElement;
    queue: IDownloadManagerElement[];
    disk?: DiskState;
    network?: NetworkState;
    progress?: ProgressState;
};

const initialState: StateType = {
    inProgress: null,
    queue: [],
};

export const downloadManagerSlice = createSlice({
    name: 'download-manager',
    initialState,
    reducers: {
        enqueue: (state, action: PayloadAction<IDownloadManagerElement>) => {
            console.log(state.queue);
            state.queue = state.queue.filter((el) => el.app.app_name !== action.payload.app.app_name);
            state.disk = null;
            state.progress = null;
            state.network = null;
            if(state.inProgress) state.queue = [state.inProgress, ...state.queue];
            state.inProgress = action.payload;
        },
        pause: (state) => {
            if(!state.inProgress) throw new Error("There is nothing to stop!");
            state.queue = [state.inProgress, ...state.queue];
            ProgressBar.setValue(1);
            state.disk = null;
            state.progress = null;
            state.network = null;
            // LegendaryLibrary.pause(state.inProgress.appName);
            state.inProgress = null;
        },
        remove: (state, action: PayloadAction<IDownloadManagerElement>) => {
            console.log("removing "+action.payload.app.app_name);
            if(state.inProgress && state.inProgress.app.app_name === action.payload.app.app_name) delete state.inProgress;
            state.queue = state.queue.filter((e) => e.app.app_name !== action.payload.app.app_name);state.disk = null;
            state.progress = null;
            state.network = null;
        },
        next: (state) => {
            if(state.queue.length === 0) return;
            state.inProgress = state.queue.shift();
        },
        onDisk: (state, action: PayloadAction<DiskState>) => {
            state.disk = action.payload;
        },
        onNetwork: (state, action: PayloadAction<NetworkState>) => {
            state.network = action.payload;
        },
        onProgress: (state, action: PayloadAction<ProgressState>) => {
            ProgressBar.setValue(action.payload.percent / 100);
            state.progress = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { enqueue, pause, onDisk, onProgress, onNetwork, next, remove } = downloadManagerSlice.actions;

export default downloadManagerSlice.reducer;