export declare const useUserStore: import("pinia").StoreDefinition<"user", import("pinia").StateTree, {
    isLoggedIn: (state: import("pinia").StateTree & import("pinia").PiniaCustomStateProperties<import("pinia").StateTree>) => boolean;
    userId: (state: import("pinia").StateTree & import("pinia").PiniaCustomStateProperties<import("pinia").StateTree>) => any;
    userProfileUrl: (state: import("pinia").StateTree & import("pinia").PiniaCustomStateProperties<import("pinia").StateTree>) => any;
    documentId: (state: import("pinia").StateTree & import("pinia").PiniaCustomStateProperties<import("pinia").StateTree>) => any;
}, {
    fetchUser(): Promise<void>;
    setToken(token: string | null): void;
    logout(): void;
    initUser(): void;
}>;
