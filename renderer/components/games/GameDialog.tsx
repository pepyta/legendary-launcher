import HorizontalCenter from "@components/misc/HorizontalCenter";
import VerticalCenter from "@components/misc/VerticalCenter";
import DownloadManager from "@lib/legendary/DownloadManager";
import LegendaryLibrary, { IGameData } from "@lib/legendary/LegendaryLibrary";
import { BuildRounded as DeveloperIcon, DeleteRounded as DeleteIcon, InventoryRounded as SizeIcon, PlayArrowRounded as PlayIcon } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Dialog, DialogContent, DialogProps, Grid, Skeleton, Typography } from "@mui/material";
import fileSize from "filesize";
import { useSnackbar } from "notistack";
import { memo, useMemo, useState } from "react";
import { GameElement } from "renderer/redux/library";

const GameDialog = (props: DialogProps & { game: GameElement }) => {
    const background = useMemo(() =>
        props.game.overview.metadata.keyImages.find((e) => e.type === "DieselGameBox")
        || props.game.overview.metadata.keyImages.find((e) => e.type === "DieselGameBoxTall"),
        [props.game.overview.metadata.keyImages]
    );

    const logo = useMemo(() =>
        props.game.overview.metadata.keyImages.find((e) => e.type === "DieselGameBoxLogo"),
        [props.game.overview.metadata.keyImages]
    );

    const details = useMemo(() => props.game.details, [props.game.details]);
    const { enqueueSnackbar } = useSnackbar();
    const [disabled, setDisabled] = useState(false);

    const install = async () => {
        DownloadManager.enqueue({
            app: props.game.overview,
            args: {},
        });

        enqueueSnackbar(`Successfully started to download ${props.game.overview.app_title}!`, {
            variant: "success",
        });

        props?.onClose && props.onClose({}, "escapeKeyDown");
    };

    const uninstall = async () => {
        enqueueSnackbar(`Successfully uninstalled ${props.game.overview.app_title}!`, {
            variant: "success",
        });

        props?.onClose && props.onClose({}, "escapeKeyDown");
        LegendaryLibrary.uninstall(props.game);
    };

    const start = async () => {
        setDisabled(true);

        await LegendaryLibrary.launch({
            appName: props.game.overview.app_name,
        });

        // disable this button until the game is most likely has been launched
        setTimeout(() => {
            setDisabled(false);
        }, 10000);
    };

    return (

        <Dialog
            fullWidth
            maxWidth={"xs"}
            keepMounted={false}
            {...props}
        >
            <Grid container>
                <Grid
                    item
                    xs={12}
                    sx={{
                        height: 261,
                        background: `url(${background.url}?h=348&resize=1&w=261)`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                    }}
                />
                {/* TODO: add logo */}
                <Grid item xs={12}>
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
                                            <LoadingButton
                                                variant={"contained"}
                                                size={"large"}
                                                disabled={disabled}
                                                loading={disabled}
                                                startIcon={<PlayIcon />}
                                                onClick={start}
                                            >
                                                Start
                                            </LoadingButton>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                size={"large"}
                                                startIcon={<DeleteIcon />}
                                                disabled={disabled}
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