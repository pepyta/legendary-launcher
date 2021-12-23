import AppBar from "@components/misc/AppBar";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Card, CardContent, Grid, Typography, useTheme } from "@mui/material";
import { ExitToAppRounded as LoginIcon } from "@mui/icons-material";
import { Fragment, useState } from "react";
import LegendaryUser from "@lib/legendary/LegendaryUser";
import { useUser } from "@components/providers/UserProvider";
import { useSnackbar } from "notistack";
import VerticalCenter from "@components/misc/VerticalCenter";
import HorizontalCenter from "@components/misc/HorizontalCenter";

const AuthPage = () => {
    const { setUser } = useUser();
    const [disabled, setDisabled] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();

    const login = async () => {
        try {
            setDisabled(true);
            setUser(await LegendaryUser.login());
            enqueueSnackbar("Successful authentication!", {
                variant: "success",
            });
        } catch (e) {
            setDisabled(false);
            enqueueSnackbar(e?.message, {
                variant: "error",
            });
        }
    };

    return (
        <Fragment>
            <AppBar
                position={"fixed"}
            />
            <Grid container sx={{ minHeight: "100vh" }}>
                <Background />
                <Grid
                    item
                    xs={12}
                    sm={6}
                    sx={{
                        paddingTop: "48px",
                        backgroundColor: theme.palette.background.default,
                    }}
                >
                    <HorizontalCenter sx={{ minHeight: "100%" }}>
                        <VerticalCenter>
                            <Grid
                                container
                                spacing={2}
                                sx={{
                                    maxWidth: 450,
                                    minHeight: "100%",
                                    p: 4,
                                    textAlign: "center",
                                }}
                            >
                                <Grid item xs={12}>
                                    <Typography variant={"h5"} gutterBottom>
                                        Welcome to the<br /><b>Legendary Launcher</b>
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography gutterBottom>
                                        It is an open-source alternative launcher for the Epic Games Store.
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <LoadingButton
                                        loading={disabled}
                                        loadingPosition="start"
                                        startIcon={<LoginIcon />}
                                        onClick={login}
                                        size={"large"}
                                        color={"primary"}
                                        variant={"contained"}
                                        sx={{
                                            mt: 4,
                                        }}
                                    >
                                        Log in via browser
                                    </LoadingButton>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant={"caption"} gutterBottom align={"center"}>
                                        We are not storing any of your information on a server. All your data stays on your computer and on Epic Games' servers.
                                    </Typography>
                                </Grid>
                            </Grid>
                        </VerticalCenter>
                    </HorizontalCenter>
                </Grid>
            </Grid>
        </Fragment>
    );
};

const Background = () => {
    const theme = useTheme();

    return (
        <Grid
            item
            xs={false}
            sm={6}
            style={{
                backgroundRepeat: "no-repeat",
                backgroundImage: `url("/images/login-background.jpg")`,
                backgroundSize: "cover",
            }}
        >
            <Box
                sx={{
                    float: "right",
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, ${theme.palette.background.default} 100%);`,
                }}
            />
        </Grid>
    );
}

export default AuthPage;