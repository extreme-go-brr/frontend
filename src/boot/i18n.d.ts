import messages from 'src/i18n';
export type MessageLanguages = keyof typeof messages;
export type MessageSchema = typeof messages['en-US'];
declare module 'vue-i18n' {
    interface DefineLocaleMessage extends MessageSchema {
    }
    interface DefineDateTimeFormat {
    }
    interface DefineNumberFormat {
    }
}
declare const _default: any;
export default _default;
