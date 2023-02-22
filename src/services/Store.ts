import EventBus from "../utils/EventBus";
import set from "../utils/set";

export enum StoreEvents {
    UPDATED = "store:updated"
}

class Store extends EventBus {
    private state: any = {};

    constructor () {
        super();
        this.on(StoreEvents.UPDATED, () => {})
    }

    public set(keypath: string, data: unknown) {
        set(this.state, keypath, data);
        console.log('ADD IN STORE: ', keypath, data);

        if (keypath.includes('error')) console.log('set error')
        this.emit(StoreEvents.UPDATED, this.getState());
    }

    public getState() {
        return this.state;
    }
}

const store = new Store();
window.st = store;

export default store;
