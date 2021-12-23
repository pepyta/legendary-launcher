import { Grid, GridProps } from "@mui/material";

export type HorizontalCenterProps = GridProps;

const HorizontalCenter = (props: HorizontalCenterProps) => {
    return (
        <Grid container justifyContent={"center"} {...props} sx={{ minWidth: "center", ...props.sx}}>
            <Grid item>
                {props.children}
            </Grid>
        </Grid>
    );
};

export default HorizontalCenter;