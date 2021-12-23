import { useUser } from "@components/providers/UserProvider";
import LegendaryUser from "@lib/legendary/LegendaryUser";
import { AccountCircleRounded as UserIcon, LogoutRounded as LogoutIcon } from "@mui/icons-material";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";

export type SideNavProps = {};

const DRAWER_WIDTH = 300;

const SideNav = (props: SideNavProps) => {
    const { user, setUser } = useUser();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
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
        } catch(e) {
            console.error(e);
        }
    };
    
    return (
        <Drawer
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: DRAWER_WIDTH,
                    boxSizing: 'border-box',
                },
            }}
            variant="permanent"
        >
            <List sx={{ height: "100%" }}>
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
                <ListItem button onClick={handleClick}>
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