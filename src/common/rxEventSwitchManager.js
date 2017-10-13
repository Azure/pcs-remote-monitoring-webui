import Rx from 'rxjs';

/** A helper class for managing polling calls */
class RxEventSwitchManager {

  constructor() {
    this.emitter = new Rx.Subject();
    this.stream = this.emitter.switch();
  }

  /** 
   * Emits an event
   * @param {string} eventName The name of the event (can be anything but text is useful for debugging)
   * @param {function} eventCallback A function that returns an observable
   * @param {function} delayInterval (Optional) The time in ms to wait before calling the callback 
   */
  emit(eventName, eventCallback, delayInterval = 0) {
    const callEvent = Rx.Observable.of(eventName)
        .delay(delayInterval)
        .flatMap(eventCallback);
    this.emitter.next(callEvent);
  }

}

export default RxEventSwitchManager;
