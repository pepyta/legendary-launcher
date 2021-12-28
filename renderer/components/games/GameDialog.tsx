import DownloadManager from "@lib/legendary/DownloadManager";
import LegendaryLibrary, { IGameData } from "@lib/legendary/LegendaryLibrary";
import { BuildRounded as DeveloperIcon, DeleteRounded as DeleteIcon, InventoryRounded as SizeIcon, PlayArrowRounded as PlayIcon } from "@mui/icons-material";
import { Button, Dialog, DialogContent, DialogProps, Grid, Skeleton, Typography } from "@mui/material";
import fileSize from "filesize";
import { memo, useMemo } from "react";
import { GameElement } from "renderer/redux/library";

const GameDialog = (props: DialogProps & { game: GameElement }) => {
    const background = useMemo(() =>
        props.game.overview.metadata.keyImages.find((e) => e.type === "DieselGameBox")
        || props.game.overview.metadata.keyImages.find((e) => e.type === "DieselGameBoxTall"),
        [props.game.overview.metadata.keyImages]
    );
    const details = useMemo(() => props.game.details, [props.game.details]);


    const install = async () => {
        DownloadManager.enqueue({
            app: props.game.overview,
            // todo: args
            args: {},
        });
    };

    const uninstall = async () => {
        LegendaryLibrary.uninstall(props.game);
    };

    const start = async () => {
        LegendaryLibrary.launch({
            appName: props.game.overview.app_name,
        });
    };

    return (

        <Dialog
            fullWidth
            maxWidth={"md"}
            keepMounted={false}
            {...props}
        >
            <Grid container>
                <Grid
                    item
                    sm={4}
                    sx={{
                        // todo resize
                        // background: `url(${background.url}?resize=1&width=400&height=${Math.floor(background.width / background.height * 400)})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                    }}
                />
                <Grid item xs={12} sm={8}>
                    <DialogContent>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Typography variant={"h5"}>
                                    {props.game.overview.metadata.title}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>
                                    DEBUG: {props.game.overview.app_name}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container alignContent={"center"} spacing={1}>
                                    <Grid item>
                                        <DeveloperIcon fontSize={"small"} />
                                    </Grid>
                                    <Grid item>
                                        <Typography>
                                            Developer: <b>{props.game.overview.metadata.developer}</b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container alignContent={"center"} spacing={1}>
                                    <Grid item>
                                        <SizeIcon fontSize={"small"} />
                                    </Grid>
                                    <Grid item sx={{ flexGrow: 1 }}>
                                        <Typography sx={{ flexGrow: 1 }}>
                                            {
                                                details ? (
                                                    `Download size: ${fileSize(details.manifest.download_size)}`
                                                ) : (
                                                    <Skeleton />
                                                )
                                            }
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <Grid container alignContent={"center"} spacing={1}>
                                    <Grid item>
                                        <SizeIcon fontSize={"small"} />
                                    </Grid>
                                    <Grid item sx={{ flexGrow: 1 }}>
                                        <Typography >
                                            {
                                                details ? (
                                                    `Disk space: ${fileSize(details.manifest.disk_size)}`
                                                ) : (
                                                    <Skeleton />
                                                )
                                            }
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {props.game.installation ? (

                                <Grid item xs={12}>
                                    <Grid container spacing={1}>
                                        <Grid item>
                                            <Button
                                                variant={"contained"}
                                                size={"large"}
                                                startIcon={<PlayIcon />}
                                                onClick={start}
                                            >
                                                Start
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                size={"large"}
                                                startIcon={<DeleteIcon />}
                                                onClick={uninstall}
                                            >
                                                Uninstall
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Grid item xs={12}>
                                    <Button
                                        variant={"contained"}
                                        size={"large"}
                                        onClick={install}
                                    >
                                        Install
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                    </DialogContent>
                </Grid>
            </Grid>
        </Dialog>
    );
};

export default memo(GameDialog);