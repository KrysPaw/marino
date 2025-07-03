import { useNavigate } from 'react-router';
import { Button } from 'src/components/Button/Button';
import { useT } from 'src/hooks/useT';
import { TyranClient } from 'src/services/tyran-client/tyran-client';
import {
	StyledButtonsContainer,
	StyledContainer,
	StyledDescription,
	StyledTitle,
} from './SessionAlreadyActiveView.styled';

export const SessionAlreadyActiveView = (): React.JSX.Element => {
	const navigate = useNavigate();
	const t = useT();

	const onReconnectClick = () => {
		TyranClient.getInstance().connect();
		navigate('/', { replace: true });
	};

	return (
		<StyledContainer>
			<StyledTitle>{t('sessionAlreadyActive.title')}</StyledTitle>
			<StyledDescription>
				{t('sessionAlreadyActive.description')}
			</StyledDescription>
			<StyledButtonsContainer>
				<Button onClick={onReconnectClick}>
					{t('sessionAlreadyActive.tryAgainButton')}
				</Button>
			</StyledButtonsContainer>
		</StyledContainer>
	);
};
