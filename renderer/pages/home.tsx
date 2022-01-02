import React, { Fragment, useState } from 'react';
import AppBar from '@components/misc/AppBar';
import { Box, ButtonBase, Card, CardContent, Container, Grid, Tooltip, Typography, useTheme } from '@mui/material';
import { useUser } from '@components/providers/UserProvider';
import { useAppSelector } from 'renderer/redux/hooks';
import GameIcon from '@components/games/GameIcon';
import { GameElement } from 'renderer/redux/library';
import LegendaryLibrary from '@lib/legendary/LegendaryLibrary';

const HomePage = () => {
    const { user } = useUser();
    const [launching, setLaunching] = useState<GameElement>();
    const theme = useTheme();
    const { games } = useAppSelector(({ library }) => library);

    const launch = async (game: GameElement) => {
        setLaunching(game);
        try {
            await LegendaryLibrary.launch({
                appName: game.overview.app_name,
            });
        } catch(e) {
            console.error(e);
        }
        
        setLaunching(null);
    };

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
                                                <ButtonBase
                                                    sx={{ borderRadius: theme.shape.borderRadius }}
                                                    onClick={() => launch(el)}
                                                    disabled={!!launching}
                                                >
                                                    <GameIcon
                                                        game={el}
                                                        disabled={!!launching}
                                                        loading={el === launching}
                                                    />
                                                </ButtonBase>
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
