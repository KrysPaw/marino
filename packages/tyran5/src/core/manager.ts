import { DataSource, ObjectLiteral } from "typeorm";
import { SpaceConfig } from "../types/index.js";
import { Space } from "./space.js";

export class Manager<TSpaces extends Record<string, (new (...args: any) => any)> = any> {
    private _createSpaceInstanceHandler: (spaceName: Extract<keyof TSpaces, string>, config?: SpaceConfig) => Space;
    db: DataSource | null = null;

    constructor(createSpaceInstanceHandler: (spaceName: Extract<keyof TSpaces, string>) => Space, db?: DataSource) {
        this._createSpaceInstanceHandler = createSpaceInstanceHandler;
        this.db = db || null;
    }

    createSpaceInstance(spaceName: Extract<keyof TSpaces, string>, config?: SpaceConfig) {
        return this._createSpaceInstanceHandler(spaceName, config);
    }
}

