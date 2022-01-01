import AppBar from "@components/misc/AppBar";
import SideNav from "@components/misc/SideNav";
import LegendaryLibrary from "@lib/legendary/LegendaryLibrary";
import LegendaryUser, { IUserData } from "@lib/legendary/LegendaryUser";
import { Grid, useTheme } from "@mui/material";
import { createContext, Dispatch, Fragment, PropsWithChildren, SetStateAction, useContext, useEffect, useState } from "react";
import AuthPage from "../../pages/auth";

const UserContext = createContext<{
    user: IUserData;
    setUser: Dispatch<SetStateAction<IUserData>>;
}>(null);

export type UserProviderProps = PropsWithChildren<{}>;

export const useUser = () => useContext(UserContext);

const UserProvider = (props: UserProviderProps) => {
    const theme = useTheme();
    const [user, setUser] = useState<IUserData>(LegendaryUser.isLoggedIn() ? LegendaryUser.getStatus() : null);

    useEffect(() => {
        LegendaryLibrary.getAll();    
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {user ? (
                <>
                    <AppBar
                        position={"fixed"}
                    />
                    <Grid container sx={{ width: "100%" }}>
                        <Grid item>
                            <SideNav />
                        </Grid>
                        <Grid item sx={{ flexBasis: 1, flexGrow: 1, backgroundColor: theme.palette.background.default, minHeight: "100vh" }}>
                            {props.children}
                        </Grid>
                    </Grid>
                </>
            ): <AuthPage />}
        </UserContext.Provider>
    );
};

export default UserProvider;