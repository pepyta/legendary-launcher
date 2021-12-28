import { IGameData } from "@lib/legendary/LegendaryLibrary";
import { Card, CardActionArea, CardProps, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import VerticalCenter from "@components/misc/VerticalCenter";
import { Fragment, memo, PureComponent, useEffect, useMemo } from "react";
import { GameElement } from "renderer/redux/library";
import Image from "@components/misc/Image";

export type GameCardProps = {
    game: GameElement;
    onOpenDialog: () => void;
} & CardProps;

class GameCard extends PureComponent<GameCardProps> {
    render() {
        return (
            <Fragment>
                <Card
                    {...this.props}
                    style={{
                        filter: !this.props.game.installation && "grayscale(1)",
                    }}
                    sx={{
                        position: "relative",
                        ...this.props.sx,
                        aspectRatio: "0.75",
                    }}
                >
                    <CardActionArea
                        onClick={async () => this.props.onOpenDialog()}
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
                        <Background game={this.props.game} />
                        <Logo game={this.props.game} />
                        <InfoCard game={this.props.game.overview} />
                    </CardActionArea>
                </Card>
            </Fragment>
        );
    }
};

const Background = (props: { game: GameElement }) => {
    const background = useMemo(
        () => props.game.overview.metadata.keyImages.find((e) => e.type === "DieselGameBoxTall"),
        [props.game.overview.metadata.keyImages]
    );

    return (
        <Image
            src={`${background?.url}?h=348&resize=1&w=261`}
            height={"100%"}
            style={{
                position: "absolute",
                height: "100%",
                width: "auto",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
            }}
        />
    );
};

const Logo = (props: { game: GameElement }) => {
    const logo = useMemo(
        () => props.game.overview.metadata.keyImages.find((el) => el.type === "DieselGameBoxLogo"),
        [props.game.overview.metadata.keyImages],
    );

    if (!logo) {
        return <Fragment />;
    }

    return (
        <Box
            className={"logo-box"}
            sx={{
                position: "absolute",
                transition: "opacity .4s cubic-bezier(0.075, 0.82, 0.165, 1)",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                maxWidth: "100%",
                maxHeight: "100%",
            }}
        >
            <VerticalCenter sx={{ p: 4 }}>
                <Image
                    src={`${logo.url}?resize=1&w=320`}
                    loading="lazy"
                    style={{
                        maxWidth: "100%"
                    }}
                />
            </VerticalCenter>
        </Box>
    );
}

const InfoCard = (props: { game: IGameData }) => (
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
        </Paper>
    </Box>
);

export default memo(GameCard);