import HTTPTransport, { queryStringify } from './HTTPTransport';

describe('HTTPTransport', () => {
    
    const baseURL = 'https://jsonplaceholder.typicode.com';
    const httpTransport: HTTPTransport= new HTTPTransport(baseURL);
    
    const data = {
        id: 1,
        name: 'John Doe',
        title: 'delectus aut autem',
        userId: '1'
    }
    
    it('should stringify correctly querystring from object', () => {
        expect(queryStringify(data))
            .toBe('id=1&name=John Doe&title=delectus aut autem&userId=1');
    });
  
    it('should send GET, GET with data without error on front side', async () => {        
        expect(async () => {
            await httpTransport.get('/todos/1')
        }).not.toThrow();
        
        expect(async () => {
            await httpTransport.get('/todos/1', data)
        }).not.toThrow();
    });

    it('should send POST, POST with data without error on front side', async () => {        
        expect(async () => {
            await httpTransport.post('/posts')
        }).not.toThrow();
        
        expect(async () => {
            await httpTransport.post('/posts', data)
        }).not.toThrow();
    });

    it('should send PUT with data without error on front side', async () => {        
        expect(async () => {
            await httpTransport.put('/todos/', data)
        }).not.toThrow();    
    });

    it('should send DELETE, DELETE with data without error on front side', async () => {
        expect(async () => {
            await httpTransport.delete('/todos/delete')
        }).not.toThrow();

        expect(async () => {
            await httpTransport.delete('/todos/delete', data)
        }).not.toThrow();   
    });

    it('should send PATCH with data without error on front side', async () => {
        expect(async () => {
            await httpTransport.patch('/todos/patch', data)
        }).not.toThrow();
    });
  
});
