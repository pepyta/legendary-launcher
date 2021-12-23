import { IGameData, IKeyImage } from "@lib/legendary/LegendaryLibrary";
import { Card, CardProps, Chip, Grid, Paper, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import Image from "next/image";
import VerticalCenter from "@components/misc/VerticalCenter";
import { useMemo } from "react";

export type GameCardProps = {
    game: IGameData;
} & CardProps;

const GameCard = (props: GameCardProps) => {
    const theme = useTheme();

    const [background, logo, badges] = useMemo(() => [
        props.game.metadata.keyImages.find((e) => e.type === "DieselGameBoxTall"),
        props.game.metadata.keyImages.find((e) => e.type === "DieselGameBoxLogo"),
        (() => {
            const result: string[] = [];

            if(props.game.metadata.customAttributes?.CanRunOffline?.value == "true") {
                result.push("Can run offline");
            };

            if(props.game.metadata.customAttributes.CloudSaveFolder) {
                result.push("Cloud save");
            }

            return result;
        })()
    ], [props.game.metadata.keyImages]);

    return (
        <Card
            {...props}
            sx={{
                position: "relative",
                ...props.sx,
                aspectRatio: (3 / 4).toString(),
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
                        {badges.map((badge) => (
                            <Grid item>
                                <Chip label={badge} />
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Box>
        </Card>
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

export default GameCard;