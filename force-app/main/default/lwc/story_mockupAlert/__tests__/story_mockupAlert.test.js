/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for story_mockupAlert/__tests__/story_mockupAlert **/
import { createElement } from 'lwc';
import story_mockupAlert from 'c/story_mockupAlert';
import { isArray } from 'util';

class TestSettings {
  constructor() {
    /**
     * type {HtmlElement}
     */
    this.element = createElement('c-story_mockupAlert', { is:story_mockupAlert });
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

describe('c-story_mockupAlert', () => {
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

  it('shows the alert when the button is pushed', () => {
    const ts = new TestSettings()
      .attachElement();
    
    const btn = ts.element.shadowRoot.querySelector('[data-id="show-alert-btn"]');
    expect(btn).toBeTruthy();

    btn.dispatchEvent(new CustomEvent('click'));

    const alert = ts.element.shadowRoot.querySelector('[data-id="hidden-alert"]');
    expect(alert).toBeTruthy();

    expect(alert.isShown).toBe(true);
  });
});