import HorizontalCenter from "@components/misc/HorizontalCenter";
import Image from "@components/misc/Image";
import VerticalCenter from "@components/misc/VerticalCenter";
import DownloadManager from "@lib/legendary/DownloadManager";
import LegendaryLibrary, { IGameData } from "@lib/legendary/LegendaryLibrary";
import { BuildRounded as DeveloperIcon, DeleteRounded as DeleteIcon, InventoryRounded as SizeIcon, PlayArrowRounded as PlayIcon } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Dialog, DialogContent, DialogProps, Grid, Skeleton, Typography, useTheme } from "@mui/material";
import fileSize from "filesize";
import { useSnackbar } from "notistack";
import { Fragment, memo, useMemo, useState } from "react";
import { GameElement } from "renderer/redux/library";

const GameDialog = (props: DialogProps & { game: GameElement }) => {
    const [background, logo] = useMemo(() =>
        [
            props.game?.overview.metadata.keyImages.find((e) => e.type === "DieselGameBox") || props.game?.overview.metadata.keyImages.find((e) => e.type === "DieselGameBoxTall"),
            props.game?.overview.metadata.keyImages.find((e) => e.type === "DieselGameBoxLogo"),
        ],
        [props.game?.overview.metadata.keyImages]
    );

    const theme = useTheme();
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

    if(!props.game) return <Fragment />;

    return (

        <Dialog
            fullWidth
            maxWidth={"xs"}
            keepMounted
            {...props}
        >
            <Grid container>
                <Grid
                    item
                    xs={12}
                    sx={{
                        height: 261,
                        position: "relative",
                    }}
                >
                    <Image
                        src={`${background.url}?resize=1&w=444`}
                        height={261}
                        style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                        }}
                    />
                    {
                        logo && (
                            <Image
                                src={`${logo.url}?resize=1&w=320`}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    marginTop: "auto",
                                    marginBottom: "auto",
                                    maxWidth: "100%",
                                    maxHeight: "80%",
                                    paddingLeft: 64,
                                    paddingRight: 64,
                                    paddingTop: 32,
                                    paddingBottom: 32,
                                }}
                            />
                        )
                    }
                    <Box
                        sx={{
                            width: "100%",
                            height: 32,
                            position: "absolute",
                            bottom: 0,
                            backgroundImage: `linear-gradient(transparent, rgba(255, 255, 255, 0.16)), linear-gradient(0, ${theme.palette.background.paper}, transparent)`,
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant={"h5"}>
                                    {props.game.overview.metadata.title}
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