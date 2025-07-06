import { BrowserRouter } from "react-router";
import { ThemeProvider } from "styled-components";
import useLocalStorage from "use-local-storage";
import { Header } from "./components/Header/Header";
import { localStorageOptions } from "./config/localStorageOptions";
import { theme } from "./config/theme";
import { useHandleServerRequest } from "./hooks/useHandleServerRequest";
import { Router } from "./Router";
import { TyranClient } from "./services/tyran-client/tyran-client";
import { useStorage } from "./storage/hooks/useStorage";
import {
  SidePanel,
  StyledMainLayout,
  StyledPageContent,
} from "./styled/MainLayout.styled";
import { Viewport } from "./views/Viewport/Viewport";

const App = () => {
  TyranClient.getInstance();
  const [, setState] = useStorage();
  const [, setLobbyId] = useLocalStorage("lobbyId", "", localStorageOptions);
  const [, setClientId] = useLocalStorage("clientId", "", localStorageOptions);
  const [, setNickname] = useLocalStorage("nickname", "", localStorageOptions);

  useHandleServerRequest("DEV_MODE_STATE_UPDATE", (payload) => {
    window.postMessage({
      source: "marino",
      type: "serverStorageUpdate",
      data: payload,
    });
  });

  useHandleServerRequest("CLIENT_INFO", (payload) => {
    const { clientId, nickname, lobbyId } = payload;

    setClientId(clientId);
    setNickname(nickname || "");
    setLobbyId(lobbyId || "");
  });

  useHandleServerRequest("KICK_LEAVE_LOBBY", () => {
    setState((prev) => {
      prev.general.kickedFromLobby = true;
    });
    setLobbyId("");
  });

  return (
    <ThemeProvider theme={theme}>
      <StyledMainLayout>
        <SidePanel />
        <StyledPageContent>
          <Viewport>
            <BrowserRouter>
              <Header />
              <Router />
            </BrowserRouter>
          </Viewport>
        </StyledPageContent>
      </StyledMainLayout>
    </ThemeProvider>
  );
};

export default App;
