import { ExceptionCase, type ValueOf } from "@shared";
import { useStorage } from "src/storage/hooks/useStorage";

export const useExceptions = (): ValueOf<typeof ExceptionCase> | undefined => {
  const [state] = useStorage();

  if (state.general.sessionAlreadyActive) {
    return ExceptionCase.SESSION_ALREADY_ACTIVE;
  }

  if (state.general.connectionLost || !state.general.connected) {
    return ExceptionCase.NO_CONNECTION;
  }

  if (state.general.kickedFromLobby) {
    return ExceptionCase.KICKED_FROM_LOBBY;
  }

  return undefined;
}