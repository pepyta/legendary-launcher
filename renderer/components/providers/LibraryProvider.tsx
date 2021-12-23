import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState } from "react";
import LegendaryLibrary, { IGameData } from "@lib/legendary/LegendaryLibrary";

const LibraryContext = createContext<{
    games: IGameData[];
    setGames: Dispatch<SetStateAction<IGameData[]>>;
}>(null);

export const useLibrary = () => useContext(LibraryContext);

export type LibraryProviderProps = PropsWithChildren<{}>;

const LibraryProvider = (props: LibraryProviderProps) => {
    const [games, setGames] = useState<IGameData[]>(null);

    useEffect(() => {
        LegendaryLibrary.get().then((result) => setGames(result));
    }, []);

    return (
        <LibraryContext.Provider value={{ games, setGames }}>
            {props.children}
        </LibraryContext.Provider>
    );
};

export default LibraryProvider;