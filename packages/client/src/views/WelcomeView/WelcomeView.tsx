import { useState } from 'react';
import { useNavigate } from 'react-router';
import { localStorageOptions } from 'src/config/localStorageOptions';
import { useServerRequest } from 'src/hooks/useServerRequest';
import useLocalStorage from 'use-local-storage';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { useT } from '../../hooks/useT';
import {
	StyledButtonsContainer,
	StyledContainer,
	StyledDescription,
	StyledNameInputContainer,
	StyledTitle,
} from './WelcomeView.styled';

export const WelcomeView = (): React.JSX.Element => {
	const t = useT();
	const [enteredName, setEnteredName] = useState('');
	const [, setNickname] = useLocalStorage('nickname', '', localStorageOptions);
	const [code] = useLocalStorage('code', '', localStorageOptions);
	const { send } = useServerRequest();
	const navigate = useNavigate();

	const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEnteredName(event.target.value);
	};

	const onContinueClick = () => {
		if (enteredName) {
			send('SET_NICKNAME', { nickname: enteredName });
			setNickname(enteredName);

			if (code) {
				navigate(`/lobby/${code}`, { replace: true });
			} else {
				navigate('/menu', { replace: true });
			}
		}
	};

	return (
		<StyledContainer>
			<StyledTitle>{t('welcome.title')}</StyledTitle>
			<StyledDescription>{t('welcome.description')}</StyledDescription>
			<StyledNameInputContainer>
				<Input
					value={enteredName}
					placeholder={t('welcome.namePlaceholder')}
					onChange={onNameChange}
				/>
			</StyledNameInputContainer>
			<StyledButtonsContainer>
				<Button>{t('welcome.button.learnMore')}</Button>
				<Button
					state={enteredName ? 'default' : 'disabled'}
					onClick={onContinueClick}
				>
					{t('welcome.button.continue')}
				</Button>
			</StyledButtonsContainer>
		</StyledContainer>
	);
};
