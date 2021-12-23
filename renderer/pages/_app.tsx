import LibraryProvider from "@components/providers/LibraryProvider";
import UserProvider from "@components/providers/UserProvider";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { AppProps } from "next/app";
import Head from "next/head";
import { SnackbarProvider } from "notistack";
import "../public/css/global.css";

const theme = createTheme({
    palette: {
        mode: "dark",
    },
});

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider>
                <UserProvider>
                    <LibraryProvider>
                        <Component {...pageProps} />
                    </LibraryProvider>
                </UserProvider>
            </SnackbarProvider>
        </ThemeProvider>
    );
};

export default App;