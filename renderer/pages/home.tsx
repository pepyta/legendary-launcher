import React, { Fragment } from 'react';
import AppBar from '@components/misc/AppBar';
import { Box, Card, CardContent, Container, Grid, Paper, Typography, useTheme } from '@mui/material';
import { useUser } from '@components/providers/UserProvider';
import { useAppSelector } from 'renderer/redux/hooks';
import Image from '@components/misc/Image';
import UpdaterCard from '@components/auto-updater/UpdaterCard';

const HomePage = () => {
    const { user } = useUser();
    const { games } = useAppSelector(({ library }) => library);
    const theme = useTheme()

    return (
        <Fragment>
            <AppBar />
            <Container maxWidth={"sm"}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant={"h6"}>
                            Hello, {user.displayName}!
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant={"h5"} gutterBottom>
                                    Quick launch
                                </Typography>
                                <Grid container spacing={1}>
                                    {games?.filter((el) => !!el.installation).map((el) => (
                                        <Grid item xs={2} key={`quick-launch-${el.overview.app_name}`}>
                                            <Paper
                                                sx={{
                                                    aspectRatio: "1",
                                                    overflow: "hidden",
                                                    transition: "all .5s ease-in-out",
                                                    borderRadius: theme.shape.borderRadius,
                                                    boxShadow: theme.shadows[4],
                                                    "&:hover": {
                                                        boxShadow: theme.shadows[8],
                                                    },
                                                }}
                                            >
                                                <Image
                                                    src={el.overview.metadata.keyImages.find((el) => el.type === "DieselGameBoxTall").url}
                                                    style={{
                                                        maxWidth: "100%",
                                                    }}
                                                />
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                </Grid>
            </Container>
        </Fragment>
    );
};

export default HomePage;
