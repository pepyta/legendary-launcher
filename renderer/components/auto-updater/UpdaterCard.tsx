import { BuildRounded as DevelopmentIcon, DoneRounded as DoneIcon, ErrorRounded as ErrorIcon } from "@mui/icons-material";
import { Button, Card, CardActions, CardContent, CircularProgress, Grid, Typography } from "@mui/material";
import { useMemo } from "react";
import { useAutoUpdater } from "renderer/redux/auto-updater";
import autoUpdater from "@lib/AutoUpdater";

type StateType = ReturnType<typeof useAutoUpdater>["state"];

const UpdaterCard = () => {
    const details = useAutoUpdater();
    const { state } = details;

    const map = useMemo(
        () => {
            const map: Map<StateType, JSX.Element> = new Map();
            map.set("checking-for-update", (
                <Grid container spacing={4} alignItems={"center"} sx={{ p: 2 }}>
                    <Grid item>
                        <CircularProgress
                            size={16}
                        />
                    </Grid>
                    <Grid item>
                        <Typography>
                            Checking for updates...
                        </Typography>
                    </Grid>
                </Grid>
            ));

            map.set("development-mode", (
                <Grid container spacing={4} alignItems={"center"} sx={{ p: 2 }}>
                    <Grid item>
                        <DevelopmentIcon />
                    </Grid>
                    <Grid item>
                        <Typography>
                            Development mode is on!
                        </Typography>
                        <Typography variant={"body2"}>
                            Updates are disabled while in development mode.
                        </Typography>
                    </Grid>
                </Grid>
            ));

            map.set("error", (
                <Grid container spacing={4} alignItems={"center"} sx={{ p: 2 }}>
                    <Grid item>
                        <ErrorIcon />
                    </Grid>
                    <Grid item>
                        <Typography>
                            Something went wrong!
                        </Typography>
                        <Typography variant={"body2"}>
                            Check console for more details!
                        </Typography>
                    </Grid>
                </Grid>
            ));

            map.set("update-available", (
                <Grid container spacing={4} alignItems={"center"} sx={{ p: 2 }}>
                    <Grid item>
                        <CircularProgress
                            size={16}
                        />
                    </Grid>
                    <Grid item>
                        <Typography>
                            An update is available!
                        </Typography>
                        <Typography variant={"body2"}>
                            TODO: more info
                        </Typography>
                    </Grid>
                </Grid>
            ));


            map.set("update-not-available", (
                <Grid container spacing={4} alignItems={"center"} sx={{ p: 2 }}>
                    <Grid item>
                        <DoneIcon />
                    </Grid>
                    <Grid item>
                        <Typography>
                            You are using the latest version of Legendary Launcher!
                        </Typography>
                        <Typography variant={"body2"}>
                            TODO: more info
                        </Typography>
                    </Grid>
                </Grid>
            ));

            map.set("download-progress", (
                <Grid container spacing={4} alignItems={"center"} sx={{ p: 2 }}>
                    <Grid item>
                        <CircularProgress
                            size={16}
                        />
                    </Grid>
                    <Grid item>
                        <Typography>
                            Downloading the latest version...
                        </Typography>
                        <Typography variant={"body2"}>
                            TODO: more info
                        </Typography>
                    </Grid>
                </Grid>
            ));

            map.set("update-downloaded", (
                <>
                    <CardContent>
                        <Grid container spacing={4} alignItems={"center"}>
                            <Grid item>
                                <CircularProgress
                                    size={16}
                                />
                            </Grid>
                            <Grid item>
                                <Typography>
                                    Update downloaded!
                                </Typography>
                                <Typography variant={"body2"}>
                                    The update will be installed next time, when you start the application.
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Button
                            onClick={() => autoUpdater.quitAndInstall()}
                        >
                            Update now
                        </Button>
                    </CardActions>
                </>
            ));

            return map;
        },
        []
    );

    const content = useMemo(() => map.get(state), [state]);

    return (
        <Card>
            {content}
        </Card>
    );
};

export default UpdaterCard;