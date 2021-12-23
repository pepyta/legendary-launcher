import CommandHandler from "@lib/CommandHandler";

export interface IGameData {
    metadata:    IMetadata;
    asset_infos: IAssetInfo;
    app_name:    string;
    app_title:   string;
    base_urls:   any[];
    dlcs:        any[];
}

export interface IAssetInfo {
    Windows: IPlatformRelease;
    Mac: IPlatformRelease;
}

export interface IPlatformRelease {
    app_name:        string;
    asset_id:        string;
    build_version:   string;
    catalog_item_id: string;
    label_name:      string;
    namespace:       string;
    metadata:        IAgeGatings;
}

export interface IAgeGatings {
}

export interface IMetadata {
    ageGatings:       IAgeGatings;
    categories:       Category[];
    creationDate:     Date;
    customAttributes: ICustomAttributes;
    description:      string;
    developer:        string;
    developerId:      string;
    endOfSupport:     boolean;
    entitlementName:  string;
    entitlementType:  string;
    eulaIds:          string[];
    id:               string;
    itemType:         string;
    keyImages:        IKeyImage[];
    lastModifiedDate: Date;
    longDescription:  string;
    namespace:        string;
    releaseInfo:      IReleaseInfo[];
    status:           string;
    title:            string;
    unsearchable:     boolean;
}

export interface Category {
    path: string;
}

export interface ICustomAttributes {
    CanRunOffline:               ICustomAttribute;
    CanSkipKoreanIdVerification: ICustomAttribute;
    CloudSaveFolder:             ICustomAttribute;
    FolderName:                  ICustomAttribute;
    MonitorPresence:             ICustomAttribute;
    PresenceId:                  ICustomAttribute;
    RequirementsJson:            ICustomAttribute;
    UseAccessControl:            ICustomAttribute;
}

export interface ICustomAttribute {
    type:  string;
    value: string;
}

export interface IKeyImage {
    height:       number;
    md5:          string;
    size:         number;
    type:         string;
    uploadedDate: Date;
    url:          string;
    width:        number;
}

export interface IReleaseInfo {
    appId:    string;
    id:       string;
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

class LegendaryLibraryHandler {
    private cacheAllGames: IGameData[] = null;
    private cacheGameDetails: Map<string, IGameDetails> = new Map(); 

    public async get(appName: string): Promise<IGameDetails> {
        if(this.cacheGameDetails.has(appName)) return this.cacheGameDetails.get(appName);

        return new Promise((resolve, reject) => {
            let data = "";

            CommandHandler.send(`info ${appName} --json`, {
                onData: (resp) => {
                    if(resp.startsWith("[cli]") || resp.startsWith("[Core]")) return;
                    data += resp;
                },
                onClose: () => {
                    const parsed = JSON.parse(data);
                    this.cacheGameDetails.set(appName, parsed);
                    resolve(parsed);
                },
                onError: reject,
            });
        });
    }

    public async getAll(): Promise<IGameData[]> {
        if(this.cacheAllGames) {
            console.log("from cache...");
            return this.cacheAllGames;
        };

        return new Promise((resolve, reject) => {
            let data = "";

            CommandHandler.send("list-games --json", {
                onData: (resp: string) => {
                    if(resp.startsWith("[cli]") || resp.startsWith("[Core]")) return;
                    data += resp
                },
                onClose: () => {
                    const parsed = JSON.parse(data);
                    this.cacheAllGames = parsed;
                    resolve(parsed);
                },
                onError: (err) => reject(err), 
            });
        });
    }
}

const LegendaryLibrary = new LegendaryLibraryHandler();
export default LegendaryLibrary;