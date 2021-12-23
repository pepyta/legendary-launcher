import CommandHandler from "@lib/CommandHandler";
import { existsSync, readFileSync } from "fs";
import LegendaryConstants from "./LegendaryConstants";

export type IUserData = {
    id: string;
    displayName: string;
    deviceId: string;
};

export type ILegendaryStatus = {
    username: string;
    games_available: number;
    games_installed: number;
    platform: string;
};

class LegendaryUserHandler {
    private userDataFilePath = `${LegendaryConstants.configFilePath}/user.json`;

    public isLoggedIn() {
        return existsSync(this.userDataFilePath);
    }
    
    public getStatus(): IUserData {
        if(!this.isLoggedIn()) throw new Error("You are not logged in!");

        const { account_id, displayName, device_id } = JSON.parse(readFileSync(this.userDataFilePath, "utf-8"));
        
        return {
            id: account_id,
            displayName,
            deviceId: device_id,
        };
    };

    public async login(): Promise<IUserData> {
        return new Promise(async (resolve, reject) => {
            CommandHandler.send("auth", {
                onClose: () => {
                    try {
                        resolve(this.getStatus());
                    } catch(e) {
                        reject(e);
                    }; 
                },
                onError: reject,
            });
        });
    };

    public async logout() {
        return new Promise(async (resolve, reject) => {
            CommandHandler.send("auth --delete", {
                onData: resolve,
                onError: reject,
            });
        });
    }
}

const LegendaryUser = new LegendaryUserHandler();
export default LegendaryUser;