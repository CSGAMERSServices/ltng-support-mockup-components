/**
 * PubSub for sibling communication.
 * @see lwc-recipes https://github.com/trailheadapps/lwc-recipes/tree/master/force-app/main/default/lwc/pubsub
 */

const events = {};

/**
 * @typedef {Object} PageReference
 */

/**
 * Confirm that two page references have the same attributes
 * @param {object} ref1 - The first page reference
 * @param {object} ref2 - The second page reference
 */
const sameObjectRef = (ref1, ref2) => {
  const obj1 = ref1.attributes;
  const obj2 = ref2.attributes;
  return obj1 && obj2 &&
    Object.keys(obj1)
      .concat(Object.keys(obj2))
      .every(key => {
        return obj1[key] === obj2[key];
      });
};

class EventListener {
  /**
   * The scope (this) called used when calling back
   * @type {Object}
   */
  thisArg;

  /**
   * The callback to execute
   * @type {Function}
   */
  callback;

  /**
   * The PageReference this object is under
   * @type {PageReference}
   */
  pageRef;

  constructor(callback, thisArg, pageRef) {
    this.callback = callback;
    this.thisArg = thisArg;
    this.pageRef = pageRef;
  }
}

/**
 * Class that can register listeners and dispatch events
 */
class EventEmitter {
  /**
   * The last value dispatched
   * (Useful for race conditions when listening)
   * @type {any}
   */
  lastValue;

  /**
   * The list of listeners for this event.
   * @type {EventListener[]}
   */
  listeners = [];

  constructor() {
    this.clear();
  }

  /**
   * Clears the entry
   */
  clear() {
    this.lastValue = null;
    this.listeners = [];
  }

  /**
   * Registers a callback for an event
   * (Note that dispatchLastValue can help protect against race conditions)
   * @param {Function} callback - Function to invoke when said event is fired.
   * @param {Object} thisArg - The scope (this) called used when calling back
   * @param {PageReference} pageRef - The scope that thisArg belongs to (used for filtering of listeners)
   * @param {Boolean} dispatchLastValue - Whether to dispatch immediately with the last value.
   */
  registerListener(callback, thisArg, pageRef, dispatchLastValue) {
    const effectivePageRef = this.determinePageRef(thisArg, pageRef);
    const shouldDispatchLastValue = dispatchLastValue === true;
    
    const duplicate = this.containsListener(callback, thisArg);
    if (!duplicate) {
      this.listeners.push(
        new EventListener(callback, thisArg, effectivePageRef)
      );

      //-- in cases where race conditions should apply
      //-- dispatch the last value for this event
      if (shouldDispatchLastValue &&
        !(this.lastValue === undefined || this.lastValue === null)
      ) {
        this.fireEvent(pageRef, this.lastValue);
      }
    }
  }

  /**
   * Unregister listeners so they do not get called on further firings.
   * @param {Function} callback - Function to invoke when said event is fired.
   * @param {Object} thisArg - The scope (this) called used when calling back
   */
  unregisterListener(callback, thisArg) {
    this.listeners = this.listeners.filter(
      listener => !(listener.callback === callback && listener.thisArg === thisArg)
    );
  }

  /**
   * Removes all listeners where thisArg is listening
   * @param {Object} thisArg - The scope (this) called used when calling back
   */
  unregisterAllListeners(thisArg) {
    this.listeners = this.listeners.filter(
      listener => listener.thisArg !== thisArg
    );
  }

  /**
   * Fires the callback for all listeners.
   * @param {PageRef} pageRef - Only components with matching pageRef will hear the event
   * @param {any} payload - the payload to fire
   */
  fireEvent(pageRef, payload) {
    this.lastValue = payload;

    this.listeners
      .filter(listener => sameObjectRef(pageRef, listener.pageRef))
      .forEach(listener => {
        try {
          listener.callback.call(listener.thisArg, payload);
        } catch (error) {
          //-- fail silently
        }
      });
  }

  /**
   * Determines the pageRef to use
   * (note, if the pageRef is null, then it is assumed thisArg.pageRef should be found)
   * @param {Object} thisArg - The scope (this) called used when calling back
   * @param {PageReference} pageRef - The scope that thisArg belongs to (used for filtering of listeners)
   * @returns {PageReference} - Either pageRef or thisArg.pageRef
   * @throws Error - if neither pageRef or thisArg.pageRef are found
   */
  determinePageRef(thisArg, pageRef) {
    if (pageRef) {
      return pageRef;
    } else if (thisArg.pageRef) {
      return thisArg.pageRef;
    }
    throw new Error('registerListener[pageRef] is required');
  }

  /**
   * Whether a listener is currently registered
   * @param {Function} callback - Function to invoke when said event is fired.
   * @param {Object} thisArg - The value to be passed as the this parameter to the callback function is bound.
   * @returns {Boolean} - whether this callback is already registered
   */
  containsListener(callback, thisArg) {
    const duplicate = this.listeners.find(listener => {
      return listener.callback === callback && listener.thisArg === thisArg;
    });
    return duplicate ? true : false;
  }
}

/**
 * Registers a callback for an event
 * @param {String} eventName - Name of the event to listen for.
 * @param {Function} callback - Function to invoke when said event is fired.
 * @param {Object} thisArg - The value to be passed as the this parameter to the callback function is bound.
 * @param {PageReference} pageRef - The page reference that the event is bound to
 * @param {Boolean} dispatchLastValue - Whether to dispatch immediately with the last value.
 */
const registerListener = (eventName, callback, thisArg, pageRef, dispatchLastValue) => {
  if (!events[eventName]) {
    events[eventName] = new EventEmitter();
  }
  return events[eventName].registerListener(callback, thisArg, dispatchLastValue);
};

/**
 * Unregisters a callback for an event
 * @param {string} eventName - Name of the event to unregister from.
 * @param {function} callback - Function to unregister.
 * @param {object} thisArg - The value to be passed as the this parameter to the callback function is bound.
 */
const unregisterListener = (eventName, callback, thisArg) => {
  if (events[eventName]) {
    events[eventName].unregisterListener(callback, thisArg);
  }
};

/**
 * Unregisters all event listeners bound to an object.
 * @param {object} thisArg - All the callbacks bound to this object will be removed.
 */
const unregisterAllListeners = thisArg => {
  Object.keys(events).forEach(eventName => {
    events[eventName].unregisterAllListeners(thisArg);
  });
};

/**
 * Fires an event to listeners.
 * @param {PageReference} pageRef - Reference of the page that represents the event scope.
 * @param {string} eventName - Name of the event to fire.
 * @param {*} payload - Payload of the event to fire.
 */
const fireEvent = (pageRef, eventName, payload) => {
  if (events[eventName]) {
    events[eventName].fireEvent(pageRef, payload);
  }
}

export {
  EventEmitter,
  registerListener,
  unregisterListener,
  unregisterAllListeners,
  fireEvent
};