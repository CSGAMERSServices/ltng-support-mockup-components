/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for story_mockupImage/__tests__/story_mockupImage **/
import { createElement } from 'lwc';
import story_mockupImage from 'c/story_mockupImage';
import { isArray } from 'util';

class TestSettings {
  constructor() {
    /**
     * type {HtmlElement}
     */
    this.element = createElement('c-story_mockupImage', { is:story_mockupImage });
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

    expect(ts.element.allScenes).toBeDefined();
    expect(isArray(ts.element.allScenes)).toBeTruthy();
    expect(ts.element.allScenes.length).toBeGreaterThan(0);

    expect(ts.element.currentScene).toBeDefined();
  });
});