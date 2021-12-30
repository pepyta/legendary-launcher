import Store from "electron-store";

const store = new Store({
    schema: {
        "download-manager-list": {
            type: "array",
        },
        "dark-mode": {
            type: "boolean",
            default: true,
        },
    }
});

export default store;