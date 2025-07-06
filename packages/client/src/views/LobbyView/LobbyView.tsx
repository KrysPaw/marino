import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import type { LobbyPlayerTeam, ValueOf } from "@shared";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "src/components/Button/Button";
import { Modal } from "src/components/Modal/Modal";
import { TooltipWrapper } from "src/components/TooltipWrapper";
import { localStorageOptions } from "src/config/localStorageOptions";
import { useHandleServerRequest } from "src/hooks/useHandleServerRequest";
import { useServerRequest } from "src/hooks/useServerRequest";
import { useT } from "src/hooks/useT";
import { useStorage } from "src/storage/hooks/useStorage";
import useLocalStorage from "use-local-storage";
import { GameStartCounter } from "./GameStartCounter";
import {
  StyledButtonContainer,
  StyledContainer,
  StyledGameStartCounter,
  StyledGameStartCounterContainer,
  StyledLobbyContainer,
  StyledPlayerListContainer,
  StyledPlayerListTitle,
  StyledTitle,
} from "./LobbyView.styled";
import { PlayersList } from "./PlayersList";

const PLAYER_LIMIT = 8;

export const LobbyView = (): React.JSX.Element => {
  const t = useT();
  const { send } = useServerRequest();
  const [, setCode] = useLocalStorage("code", "", localStorageOptions);
  const [state, setState] = useStorage();
  const [isStarting, setIsStarting] = useState(false);
  const [startingCounter, setStartingCounter] = useState(3);
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

  useHandleServerRequest("UPDATE_LOBBY_INFO", (payload) => {
    setState((prev) => {
      prev.lobby = payload;
    });
  });

  const isPlayerInBlueTeam = () => {
    return state.lobby.blueTeam.some(
      (player) => player.id === localStorage.getItem("clientId")
    );
  };

  const onSwitchTeamClick = () => {
    send("SWITCH_TEAM", { team: isPlayerInBlueTeam() ? "RED" : "BLUE" });
  };

  const onStartGameClick = () => {
    send(
      "TRIGGER_GAME_START",
      {
        lobbyId: state.lobby.lobbyId,
      },
      (response) => {
        if (response.status === "ERROR") {
          console.error("Error starting game:", response.errorCode);
        }
      }
    );
  };

  const startGame = () => {
    setIsStarting(false);
    setStartingCounter(3);
    setState((prev) => {
      prev.lobby.state = "IN_PROGRESS";
    });
  };

  useHandleServerRequest("START_GAME", () => {
    setIsStarting(true);

    const intervalId = setInterval(() => {
      setStartingCounter((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          startGame();
          return 1;
        }

        return prev - 1;
      });
    }, 1000);
  });

  const addAIPlayer = (team: ValueOf<typeof LobbyPlayerTeam>) => {
    send("ADD_AI_PLAYER", {
      team,
      lobbyId: state.lobby.lobbyId,
    });
  };

  const removePlayer = (playerId: string) => {
    send("KICK_PLAYER", {
      lobbyId: state.lobby.lobbyId,
      playerId,
    });
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
            <PlayersList
              players={state.lobby.blueTeam}
              onAddAI={() => addAIPlayer("BLUE")}
              onRemovePlayer={removePlayer}
            />
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
            <PlayersList
              players={state.lobby.redTeam}
              onAddAI={() => addAIPlayer("RED")}
              onRemovePlayer={removePlayer}
            />
          </div>
        </StyledPlayerListContainer>
      </StyledLobbyContainer>
      <StyledButtonContainer>
        <Button onClick={onStartGameClick}>Start game</Button>
      </StyledButtonContainer>
      <Modal isOpen={isStarting} closable={false} hideHeader size={400}>
        <StyledGameStartCounterContainer>
          <StyledGameStartCounter>
            <GameStartCounter value={startingCounter} />
          </StyledGameStartCounter>
        </StyledGameStartCounterContainer>
      </Modal>
    </StyledContainer>
  );
};
