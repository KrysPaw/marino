import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Tooltip } from "react-tooltip";
import useLocalStorage from "use-local-storage";
import { localStorageOptions } from "./config/localStorageOptions";
import { useStorage } from "./storage/hooks/useStorage";
import { LobbyView } from "./views/LobbyView/LobbyView";
import { MenuView } from "./views/MenuView/MenuView";
import { NoConnectionErrorView } from "./views/NoConnectionError/NoConnectionErrorView";
import { SessionAlreadyActiveView } from "./views/SessionAlreadyActive/SessionAlreadyActiveView";
import { WelcomeView } from "./views/WelcomeView/WelcomeView";

export const Router = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [nickname] = useLocalStorage("nickname", "", localStorageOptions);
  // const [sessionId] = useLocalStorage('sessionId', '', localStorageOptions);
  // const [lobbyId] = useLocalStorage('lobbyId', '', localStorageOptions);
  const [state, setState] = useStorage();

  const setLocation = (newLocation: string) => {
    if (pathname !== newLocation) {
      navigate(newLocation, { replace: true });
    }
  };

  const place = pathname.split("/").filter(Boolean)[0];
  const placeId = pathname.split("/").filter(Boolean)[1];

  useEffect(() => {
    if (
      place === "lobby" &&
      placeId &&
      placeId.length === 6 &&
      !state.lobby.lobbyId
    ) {
      setState((prev) => {
        prev.lobby.code = placeId;
        return prev;
      });
    }
  }, []);

  let content: React.ReactElement;

  if (state.general.sessionAlreadyActive) {
    content = <SessionAlreadyActiveView key="session-already-active-view" />;
  } else if (state.general.connectionLost || !state.general.connected) {
    content = <NoConnectionErrorView key="no-connection-error-view" />;
  } else if (!nickname) {
    setLocation("/");
    content = <WelcomeView key="welcome-view" />;
  } else if (state.lobby.code) {
    setLocation(`/lobby/${state.lobby.code}`);
    content = <LobbyView key="lobby-view" />;
  } else if (place === "menu" || place === undefined) {
    setLocation("/menu");
    content = <MenuView key="menu-view" />;
  } else {
    content = (
      <div key="not-covered-view">Not covered case. Reached the end</div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${content.key}`}
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
};
