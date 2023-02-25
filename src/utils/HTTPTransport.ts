enum METHODS {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE'
}

type Options = {
    method: METHODS;
    data?: any;
    apiNameMethod?: string;
}

// type OptionsNoMethod = Omit<Options, 'method'>;
// type HTTPMethod = ( url: string, options?: OptionsNoMethod) => Promise<XMLHttpRequest>

// function queryStringify(data: Record<string, unknown>): string {
// 	return Object.keys(data)
//         .map(key => key + '=' + data[key])
//         .join('&');
// }

export default class HTTPTransport {
    static API_URL = 'https://ya-praktikum.tech/api/v2';
    protected endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = `${HTTPTransport.API_URL}${endpoint}`;
    }

    public get<Response>(path = '/'): Promise<Response> {
        return this.request<Response>( this.endpoint + path);
    }
    
    public post<Response = void> (path: string, data?: unknown): Promise<Response> {
        return this.request<Response>( this.endpoint + path, {
            method: METHODS.POST,
            data
        });
    }
    
    public put<Response = void> (path: string, data: unknown, apiNameMethod?: string): Promise<Response> {
        return this.request<Response>( this.endpoint + path, {
            method: METHODS.PUT,
            data,
            apiNameMethod
        });
    }
    
    public patch<Response> (path: string, data: unknown): Promise<Response> {
        return this.request<Response>( this.endpoint + path, {
            method: METHODS.PATCH,
            data
        });
    }
    
    public delete<Response> (path: string): Promise<Response> {
        return this.request<Response>( this.endpoint + path, {
            method: METHODS.DELETE
        });
    }

    private request<Response>(url: string, options: Options = { method: METHODS.GET },): Promise<Response> {
        const { method, data, apiNameMethod } = options;
    
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url);

            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status < 400) {
                        resolve(xhr.response);
                        console.log(xhr)
                        console.log(xhr.status, xhr.response);
                    } else {
                        reject(xhr.response);
                    }
                }
            };

            xhr.onabort = () => reject({ reason: 'abort' });
            xhr.onerror = () => reject({ reason: 'network error' });
            xhr.timeout = 5000;
            xhr.ontimeout = () => reject({ reason: 'timeout' });

            if ((apiNameMethod === 'multipart/form-data')) { // если отправляем картинку
                xhr.setRequestHeader('mode', 'cors');
            } else {
                xhr.setRequestHeader('Content-Type', 'application/json');
            }

            xhr.withCredentials = true;
            xhr.responseType = 'json';

            if (method === METHODS.GET || !data) {
                xhr.send();
            } else if (apiNameMethod === 'multipart/form-data') {
                xhr.send(data);
            } else {
                xhr.send(JSON.stringify(data));
            }
        })
    }
}
