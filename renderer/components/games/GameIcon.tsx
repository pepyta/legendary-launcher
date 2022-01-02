import Image from "@components/misc/Image";
import { Box, BoxProps, CircularProgress, useTheme } from "@mui/material";
import { memo, useMemo } from "react";
import { GameElement } from "renderer/redux/library";

export type GameIconProps = {
    game: GameElement;
    loading?: boolean;
    disabled?: boolean;
} & BoxProps;

const GameIcon = (props: GameIconProps) => {
    const theme = useTheme();
    const logo = useMemo(
        () => (
            props.game.overview.metadata.keyImages.find((el) => el.type === "DieselGameBoxLogo") &&
            <Logo url={props.game.overview.metadata.keyImages.find((el) => el.type === "DieselGameBoxLogo")?.url} disabled={props.disabled} />
        ),
        [props.game, props.disabled]
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
                    transition: ".5s all ease-out",
                    filter: (props.loading || props.disabled) && "grayscale(1) brightness(30%)",
                }}
            />
        ),
        [props.game, props.loading, props.disabled],
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
            {props.loading ? (
                <CircularProgress
                    sx={{
                        position: "absolute",
                        maxWidth: "100%",
                        maxHeight: "100%",
                        left: 0,
                        top: 0,
                        right: 0,
                        p: 1,
                        bottom: 0,
                        marginTop: "auto",
                        marginBottom: "auto",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                />
            ) : logo}
        </Box>
    );
};

const Logo = (props: { url: string, disabled: boolean }) => (
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
            filter: props.disabled && "grayscale(1) brightness(30%)",
            marginLeft: "auto",
            marginRight: "auto",
        }}
    />
);

export default memo(GameIcon);