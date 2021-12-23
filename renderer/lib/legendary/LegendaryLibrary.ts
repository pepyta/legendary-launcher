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

class LegendaryLibraryHandler {
    private cache: IGameData[] = null;

    public async get(): Promise<IGameData[]> {
        if(this.cache) {
            console.log("from cache...");
            return this.cache;
        };

        return new Promise((resolve, reject) => {
            let data = "";

            CommandHandler.send("list-games --json", {
                onData: (resp: string) => {
                    if(resp.startsWith("[cli]") || resp.startsWith("[Core]")) return;
                    data += resp
                },
                onClose: () => {
                    console.log(data);
                    const parsed = JSON.parse(data);
                    this.cache = parsed;
                    resolve(parsed);
                },
                onError: (err) => reject(err), 
            });
        });
    }
}

const LegendaryLibrary = new LegendaryLibraryHandler();
export default LegendaryLibrary;