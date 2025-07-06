import {
  EllipsisOutlined,
  RobotOutlined,
  StarOutlined,
} from "@ant-design/icons";
import type React from "react";
import { Dropdown } from "src/components/Dropdown/Dropdown";
import { TooltipWrapper } from "src/components/TooltipWrapper";
import type { Player } from "src/storage/types/lobby.type";
import { CenteredRow } from "src/styled/CenteredRow.styled";
import { StyledPlayerList, StyledPlayerListItem } from "./LobbyView.styled";

const TEAM_LIMIT = 4;

type Props = {
  players: Player[];
  onAddAI: () => void;
  onRemovePlayer: (playerId: string) => void;
};

export const PlayersList = ({
  players,
  onAddAI,
  onRemovePlayer,
}: Props): React.JSX.Element => {
  const playersList = Array.from({ length: TEAM_LIMIT }, (_, index) => {
    const isOccupied = index < players.length;
    const player = players[index];

    const isMe = player?.id === localStorage.getItem("clientId");
    const isHuman = isOccupied && player?.type === "MOST_LIKELY_HUMAN";
    const isAI = isOccupied && player?.type === "AI";

    const dropdownItems = [
      ...(isHuman && !isMe
        ? [
            {
              label: "Kick player",
              onClick: () => onRemovePlayer(player.id),
            },
            {
              label: "Transfer host",
              // TODO: Implement transfer host functionality
              onClick: () => {},
            },
          ]
        : []),
      ...(isAI
        ? [
            {
              label: "Remove AI",
              onClick: () => onRemovePlayer(player.id),
            },
          ]
        : []),
      ...(!isOccupied
        ? [
            {
              label: "Add AI",
              onClick: onAddAI,
            },
          ]
        : []),
    ];

    return (
      <StyledPlayerListItem key={`1${index + 3}2`} $inactive={!isOccupied}>
        {index + 1}. {player?.nickname || "Free slot"}
        <CenteredRow gap={16}>
          {player?.isHost && (
            <TooltipWrapper id="host-player" message="This player is host">
              <StarOutlined />
            </TooltipWrapper>
          )}
          {player?.type === "AI" && (
            <TooltipWrapper id="ai-player" message="AI player">
              <RobotOutlined />
            </TooltipWrapper>
          )}
          {dropdownItems.length > 0 && (
            <Dropdown items={dropdownItems}>
              <EllipsisOutlined />
            </Dropdown>
          )}
        </CenteredRow>
      </StyledPlayerListItem>
    );
  });

  return <StyledPlayerList>{playersList}</StyledPlayerList>;
};
