import { Button } from 'src/components/Button/Button';
import {
	StyledButtonsContainer,
	StyledContainer,
	StyledTitle,
} from './NoConnectionErrorView.styled';
import { TyranClient } from 'src/services/tyran-client/tyran-client';
import { useNavigate } from 'react-router';
import { useStorage } from 'src/storage/hooks/useStorage';
import { useT } from 'src/hooks/useT';
import { useEffect } from 'react';

export const NoConnectionErrorView = (): React.JSX.Element => {
	const [state] = useStorage();
	const navigate = useNavigate();
	const t = useT();

	const onReconnectClick = () => {
		TyranClient.getInstance().connect();
	};

	useEffect(() => {
		if (state.general.connected) {
			navigate('/');
		}
	}, [state.general.connected]);

	return (
		<StyledContainer>
			<StyledTitle>{t('noConnection.title')}</StyledTitle>
			<StyledButtonsContainer>
				<Button onClick={onReconnectClick}>
					{t('noConnection.reconnectButton')}
				</Button>
			</StyledButtonsContainer>
		</StyledContainer>
	);
};
