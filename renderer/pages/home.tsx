import React, { Fragment } from 'react';
import AppBar from '@components/misc/AppBar';
import { Box, Card, CardContent, Container, Grid, Paper, Tooltip, Typography, useTheme } from '@mui/material';
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
                                            <Tooltip title={el.overview.app_title} key={`quick-launch-${el.overview.app_name}`}>
                                        <Grid item xs={2}>
                                                <GameIcon
                                                    game={el}
                                                />
                                        </Grid>
                                            </Tooltip>
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
