/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for story_staticResourceHelper/__tests__/story_staticResourceHelper **/
import { createElement } from 'lwc';
import story_staticResourceHelper from 'c/story_staticResourceHelper';

class TestSettings {
  constructor() {
    /**
     * type {HtmlElement}
     */
    this.element = createElement('c-story_staticResourceHelper', { is:story_staticResourceHelper });
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
    document.body.appendChild(this.element);
    return this;
  }
}

describe('c-story_mockupImage', () => {
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
    
    expect(ts.element.allScenes).toBeTruthy();
    expect(ts.element.allScenes.length).toBeGreaterThan(0);
  });
});