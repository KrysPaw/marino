import { z } from "zod";
import { type TyranCommandsType } from "../types/tyran-commands-type";

/** Make schemas void by default */
export const TyranCommands = {
  CREATE_GAME: {
    space: 'LOBBY',
    clientRequestSchema: z.object({

    }),
    serverResponseSchema: z.object({
      code: z.string().regex(/^[A-Z0-9]{6}$/),
    }),
    clientResponseSchema: z.void(),
    serverRequestSchema: z.void(),
  }
} satisfies TyranCommandsType;