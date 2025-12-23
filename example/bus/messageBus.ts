import EventEmmitter from 'events';

const eventEmitter = new EventEmmitter();

export function subscribe(message, handler) {
    eventEmitter.on(message, handler);
}

export function dispatch(message) {
    console.info(`[DISPATCH]: ${message}`);
    eventEmitter.emit(message);
}
