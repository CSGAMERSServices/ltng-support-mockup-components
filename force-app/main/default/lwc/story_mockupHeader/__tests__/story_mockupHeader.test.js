/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for story_mockupHeader/__tests__/story_mockupHeader **/
import { createElement } from 'lwc';
import story_mockupHeader from 'c/story_mockupHeader';
import { isArray } from 'util';

class TestSettings {
  constructor() {
    /**
     * type {HtmlElement}
     */
    this.element = createElement('c-story_mockupHeader', { is:story_mockupHeader });
  }

  attachElement() {
    document.body.appendChild(this.element);
    return this;
  }
}

describe('c-story_mockupHeader', () => {
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
    expect(isArray(ts.element.allScenes)).toBeTruthy();
    expect(ts.element.allScenes.length).toBeGreaterThan(0);
  });
});