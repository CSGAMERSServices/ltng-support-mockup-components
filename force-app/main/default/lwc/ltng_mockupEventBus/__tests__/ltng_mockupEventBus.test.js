/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for ltng_mockupEventBus/__tests__/ltng_mockupEventBus **/
import {
  registerListener,
  unregisterListener,
  unregisterAllListeners,
  fireEvent
} from 'c/ltng_mockupEventBus';

import * as data from '../__data__';

let UNIQUE = 0;
const generateMockComponent = (pageRef) => {
  const result = {
    pageRef: pageRef,
    unique: UNIQUE++
  };
  return result;
}

const EVENT_CHANGE = 'change';
const EVENT_ELSE = 'else';

/** @typedef {Object} PageRef */
/**
 * @typedef {Object} Component
 * @property {Object} pageRef - page reference
 */
/**
 * @typedef {Component} Emitter
 */
/**
 * @typedef {Component} Receiver
 * @property {Function} handleChange -
 * @property {Function} handleElse -
 */

class TestSettings {
  constructor() {
    /**
     * Page Reference
     * @type {PageRef}
     */
    this.pageRef = data.pageRef;

    /**
     * Different page ref
     * @type {PageRef}
     */
    this.otherPageRef = data.otherPageRef;

    /**
     * Component that will be emitting events
     * @type {Emitter}
     */
    this.emitter = generateMockComponent(this.pageRef);
    
    /**
     * Component that will be receiving events
     * @type {Receiver}
     **/
    this.receiver = generateMockComponent(this.pageRef);
    this.receiver.handleChange = jest.fn();
    this.receiver.handleElse = jest.fn();

    /**
     * Receiver on another page
     * @type {Receiver}
     */
    this.otherReceiver = generateMockComponent(this.otherPageRef);
    this.otherReceiver.handleChange = jest.fn();
    this.otherReceiver.handleElse = jest.fn();

    /**
     * Expected Payload
     * @type {Object} -
     */
    this.expectedPayload = { payload:'found' };
  }

  /**
   * Performs a custom setup step
   * @param {(TestSettings) => TestSettings}
   */
  customSetup(setupStep) {
    setupStep(this);
    return this;
  }

  /**
   * Setup two elements on the same page
   */
  setupSamePage() {
    this.otherReceiver.pageRef = this.pageRef;
    return this;
  }

  /**
   * Setup two elements on different pages
   */
  setupDifferentPage() {
    //-- default
    return this;
  }

  /**
   * Registers for the change event
   */
  registerForEvents() {
    registerListener(EVENT_CHANGE, this.receiver.handleChange, this.receiver);
    registerListener(EVENT_CHANGE, this.otherReceiver.handleChange, this.otherReceiver);
    registerListener(EVENT_ELSE, this.receiver.handleElse, this.receiver);
    registerListener(EVENT_ELSE, this.otherReceiver.handleElse, this.otherReceiver);
    return this;
  }

  /**
   * Reset listeners
   */
  resetListeners() {
    this.receiver.handleChange.mockReset();
    this.otherReceiver.handleChange.mockReset();
    this.receiver.handleElse.mockReset();
    this.otherReceiver.handleElse.mockReset();
  }

  finalize() {
    return this;
  }
}

describe('c-ltng_mockupEventBus', () => {
  //-- boilerplate DOM reset
  afterEach(() => {
    // while (document.body.firstChild){
    //   document.body.removeChild(document.body.firstChild);
    // }
  });
  
  it('can be created', () => {
    const ts = new TestSettings()
      .finalize()
    
    expect(ts.emitter).toBeTruthy();
    expect(ts.receiver).toBeTruthy();
    expect(ts.otherReceiver).toBeTruthy();

    expect(ts.emitter.pageRef).toBe(ts.pageRef);
    expect(ts.receiver.pageRef).toBe(ts.pageRef);
    expect(ts.otherReceiver.pageRef).toBe(ts.otherPageRef);
    expect(ts.pageRef).not.toBe(ts.otherPageRef);

    expect(ts.receiver.handleChange).toBeTruthy();
    expect(ts.receiver.handleElse).toBeTruthy();
    expect(ts.otherReceiver.handleChange).toBeTruthy();
    expect(ts.otherReceiver.handleElse).toBeTruthy();
  });

  it('event dispatched on same page is heard', () => {
    const ts = new TestSettings()
      .setupSamePage()
      .registerForEvents()
      .finalize();

    fireEvent(ts.pageRef, EVENT_CHANGE, ts.expectedPayload);

    let callResult;
    expect(ts.receiver.handleChange).toHaveBeenCalled();
    expect(ts.receiver.handleChange).toHaveBeenCalledTimes(1);
    callResult = ts.receiver.handleChange.mock.calls[0][0];
    expect(callResult).toBeTruthy();
    expect(callResult).toBe(ts.expectedPayload);

    expect(ts.otherReceiver.handleChange).toHaveBeenCalled();
    expect(ts.otherReceiver.handleChange).toHaveBeenCalledTimes(1);
    callResult = ts.otherReceiver.handleChange.mock.calls[0][0];
    expect(callResult).toBeTruthy();
    expect(callResult).toBe(ts.expectedPayload);

    expect(ts.receiver.handleElse).not.toHaveBeenCalled();
    expect(ts.otherReceiver.handleElse).not.toHaveBeenCalled();
  });

  it('event dispatched on different pages are not heard', () => {
    const ts = new TestSettings()
      .setupDifferentPage()
      .registerForEvents()
      .finalize();

    fireEvent(ts.pageRef, EVENT_CHANGE, ts.expectedPayload);

    let callResult;
    expect(ts.receiver.handleChange).toHaveBeenCalled();
    expect(ts.receiver.handleChange).toHaveBeenCalledTimes(1);
    callResult = ts.receiver.handleChange.mock.calls[0][0];
    expect(callResult).toBeTruthy();
    expect(callResult).toBe(ts.expectedPayload);

    expect(ts.otherReceiver.handleChange).not.toHaveBeenCalled();

    expect(ts.receiver.handleElse).not.toHaveBeenCalled();
    expect(ts.otherReceiver.handleElse).not.toHaveBeenCalled();
  });

  it('only fires the event once if the event is registered multiple times', () => {
    const ts = new TestSettings()
      .registerForEvents()
      .registerForEvents()
      .finalize();
    
    fireEvent(ts.pageRef, EVENT_CHANGE, ts.expectedPayload);

    let callResult;
    expect(ts.receiver.handleChange).toHaveBeenCalled();
    expect(ts.receiver.handleChange).toHaveBeenCalledTimes(1);
    callResult = ts.receiver.handleChange.mock.calls[0][0];
    expect(callResult).toBeTruthy();
    expect(callResult).toBe(ts.expectedPayload);

    expect(ts.otherReceiver.handleChange).not.toHaveBeenCalled();
  });

  it('firing for an event not found doesnt fail', () => {
    const ts = new TestSettings()
      .registerForEvents()
      .finalize();
    
    const fn = () => fireEvent(ts.pageRef, 'someunknown', ts.expectedPayload);

    expect(fn).not.toThrow();
  });

  it('firing for some page with nothing registered doesnt fail', () => {
    const ts = new TestSettings()
      .finalize();
    
    const fn = () => fireEvent(ts.pageRef, 'someunknown', ts.expectedPayload);

    expect(fn).not.toThrow();
  });

  it('throws an error if the component does not have a pageRef', () => {
    const handler = jest.fn();
    const fn = () => registerListener(EVENT_CHANGE, handler, {});
    expect(fn).toThrow();
    expect(handler).not.toHaveBeenCalled();
  });

  it('can reset the event mock calls', () => {
    const ts = new TestSettings()
      .setupSamePage()
      .registerForEvents()
      .finalize();

    fireEvent(ts.pageRef, EVENT_CHANGE, ts.expectedPayload);

    expect(ts.receiver.handleChange).toHaveBeenCalled();
    expect(ts.otherReceiver.handleChange).toHaveBeenCalled();

    ts.resetListeners();

    expect(ts.receiver.handleChange).not.toHaveBeenCalled();
    expect(ts.otherReceiver.handleChange).not.toHaveBeenCalled();
  });

  it('hears only the events once they are fired', () => {
    const ts = new TestSettings()
      .setupSamePage()
      .registerForEvents()
      .finalize();
    
    fireEvent(ts.pageRef, EVENT_CHANGE, ts.expectedPayload);

    expect(ts.receiver.handleChange).toHaveBeenCalled();
    expect(ts.otherReceiver.handleChange).toHaveBeenCalled();
    expect(ts.receiver.handleElse).not.toHaveBeenCalled();
    expect(ts.otherReceiver.handleElse).not.toHaveBeenCalled();

    fireEvent(ts.pageRef, EVENT_ELSE, ts.expectedPayload);

    expect(ts.receiver.handleElse).toHaveBeenCalled();
    expect(ts.otherReceiver.handleElse).toHaveBeenCalled();

    ts.resetListeners();

    expect(ts.receiver.handleChange).not.toHaveBeenCalled();
    expect(ts.otherReceiver.handleChange).not.toHaveBeenCalled();
    expect(ts.receiver.handleElse).not.toHaveBeenCalled();
    expect(ts.otherReceiver.handleElse).not.toHaveBeenCalled();
  });

  it('unregistering unregisters for only that single listener', () => {
    const ts = new TestSettings()
      .setupSamePage()
      .registerForEvents()
      .finalize();
    
    expect(ts.receiver.handleChange).not.toHaveBeenCalled();
    expect(ts.otherReceiver.handleChange).not.toHaveBeenCalled();
    expect(ts.receiver.handleElse).not.toHaveBeenCalled();
    expect(ts.otherReceiver.handleElse).not.toHaveBeenCalled();

    unregisterListener(EVENT_CHANGE, ts.receiver.handleChange, ts.receiver);

    fireEvent(ts.pageRef, EVENT_CHANGE, ts.expectedPayload);

    expect(ts.receiver.handleChange).not.toHaveBeenCalled();
    expect(ts.otherReceiver.handleChange).toHaveBeenCalled();
    expect(ts.receiver.handleElse).not.toHaveBeenCalled();
    expect(ts.otherReceiver.handleElse).not.toHaveBeenCalled();

    fireEvent(ts.pageRef, EVENT_ELSE, ts.expectedPayload);

    expect(ts.receiver.handleElse).toHaveBeenCalled();
    expect(ts.otherReceiver.handleElse).toHaveBeenCalled();
  });

  it('unregistering for an event not found doesnt fail', () => {
    const ts = new TestSettings()
      .setupSamePage()
      .registerForEvents()
      .finalize();
    
    const fn = () => unregisterListener('notfound', ts.receiver.handleChange, ts.receiver);
    
    expect(fn).not.toThrow();

    fireEvent(ts.pageRef, EVENT_CHANGE, ts.expectedPayload);
  
    expect(ts.receiver.handleChange).toHaveBeenCalled();
    expect(ts.otherReceiver.handleChange).toHaveBeenCalled();
  });

  it('unregistering an event for a component not found doesnt fail', () => {
    const ts = new TestSettings()
      .setupSamePage()
      .registerForEvents()
      .finalize();
    
    const someUnknownComponent = generateMockComponent(ts.pageRef);

    const fn = () => unregisterListener('notfound', ts.receiver.handleChange, someUnknownComponent);
    
    expect(fn).not.toThrow();

    fireEvent(ts.pageRef, EVENT_CHANGE, ts.expectedPayload);

    expect(ts.receiver.handleChange).toHaveBeenCalled();
    expect(ts.otherReceiver.handleChange).toHaveBeenCalled();
  });

  it('unregistering all unregisters all listeners for that component', () => {
    const ts = new TestSettings()
      .setupSamePage()
      .registerForEvents()
      .finalize();
    
    unregisterAllListeners(ts.receiver);

    fireEvent(ts.pageRef, EVENT_CHANGE, ts.expectedPayload);

    expect(ts.receiver.handleChange).not.toHaveBeenCalled();
    expect(ts.otherReceiver.handleChange).toHaveBeenCalled();
    expect(ts.receiver.handleElse).not.toHaveBeenCalled();
    expect(ts.otherReceiver.handleElse).not.toHaveBeenCalled();

    fireEvent(ts.pageRef, EVENT_ELSE, ts.expectedPayload);

    expect(ts.receiver.handleElse).not.toHaveBeenCalled();
    expect(ts.otherReceiver.handleElse).toHaveBeenCalled();
  });

  it('unregistering for all events for a component not found doesnt fail', () => {
    const ts = new TestSettings()
      .setupSamePage()
      .registerForEvents()
      .finalize();

    const someUnknownComponent = generateMockComponent(ts.pageRef);
    
    const fn = () => unregisterAllListeners(someUnknownComponent);
    
    expect(fn).not.toThrow();

    fireEvent(ts.pageRef, EVENT_CHANGE, ts.expectedPayload);

    expect(ts.receiver.handleChange).toHaveBeenCalled();
    expect(ts.otherReceiver.handleChange).toHaveBeenCalled();
  });
});