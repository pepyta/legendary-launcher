import LegendaryLibrary, { IGameData, IKeyImage } from "@lib/legendary/LegendaryLibrary";
import { Card, CardActionArea, CardProps, Chip, CircularProgress, Dialog, DialogContent, DialogProps, DialogTitle, Grid, Paper, Skeleton, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import Image from "next/image";
import VerticalCenter from "@components/misc/VerticalCenter";
import { Fragment, useMemo, useState } from "react";
import { BuildRounded, Inventory2Rounded as DownloadSizeIcon } from "@mui/icons-material";
import LibraryProvider, { useLibrary } from "@components/providers/LibraryProvider";
import fileSize from "filesize";

export type GameCardProps = {
    game: IGameData;
} & CardProps;

const GameCard = (props: GameCardProps) => {
    const { setGameDetails, gameDetails } = useLibrary();
    const [open, setOpen] = useState(false);

    const [background, logo, badges] = useMemo(() => [
        props.game.metadata.keyImages.find((e) => e.type === "DieselGameBoxTall"),
        props.game.metadata.keyImages.find((e) => e.type === "DieselGameBoxLogo"),
        (() => {
            const result: string[] = [];

            if (props.game.metadata.customAttributes?.CanRunOffline?.value == "true") {
                result.push("Can run offline");
            };

            if (props.game.metadata.customAttributes.CloudSaveFolder) {
                result.push("Cloud save");
            }

            return result;
        })()
    ], [props.game.metadata.keyImages]);

    return (
        <Fragment>
            <GameDialog
                open={open}
                onClose={() => setOpen(false)}
                game={props.game}
            />
            <Card
                {...props}
                sx={{
                    position: "relative",
                    ...props.sx,
                    aspectRatio: (3 / 4).toString(),
                }}
            >
                <CardActionArea
                    onClick={async () => {
                        setOpen(true);
                        const resp = await LegendaryLibrary.get(props.game.app_name);
                        const newMap = new Map(gameDetails);
                        newMap.set(props.game.app_name, resp);
                        setGameDetails(newMap);
                    }}
                    sx={{
                        ":hover > .logo-box": {
                            opacity: 0,
                        },
                        ":hover > .game-description": {
                            transform: "translateY(0)",
                        },
                    }}
                >
                    <Background {...background} />
                    <Logo {...logo} />
                    <InfoCard badges={badges} game={props.game} />
                </CardActionArea>
            </Card>
        </Fragment>
    );
};

const Background = (props: IKeyImage) => (
    <Image
        src={props.url}
        layout="responsive"
        width={props.height * 3 / 4}
        height={props.height}
    />
);

const Logo = (logo: IKeyImage) => (
    logo && (
        <Box
            className={"logo-box"}
            sx={{
                position: "absolute",
                transition: "opacity .4s cubic-bezier(0.075, 0.82, 0.165, 1)",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }}
        >
            <VerticalCenter sx={{ p: 4 }}>
                <img
                    src={logo.url}
                    style={{
                        maxWidth: "100%"
                    }}
                />
            </VerticalCenter>
        </Box>
    )
);

const InfoCard = (props: { game: IGameData, badges: string[] }) => (
    <Box
        sx={{
            position: "absolute",
            transform: "translateY(100%)",
            left: 0,
            right: 0,
            bottom: 0,
            transition: "transform .6s cubic-bezier(0.075, 0.82, 0.165, 1)",
        }}
        className={"game-description"}
    >
        <Paper
            square
            elevation={0}
            sx={{
                height: "100%",
                p: 2,
            }}
        >
            <Typography variant={"body1"} gutterBottom noWrap>
                {props.game.metadata.title}
            </Typography>
            <Grid container spacing={1}>
                {props.badges.map((badge, index) => (
                    <Grid item key={`game-card-badge-${props.game.metadata.id}-${index}`}>
                        <Chip label={badge} />
                    </Grid>
                ))}
            </Grid>
        </Paper>
    </Box>
);

const GameDialog = (props: DialogProps & { game: IGameData }) => {
    const { gameDetails } = useLibrary();

    const background = useMemo(() => props.game.metadata.keyImages.find((e) => e.type === "DieselGameBox"), [props.game.metadata.keyImages]);
    const fallback = useMemo(() => props.game.metadata.keyImages.find((e) => e.type === "DieselGameBoxTall"), [props.game.metadata.keyImages]);

    const details = gameDetails.get(props.game.app_name);

    console.log(details);
    console.log(props.game);

    return (

        <Dialog
            fullWidth
            maxWidth={"md"}
            {...props}
        >
            <Grid container>
                <Grid
                    item
                    sm={4}
                    sx={{
                        background: `url(${(background || fallback).url})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                    }}
                />
                <Grid item xs={12} sm={8}>
                    <DialogContent>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Typography variant={"h5"}>
                                    {props.game.metadata.title}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>
                                    {props.game.app_name}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container alignContent={"center"} spacing={1}>
                                    <Grid item>
                                        <BuildRounded fontSize={"small"} />
                                    </Grid>
                                    <Grid item>
                                        <Typography>
                                            Developer: <b>{props.game.metadata.developer}</b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container alignContent={"center"} spacing={1}>
                                    <Grid item>
                                        <DownloadSizeIcon fontSize={"small"} />
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
                                        <DownloadSizeIcon fontSize={"small"} />
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
                        </Grid>
                    </DialogContent>
                </Grid>
            </Grid>
        </Dialog>
    );
};

export default GameCard;