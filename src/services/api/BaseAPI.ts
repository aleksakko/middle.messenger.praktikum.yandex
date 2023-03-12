import HTTPTransport from "../../utils/HTTPTransport";

export default abstract class BaseAPI {
    protected http: HTTPTransport;

    protected constructor(endpoint: string) {
        this.http = new HTTPTransport(`https://ya-praktikum.tech/api/v2${endpoint}`);
    }

    public abstract create?(data: unknown): Promise<unknown>

    public abstract read?(id_or_queryObj?: number | unknown): Promise<unknown>

    public abstract update?(id: string, data: unknown): Promise<unknown>

    public abstract delete?(id: string): Promise<unknown>
    
}
