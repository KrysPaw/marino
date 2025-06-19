import { TyranCommandAction } from '@shared';
import { Button } from '../../../components/Button/Button';
import { Input } from '../../../components/Input/Input';
import { UseServerRequest } from '../../../hooks/useServerRequest';
import { useT } from '../../../hooks/useT';
import {
  StyledContainer,
  StyledDescription,
  StyledJoinOptionContainer,
  StyledOptionsContainer,
} from './MenuView.styled';

export const MenuView = (): React.JSX.Element => {
  const t = useT();
  const { send } = UseServerRequest();

  const onCreateGameClick = () => {
    send(TyranCommandAction.CREATE_GAME, {});
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
