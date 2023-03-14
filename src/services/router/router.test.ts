import Block from '../../utils/Block';
import router, { Routes } from './';

describe('Router', () => {

    router.use(Routes.Main, Block, { title: 'TestRoute' });
    router.use(Routes.Auth, Block, { title: 'Авторизация' });
    router.use(Routes.Reg, Block, { title: 'Регистрация' });

    it('should return route object and check this title', () => {        
        let route = router.getRoute(Routes.Main);
        expect(route?.title).toEqual('TestRoute');
        route = router.getRoute(Routes.Auth);
        expect(route?.title).toEqual('Авторизация');
    });
    
    it('check router.go, create instance of class Block and render)', () => {
        const route = router.getRoute(Routes.Reg);

        const fakeRootElement = document.createElement('div');        
        const fakeElement = document.createElement('title');
        if (route) {
            route.elHeadTitle = fakeElement;
            route.elTitle = fakeElement;
            route.elRoot = fakeRootElement;
        }
        
        router.go(Routes.Reg);
        
        const block: any = route ? route['_block'] : {element: null};
        expect(block).toBeInstanceOf(Block); // блок создался
        expect(block['_element']).toBeInstanceOf(HTMLDivElement);
        expect(fakeRootElement.children[0]).toBeInstanceOf(HTMLDivElement); // рендер состоялся
    })
});
