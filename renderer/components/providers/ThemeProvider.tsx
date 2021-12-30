import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { ThemeProviderProps } from "@mui/system";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "renderer/redux/hooks";
import { loadTheme } from "renderer/redux/theme";

const lightTheme = createTheme({
    palette: {
        mode: "light",
    },
});

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const ThemeProvider = (props: Omit<ThemeProviderProps, "theme">) => {
    const { darkMode } = useAppSelector(({ theme }) => theme);
    const dispatch = useAppDispatch();

    const theme = darkMode ? darkTheme : lightTheme;

    useEffect(() => {
        dispatch(loadTheme());
    }, []);

    return (
        <MuiThemeProvider {...props} theme={theme} />
    );
};

export default ThemeProvider;