/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for story_mockupFileHelper/__tests__/story_mockupFileHelper **/
import { createElement } from 'lwc';
import story_mockupFileHelper from 'c/story_mockupFileHelper';
// import { isArray } from 'util';

class TestSettings {
  constructor() {
    /**
     * type {HtmlElement}
     */
    this.element = createElement('c-story_mockupFileHelper', { is:story_mockupFileHelper });
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
    
    expect(ts.element.expandedScene).toBeTruthy();
    expect(ts.element.collapsedScene).toBeTruthy();
    expect(ts.element.notCollapsibleScene).toBeTruthy();
  });
});