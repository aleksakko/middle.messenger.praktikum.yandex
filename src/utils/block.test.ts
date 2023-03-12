import Block from "./Block";

describe('Component BLock', () => {

    const component = new Block('textarea');

    it('should be created instance of component', () => {
        expect(component).toBeInstanceOf(Block);
    });

    it('should be HTMLElement - <textarea>', () => {
        expect(component.getContent()).toBeInstanceOf(HTMLTextAreaElement);
    })
    
})
