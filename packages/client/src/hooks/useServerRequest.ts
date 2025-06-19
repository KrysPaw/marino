import { TyranClient } from "../services/tyran-client/tyran-client";
import type { TyranCommandAction, TyranCommandsType, ValueOf } from "@shared";
import type { z } from "zod/v4";


export const UseServerRequest = () => {
  const client = TyranClient.getInstance();

  return {
    send: <T extends ValueOf<typeof TyranCommandAction>>(
      action: T,
      payload: z.infer<TyranCommandsType[T]['clientRequestSchema']>,
      onServerResponse?: (payload: z.infer<TyranCommandsType[T]['serverResponseSchema']>) => void
    ) => {
      client.sendCommand(action, payload, onServerResponse);
    }
  }
};