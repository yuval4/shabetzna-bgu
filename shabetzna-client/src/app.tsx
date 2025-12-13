import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ReactGA from 'react-ga4';
import OneSignal from 'react-onesignal';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TrackPosthogPageView from "./components/track-posthog-page-view";
import { TeamProvider } from "./context/team-context";
import { TimeRangeViewProvider } from "./context/time-range-view-context";
import { UserProvider } from "./context/user-context";
import Layout from "./layout";
import Page404 from "./sceens/error/404";
import GeneralError from "./sceens/error/general-error";
import Unauthorized from "./sceens/error/unauthorized";
import LoginScreen from "./sceens/login";
import LocalLoginScreen from "./sceens/login/local-login";
import { ENV } from "./shared/consts";
import { booleanValue } from "./shared/format/boolean-value";
import ProtectedRoute from "./shared/routes/protected-route";
import { pages } from "./shared/routes/routes";
import theme from "./shared/theme";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: Infinity,
    },
  },
});

const App = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      OneSignal.init({
        appId: import.meta.env.VITE_ONE_SIGNAL_APP_ID,
        notifyButton: {
          enable: true,
        },
        allowLocalhostAsSecureOrigin: import.meta.env.VITE_ENV === ENV.LOCAL
      });
    }
  }, []);


  if (import.meta.env.VITE_ENV === ENV.PRODUCTION && import.meta.env.VITE_GA_TRACKING_ID) {
    ReactGA.initialize(import.meta.env.VITE_GA_TRACKING_ID);
  }

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--mui-primary-main", theme.palette.primary.main);
    root.style.setProperty(
      "--mui-secondary-main",
      theme.palette.secondary.main
    );
    root.style.setProperty("--mui-grey-A200", theme.palette.grey["A200"]);
    root.style.setProperty("--mui-grey-A400", theme.palette.grey["A400"]);
    root.style.setProperty("--mui-grey-A700", theme.palette.grey["A700"]);
    root.style.setProperty("--mui-grey-50", theme.palette.grey["50"]);
    root.style.setProperty("--mui-grey-100", theme.palette.grey["100"]);
  }, [theme]);

  const cache = createCache({
    key: "material-ui-rtl",
  });

  const Login = booleanValue(import.meta.env.VITE_USE_GOOGLE_AUTH) === true ? LoginScreen : LocalLoginScreen;

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary fallback={<GeneralError />}>
          <QueryClientProvider client={queryClient}>
            <UserProvider>
              <TeamProvider>
                <TimeRangeViewProvider>
                  <BrowserRouter>
                    <TrackPosthogPageView />
                    <Routes>
                      <Route path="login" element={<Login />} />
                      <Route path="/" element={<Layout />}>
                        {pages.map((page) => (
                          <Route
                            key={page.name}
                            path={page.path}
                            element={
                              <ProtectedRoute>{page.element}</ProtectedRoute>
                            }
                          />
                        ))}
                      </Route>
                      <Route path="unauthorized" element={<Unauthorized />} />
                      <Route path="error" element={<GeneralError />} />
                      <Route path="*" element={<Page404 />} />
                    </Routes>
                  </BrowserRouter>
                </TimeRangeViewProvider>
              </TeamProvider>
            </UserProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;
