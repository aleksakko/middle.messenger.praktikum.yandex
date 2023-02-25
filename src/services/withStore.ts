import Block from "../utils/Block";
import isEqual from "../utils/isEqual";
import store, { StoreEvents } from "./Store";

export default function withStore(mapStateToProps: (state: any) => any) {
    
    return function wrap(Component: new (props?: any) => Block) {

        let currentState: Record<string, any> | null = null;
        
        return class WithStore extends Component {
            
            constructor(props: Record<string, any>) {
                const state: Record<string, any> = store.getState();
                currentState = mapStateToProps.call('THIS', state); // user.data..
                
                super({ ...props, ...currentState });
                currentState = mapStateToProps.call(this, state); // здесь вызов ради корректной работы компонентов sectionWith и Form

                store.on(StoreEvents.UPDATED, () => {
                    const state = store.getState();

                    const propsFromState = mapStateToProps.call(this, state); // user.data..

                    //console.log('!!!!!!!!!!!!! ', currentState, propsFromState)
                    if (isEqual(currentState, propsFromState)) {
                        return;
                    }

                    // если mapStateToProps всегда возвращает null, то isEqual не пройдет
                    // т.е. отключаем setProps здесь, и можно вызвать желаемый set Props внутри mapStateToProps
                    this.setProps({ ...propsFromState });
                })
            }
        }
    }
}
