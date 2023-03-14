import Block from "./Block";

describe('Component BLock', () => {

    describe('init', () => {
        const block = new Block('textarea');

        it('should be created instance of component', () => {
            expect(block).toBeInstanceOf(Block);
        });
        
        it('should initialize with default values', () => {
          expect(block.id).toBeDefined();
          expect(block.eventBus).toBeDefined();
          expect(typeof block.eventBus()).toBe('object');
          expect(block['kids']).toEqual({});
          expect(block['props']).toEqual({});
        });

        it('should be HTMLElement - <textarea>', () => {
            expect(block.getContent()).toBeInstanceOf(HTMLTextAreaElement);
        })
    });

    describe('props', () => {
        const block = new Block();
        
        it('should not update props when values are equal', () => {
            block['props'] = { text: 'PROPS' };
            const oldProps = { ...block['props'] };
            block['props'].text = 'PROPS';
            expect(block['props']).toEqual(oldProps);
        });

        it('should stop changing private props', () => {
            const props = { _private: 'I am private!' };
            const proxyProps = block._makePropsProxy(props);
            expect(() => proxyProps._private).toThrow('Нет доступа');
        });

        it('should update props and emit FLOW_CDU event', () => {
            const eventBus = block.eventBus();
            const newProps = { text: 'newProp + event', onClick: () => {'stub'} };
            block['props'] = { text: 'newProp' };
            block['props'] = newProps;
            expect(block['props']).toEqual(newProps);
            expect(eventBus['listeners']['flow:component-did-update']).toHaveLength(1);
          });
    });
})
