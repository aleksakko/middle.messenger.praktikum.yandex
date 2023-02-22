import store, { StoreEvents } from './store';

class UserProfile extends Block {
  constructor(...args) {
    super(...args);

        // запрашиваем данные у контроллера
        UserController.getUser();

        // подписываемся на событие
    store.on(StoreEvents.Updated, () => {
      // вызываем обновление компонента, передав данные из хранилища
      this.setProps(store.getState());
        });
  }

  render() {
    // внутри рендер в this.props будут достпны данные из хранилища
  }
} 
