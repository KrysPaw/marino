import { z } from "zod";
import { TyranCommandAction } from "../enums/tyran-command-action";
import { TyranSpace } from "../enums/tyran-space";

export type TyranCommandsType = {
  [Command in keyof typeof TyranCommandAction]: {
    space: keyof typeof TyranSpace;
    /** When client requests from server */
    clientRequestSchema: z.ZodType;
    /** When client responds to server request */
    clientResponseSchema: z.ZodType;
    /** When server requests from client */
    serverRequestSchema: z.ZodType;
    /** When server responds to client request */
    serverResponseSchema: z.ZodType;
  };
};