import DownloadCard from "@components/downloads/DownloadCard";
import { useUser } from "@components/providers/UserProvider";
import LegendaryUser from "@lib/legendary/LegendaryUser";
import { AccountCircleRounded as UserIcon, GamesRounded as GamesIcon, HomeRounded as HomeIcon, LogoutRounded as LogoutIcon } from "@mui/icons-material";
import { CSSObject, Drawer as MuiDrawer, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, styled, Theme, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

export type SideNavProps = {};

const DRAWER_WIDTH = 300;

const openedMixin = (theme: Theme): CSSObject => ({
    width: DRAWER_WIDTH,
    background: "transparent",
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    background: "transparent",
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: DRAWER_WIDTH,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);


const SideNav = (props: SideNavProps) => {
    const router = useRouter();
    const { user, setUser } = useUser();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const isOpen = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logout = async () => {
        try {
            await LegendaryUser.logout();
            handleClose();
            setUser(null);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Drawer
            open={isOpen}
            variant="permanent"
        >
            <List
                sx={{
                    position: "relative",
                    height: "100%",
                }}
            >
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                >
                    <MenuItem onClick={logout}>
                        <ListItemIcon>
                            <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
                <ListItem button onClick={() => router.push("/home")}>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={"Home"}
                    />
                </ListItem>
                <ListItem button onClick={() => router.push("/library")}>
                    <ListItemIcon>
                        <GamesIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={"Library"}
                    />
                </ListItem>
                <DownloadCard />
                <ListItem
                    button
                    onClick={handleClick}
                    sx={{
                        position: "absolute",
                        bottom: 8,
                    }}
                >
                    <ListItemIcon>
                        <UserIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={user.displayName}
                    />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default SideNav;