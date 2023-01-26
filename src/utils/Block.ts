import EventBus from './EventBus';
// import { v4 as makeUUID} from 'uuid';

interface Props {
    events?: Record<string, any>,   
    [key: string]: any
}

export default class Block {
    static EVENTS = {
        INIT: 'init',
        FLOW_CDM: 'flow:component-did-mount',
        FLOW_RENDER: 'flow:render',
        FLOW_UPDATE: 'flow:update'
    }

    protected props: Props;
    private eventBus: () => EventBus;
    private _meta: { tagName: String; props: Props };
    private _element: HTMLElement | any;

    /** JSDoc
   * @param {string} tagName
   * @param {Object} props
   *
   * @returns {void}
   */

    // START CONSTRUCTOR ---------------------------------
    constructor (tagName: string = "div", props: Props = {}) {
        // A1. Сохраняем метаинфо от пользователя
        // A2. Генерируем уникальный UUID, если требуется
        // A3. Обертка Proxy для ограничения доступа к _защищенным props'ам
        this._meta = { tagName, props };
        // this._id = makeUUID();
        this.props = this._makePropsProxy(props); 
        
        // B1. Создаем экземпляр EventBus ({}.listeners с {событие1: [массив колбеков], 2:[], ...} + подписка, отписка, emit)
        // B2. Делаем внешний доступ к EventBus через this.eventBus()
        // B3. Подписываемся на 3 события из static EVENTS - инициация, маунтинг, рендер
        const eventBus = new EventBus();
        this.eventBus = () => eventBus;
        this._registerEvents(eventBus);
        
        // C1. Запускаем событие инициации с запусками 
        eventBus.emit(Block.EVENTS.INIT);
    }
    // END CONSTRUCTOR ------------------------------------

    // A3 - функция Proxi-обёртки для пропсов
    _makePropsProxy(props: Props) {
        // Ещё один способ передачи this, но он больше не применяется с приходом ES6+
        const self = this;
        const proxyProps = new Proxy(props, {
            get(target: Props, prop: string) {
                if (prop[0] === '_') {
                    throw new Error('Нет доступа');
                }
        
                const value = target[prop];
                    return typeof value === 'function' ? value.bind(target) : value;
            },
            set(target: Props, prop: string, value) {
                if (prop[0] === '_') {
                    throw new Error('Нет доступа');
                } else if (target[prop] === value) {
                    return true;
                } else {
                    const oldTarget = { ...target };
                    target[prop] = value;
                    self.eventBus().emit(Block.EVENTS.FLOW_UPDATE, oldTarget, target);
                    return true;
                }
            },
            deleteProperty(target: Props, prop: string) {
                if (prop[0] === '_') {
                    throw new Error('Нет доступа');
                } else {
                    delete target[prop];
                    return true;
                }
            }
          });
        
        return proxyProps;
    }

    // B3 - функция подписки на события
    _registerEvents(eventBus: EventBus) {
        eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
        eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
        eventBus.on(Block.EVENTS.FLOW_UPDATE, this._componentDidUpdate.bind(this));
    }
    
    // Обработчики событий --------------------------------
    // Cback event1 - Инициация
    init() {
        this._createWrap();
        this.eventBus().emit(Block.EVENTS.FLOW_RENDER); // Запуск события3 Поток Рендера
    }
        _createWrap() {
            const { tagName } = this._meta;
            this._element = this._createDocumentElement(<string>tagName);
        }
            _createDocumentElement(tagName: string) {
                // Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
                const element = document.createElement(tagName);
                // element.setAttribute('');
                
                return element;
            }
    
    // Метод, доступный снаружи - отправляет компонент на маунтинг через emit event2 - flow:cdm
    dispatchComponentDidMount() {
        this.eventBus().emit(Block.EVENTS.FLOW_CDM);
    }
        _componentDidMount() {
            this.componentDidMount();
        }
            componentDidMount() {}
            
    
    _componentDidUpdate(oldProps: Props, newProps: Props) {        
        if (this.componentDidUpdate(oldProps, newProps)) {
            this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
        }
    }
        componentDidUpdate(oldProps: Props, newProps: Props) {
            if (oldProps === newProps) { // временная мера для typescript'а
            return true;
            }
        }

    setProps = (nextProps: Props) => {
        if (!nextProps) {
            return;
        }

        Object.assign(this.props, nextProps);
    }

    
    private _render() {
        const block = this.render();
        // Это небезопасный метод для упрощения логики
        // Используйте шаблонизатор из npm или напишите свой безопасный
        // Нужно компилировать не в строку (или делать это правильно),
        // либо сразу превращать в DOM-элементы и возвращать из compile DOM-ноду
        // Удалить старые события через removeEventListener
        this._element.innerHTML = block;
        
        this._addEvents();
    }
        // Переопределяется пользователем. Необходимо вернуть разметку
        protected render(): string {
            return '';            
        }
                
        _addEvents() {
            const { events } = <Props>this.props;
    
            Object.keys( <Record<string, any>>events ).forEach(eName => {
                this._element.addEventListener(eName, (<any>events)[eName] );
            });
        }
        
        
    show() {
        this.getContent().style.display = 'block';
    }
    
    hide() {
        this.getContent().style.display = 'none';
    }
        getContent() {
            return this.element;
        }
        get element() {
            return this._element;
        }        
}
