import { Box, BoxProps, Grid, useTheme } from "@mui/material";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";

const AppBar = (props: BoxProps) => {
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        ipcRenderer.send("isMaximized");
        ipcRenderer.on("isMaximized-reply", (e, result) => setIsMaximized(result));
    }, []);

    return (
        <Box
            {...props}
            sx={{
                width: "100%",
                height: 28,
                alignItems: "center",
                backgroundColor: "transparent",
                zIndex: 100000,
                ...props.sx,
            }}
            className={"appbar"}
        >
            <Grid container>
                <Grid
                    item
                    sx={{
                        flexGrow: 1,
                    }}
                />
                <Grid item>
                    <Grid container>
                        <WindowButton
                            onClick={() => ipcRenderer.send("minimize")}
                        >
                            <MinimizeIcon />
                        </WindowButton>
                        {isMaximized ? (
                            <WindowButton
                                onClick={() => ipcRenderer.send("restore")}
                            >
                                <RestoreIcon />
                            </WindowButton>
                        ) : (
                            <WindowButton
                                onClick={() => ipcRenderer.send("maximize")}
                            >
                                <FullScreenIcon />
                            </WindowButton>
                        )}
                        <WindowButton 
                            id={"close-button"}
                            onClick={() => ipcRenderer.send("close")}
                        >
                            <CloseIcon />
                        </WindowButton>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};


const MinimizeIcon = () => (
    <svg aria-hidden="true" version="1.1" width="10" height="10"><path d="M 0,5 10,5 10,6 0,6 Z"></path></svg>
);

const FullScreenIcon = () => (
    <svg aria-hidden="true" version="1.1" width="10" height="10"><path d="M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z"></path></svg>
);

const RestoreIcon = () => (
    <svg aria-hidden="true" version="1.1" width="10" height="10"><path d="m 2,1e-5 0,2 -2,0 0,8 8,0 0,-2 2,0 0,-8 z m 1,1 6,0 0,6 -1,0 0,-5 -5,0 z m -2,2 6,0 0,6 -6,0 z"></path></svg>
);

const CloseIcon = () => (
    <svg aria-hidden="true" version="1.1" width="10" height="10"><path d="M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z"></path></svg>
);


const WindowButton = (props: BoxProps) => {
    const theme = useTheme();

    return (
        (
            <Grid
                item
            >
                <Box
                    {...props}
                    className={"window-button"}
                    sx={{
                        transition: "all .1s ease-out",
                        width: 45,
                        height: 28,
                        fill: theme.palette.getContrastText(theme.palette.background.default),
                        alignContent: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        lineHeight: "28px",
                        "&:hover": {
                            backgroundColor: props.id === "close-button" ? "rgba(255, 0, 0, 0.8)" : theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.25)",
                        },
                        ...props.sx,
                    }}
                />
            </Grid>
        )
    );
};

export default AppBar;