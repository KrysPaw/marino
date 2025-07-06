import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import styled from "styled-components";

export const StyledDropdownTrigger = styled(DropdownMenu.Trigger)`
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 6px 16px;
  background-color: ${({ theme }) => theme.colors.darkBlue_1};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.white_1};
  font-family: "Strait";
  font-size: 20px;
  min-height: 36px;
  text-shadow: 4px 4px 6px rgba(66, 68, 90, 1);
  box-shadow: 0px 4px 8px 0px #00000033;

  transition: background-color 0.2s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.colors.dark};
    border-color: ${({ theme }) => theme.colors.darkBlue_2};
    cursor: pointer;
  }
`;

export const StyledDropdownContent = styled(DropdownMenu.Content)`
  background: radial-gradient(
    ellipse at right top,
    #102433dd 0%,
    #213555ff 100%
  );
  color: ${({ theme }) => theme.colors.white_1};
  border-radius: 8px;
  padding: 4px;
  animation-duration: 0.6s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);

  &[data-side="top"] {
    animation-name: slideUp;
  }

  &[data-side="bottom"] {
    animation-name: slideDown;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const StyledDropdownItem = styled(DropdownMenu.Item)`
  outline: none;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;

  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.dark};
  }
`;
