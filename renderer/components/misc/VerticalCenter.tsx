import { Grid, GridProps } from "@mui/material";

export type VerticalCenterProps = GridProps;

const VerticalCenter = (props: VerticalCenterProps) => {
    return (
        <Grid container alignItems={"center"} {...props} sx={{ minHeight: "100%", ...props?.sx }} >
            <Grid item>
                {props.children}
            </Grid>
        </Grid>
    );
};

export default VerticalCenter;