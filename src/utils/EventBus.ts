type Cback = (...args: any[]) => void;

export default class EventBus {
    private readonly listeners: Record<string, Cback[]> = {};

    on(event: string, cback: Cback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }

        //console.log(`Подписан на ${event}`)
        this.listeners[event].push(cback);
    }
    
    off(event: string, cback: Cback) {
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${event}`);
        }
        
        this.listeners[event] = this.listeners[event].filter(
            listener => listener !== cback
        );
        //console.log(`Отписан от ${event}`)
    }
        
    emit(event: string, ...args: any[]) {
        if (!this.listeners[event]) {
            throw new Event(`Нет события: ${event}`);
        }

        this.listeners[event].forEach(listener => {
            listener(...args);
        });
    }
}

const EventBusGlobal = new EventBus();
export { EventBusGlobal };
