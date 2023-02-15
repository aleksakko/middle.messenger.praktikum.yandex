import Block from '../../utils/Block';
//import {render} from '../../utils/renderDOM';

export default class Route {
    protected _block: Block | null; // инстанс блока (создается в методе render)     
    public elem: HTMLElement | null;
    
    constructor(
        protected _path: string,
        protected _blockClass: new (_props: Record<string, any> | null) => Block,
        protected _props: Record<string, any>,
        protected _rootQuery: string
    ){
        this._block = null;
        this.elem = document.querySelector(this._rootQuery);
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
            this._block = new this._blockClass(this._props);
            console.log(this._block);
            //this._block.render(this._rootQuery, this._block);
            // this.elem.innerHTML = '';
            this.elem?.append(this._block.getContent())
            return;
        }
        
        
        // this.elem.innerHTML = ''; // так может быть лучше, не будет висеть в DOM куча инстансов
        // this.elem?.append(this._block.getContent()) // вот так зато в app висит один объект
        this._block.show();
    }
}
