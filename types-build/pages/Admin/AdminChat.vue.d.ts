declare const _default: import("vue").DefineComponent<{}, {
    leftDrawerOpen: import("vue").Ref<boolean, boolean>;
    search: import("vue").Ref<string, string>;
    message: import("vue").Ref<string, string>;
    currentConversationIndex: import("vue").Ref<number, number>;
    conversations: {
        id: number;
        person: string;
        avatar: string;
        caption: string;
        time: string;
        sent: boolean;
        deleted: boolean;
    }[];
    currentConversation: import("vue").ComputedRef<{
        id: number;
        person: string;
        avatar: string;
        caption: string;
        time: string;
        sent: boolean;
        deleted: boolean;
    } | undefined>;
    setCurrentConversation: (index: number) => void;
    style: import("vue").ComputedRef<{
        height: string;
    }>;
    toggleLeftDrawer: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
