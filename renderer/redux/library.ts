import { IGameData, IGameDetails, IGameInstallation } from "@lib/legendary/LegendaryLibrary";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GameElement {
    overview: IGameData;
    details?: IGameDetails;
    installation?: IGameInstallation;
};

interface StateType {
    games: GameElement[];
};

const initialState: StateType = {
    games: null,
};

export const librarySlice = createSlice({
    name: "library",
    initialState,
    reducers: {
        load: (state, action: PayloadAction<GameElement[]>) => {
            state.games = action.payload;
        },
        uninstall: (state, action: PayloadAction<GameElement>) => {
            for (let i = 0; i < state.games.length; i++) {
                if (state.games[i].overview.app_name === action.payload.overview.app_name) {
                    delete state.games[i].installation;
                }
            }
        },
        saveDetails: (state, game: PayloadAction<IGameDetails>) => {
            state.games.find((el) => el.overview.app_name === game.payload.game.app_name).details = game.payload;
        }
    },
});


// Action creators are generated for each case reducer function
export const { load, saveDetails, uninstall } = librarySlice.actions;

export default librarySlice.reducer;