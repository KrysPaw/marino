import { useEffect, useRef } from "react";
import { TyranClient } from "../services/tyran-client/tyran-client";
import type { TyranCommandAction, TyranCommandsType, ValueOf } from "@shared";
import type { z } from "zod/v4";

type Props<T extends ValueOf<typeof TyranCommandAction>> = {
  action: T;
  fn: (payload: z.infer<TyranCommandsType[T]['serverRequestSchema']>) => void;
}

export const UseHandleServerRequest = <T extends ValueOf<typeof TyranCommandAction>>({ action, fn }: Props<T>) => {
  const subId = useRef<string | null>(null);

  const client = TyranClient.getInstance();

  useEffect(() => {
    if (!subId.current) {
      subId.current = client.subscribe(action, fn)
    }

    return () => {
      if (subId.current) {
        client.unsubscribe(subId.current, action);
        subId.current = null;
      }
    }
  }, [])
};