import { Paper, PaperProps, useTheme } from "@mui/material";

export type KeyboardShortcutProps = PaperProps;

const KeyboardShortcut = (props: KeyboardShortcutProps) => {
    const theme = useTheme();

    return (
        <Paper
            elevation={0}
            {...props}
            sx={{
                ...props.sx,
                border: `1px solid ${theme.palette.background.paper}`,
                padding: "0px 7px",
                fontSize: "12px !important",
                pointerEvents: "none",
                fontWeight: 700,
                lineHeight: "21px",
                borderRadius: "5px",
            }}
        />
    );
};

export default KeyboardShortcut;