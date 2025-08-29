import { defineStore, acceptHMRUpdate } from 'pinia';
export var useCounterStore = defineStore('counter', {
    state: function () { return ({
        counter: 0,
    }); },
    getters: {
        doubleCount: function (state) { return state.counter * 2; },
    },
    actions: {
        increment: function () {
            this.counter++;
        },
    },
});
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCounterStore, import.meta.hot));
}
