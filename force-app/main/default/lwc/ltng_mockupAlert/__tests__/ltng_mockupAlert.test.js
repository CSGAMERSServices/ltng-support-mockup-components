/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for ltng_mockupAlert/__tests__/ltng_mockupAlert **/
import { createElement } from 'lwc';
import ltng_mockupAlert from 'c/ltng_mockupAlert';
// import { isArray } from 'util';

const defaultProperties = {};

class TestSettings {
  constructor() {
    /**
     * type {HtmlElement}
     */
    this.element = createElement('c-ltng_mockupAlert', { is:ltng_mockupAlert });
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

describe('c-ltng_mockupAlert', () => {
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
    
    // const div = ts.element.shadowRoot.querySelector('div');
    // expect(div.textContent).toBe('Hello, World!');
  });
});