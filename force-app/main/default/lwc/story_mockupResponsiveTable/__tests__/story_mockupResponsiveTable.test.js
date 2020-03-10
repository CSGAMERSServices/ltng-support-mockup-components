/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for story_mockupResponsiveTable/__tests__/story_mockupResponsiveTable **/
import { createElement } from 'lwc';
import story_mockupResponsiveTable from 'c/story_mockupResponsiveTable';

const defaultProperties = {};

class TestSettings {
  constructor() {
    /**
     * type {HtmlElement}
     */
    this.element = createElement('c-story_mockupResponsiveTable', { is:story_mockupResponsiveTable });
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

describe('c-story_mockupResponsiveTable', () => {
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
  });
  it('has scenes', () => {
    const ts = new TestSettings()
      .applyDefaultProperties()
      .attachElement();
    expect(ts.element.allScenes).not.toBeNull();
    expect(ts.element.allScenes.length).toBeGreaterThan(0);
  });
});