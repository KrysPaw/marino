import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import type { LobbyPlayer } from "@shared";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "src/components/Button/Button";
import { TooltipWrapper } from "src/components/TooltipWrapper";
import { localStorageOptions } from "src/config/localStorageOptions";
import { UseHandleServerRequest } from "src/hooks/useHandleServerRequest";
import { useServerRequest } from "src/hooks/useServerRequest";
import { useT } from "src/hooks/useT";
import { useStorage } from "src/storage/hooks/useStorage";
import useLocalStorage from "use-local-storage";
import starIcon from "../../assets/images/star.png";
import {
  StyledContainer,
  StyledLobbyContainer,
  StyledPlayerList,
  StyledPlayerListContainer,
  StyledPlayerListItem,
  StyledPlayerListTitle,
  StyledTitle,
} from "./LobbyView.styled";

const PLAYER_LIMIT = 8;

export const LobbyView = (): React.JSX.Element => {
  const t = useT();
  const { send } = useServerRequest();
  const [, setCode] = useLocalStorage("code", "", localStorageOptions);
  const [state, setState] = useStorage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!state.lobby.lobbyId) {
      const code = location.pathname.split("/").pop();

      if (!code || code.length !== 6) {
        console.error("Invalid lobby code:", code);
        return;
      }

      send("JOIN_LOBBY", { code }, (response) => {
        if (response.status === "ERROR") {
          setState((prev) => {
            prev.lobby.code = "";

            return prev;
          });
          setCode("");
          navigate("/");
          return;
        }

        setState((prev) => {
          prev.lobby = response.data;
          return prev;
        });
      });
    }
  }, [send, setState, state.lobby.lobbyId]);

  UseHandleServerRequest("UPDATE_LOBBY_INFO", (payload) => {
    setState((prev) => {
      prev.lobby = payload;
    });
  });

  const getPlayerItems = (team: LobbyPlayer["team"]) => {
    const { blueTeam, redTeam } = state.lobby;
    const players = team === "BLUE" ? blueTeam : redTeam;

    return Array.from({ length: PLAYER_LIMIT / 2 }, (_, index) => {
      const isPlayerPresent = index < players.length;
      const player = players[index];

      return (
        <StyledPlayerListItem
          key={`1${index + 3}2`}
          $inactive={!isPlayerPresent}
        >
          {index + 1}. {player?.nickname || "Free slot"}
          {player?.isHost && <img src={starIcon} alt="Host" />}
        </StyledPlayerListItem>
      );
    });
  };

  const isPlayerInBlueTeam = () => {
    return state.lobby.blueTeam.some(
      (player) => player.id === localStorage.getItem("clientId")
    );
  };

  const onSwitchTeamClick = () => {
    send("SWITCH_TEAM", { team: isPlayerInBlueTeam() ? "RED" : "BLUE" });
  };

  return (
    <StyledContainer>
      <StyledTitle>{t("lobby.title")}</StyledTitle>
      <StyledLobbyContainer>
        <StyledPlayerListContainer>
          <div>
            <StyledPlayerListTitle>
              {t("lobby.blueTeam")} ({state.lobby.blueTeam.length}/
              {PLAYER_LIMIT / 2})
            </StyledPlayerListTitle>
            <StyledPlayerList>{getPlayerItems("BLUE")}</StyledPlayerList>
          </div>
          <TooltipWrapper id="switch-team-tooltip" message="Change team">
            <Button onClick={onSwitchTeamClick}>
              {isPlayerInBlueTeam() ? (
                <RightOutlined style={{ fontSize: "32px" }} />
              ) : (
                <LeftOutlined style={{ fontSize: "32px" }} />
              )}
            </Button>
          </TooltipWrapper>
          <div>
            <StyledPlayerListTitle>
              {t("lobby.redTeam")} ({state.lobby.redTeam.length}/
              {PLAYER_LIMIT / 2})
            </StyledPlayerListTitle>
            <StyledPlayerList>{getPlayerItems("RED")}</StyledPlayerList>
          </div>
        </StyledPlayerListContainer>
        {/* <StyledOtherPartContainer>Other things</StyledOtherPartContainer> */}
      </StyledLobbyContainer>
    </StyledContainer>
  );
};
