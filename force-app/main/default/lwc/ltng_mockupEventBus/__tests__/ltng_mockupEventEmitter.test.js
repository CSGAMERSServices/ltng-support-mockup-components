/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for ltng_mockupEventBus/__tests__/ltng_mockupEventBus **/
import {
  EventEmitter
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
     * @type {EventEmitter}
     */
    this.emitter = new EventEmitter();
    
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
    this.emitter.registerListener(this.receiver.handleChange, this.receiver);
    this.emitter.registerListener(this.otherReceiver.handleChange, this.otherReceiver);
    return this;
  }

  /**
   * Reset listeners
   */
  resetListeners() {
    this.receiver.handleChange.mockReset();
    this.otherReceiver.handleChange.mockReset();
  }

  finalize() {
    return this;
  }
}

describe('c-mockupEventBus.EventEmitter', () => {
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

    expect(ts.receiver.pageRef).toBe(ts.pageRef);
    expect(ts.otherReceiver.pageRef).toBe(ts.otherPageRef);
    expect(ts.pageRef).not.toBe(ts.otherPageRef);

    expect(ts.receiver.handleChange).toBeTruthy();
    expect(ts.otherReceiver.handleChange).toBeTruthy();
  });

  it('listens if a pageRef is sent specifically', () => {
    const ts = new TestSettings()
      .customSetup(customTS => {
        customTS.emitter.registerListener(customTS.receiver.handleChange, customTS.receiver, customTS.pageRef);
      })
      .finalize()
    
    ts.emitter.fireEvent(ts.pageRef, ts.expectedPayload);

    expect(ts.receiver.handleChange).toHaveBeenCalled();
    const details = ts.receiver.handleChange.mock.calls[0][0];
    expect(details).toBe(ts.expectedPayload);
  });

  describe('hears the last dispatch value on listen', () => {
    it('when the event is fired before the listener', () => {
      const ts = new TestSettings()
        .finalize();
      
      ts.emitter.fireEvent(ts.pageRef, ts.expectedPayload);

      ts.emitter.registerListener(
        ts.receiver.handleChange, ts.receiver, ts.pageRef, true
      );

      expect(ts.receiver.handleChange).toHaveBeenCalledTimes(1);
      const details = ts.receiver.handleChange.mock.calls[0][0];
      expect(details).toBe(ts.expectedPayload);
    });

    it('still fires even if the page reference is on the receiver', () => {
      const ts = new TestSettings()
        .finalize();
      
      ts.emitter.fireEvent(ts.pageRef, ts.expectedPayload);

      ts.emitter.registerListener(
        ts.receiver.handleChange, ts.receiver, ts.pageRef, true
      );

      expect(ts.receiver.handleChange).toHaveBeenCalledTimes(1);
      const details = ts.receiver.handleChange.mock.calls[0][0];
      expect(details).toBe(ts.expectedPayload);
    });
  })

  describe('it does not hear an event', () => {
    it('if the handler matches, but the object does not', () => {
      const ts = new TestSettings()
        .customSetup(customTS => {
          customTS.emitter.registerListener(customTS.otherReceiver.handleChange, customTS.receiver, customTS.pageRef);
        })
        .finalize()
      
      ts.emitter.fireEvent(ts.pageRef, ts.expectedPayload);

      expect(ts.receiver.handleChange).not.toHaveBeenCalled();
    });

    it('if the handler does not match, but the object does', () => {
      const ts = new TestSettings()
        .customSetup(customTS => {
          customTS.emitter.registerListener(() => {}, customTS.otherReceiver, customTS.pageRef);
        })
        .finalize()
      
      ts.emitter.fireEvent(ts.pageRef, ts.expectedPayload);

      expect(ts.receiver.handleChange).not.toHaveBeenCalled();
    });

    it('if the pageRef does not match', () => {
      const ts = new TestSettings()
        .customSetup(customTS => {
          customTS.emitter.registerListener(customTS.receiver.handleChange, customTS.receiver, customTS.otherPageRef);
        })
        .finalize()
      
      ts.emitter.fireEvent(ts.pageRef, ts.expectedPayload);

      expect(ts.receiver.handleChange).not.toHaveBeenCalled();
    });
  });

  it('event dispatched on same page is heard', () => {
    const ts = new TestSettings()
      .setupSamePage()
      .registerForEvents()
      .finalize();

    ts.emitter.fireEvent(ts.pageRef, ts.expectedPayload);

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
  });

  it('event dispatched on different pages are not heard', () => {
    const ts = new TestSettings()
      .setupDifferentPage()
      .registerForEvents()
      .finalize();

    ts.emitter.fireEvent(ts.pageRef, ts.expectedPayload);

    let callResult;
    expect(ts.receiver.handleChange).toHaveBeenCalled();
    expect(ts.receiver.handleChange).toHaveBeenCalledTimes(1);
    callResult = ts.receiver.handleChange.mock.calls[0][0];
    expect(callResult).toBeTruthy();
    expect(callResult).toBe(ts.expectedPayload);

    expect(ts.otherReceiver.handleChange).not.toHaveBeenCalled();
  });

  it('only fires the event once if the event is registered multiple times', () => {
    const ts = new TestSettings()
      .registerForEvents()
      .registerForEvents()
      .finalize();
    
    ts.emitter.fireEvent(ts.pageRef, ts.expectedPayload);

    let callResult;
    expect(ts.receiver.handleChange).toHaveBeenCalled();
    expect(ts.receiver.handleChange).toHaveBeenCalledTimes(1);
    callResult = ts.receiver.handleChange.mock.calls[0][0];
    expect(callResult).toBeTruthy();
    expect(callResult).toBe(ts.expectedPayload);

    expect(ts.otherReceiver.handleChange).not.toHaveBeenCalled();
  });

  it('firing for some page with nothing registered doesnt fail', () => {
    const ts = new TestSettings()
      .finalize();
    
    const fn = () => ts.emitter.fireEvent(ts.pageRef, ts.expectedPayload);

    expect(fn).not.toThrow();
  });

  it('throws an error if the component does not have a pageRef', () => {
    const ts = new TestSettings()
      .finalize();
    
    const handler = jest.fn();
    const fn = () => ts.emitter.registerListener(handler, {});
    expect(fn).toThrow();
    expect(handler).not.toHaveBeenCalled();
  });

  it('can reset the event mock calls', () => {
    const ts = new TestSettings()
      .setupSamePage()
      .registerForEvents()
      .finalize();

    ts.emitter.fireEvent(ts.pageRef, ts.expectedPayload);

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
    
    ts.emitter.fireEvent(ts.pageRef, ts.expectedPayload);

    expect(ts.receiver.handleChange).toHaveBeenCalled();
    expect(ts.otherReceiver.handleChange).toHaveBeenCalled();

    ts.emitter.fireEvent(ts.pageRef, ts.expectedPayload);

    ts.resetListeners();

    expect(ts.receiver.handleChange).not.toHaveBeenCalled();
    expect(ts.otherReceiver.handleChange).not.toHaveBeenCalled();
  });

  it('unregistering unregisters for only that single listener', () => {
    const ts = new TestSettings()
      .setupSamePage()
      .registerForEvents()
      .finalize();
    
    expect(ts.receiver.handleChange).not.toHaveBeenCalled();
    expect(ts.otherReceiver.handleChange).not.toHaveBeenCalled();

    ts.emitter.unregisterListener(ts.receiver.handleChange, ts.receiver);

    ts.emitter.fireEvent(ts.pageRef, ts.expectedPayload);

    expect(ts.receiver.handleChange).not.toHaveBeenCalled();
    expect(ts.otherReceiver.handleChange).toHaveBeenCalled();

    ts.emitter.fireEvent(ts.pageRef, ts.expectedPayload);
  });

  it('unregistering an event for a component not found doesnt fail', () => {
    const ts = new TestSettings()
      .setupSamePage()
      .registerForEvents()
      .finalize();
    
    const someUnknownComponent = generateMockComponent(ts.pageRef);

    const fn = () => ts.emitter.unregisterListener(ts.receiver.handleChange, someUnknownComponent);
    
    expect(fn).not.toThrow();

    ts.emitter.fireEvent(ts.pageRef, ts.expectedPayload);

    // expect(ts.receiver.handleChange).toHaveBeenCalled();
    expect(ts.otherReceiver.handleChange).toHaveBeenCalled();
  });

  it('unregistering all unregisters all listeners for that component', () => {
    const ts = new TestSettings()
      .setupSamePage()
      .registerForEvents()
      .finalize();
    
    ts.emitter.unregisterAllListeners(ts.receiver);

    ts.emitter.fireEvent(ts.pageRef, ts.expectedPayload);

    expect(ts.receiver.handleChange).not.toHaveBeenCalled();
    expect(ts.otherReceiver.handleChange).toHaveBeenCalled();

    ts.emitter.fireEvent(ts.pageRef, ts.expectedPayload);
  });

  it('unregistering for all events for a component not found doesnt fail', () => {
    const ts = new TestSettings()
      .setupSamePage()
      .registerForEvents()
      .finalize();

    const someUnknownComponent = generateMockComponent(ts.pageRef);
    
    const fn = () => ts.emitter.unregisterAllListeners(someUnknownComponent);
    
    expect(fn).not.toThrow();

    ts.emitter.fireEvent(ts.pageRef, ts.expectedPayload);

    expect(ts.receiver.handleChange).toHaveBeenCalled();
    expect(ts.otherReceiver.handleChange).toHaveBeenCalled();
  });
});