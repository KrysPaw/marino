import { BrowserRouter } from 'react-router';
import { ThemeProvider } from 'styled-components';
import useLocalStorage from 'use-local-storage';
import { Header } from './components/Header/Header';
import { localStorageOptions } from './config/localStorageOptions';
import { theme } from './config/theme';
import { UseHandleServerRequest } from './hooks/useHandleServerRequest';
import { Router } from './Router';
import { TyranClient } from './services/tyran-client/tyran-client';
import {
	SidePanel,
	StyledMainLayout,
	StyledPageContent,
} from './styled/MainLayout.styled';
import { Viewport } from './views/Viewport/Viewport';

const App = () => {
	TyranClient.getInstance();
	const [, setLobbyId] = useLocalStorage('lobbyId', '', localStorageOptions);
	const [, setClientId] = useLocalStorage('clientId', '', localStorageOptions);
	const [, setNickname] = useLocalStorage('nickname', '', localStorageOptions);

	UseHandleServerRequest('DEV_MODE_STATE_UPDATE', (payload) => {
		window.postMessage({
			source: 'marino',
			type: 'serverStorageUpdate',
			data: payload,
		});
	});

	UseHandleServerRequest('CLIENT_INFO', (payload) => {
		const { clientId, nickname, lobbyId } = payload;

		setClientId(clientId);
		setNickname(nickname || '');
		setLobbyId(lobbyId || '');
	});

	return (
		<ThemeProvider theme={theme}>
			<StyledMainLayout>
				<SidePanel />
				<StyledPageContent>
					<Viewport>
						<Header />
						<BrowserRouter>
							<Router />
						</BrowserRouter>
					</Viewport>
				</StyledPageContent>
			</StyledMainLayout>
		</ThemeProvider>
	);
};

export default App;
