declare module 'pinia-plugin-persist' {
    import { PiniaPluginContext } from 'pinia';

    const piniaPersist: (context: PiniaPluginContext) => void;
    export default piniaPersist;
}
