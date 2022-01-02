import { KeyboardRounded as KeyboardIcon, SearchOffRounded as NotFoundIcon, SearchRounded as SearchIcon } from "@mui/icons-material";
import { Box, Button, Dialog, Grid, InputAdornment, InputBase, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography, useTheme } from "@mui/material";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "renderer/redux/hooks";
import { Index } from "flexsearch";
import { GameElement } from "renderer/redux/library";
import Image from "@components/misc/Image";
import KeyboardShortcut from "@components/misc/KeyboardShortcut";
import { useHotkeys } from "react-hotkeys-hook";
import GameIcon from "./GameIcon";

export type SearchBarProps = {
    onSelect: (game: GameElement) => void;
};

const SearchBar = (props: SearchBarProps) => {
    const [results, setResults] = useState<GameElement[]>([]);
    const [open, setOpen] = useState(false);
    const { games } = useAppSelector(({ library }) => library);
    const [search, setSearch] = useState("");
    const theme = useTheme();
    useHotkeys('ctrl+k', () => setOpen(true));

    const [worker, map] = useMemo(() => {
        // todo: move to worker with @koale/useworker
        const worker = new Index({
            preset: "score",
            tokenize: "forward",
        });

        const map = new Map<string, GameElement>();

        games?.forEach((game) => {
            worker.add(game.overview.app_name, `${game.overview.app_title} ${game.overview.metadata.developer}`);
            map.set(game.overview.app_name, game);
        });

        return [worker, map];
    }, [games]);

    useEffect(() => {
        // ignored becuase we are using strings and the id field enables us to use number 
        // @ts-ignore
        worker.searchAsync(search, 5).then((result) => setResults(result.map(el => map.get(el))));
    }, [games, worker, search]);

    return (
        <Fragment>
            <Paper sx={{
                width: 300,
                mr: "auto",
                ml: "auto",
            }}>

                <Button
                    fullWidth
                    startIcon={
                        <SearchIcon />
                    }
                    onClick={() => setOpen(true)}
                    sx={{
                        height: 48,
                        pr: 2,
                        pl: 2,
                        color: theme.palette.getContrastText(theme.palette.background.paper),
                    }}
                    endIcon={
                        <KeyboardShortcut>
                            CTRL + K
                        </KeyboardShortcut>
                    }
                >
                    <Box sx={{
                        textAlign: "left",
                        flexGrow: 1,
                        textTransform: "none",
                    }}>
                        Search...
                    </Box>
                </Button>
            </Paper>
            <Dialog
                maxWidth={"xs"}
                fullWidth
                open={open}
                onClose={() => setOpen(false)}
            >
                <InputBase
                    autoFocus
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    startAdornment={(
                        <InputAdornment position="end" sx={{ mr: 2 }}>
                            <SearchIcon />
                        </InputAdornment>
                    )}
                    endAdornment={(
                        <InputAdornment position="end" sx={{ mr: 1 }}>
                            <KeyboardShortcut>
                                ESC
                            </KeyboardShortcut>
                        </InputAdornment>
                    )}
                    sx={{
                        height: 56,
                        p: 1,
                    }}
                    placeholder="Search..."
                    fullWidth
                />
                <Box sx={{
                    height: results.length > 0 ? results.length * 80 + 16 : 130,
                    overflow: "hidden",
                    transition: "height .1s ease-in-out"
                }}>
                    {results.length > 0 ? (
                        <List>
                            {results.map((el) => (
                                <ListItem button onClick={() => {
                                    setOpen(false);
                                    props.onSelect(el);
                                }}>
                                    <ListItemAvatar sx={{
                                        overflow: "hidden",
                                        width: 64,
                                        height: 64,
                                        boxShadow: theme.shadows[4],
                                        borderRadius: theme.shape.borderRadius,
                                        mr: 2,
                                    }}>
                                        <GameIcon
                                            game={el}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography noWrap>
                                                {el.overview.app_title}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography sx={{ color: theme.palette.grey[400] }} variant={"body2"} noWrap>
                                                {el.overview.metadata.developer}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : search.length === 0 ? (

                        <Grid container sx={{ p: 4 }}>
                            <Grid item xs={12} textAlign={"center"}>
                                <KeyboardIcon fontSize={"large"} />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography align="center">
                                    Start typing to see the results!
                                </Typography>
                            </Grid>
                        </Grid>
                    ) : (

                        <Grid container sx={{ p: 4 }}>
                            <Grid item xs={12} textAlign={"center"}>
                                <NotFoundIcon fontSize={"large"} />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography align="center">
                                    Nothing found!
                                </Typography>
                            </Grid>
                        </Grid>
                    )}
                </Box>
            </Dialog>
        </Fragment>
    );
};

export default SearchBar;