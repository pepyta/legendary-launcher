import Store from "electron-store";

const store = new Store({
    schema: {
        "download-manager-list": {
            type: "array",
        }
    }
});

export default store;