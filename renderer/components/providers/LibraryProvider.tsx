import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState } from "react";
import LegendaryLibrary, { IGameData, IGameDetails } from "@lib/legendary/LegendaryLibrary";

const LibraryContext = createContext<{
    games: IGameData[];
    setGames: Dispatch<SetStateAction<IGameData[]>>;
    gameDetails: Map<string, IGameDetails>,
    setGameDetails: Dispatch<SetStateAction<Map<string, IGameDetails>>>;
}>(null);

export const useLibrary = () => useContext(LibraryContext);

export type LibraryProviderProps = PropsWithChildren<{}>;

const LibraryProvider = (props: LibraryProviderProps) => {
    const [games, setGames] = useState<IGameData[]>(null);
    const [gameDetails, setGameDetails] = useState<Map<string, IGameDetails>>(new Map());

    useEffect(() => {
        LegendaryLibrary.getAll().then((result) => setGames(result));
    }, []);

    return (
        <LibraryContext.Provider value={{ games, setGames, gameDetails, setGameDetails }}>
            {props.children}
        </LibraryContext.Provider>
    );
};

export default LibraryProvider;