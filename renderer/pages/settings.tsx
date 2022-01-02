import { Card, Container, Grid, List, ListItem, ListItemText, ListSubheader, Switch } from "@mui/material";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "renderer/redux/hooks";
import { setTheme } from "renderer/redux/theme";
import UpdaterCard from "@components/auto-updater/UpdaterCard";

const SettingsPage = () => {
    const dispatch = useAppDispatch();
    const { darkMode } = useAppSelector(({ theme }) => theme);

    const categories = useMemo(
        () => [
            {
                name: "Display settings",
                options: [
                    {
                        name: "Dark mode",
                        type: "switch",
                        onChange: (e, checked: boolean) => dispatch(setTheme(checked ? "dark" : "light")),
                        checked: darkMode
                    }
                ]
            }
        ],
        [darkMode],
    );

    return (
        <Container maxWidth={"sm"}>
            <Grid container spacing={2} sx={{ pt: 6 }}>
                {categories.map((category) => (
                    <Grid item xs={12}>
                        <Card>
                            <List
                                subheader={(
                                    <ListSubheader sx={{ background: "transparent" }}>
                                        {category.name}
                                    </ListSubheader>
                                )}
                            >
                                {category.options.map((option) => (
                                    <ListItem>
                                        <ListItemText
                                            id={"switch-dark-mode"}
                                            primary={"Dark mode"}
                                        />
                                        <Switch
                                            edge="end"
                                            onChange={option.onChange}
                                            checked={option.checked}
                                            inputProps={{
                                                'aria-labelledby': 'switch-list-label-wifi',
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Card>
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <UpdaterCard />
                </Grid>
            </Grid>
        </Container>
    );
};

export default SettingsPage;