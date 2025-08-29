import { type AxiosInstance } from 'axios';
declare module 'vue' {
    interface ComponentCustomProperties {
        $axios: AxiosInstance;
        $api: AxiosInstance;
    }
}
declare const api: AxiosInstance;
declare const _default: any;
export default _default;
export { api };
