import { useNavigate } from 'react-router';
import { Button } from 'src/components/Button/Button';
import { useT } from 'src/hooks/useT';
import { TyranClient } from 'src/services/tyran-client/tyran-client';
import {
	StyledButtonsContainer,
	StyledContainer,
	StyledTitle,
} from './NoConnectionErrorView.styled';

export const NoConnectionErrorView = (): React.JSX.Element => {
	const navigate = useNavigate();
	const t = useT();

	const onReconnectClick = () => {
		TyranClient.getInstance().connect();
		navigate('/', { replace: true });
	};

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
