import { useStorage } from 'src/storage/hooks/useStorage';
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
import { useNavigate } from 'react-router';

export const MenuView = (): React.JSX.Element => {
	const { send } = useServerRequest();
	const navigate = useNavigate();
	const [, setState] = useStorage();
	const t = useT();

	const onCreateGameClick = () => {
		send('CREATE_GAME', undefined, ({ code }) => {
			setState((prev) => {
				prev.general = {
					...prev.general,
					state: 'LOBBY',
					code,
				};

				return prev;
			});

			localStorage.setItem('code', code);

			navigate('/lobby/' + code, {
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
					<Input placeholder={t('menu.gameCodePlaceholder')} width="180px" />
					<Button minWidth="180px">{t('menu.buttons.joinGame')}</Button>
				</StyledJoinOptionContainer>
			</StyledOptionsContainer>
		</StyledContainer>
	);
};
