import '../styles/globals.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import type { AppProps } from 'next/app'
import { Layout } from '../components/layout';
import { ThemeProvider } from '@mui/material/styles';
import { theme1 } from '../settings/theme';
import { AlertProvider, AuthProvider } from '../contexts';
import { LoadingProvider } from '../contexts';
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={true} />
      <AuthProvider>
        <ThemeProvider theme={theme1}>
          <LoadingProvider>
            <AlertProvider>
              <Layout>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                 <Component {...pageProps} />
              </LocalizationProvider>
              </Layout>
            </AlertProvider>
          </LoadingProvider>
        </ThemeProvider>
      </AuthProvider>

    </QueryClientProvider>

  )

}

export default MyApp
