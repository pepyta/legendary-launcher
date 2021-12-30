import { configureStore } from "@reduxjs/toolkit";
import downloadManager from "./download-manager";
import library from "./library";
import theme from "./theme";

const store = configureStore({
    reducer: {
        downloadManager, 
        library,
        theme,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;