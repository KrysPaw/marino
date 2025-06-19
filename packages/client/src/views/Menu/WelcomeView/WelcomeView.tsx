import { useState } from 'react';
import { Button } from '../../../components/Button/Button';
import { Input } from '../../../components/Input/Input';
import {
  StyledButtonsContainer,
  StyledContainer,
  StyledDescription,
  StyledNameInputContainer,
  StyledTitle,
} from './WelcomeView.styled';
import { useNavigate } from 'react-router';
import { useT } from '../../../hooks/useT';

export const WelcomeView = (): React.JSX.Element => {
  const t = useT();
  const [enteredName, setEnteredName] = useState('');
  const navigate = useNavigate();

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredName(event.target.value);
  };

  const onContinueClick = () => {
    if (enteredName) {
      localStorage.setItem('user', enteredName);
      navigate('/menu');
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
