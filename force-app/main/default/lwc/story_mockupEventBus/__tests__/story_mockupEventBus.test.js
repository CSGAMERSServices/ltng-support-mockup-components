/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for story_mockupEventBus/__tests__/story_mockupEventBus **/
import { createElement } from 'lwc';
import story_mockupEventBus from 'c/story_mockupEventBus';
import { isArray } from 'util';

import * as data from '../../ltng_mockupEventBus/__data__';

class TestSettings {
  constructor() {
    /**
     * type {HtmlElement}
     */
    this.element = createElement('c-story_mockupEventBus', { is:story_mockupEventBus });
  }

  /**
   * Performs a custom setup step
   * @param {(TestSettings) => TestSettings}
   */
  customSetup(setupStep) {
    setupStep(this);
    return this;
  }

  attachElement() {
    data.execPageReferenceMock();
    document.body.appendChild(this.element);
    return this;
  }
}

describe('c-story_mockupEventBus', () => {
  //-- boilerplate DOM reset
  afterEach(() => {
    while (document.body.firstChild){
      document.body.removeChild(document.body.firstChild);
    }
  });
  
  it('can be created', () => {
    const ts = new TestSettings()
      .attachElement();
    
    expect(ts.element).not.toBe(null);
  });

  it('has scenes', () => {
    const ts = new TestSettings()
      .attachElement();

    expect(ts.element.currentScene).toBeTruthy();
    
    expect(ts.element.allScenes).toBeTruthy();
    expect(isArray(ts.element.allScenes)).toBeTruthy();
    expect(ts.element.allScenes.length).toBeGreaterThanOrEqual(0);
  });
});