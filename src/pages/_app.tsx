import { type AppType } from 'next/app';

import Head from 'next/head';

import { MantineProvider } from '@mantine/core';
import { NavigationProgress } from '@mantine/nprogress';

import { api } from '../utils/api';

import '../styles/globals.css';

const TodoistApp: AppType = ({ Component, pageProps }) => {
    return (
        <>
            <Head>
                <title>Todoist</title>
                <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
            </Head>

            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    colorScheme: 'dark'
                }}
            >
                <Component {...pageProps} />
            </MantineProvider>
        </>
    );
};

export default api.withTRPC(TodoistApp);
