import GameCard from "@components/games/GameCard";
import { useLibrary } from "@components/providers/LibraryProvider";
import { Box, Grid } from "@mui/material";

const LibraryPage = () => {
    const { games } = useLibrary();

    console.log(games);

    return (
        <Box sx={{
            paddingTop: "28px"
        }}>
            <Grid container spacing={2} sx={{ p: 4 }}>
                {games?.map((game) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={`game-card-${game.metadata.id}`}>
                        <GameCard game={game} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default LibraryPage;