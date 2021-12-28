import LegendaryLibrary, { IGameData, IKeyImage } from "@lib/legendary/LegendaryLibrary";
import { Card, CardActionArea, CardProps, Chip, Dialog, DialogContent, DialogProps, Grid, Paper, Skeleton, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import VerticalCenter from "@components/misc/VerticalCenter";
import { Fragment, memo, useMemo, useState } from "react";

import dynamic from "next/dynamic";
import { GameElement } from "renderer/redux/library";

const GameDialog = dynamic(() => import("@components/games/GameDialog"));

export type GameCardProps = {
    game: GameElement;
} & CardProps;

const GameCard = (props: GameCardProps) => {
    const [open, setOpen] = useState(false);

    const [background, logo, badges] = useMemo(() => [
        props.game.overview.metadata.keyImages.find((e) => e.type === "DieselGameBoxTall"),
        props.game.overview.metadata.keyImages.find((e) => e.type === "DieselGameBoxLogo"),
        (() => {
            const result: string[] = [];

            if (props.game.overview.metadata.customAttributes?.CanRunOffline?.value == "true") {
                result.push("Can run offline");
            };

            if (props.game.overview.metadata.customAttributes.CloudSaveFolder) {
                result.push("Cloud save");
            }

            return result;
        })()
    ], [props.game.overview.metadata.keyImages]);

    return (
        <Fragment>
            <GameDialog
                open={open}
                onClose={() => setOpen(false)}
                game={props.game}
            />
            <Card
                {...props}
                style={{
                    filter: !props.game.installation && "grayscale(1)",
                }}
                sx={{
                    position: "relative",
                    ...props.sx,
                    aspectRatio: "0.75",
                }}
            >
                <CardActionArea
                    onClick={async () => {
                        setOpen(true);
                        try {
                            await LegendaryLibrary.getDetails(props.game.overview.app_name);
                        } catch(e) {
                            console.error(e);
                        }
                    }}
                    sx={{
                        ":hover > .logo-box": {
                            opacity: 0,
                        },
                        ":hover > .game-description": {
                            transform: "translateY(0)",
                        }, 
                        height: "100%",
                    }}
                >
                    <Background {...background} />
                    <Logo {...logo} />
                    <InfoCard badges={badges} game={props.game.overview} />
                </CardActionArea>
            </Card>
        </Fragment>
    );
};

const Background = (props: IKeyImage) => (
    <img
        src={`${props?.url}?h=348&resize=1&w=261`}
        style={{
            maxWidth: "100%",
            minWidth: "100%",
            aspectRatio: "0.75",
        }}
        loading={"lazy"}
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
                    loading="lazy"
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

export default memo(GameCard);