import GameDialog from "@components/games/GameDialog";
import LargeList from "@components/misc/LargeList";
import { Box, CircularProgress, Grid, Paper, Portal, useTheme } from "@mui/material";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useAppSelector } from "renderer/redux/hooks";
import { GameElement } from "renderer/redux/library";

const GameCard = dynamic(() => import("@components/games/GameCard"));

const toInt = (a: boolean): number => a ? 1 : 0

const LibraryPage = () => {
    const { games } = useAppSelector(({ library }) => library);
    const theme = useTheme();
    const [selectedGame, setSelectedGame] = useState<GameElement>();

    const memoizedList = useMemo(
        () => (
            <LargeList key={"large-list-library"}>
                    {([...(games || [])])
                        .sort((a, b) => toInt(!!b.installation) - toInt(!!a.installation))
                        .map((game) => (
                            <Grid
                                item
                                xs={6} sm={4} md={3} lg={2}
                                key={`game-card-${game.overview.metadata.id}`}
                            >
                                <GameCard game={game} onOpenDialog={() => setSelectedGame(game)} />
                            </Grid>
                        ))
                    }
                </LargeList>
        ), 
        [games]
    );

    return (
        <Box>
            <Grid
                container
                spacing={2}
                sx={{
                    p: 4,
                    maxHeight: "calc(100vh - 28px)",
                    overflowY: "scroll",
                    willChange: "transform",
                    marginTop: "28px",
                }}
            >
                <GameDialog
                    open={!!selectedGame}
                    onClose={() => setSelectedGame(null)}
                    game={selectedGame}
                />
                {memoizedList}
            </Grid>
        </Box>
    );
};

export default LibraryPage;