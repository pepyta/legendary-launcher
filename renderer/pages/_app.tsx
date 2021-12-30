
import UserProvider from "@components/providers/UserProvider";
import { CssBaseline } from "@mui/material";
import { AppProps } from "next/app";
import { SnackbarProvider } from "notistack";
import Head from "next/head";
import { Provider } from "react-redux";
import store from "../redux/store";
import { useEffect } from "react";
import LegendaryLibrary from "@lib/legendary/LegendaryLibrary";
import ThemeProvider from "@components/providers/ThemeProvider";

const App = ({ Component, pageProps }: AppProps) => {
    useEffect(() => {
        LegendaryLibrary.getAll();
    }, []);

    return (
        <Provider store={store}>
            <ThemeProvider>
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