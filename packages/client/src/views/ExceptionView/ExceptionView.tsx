import { ExceptionCase, type ValueOf } from "@shared";
import type React from "react";
import { useNavigate } from "react-router";
import { Button } from "src/components/Button/Button";
import i18n from "src/config/i18n";
import { useT } from "src/hooks/useT";
import { TyranClient } from "src/services/tyran-client/tyran-client";
import { useStorage } from "src/storage/hooks/useStorage";
import {
  StyledButtonsContainer,
  StyledContainer,
  StyledDescription,
  StyledTitle,
} from "./ExceptionView.styled";

type Props = {
  type: ValueOf<typeof ExceptionCase>;
};

export const ExceptionView = ({ type }: Props): React.JSX.Element => {
  const t = useT();
  const navigate = useNavigate();
  const [, setState] = useStorage();

  const title = t(`exceptions.${type}.title`);
  const description = i18n.exists(`exceptions.${type}.description`)
    ? t(`exceptions.${type}.description`)
    : undefined;
  const actionButton = i18n.exists(`exceptions.${type}.description`)
    ? t(`exceptions.${type}.actionButton`)
    : undefined;

  const getAction = () => {
    switch (type) {
      case ExceptionCase.SESSION_ALREADY_ACTIVE:
        return () => {
          TyranClient.getInstance().connect();
          navigate("/", { replace: true });
        };
      case ExceptionCase.NO_CONNECTION:
        return () => {
          TyranClient.getInstance().connect();
          navigate("/", { replace: true });
        };
      case ExceptionCase.KICKED_FROM_LOBBY:
        return () => {
          setState((prev) => {
            prev.general.kickedFromLobby = false;
          });
          navigate("/menu", { replace: true });
        };
      default:
        return () => window.location.reload();
    }
  };

  return (
    <StyledContainer>
      <StyledTitle>{title}</StyledTitle>
      {description && <StyledDescription>{description}</StyledDescription>}
      <StyledButtonsContainer>
        <Button onClick={getAction()}>{actionButton ?? "OK"}</Button>
      </StyledButtonsContainer>
    </StyledContainer>
  );
};
