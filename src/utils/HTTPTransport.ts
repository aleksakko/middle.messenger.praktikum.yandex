export enum METHODS {
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

export function queryStringify(data: {[key in string]: unknown}): string {
	return Object.keys(data)
        .map(key => key + '=' + data[key])
        .join('&');
}

export default class HTTPTransport {
    protected endpoint: string;

    constructor(URL: string) {
        this.endpoint = URL;
    }

    public get<Response, T>(path = '/', data?: T): Promise<Response> {
        const query = data ? `?${queryStringify(data)}` : '';
        return this.request( this.endpoint + path + query);
    }
    
    public post<Response = void> (path: string, data?: unknown): Promise<Response> {
        return this.request( this.endpoint + path, {
            method: METHODS.POST,
            data
        });
    }
    
    public put<Response = void> (path: string, data: unknown, apiNameMethod?: string): Promise<Response> {
        return this.request( this.endpoint + path, {
            method: METHODS.PUT,
            data,
            apiNameMethod
        });
    }
    
    public patch<Response> (path: string, data: unknown): Promise<Response> {
        return this.request( this.endpoint + path, {
            method: METHODS.PATCH,
            data
        });
    }
    
    public delete<Response> (path: string, data?: unknown): Promise<Response> {
        return this.request( this.endpoint + path, {
            method: METHODS.DELETE,
            data
        });
    }

    private request<Response>(url: string, options: Options = { method: METHODS.GET }): Promise<Response> {
        const { method, data, apiNameMethod } = options;
    
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url);

            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status < 400) {
                        resolve(xhr.response);
                        // console.log(xhr.status, xhr.response);
                    } else {
                        reject(xhr.response);
                    }
                }
            };

            xhr.onabort = () => reject({ reason: 'abort' });
            xhr.onerror = () => reject({ reason: 'network error' });
            xhr.timeout = 5000;
            xhr.ontimeout = () => reject({ reason: 'timeout' });

            if ((apiNameMethod === 'multipart/form-data')) { // ???????? ???????????????????? ????????????????
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
