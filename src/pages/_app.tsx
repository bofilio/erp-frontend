import '../styles/globals.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import type { AppProps } from 'next/app'
import { Layout } from '../components/layout';
import { ThemeProvider } from '@mui/material/styles';
import { theme1 } from '../settings/theme';
import { AlertProvider, AuthProvider, CurrentAppProvider } from '../contexts';
import { LoadingProvider } from '../contexts';
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { AuthenticatedGuard } from '../components/guards';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
    },

  },
})

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <AuthProvider>
        <AuthenticatedGuard>
          <ThemeProvider theme={theme1}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <LoadingProvider>
                <AlertProvider>
                  <CurrentAppProvider>
                    <Layout>
                    <Component {...pageProps} />
                  </Layout>
                  </CurrentAppProvider>
                </AlertProvider>
              </LoadingProvider>
            </LocalizationProvider>
          </ThemeProvider>
        </AuthenticatedGuard>
      </AuthProvider>

    </QueryClientProvider>

  )

}

export default MyApp
