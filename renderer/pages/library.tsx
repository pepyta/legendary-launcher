import { Box, Grid, useTheme } from "@mui/material";
import dynamic from "next/dynamic";
import { useAppSelector } from "renderer/redux/hooks";

const GameCard = dynamic(() => import("@components/games/GameCard"));

const toInt = (a: boolean): number => a ? 1 : 0

const LibraryPage = () => {
    const { games } = useAppSelector(({ library }) => library);
    const theme = useTheme();

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
                {([...(games || [])])
                    .sort((a, b) => toInt(!!b.installation) - toInt(!!a.installation))
                    .map((game) => (
                        <Grid
                            item
                            xs={6} sm={4} md={3} lg={2}
                            key={`game-card-${game.overview.metadata.id}`}
                        >
                            <GameCard game={game} />
                        </Grid>
                    ))
                }
            </Grid>
        </Box>
    );
};

export default LibraryPage;