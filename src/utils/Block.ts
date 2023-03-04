
import EventBus from './EventBus';
import isEqual from './isEqual';
import randomID from './randomID';
import { merge } from './set';

type Props = Record<string, any>

export default class Block {
    static EVENTS = {
        INIT: 'init',
        FLOW_CDM: 'flow:component-did-mount',
        FLOW_CDU: 'flow:component-did-update',
        FLOW_RENDER: 'flow:render'
    }

    public id: string;
    protected props: Props;
    public eventBus: () => EventBus;
    private _meta: { tagName: string; props: Props };
    private _element!: HTMLElement | HTMLInputElement | HTMLButtonElement;
    protected kids: Record<string, Block | any>;

    /** JSDoc
   * @param {string} tagName
   * @param {Object} props
   *
   * @returns {void}
   */

    // START CONSTRUCTOR ---------------------------------
    constructor (tagName = "div", propsAndKids: Props = {}) {
        loggg.push([tagName, 'start constructor Block']);
        
        const { props, kids } = this._getKidsAndProps(propsAndKids);
        this._meta = { tagName, props }; // параметры от инстанса
        this.id = randomID(6); // генерируем уникальный id
        this.kids = kids; // отделенные от пропсов сами элементы-инстансы
        this.props = this._makePropsProxy(props); // делаем обёртку Proxy
        //console.log('constructor Block')
        // Создаем экземпляр EventBus ({}.listeners с {ev1: [массив колбеков], ev2:[], ...} + on, off, emit)
        const eventBus = new EventBus();
        // Делаем внешний доступ к EventBus через this.eventBus()
        this.eventBus = () => eventBus; 
        // подписка инстанса на жизн.цикл - init, cdm, cdu, render
        this._registerEvents(eventBus);
        
        // запуск жизн.цикла с события init
        eventBus.emit(Block.EVENTS.INIT);
        
        loggg.push([this.element, 'end constructor Block'])
    }
    // END CONSTRUCTOR ------------------------------------

    // функция Proxi-обёртки для пропсов
    _makePropsProxy(props: Props) {
        const proxyProps = new Proxy(props, {
            
            get(target: Props, prop: string) {
                if (prop[0] === '_') {
                    throw new Error('Нет доступа');
                }
                const value = target[prop];
                return typeof value === 'function' ? value.bind(target) : value;
            },
            
            set:(target: Props, prop: string, value) => {
                if (prop[0] === '_') {
                    throw new Error('Нет доступа');
                } else if (isEqual(target[prop], value)) {
                    return true;
                } else {
                    const oldTarget = { ...target };
                    this._removeEvents();
                    target[prop] = value;
                    this.eventBus().emit(Block.EVENTS.FLOW_CDU, oldTarget, target);
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
    // вспомогательный метод - разделение пропсов на Пропсы и Детей 
    _getKidsAndProps(propsAndKids: Record<string, any | Block>) {
        const props: Record<string, any> = {};
        const kids: Record<string, Block> = {};
        Object.entries(propsAndKids).forEach(([key, val]) => {
            if (val instanceof Block) {
                kids[key] = val;
            } else {
                props[key] = val;
            }
        })

        return { props, kids };
    }

    // функция подписки на события
    _registerEvents(eventBus: EventBus) {
        // сначала INIT > RENDER > CDM, затем цикл CDU - RENDER
        eventBus.on(Block.EVENTS.INIT, this._init.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
        eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
    }
    
    // Обработчики событий --------------------------------
    // Cback 1 - Инициация
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected init() {}
    private _init() {   
        //console.log('init Block')
        
        this._createWrap();
        this.init();
        //setTimeout(() => {
        this.eventBus().emit(Block.EVENTS.FLOW_RENDER); // Запуск Cback 3 - Поток Рендера
   // }, 1);
    }
        _createWrap() {
            const { tagName } = this._meta;
            this._element = this._createDocumentElement(tagName);
        }
        _createDocumentElement(tagName: string) {
            // Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
            const element = document.createElement(tagName);
            // element.setAttribute('');
            
            return element;
        }
    
    // Метод, доступный снаружи - отправляет компонент на маунтинг через emit event2 - flow:cdm
    // Вызывается после render на странице
    public dispatchComponentDidMount() {
        this.eventBus().emit(Block.EVENTS.FLOW_CDM);
    }
    private _componentDidMount() {
        this.componentDidMount();
    }
    // Переопределяется пользователем.
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected componentDidMount() {}
         

    private _componentDidUpdate(oldProps: Props, newProps: Props) {        
        if (this.componentDidUpdate(oldProps, newProps)) {
            // console.log(`CD_Update render ${this.element}`, newProps);
            this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
        } else {
            // console.log(`Отмена CD_Update render ${this.element}`, newProps);
        }
    }
    // Переопределяется пользователем.
    protected componentDidUpdate(oldProps: Props, newProps: Props) {
        return (!isEqual(oldProps, newProps)) ? true : false;
    }

    public setProps = (nextProps: Props) => {
        if (!nextProps) {
            return;
        }

        const { props, kids } = this._getKidsAndProps(nextProps);
        if (Object.values(kids).length)
            console.log(this.kids, kids);
        
        if (Object.values(props).length)
            merge(this.props, nextProps);
    }
    
    private _render() {
        //console.log('render Block')
        const block = this.render();
        // Это небезопасный метод для упрощения логики
        // Используйте шаблонизатор из npm или напишите свой безопасный (пока использую hbs) 
        this._element.innerHTML = '';
        this._element.append(block);
        this._addEvents();
    }
    // Переопределяется пользователем. Необходимо вернуть разметку
    protected render(): DocumentFragment {
        return new DocumentFragment(); // возвращает шаблонизатор       
    }
    // Вызывают наследники
    protected compile(template: HandlebarsTemplateDelegate, context: Props) {
        const contextAndStubs = { ...context, ...this.props };
        // замена компонентов на заглушки с уникальным id
        Object.entries(this.kids).forEach(([key, component]) => {
            contextAndStubs[key] = `<div data-id="${component.id}"></div>`;
        });
        // console.log(contextAndStubs);
        
        // выгрузка шаблона с заглушками в html-элементы во временный template
        const html = template(contextAndStubs);
        // console.log(html)
        const temp = document.createElement('template');

        temp.innerHTML = html;
        // замена заглушек обратно на элементы
        Object.entries(this.kids).forEach(([, component]) => {
            const stub = temp.content.querySelector(`[data-id="${component.id}"]`);
            
            if (!stub) return;

            stub.replaceWith(component.getContent());
        });

        return temp.content;
    }

    _addEvents() {
        const { events = {} } = this.props as { events: Record<string, () => void> };
        
        Object.keys( events ).forEach(eName => {
            this._element.addEventListener( eName, events[eName] );
        });
    }
    _removeEvents() {
        const { events = {} } = this.props as { events: Record<string, () => void> };

        Object.keys( events ).forEach(eName => {
            this._element.removeEventListener( eName, events[eName] );
        })
    }        
        
    show() {

        this.element.classList.remove('hidden');
    }
    
    hide() {
        this.element.classList.add('hidden');
    }
        getContent() {
            return this.element;
        }
        get element() {
            return this._element;
        }        
}
