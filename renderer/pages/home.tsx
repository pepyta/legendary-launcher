import React, { Fragment } from 'react';
import AppBar from '@components/misc/AppBar';
import { Box, Card, CardContent, Container, Grid, Paper, Typography, useTheme } from '@mui/material';
import { useUser } from '@components/providers/UserProvider';
import { useAppSelector } from 'renderer/redux/hooks';
import Image from '@components/misc/Image';
import UpdaterCard from '@components/auto-updater/UpdaterCard';
import GameIcon from '@components/games/GameIcon';

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
                                            <GameIcon
                                                game={el}
                                            />
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
