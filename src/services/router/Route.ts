import Block from '../../utils/Block';
//import {render} from '../../utils/renderDOM';

export default class Route {
    protected _block: Block | null; // инстанс блока (создается в методе render)     
    public elRoot: HTMLElement | null;
    public elTitle: HTMLTitleElement;
    public elHeadTitle: HTMLElement | null;
    protected _title: string;
    
    constructor(
        protected _path: string,
        protected _blockClass: new (_props: Record<string, any> | null) => Block,
        protected _propsAndTitle: Record<string, any>,
        protected _rootQuery: string
    ){
        this._block = null;
        this.elRoot = document.querySelector(this._rootQuery);
        this.elTitle = document.getElementsByTagName('title')[0];
        this.elHeadTitle = document.getElementById('header-title');
        this._title = _propsAndTitle.title;
    }

    navigate(path: string) {
        if (this.match(path)) {
            this._path = path;
            this.render();
        }
    }

    leave() {
        if (this._block) {
            this._block.hide();
        }
    }

    match(path: string) {
        return path === this._path;
    }

    render() {
        window.loggg = [];
        if (!this._block) {
            this._block = new this._blockClass(this._propsAndTitle.props);
            // console.log(this._block.getContent());
            // this._block.render(this._rootQuery, this._block);
            if (this.elRoot !== null) this.elRoot.textContent = '';
            this.elRoot?.append(this._block.getContent())
            this.elTitle.textContent = 'SPA ' + this._title;
            if (this.elHeadTitle) this.elHeadTitle.textContent = this._title;
            return;
        }
        
        
        this.elTitle.textContent = 'SPA ' + this._title;
        if (this.elHeadTitle) this.elHeadTitle.textContent = this._title;
        if (this.elRoot !== null) this.elRoot.textContent = ''; // так может быть лучше, не будет висеть в DOM куча инстансов
        this.elRoot?.append(this._block.getContent()) // и в app висит один объект
        // this._block.show(); // если активно, то блок висит в DOM
    }
}
