/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for story_mockupPlaceholder/__tests__/story_mockupPlaceholder **/
import { createElement } from 'lwc';
import story_mockupPlaceholder from 'c/story_mockupPlaceholder';

const defaultProperties = {};

class TestSettings {
  constructor() {
    /**
     * type {HtmlElement}
     */
    this.element = createElement('c-story_mockupPlaceholder', { is:story_mockupPlaceholder });
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
   * Applies the default properties on the component.
   * @returns {TestSettings}
   */
  applyDefaultProperties() {
    Object.assign(this.element, defaultProperties);
    return this;
  }

  attachElement() {
    document.body.appendChild(this.element);
    return this;
  }
}

describe('c-story_mockupPlaceholder', () => {
  //-- boilerplate DOM reset
  afterEach(() => {
    while (document.body.firstChild){
      document.body.removeChild(document.body.firstChild);
    }
  });
  
  it('can be created', () => {
    const ts = new TestSettings()
      .applyDefaultProperties()
      .attachElement();
    
    expect(ts.element).not.toBe(null);

    const stories = ts.element.shadowRoot.querySelectorAll('c-ltng_mockup-placeholder');
    expect(stories).toBeTruthy();
    expect(stories.length).toBeGreaterThan(0);
  });

  it('has scenes', () => {
    const ts = new TestSettings()
      .applyDefaultProperties()
      .attachElement();
    
    expect(ts.element.allScenes).toBeTruthy();
    expect(ts.element.allScenes.length).toBeGreaterThan(0);
  });
});