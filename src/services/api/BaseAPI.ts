import HTTPTransport from "../../utils/HTTPTransport";

export default abstract class BaseAPI {
    protected http: HTTPTransport;

    protected constructor(endpoint: string) {
        this.http = new HTTPTransport(endpoint);
    }
    // На случай, если забудете переопределить метод и используете его, — выстрелит ошибка
    public abstract create?(data: unknown): Promise<unknown>

    public abstract read?(id?: string): Promise<unknown>

    public abstract update?(id: string, data: unknown): Promise<unknown>

    public abstract delete?(id: string): Promise<unknown>
    
}
