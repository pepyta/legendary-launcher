
import UserProvider from "@components/providers/UserProvider";
import { CssBaseline, NoSsr } from "@mui/material";
import { AppProps } from "next/app";
import { SnackbarProvider } from "notistack";
import Head from "next/head";
import { Provider } from "react-redux";
import store from "../redux/store";
import ThemeProvider from "@components/providers/ThemeProvider";

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <Provider store={store}>
            <ThemeProvider>
                <CssBaseline />
                <Head>
                    <link rel="stylesheet" href="/css/global.css" />
                </Head>
                <SnackbarProvider>
                    <NoSsr>
                        <UserProvider>
                            <Component {...pageProps} />
                        </UserProvider>
                    </NoSsr>
                </SnackbarProvider>
            </ThemeProvider>
        </Provider>
    );
};

export default App;