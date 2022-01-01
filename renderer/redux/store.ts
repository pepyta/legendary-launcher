import { configureStore } from "@reduxjs/toolkit";
import downloadManager from "./download-manager";
import library from "./library";
import theme from "./theme";
import autoUpdater from "./auto-updater";

const store = configureStore({
    reducer: {
        downloadManager, 
        library,
        theme,
        autoUpdater,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;