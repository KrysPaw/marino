import { ArrowLeftOutlined, GlobalOutlined } from "@ant-design/icons";
import type React from "react";
import { useRef } from "react";
import { Button } from "../Button/Button";
import "flag-icons/css/flag-icons.min.css";
import { useLocation, useNavigate } from "react-router";
import {
  LanguageModal,
  type LanguageModalRef,
} from "../LanguageModal/LanguageModal";
import { StyledButtonsContainer } from "./HeaderControls.styled";

export const HeaderControls = (): React.JSX.Element => {
  const modalRef = useRef<LanguageModalRef>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const onLocalizationButtonClick = () => {
    modalRef.current?.open();
  };

  const onBackButtonClick = () => {
    switch (location.pathname.split("/")[1]) {
      case "menu":
        break;
      case "lobby":
        navigate("/menu", { replace: true });
        break;
      case "game":
        break;
      default:
        break;
    }
  };

  return (
    <StyledButtonsContainer>
      {location.pathname !== "/menu" && (
        <Button onClick={onBackButtonClick}>
          <ArrowLeftOutlined style={{ fontSize: "32px" }} />
        </Button>
      )}
      <Button onClick={onLocalizationButtonClick}>
        <GlobalOutlined style={{ fontSize: "32px" }} />
      </Button>
      <LanguageModal ref={modalRef} />
    </StyledButtonsContainer>
  );
};
