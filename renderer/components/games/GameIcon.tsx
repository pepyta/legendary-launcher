import Image from "@components/misc/Image";
import { Box, BoxProps, useTheme } from "@mui/material";
import { memo, useMemo } from "react";
import { GameElement } from "renderer/redux/library";

export type GameIconProps = {
    game: GameElement;
} & BoxProps;

const GameIcon = (props: GameIconProps) => {
    const theme = useTheme();
    const logo = useMemo(
        () => (
            props.game.overview.metadata.keyImages.find((el) => el.type === "DieselGameBoxLogo") &&
            <Logo url={props.game.overview.metadata.keyImages.find((el) => el.type === "DieselGameBoxLogo")?.url} />
        ),
        [props.game]
    );

    const background = useMemo(
        () => (
            <Image
                src={
                    (
                        props.game.overview.metadata.keyImages.find((el) => el.type === "DieselGameBoxTall")
                    ).url
                }
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
            />
        ),
        [props.game],
    );
    
    return (
        <Box
            {...props}
            sx={{
                position: "relative",
                overflow: "hidden",
                aspectRatio: "1",
                borderRadius: theme.shape.borderRadius,
                userSelect: "none",
                ...props.sx,
            }}
        >
            {background}
            {logo}
        </Box>
    );
};

const Logo = (props: { url: string }) => (
    <Image
        src={props.url}
        style={{
            position: "absolute",
            maxWidth: "100%",
            maxHeight: "100%",
            left: 0,
            top: 0,
            right: 0,
            padding: 8,
            bottom: 0,
            marginTop: "auto",
            marginBottom: "auto",
            marginLeft: "auto",
            marginRight: "auto",
        }}
    />
);

export default memo(GameIcon, (prev, props) => prev.game.overview.app_name === props.game.overview.app_name);