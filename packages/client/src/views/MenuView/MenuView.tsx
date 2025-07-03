import { useState } from 'react';
import { useNavigate } from 'react-router';
import { localStorageOptions } from 'src/config/localStorageOptions';
import { useStorage } from 'src/storage/hooks/useStorage';
import useLocalStorage from 'use-local-storage';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { useServerRequest } from '../../hooks/useServerRequest';
import { useT } from '../../hooks/useT';
import {
	StyledContainer,
	StyledDescription,
	StyledJoinOptionContainer,
	StyledOptionsContainer,
} from './MenuView.styled';

export const MenuView = (): React.JSX.Element => {
	const { send } = useServerRequest();
	const [enteredCode, setEnteredCode] = useState('');
	const [, setCode] = useLocalStorage('code', '', localStorageOptions);
	const navigate = useNavigate();
	const [, setState] = useStorage();
	const t = useT();

	const onCreateGameClick = () => {
		send('CREATE_LOBBY', undefined, (lobbyInfo) => {
			setState((prev) => {
				prev.general = {
					...prev.general,
					state: 'LOBBY',
					code: lobbyInfo.code,
				};

				prev.lobby = lobbyInfo;
			});

			setCode(lobbyInfo.code);

			navigate(`/lobby/${lobbyInfo.code}`, {
				replace: true,
			});
		});
	};

	const onJoinGameClick = () => {
		send('JOIN_LOBBY', { code: enteredCode }, (response) => {
			if (response.status === 'ERROR') {
				return;
			}

			setState((prev) => {
				prev.general = {
					...prev.general,
					state: 'LOBBY',
					code: response.data.code,
				};

				prev.lobby = response.data;
			});

			setCode(response.data.code);

			navigate(`/lobby/${response.data.code}`, {
				replace: true,
			});
		});
	};

	return (
		<StyledContainer>
			<StyledDescription>{t('menu.description')}</StyledDescription>
			<StyledOptionsContainer>
				<div style={{ alignSelf: 'flex-end' }}>
					<Button minWidth="180px" onClick={onCreateGameClick}>
						{t('menu.buttons.createGame')}
					</Button>
				</div>
				<StyledJoinOptionContainer>
					<Input
						value={enteredCode}
						onChange={(e) => setEnteredCode(e.target.value)}
						placeholder={t('menu.gameCodePlaceholder')}
						width="180px"
					/>
					<Button
						onClick={onJoinGameClick}
						state={enteredCode.length < 6 ? 'disabled' : 'default'}
						minWidth="180px"
					>
						{t('menu.buttons.joinGame')}
					</Button>
				</StyledJoinOptionContainer>
			</StyledOptionsContainer>
		</StyledContainer>
	);
};
