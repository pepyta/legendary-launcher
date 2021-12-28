
import UserProvider from "@components/providers/UserProvider";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { AppProps } from "next/app";
import { SnackbarProvider } from "notistack";
import Head from "next/head";
import { Provider } from "react-redux";
import store from "../redux/store";
import { useEffect } from "react";
import LegendaryLibrary from "@lib/legendary/LegendaryLibrary";

const theme = createTheme({
    palette: {
        mode: "dark",
    },
});

const App = ({ Component, pageProps }: AppProps) => {
    useEffect(() => {
        LegendaryLibrary.getAll();
    }, []);

    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Head>
                    <link rel="stylesheet" href="/css/global.css" />
                </Head>
                <SnackbarProvider>
                    <UserProvider>
                        <Component {...pageProps} />
                    </UserProvider>
                </SnackbarProvider>
            </ThemeProvider>
        </Provider>
    );
};

export default App;