import { Tyran, TyranSetup } from "tyran5";
import { LobbySpace } from "./lobby/index.js";

@TyranSetup({
    spaces: [
        LobbySpace
    ]
})
export class Setup { }

// AppDataSource.initialize()
//     .then(() => console.log("Database connected successfully"))
//     .catch((error) => console.error("Database connection failed:", error))

const tyran = Tyran.createApp(Setup, {
    defaultSpace: 'LOBBY',
    // TypeOrmAppDataSource: AppDataSource,
});

tyran.listen(3000);