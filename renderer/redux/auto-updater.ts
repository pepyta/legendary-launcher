import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProgressInfo, UpdateInfo } from "electron-updater";
import { useAppSelector } from "./hooks";

type StateType = {
    state: "development-mode";
} | {
    state: "error",
    error: Error;
} | {
    state: "checking-for-update",
} | {
    state: "update-available",
    info: UpdateInfo;
} | {
    state: "update-not-available";
    info: UpdateInfo;
} | {
    state: "download-progress";
    progress: ProgressInfo;
    bytesPerSecond: number;
    percent: number;
    total: number;
    transferred: number;
} | {
    state: "update-downloaded";
    info: UpdateInfo;
};

const initialState: { state: StateType } = {
    state: {
        state: "checking-for-update",
    },
};

const autoUpdaterSlice = createSlice({
    name: "auto-updater",
    initialState,
    reducers: {
        setState: (state, action: PayloadAction<StateType>) => {
            state.state = action.payload;
        },
    },
});

export const useAutoUpdater = () => useAppSelector(({ autoUpdater }) => autoUpdater.state);
export const AutoUpdaterActions = autoUpdaterSlice.actions;

export default autoUpdaterSlice.reducer;