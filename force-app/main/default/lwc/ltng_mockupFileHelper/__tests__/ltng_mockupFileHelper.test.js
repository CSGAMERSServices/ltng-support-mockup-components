/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for ltng_mockupFileHelper/__tests__/ltng_mockupFileHelper **/
import { createElement } from 'lwc';
import ltng_mockupFileHelper from 'c/ltng_mockupFileHelper';
// import { isArray } from 'util';

import * as data from '../__data__';

const defaultProperties = {
  showDropDownSpacer: false
};

class TestSettings {
  constructor() {
    /**
     * type {HtmlElement}
     */
    this.element = createElement('c-ltng_mockupFileHelper', { is:ltng_mockupFileHelper });
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

  /**
   * Fire the wire mock for page references
   * @return {TestSettings}
   */
  firePageReference() {
    data.execPageReferenceMock();
    return this;
  }
  
  /**
   * Fire wire mock to get recent files with values
   * @return {TestSettings}
   */
  fireFindFilesRecent() {
    data.exec_findFilesRecent();
    return this;
  }
  
  /**
   * Fire wire mock to get recent files with no values
   * @return {TestSettings}
   */
  fireFindFilesMockWithEmptyResults() {
    data.exec_findFilesEmpty();
    return this;
  }

  /**
   * Fire apex mock to update a content version
   * @return {TestSettings}
   */
  fireCreateContentVersion() {
    data.exec_createContentVersion();
    return this;
  }

  attachElement() {
    document.body.appendChild(this.element);
    return this;
  }
}

describe('c-ltng_mockupFileHelper', () => {
  //-- boilerplate DOM reset
  afterEach(() => {
    while (document.body.firstChild){
      document.body.removeChild(document.body.firstChild);
    }
  });
  
  it('can be created', () => {
    const ts = new TestSettings()
      .applyDefaultProperties()
      .firePageReference()
      .fireFindFilesRecent()
      .attachElement();
    
    expect(ts.element).not.toBe(null);

    expect(ts.element.showDropDownSpacer).toBe(defaultProperties.showDropDownSpacer);
    
    // const div = ts.element.shadowRoot.querySelector('div');
    // expect(div.textContent).toBe('Hello, World!');
  });
});