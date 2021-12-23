import SideNav from "@components/misc/SideNav";
import LegendaryUser, { IUserData } from "@lib/legendary/LegendaryUser";
import { Grid } from "@mui/material";
import { createContext, Dispatch, Fragment, PropsWithChildren, SetStateAction, useContext, useState } from "react";
import AuthPage from "../../pages/auth";

const UserContext = createContext<{
    user: IUserData;
    setUser: Dispatch<SetStateAction<IUserData>>;
}>(null);

export type UserProviderProps = PropsWithChildren<{}>;

export const useUser = () => useContext(UserContext);

const UserProvider = (props: UserProviderProps) => {
    const [user, setUser] = useState<IUserData>(LegendaryUser.isLoggedIn() ? LegendaryUser.getStatus() : null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {user ? (
                <Grid container sx={{ width: "100%" }}>
                    <Grid item>
                        <SideNav />
                    </Grid>
                    <Grid item sx={{ flexGrow: 1 }}>
                        {props.children}
                    </Grid>
                </Grid>
            ): <AuthPage />}
        </UserContext.Provider>
    );
};

export default UserProvider;