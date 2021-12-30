import store from "@lib/Store";
import { createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";
import { ipcRenderer } from "electron";

type StateType = {
    darkMode: boolean;
};

const initialState: StateType = {
    darkMode: true, 
};

export const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        loadTheme: (state) => {
            const isDarkMode = store.get("dark-mode", true) === true;
            ipcRenderer.send("set-theme", isDarkMode);
            state.darkMode = isDarkMode;
        },
        setTheme: (state, action: PayloadAction<"dark" | "light">) => {
            const isDarkMode = action.payload === "dark";
            ipcRenderer.send("set-theme", isDarkMode);
            state.darkMode = isDarkMode;
            store.set("dark-mode", isDarkMode);
        },
    }
});

export const { setTheme, loadTheme } = themeSlice.actions;

export default themeSlice.reducer;