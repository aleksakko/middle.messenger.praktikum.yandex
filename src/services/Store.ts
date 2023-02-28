import EventBus from "../utils/EventBus";
import set from "../utils/set";

export enum StoreEvents {
    UPDATED = "store:updated"
}

class Store extends EventBus {
    private state: any = {};

    constructor () {
        super();
        this.on(StoreEvents.UPDATED, () => null)
    }

    public set(keypath: string, data: unknown) {
        set(this.state, keypath, data);
        console.log('ADD IN STORE: ', keypath, data);

        if (keypath.includes('error')) console.log('set error')
        this.emit(StoreEvents.UPDATED, this.getState());
    }
    
    public setMany(...arr: [keypath: string, data: unknown][]) {
        let obj: unknown = {};
        arr.forEach(one => {
            obj = set(obj, one[0], one[1])
        })
        console.log(obj);
        console.log('ADD IN STORE: ', obj);

        //this.emit(StoreEvents.UPDATED, this.getState());
    }

    public getState() {
        return this.state;
    }
}

const store = new Store();
window.st = store;

export default store;
