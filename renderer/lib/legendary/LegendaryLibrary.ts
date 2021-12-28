import CommandHandler from "@lib/CommandHandler";
import { IDownloadManagerElement } from "renderer/redux/download-manager";
import { GameElement, load, uninstall } from "renderer/redux/library";
import store from "renderer/redux/store";

export interface IGameData {
    metadata: IMetadata;
    asset_infos: IAssetInfo;
    app_name: string;
    app_title: string;
    base_urls: any[];
    dlcs: any[];
}

export interface IAssetInfo {
    Windows: IPlatformRelease;
    Mac: IPlatformRelease;
}

export interface IPlatformRelease {
    app_name: string;
    asset_id: string;
    build_version: string;
    catalog_item_id: string;
    label_name: string;
    namespace: string;
    metadata: IAgeGatings;
}

export interface IAgeGatings {
}

export interface IMetadata {
    ageGatings: IAgeGatings;
    categories: Category[];
    creationDate: Date;
    customAttributes: ICustomAttributes;
    description: string;
    developer: string;
    developerId: string;
    endOfSupport: boolean;
    entitlementName: string;
    entitlementType: string;
    eulaIds: string[];
    id: string;
    itemType: string;
    keyImages: IKeyImage[];
    lastModifiedDate: Date;
    longDescription: string;
    namespace: string;
    releaseInfo: IReleaseInfo[];
    status: string;
    title: string;
    unsearchable: boolean;
}

export interface Category {
    path: string;
}

export interface ICustomAttributes {
    CanRunOffline: ICustomAttribute;
    CanSkipKoreanIdVerification: ICustomAttribute;
    CloudSaveFolder: ICustomAttribute;
    FolderName: ICustomAttribute;
    MonitorPresence: ICustomAttribute;
    PresenceId: ICustomAttribute;
    RequirementsJson: ICustomAttribute;
    UseAccessControl: ICustomAttribute;
}

export interface ICustomAttribute {
    type: string;
    value: string;
}

export interface IKeyImage {
    height: number;
    md5: string;
    size: number;
    type: string;
    uploadedDate: Date;
    url: string;
    width: number;
}

export interface IReleaseInfo {
    appId: string;
    id: string;
    platform: string[];
}

export interface PlatformVersions {
    Mac: string;
    Windows: string;
}

export interface Game {
    app_name: string;
    title: string;
    version: string;
    platform_versions: PlatformVersions;
    cloud_saves_supported: boolean;
    cloud_save_folder?: any;
    cloud_save_folder_mac?: any;
    is_dlc: boolean;
    external_activation?: any;
    launch_options: any[];
    owned_dlc: any[];
}

export interface Manifest {
    size: number;
    type: string;
    version: number;
    feature_level: number;
    app_name: string;
    launch_exe: string;
    launch_command: string;
    build_version: string;
    build_id: string;
    prerequisites?: any;
    install_tags: string[];
    num_files: number;
    num_chunks: number;
    disk_size: number;
    download_size: number;
    tag_disk_size: any[];
    tag_download_size: any[];
}

export interface IGameDetails {
    game: Game;
    manifest: Manifest;
}

export interface InstallArgs {
    withDlcs?: boolean;
    customPath?: string;
};

export interface InstallOutputStream {
    onProgress?: (percent: number, elapsed: string, eta: string) => void;
    onDisk?: (read: string, write: string) => void;
    onNetwork?: (raw: string, decompressed: string) => void;
    onFinish?: () => void;
}

export interface IGameInstallation {
    app_name: string;
    install_path: string;
    title: string;
    version: string;
    base_urls: string[];
    can_run_offline: boolean;
    egl_guid: string;
    executable: string;
    install_size: any;
    install_tags: any[];
    is_dlc: boolean;
    launch_parameters: string;
    manifest_path: string;
    needs_verification: boolean;
    platform: string;
    prereq_info?: any;
    requires_ot: any;
    save_path?: any;
}

class LegendaryLibraryHandler {
    private cacheAllGames: IGameData[] = null;
    private cacheGameDetails: Map<string, IGameDetails> = new Map();

    /**
     * Starts the download of a game
     * @param appName The applications name
     * @param args 
     * @param streams 
     */
    public async install({ args, app: { app_name: appName } }: IDownloadManagerElement, streams?: InstallOutputStream): Promise<void> {
        const params = this.constructParams(args || {});

        CommandHandler.send(`install ${appName} ${params.join(" ")}`, {
            onError: (e) => { throw e; },
            onClose: () => streams?.onFinish && streams.onFinish(),
            onData: (data: string) => {
                if (!streams) return;
                data.split("\n").forEach((row) => {
                    let str = row.replace("\r", "").replace("[DLManager] INFO: ", "").replace(/[=\-+]/, "").trim();
                    console.debug(str);
                    if (str.startsWith("Progress")) {
                        const data = str.replace("Progress: ", "").replace(" Running for:", "").replace(", ETA:", "").split(" ");
                        const percent = data[0];
                        const elapsed = data[4];
                        const eta = data[5];
                        if (streams.onProgress) streams.onProgress(parseFloat(percent.replace("%", "")), elapsed, eta);
                    } else if (str.startsWith("Download	-")) {
                        const data = str.replace("Download	-", "").split(" ");
                        const raw = `${data[1]} ${data[2]}`;
                        const decompressed = `${data[5]} ${data[6]}`;
                        if (streams.onNetwork) streams.onNetwork(raw, decompressed);
                    } else if (str.startsWith("Disk	-")) {
                        const data = str.replace("Disk	-", "").split(" ");
                        const write = `${data[1]} ${data[2]}`;
                        const read = `${data[5]} ${data[6]}`;
                        if (streams.onDisk) streams.onDisk(read, write);
                    }

                    console.debug(str);
                });
            }
        });
    }

    private constructParams(args: InstallArgs) {
        const params = [];
        params.push(args.withDlcs ? "--with-dlcs" : "--skip-dlcs");
        if (args.customPath) params.push(...["--base-path", args.customPath]);
        params.push("-y");

        return params;
    }

    public async getDetails(appName: string): Promise<IGameDetails> {
        if (this.cacheGameDetails.has(appName)) return this.cacheGameDetails.get(appName);

        return new Promise((resolve, reject) => {
            let data = "";

            CommandHandler.send(`info ${appName} --json`, {
                onData: (resp) => {
                    if (resp.startsWith("[cli]") || resp.startsWith("[Core]")) return;
                    data += resp;
                },
                onClose: () => {
                    console.log(data);
                    // TODO: fix parse error on starting of installation
                    /**
                     * 
                    try {
                        const parsed = JSON.parse(data);
                        this.cacheGameDetails.set(appName, parsed);
                        store.dispatch(saveDetails(parsed));
                        resolve(parsed);
                    } catch(e) {
                        reject(e);
                    }
                     */
                },
                onError: reject,
            });
        });
    }

    public async pause(appName: string) {
        return new Promise((resolve, reject) => {
            const pattern = process.platform === 'linux' ? appName : 'legendary';

            if (process.platform === 'win32') {
                try {
                    CommandHandler.execSync(`Stop-Process -name  ${pattern}`);
                    resolve(null);
                } catch (error) {
                    reject(new Error(`Couldn't stop the download process of ${appName}`));
                }
            } else {
                CommandHandler.dispatch(['pkill', '-f', pattern], {
                    onClose: () => resolve(null),
                    onError: (e) => reject(e),
                });
            }
        });
    }

    public async getInstalled(): Promise<IGameInstallation[]> {
        return new Promise((resolve, reject) => {
            let data = "";

            CommandHandler.send("list-installed --json", {
                onData: (resp: string) => {
                    if (!this.isJustLog(resp)) data += resp;
                },
                onClose: () => {
                    try {
                        const parsed = JSON.parse(data);
                        resolve(parsed);
                    } catch(e) {
                        console.error(e);
                    }
                },
                onError: (err) => reject(err),
            });
        });
    }

    private isJustLog(str: string) {
        if(str.startsWith("[cli]") || str.startsWith("[Core]")) return true;
        return false;
    }

    public async launch({ appName }: { appName: string }) {
        return new Promise((resolve, reject) => {
            CommandHandler.send(`launch ${appName}`, {
                onClose: () => resolve(null),
                onError: reject,
                onData: (data) => console.log(data),
            });
        });
    }

    public async uninstall(app: GameElement): Promise<void> {
        return new Promise((resolve, reject) => {
            CommandHandler.send(`uninstall ${app.overview.app_name} -y`, {
                onClose: () => resolve(null),
                onError: reject,
                onData: (data) => console.log(data),
            });

            store.dispatch(uninstall(app));
        });
    }

    public async getAll(): Promise<GameElement[]> {
        return new Promise((resolve, reject) => {
            let data = "";

            CommandHandler.send("list-games --json", {
                onData: (resp: string) => {
                    if (resp.startsWith("[cli]") || resp.startsWith("[Core]")) return;
                    data += resp
                },
                onClose: async () => {
                    const parsed: IGameData[] = JSON.parse(data);
                    
                    const installations = await this.getInstalled();
                    const map = new Map<string, IGameInstallation>();
                    installations.forEach((el) => {
                        map.set(el.app_name, el);
                    });

                    const processed: GameElement[] = parsed.map((overview) => map.has(overview.app_name) ? ({
                        overview,
                        installation: map.get(overview.app_name),
                    }) : ({
                        overview,
                    }));

                    console.log(processed);

                    store.dispatch(load(processed));
                    resolve(processed);
                },
                onError: (err) => reject(err),
            });
        });
    }
}

if (!global["LegendaryLibrary"]) {
    global["LegendaryLibrary"] = new LegendaryLibraryHandler();
}

const LegendaryLibrary: LegendaryLibraryHandler = global["LegendaryLibrary"];
export default LegendaryLibrary;