export class PubSub extends EventTarget {
  callbacks: any;
  constructor() {
    super();
    this.callbacks = {};
  }
  emit(route: string, ...args: any) {
    const event = new CustomEvent(route, { detail: args });
    this.dispatchEvent(event);
  }
  on(route: string, callback: any) {
    const listener = (e: CustomEvent) => callback(...e.detail);
    this.callbacks[callback] = listener;
    this.addEventListener(route, listener as EventListener);
  }
  off(route: string, callback: any) {
    const listener = this.callbacks[callback];
    if (listener) this.removeEventListener(route, listener);
  }
}
