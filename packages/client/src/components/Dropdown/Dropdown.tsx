import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type React from "react";
import {
  StyledDropdownContent,
  StyledDropdownItem,
  StyledDropdownTrigger,
} from "./Dropdown.styled";

type Item = {
  label: string;
  onClick: () => void;
};

type Props = {
  children: React.ReactNode;
  position?: DropdownMenu.DropdownMenuContentProps["side"];
  items: Item[];
};

export const Dropdown = ({
  children,
  position = "bottom",
  items,
}: Props): React.JSX.Element => {
  const itemElements = items.map((item, index) => (
    <StyledDropdownItem key={`${index}-${item.label}`} onClick={item.onClick}>
      {item.label}
    </StyledDropdownItem>
  ));

  return (
    <DropdownMenu.Root>
      <StyledDropdownTrigger>{children}</StyledDropdownTrigger>
      <DropdownMenu.Portal
        container={document.getElementById("game-view") as HTMLElement}
      >
        <StyledDropdownContent
          className="DropdownMenuContent"
          sideOffset={10}
          side={position}
        >
          {itemElements}
        </StyledDropdownContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
