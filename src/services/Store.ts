import EventBus from "../utils/EventBus";
import set from "../utils/set";

export enum StoreEvents {
    UPDATED = "store:updated"
}

export type State = Record<string, any>;
class Store extends EventBus {
    private state: State = {};
    
    constructor () {
        super();
        this.on(StoreEvents.UPDATED, () => null)
    }

    public set(keypath: string, data: unknown) {
        set(this.state, keypath, data);
        // console.log('STORE:ADD ', keypath, data);

        this.emit(StoreEvents.UPDATED, this.getState());
    }
    
    public setMany(...arr: [keypath: string, data: unknown][]) {
        let obj: unknown = {};
        arr.forEach(one => {
            obj = set(obj, one[0], one[1])
        })
        // console.log('STORE:ADD ', obj);

        this.emit(StoreEvents.UPDATED, this.getState());
    }

    public remove(keypath: string) {
        set(this.state, keypath, undefined);
        // console.log('STORE:DELETE ', keypath);

        this.emit(StoreEvents.UPDATED, this.getState());
    }

    public reset() {
        this.state = {};
        this.emit(StoreEvents.UPDATED, this.getState());
    }


    public getState() {
        return this.state;
    }
}

const store = new Store();

window.store = store; // для теста

export default store;
