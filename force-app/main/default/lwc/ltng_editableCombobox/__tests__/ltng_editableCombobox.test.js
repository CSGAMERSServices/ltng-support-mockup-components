/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for ltng_editableCombobox/__tests__/ltng_editableCombobox **/
import { createElement } from 'lwc';
import ltng_editableCombobox from 'c/ltng_editableCombobox';
// import { isArray } from 'util';

const defaultProperties = {
  options: [],
  isOpen: false,
  label: 'Test Label',
  placeholder: 'Test Placeholder'
};

class TestSettings {
  constructor() {
    /**
     * type {HtmlElement}
     */
    this.element = createElement('c-ltng_editableCombobox', { is:ltng_editableCombobox });
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

import * as data from '../__data__';

describe('c-ltng_editableCombobox', () => {
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

    expect(ts.element.options).toStrictEqual(defaultProperties.options);
    expect(ts.element.isOpen).toBe(defaultProperties.isOpen);
    expect(ts.element.label).toBe(defaultProperties.label);
    expect(ts.element.placeholder).toBe(defaultProperties.placeholder);
    
    // const div = ts.element.shadowRoot.querySelector('div');
    // expect(div.textContent).toBe('Hello, World!');
  });

  it('has data', () => {
    expect(data.EXAMPLE_OPTION).toBeTruthy();
    expect(data.LONG_OPTIONS.length).toBeGreaterThan(5);
    expect(data.SHORT_OPTIONS.length).toBeGreaterThanOrEqual(1);
  });

  it('can have options updated', () => {

  });
});