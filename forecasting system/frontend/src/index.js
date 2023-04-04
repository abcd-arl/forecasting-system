import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<CookiesProvider>
				<MantineProvider withGlobalStyles withNormalizeCSS>
					<ModalsProvider>
						<NotificationsProvider>
							<QueryClientProvider client={queryClient}>
								<App />
							</QueryClientProvider>
						</NotificationsProvider>
					</ModalsProvider>
				</MantineProvider>
			</CookiesProvider>
		</BrowserRouter>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
