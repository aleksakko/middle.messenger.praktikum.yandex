import Block from "./Block";
import store, { StoreEvents } from "../services/storeTheory/store";

function connect(mapStateToProps: (state: Indexed) => Indexed) {
    return function(Component: typeof Block) {
        // используем class expression
        return class extends Component {
            constructor(props) {
                // сохраняем начальное состояние
                let state = mepStateToProps(store.getState());

                super({...props, ...mapStateToProps(store.getState())});
                
                // подписываемся на событие
                store.on(StoreEvents.Updated, () => {
                    // при обновлении получаем новое состояние, передав данные из хранилища
                    const newState = mapStateToProps(store.getState());

                    // если что-то из используемых данных поменялось, обновляем компонент
                    if (!isEqual(state, newState)) {
                        this.setProps({...newState})
                    }

                    // не забываем сохранить новое состояние
                    state = newState;
                });
            }            
        }
    }
}

function mapStateToProps(state) {
    return {
        name: state.user.name,
        avatar: state.user.avatar
    };
}

// придется где-то (где?) сравнивать старое и новое состояние
// чтобы компоненты не обновлялись каждый раз при изменении данных в стостоянии приложения,
// даже если эти данные они не используют
// можно сравнивать не все состояние, а только ту его часть,
// которую мы получаем с помощью функции mapStateToProps:
const newState = mapStateToProps(state);
if (!isEqual(oldState, newState)) {
    // тогда обновляем компонент
}

// применение сначала каррирование
const withUser = connect(state => ({
    user: state.user
}))
// применение
withUser(UserProfile);
withUser(SettingPage);
