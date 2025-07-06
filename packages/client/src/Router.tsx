import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import useLocalStorage from "use-local-storage";
import { localStorageOptions } from "./config/localStorageOptions";
import { useExceptions } from "./hooks/useExceptions";
import { useStorage } from "./storage/hooks/useStorage";
import { ExceptionView } from "./views/ExceptionView/ExceptionView";
import { GameView } from "./views/GameView/GameView";
import { LobbyView } from "./views/LobbyView/LobbyView";
import { MenuView } from "./views/MenuView/MenuView";
import { WelcomeView } from "./views/WelcomeView/WelcomeView";

export const Router = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [nickname] = useLocalStorage("nickname", "", localStorageOptions);
  const exception = useExceptions();
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

  if (exception) {
    content = (
      <ExceptionView type={exception} key={`exception-view-${exception}`} />
    );
  } else if (!nickname) {
    setLocation("/");
    content = <WelcomeView key="welcome-view" />;
  } else if (place === "menu" || place === undefined) {
    setLocation("/menu");
    content = <MenuView key="menu-view" />;
  } else if (place === "lobby" && state.lobby.state === "IN_PROGRESS") {
    setLocation(`/lobby/${state.lobby.code}`);
    content = <GameView key="game-view" />;
  } else if (place === "lobby" && state.lobby.code) {
    setLocation(`/lobby/${state.lobby.code}`);
    content = <LobbyView key="lobby-view" />;
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
