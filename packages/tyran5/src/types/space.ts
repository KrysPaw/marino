export type SpaceMetadata = {
    /**
     * Controller class purpose is to handle incoming commands from clients and internal events.
     */
    controller?: new (...args: any) => any;
    /**
     * Service class purpose is to handle mainly business logic and data manipulation.
     */
    service?: new (...args: any) => any;
    /**
     * Other modules that the space depends on.
     */
    modules?: (new (...args: any) => any)[];
}

export type SpaceConfig = {
    /**
     * If true, the space will be persistent and will not be destroyed when all clients disconnect.
     * Default: false
     */
    persistent?: boolean;
    /**
     * Maximum number of clients that can connect to the space.
     * By default there is no limit.
     */
    maxClients?: number;
}