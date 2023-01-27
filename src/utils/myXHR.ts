enum METHODS {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE'
}
type Options = {
    method: string;
    data?: any;
}
type OptionsNoMethod = Omit<Options, 'method'>;

function queryStringify(data: Record<string, unknown>): string {
	return Object.keys(data)
        .map(key => key + '=' + data[key])
        .join('&');
}

export default class HTTPSender {
    get(url: string, options: OptionsNoMethod = {}): Promise<XMLHttpRequest>{
        return this.request(url, {...options, method: METHODS.GET});
    }
    post(url: string, options: OptionsNoMethod = {}): Promise<XMLHttpRequest>{
        return this.request(url, {...options, method: METHODS.POST});
    }
    put(url: string, options: OptionsNoMethod = {}): Promise<XMLHttpRequest>{
        return this.request(url, {...options, method: METHODS.PUT});
    }
    delete(url: string, options: OptionsNoMethod = {}): Promise<XMLHttpRequest>{
        return this.request(url, {...options, method: METHODS.DELETE});
    }

    request(url: string, options: Options = { method: METHODS.GET }, timeout = 5000): Promise<XMLHttpRequest> {
        const { method, data } = options;
    
        return new Promise((resolve, reject) => {
            if (!method) {
                reject('No method');
                return;
            }
            
            const xhr = new XMLHttpRequest();
            const isGet = method === METHODS.GET;
            const isData = data ? true : false;
            if (isGet && isData) {
                url += '?' + queryStringify(data);
            }

            xhr.open(method, url);
            xhr.setRequestHeader('Content-Type', 'text/plain');    

            xhr.onload = function() {
                resolve(xhr);
            }

            xhr.onabort = reject;
            xhr.onerror = reject;
            
            xhr.timeout = timeout;
            xhr.ontimeout = reject;

            if (isGet || !isData) {
                xhr.send();
            } else {
                xhr.send(data);
            }
        })
    }
}
