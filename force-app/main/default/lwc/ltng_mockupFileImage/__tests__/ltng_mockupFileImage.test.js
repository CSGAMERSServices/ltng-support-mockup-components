/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for ltng_mockupFileImage/__tests__/ltng_mockupFileImage **/
import { createElement } from 'lwc';
import ltng_mockupFileImage from 'c/ltng_mockupFileImage';
// import { isArray } from 'util';

const defaultProperties = {
  contentId: '/assets/431edcbfb2/ltng_ExamplePlaceholderImage'
};

import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import { CurrentPageReference } from 'lightning/navigation';
const pageReferenceMock = registerLdsTestWireAdapter(CurrentPageReference);

import apexGetSettings from '@salesforce/apex/ltng_mockupFileCtrl.getSettings';
const getSettingsMock = registerLdsTestWireAdapter(apexGetSettings);

import apexDetermineFileContentURL from '@salesforce/apex/ltng_mockupFileCtrl.determineFileContentURL';
const determineFileContentMock = registerLdsTestWireAdapter(apexDetermineFileContentURL);

const examplePageRef = { type:'standard__navItemPage', attributes:{ apiName:'ltng_MockupExampleAppPage'}, state:{}};

debugger;

class TestSettings {
  constructor() {
    /**
     * type {HtmlElement}
     */
    this.element = createElement('c-ltng_mockupFileImage', { is:ltng_mockupFileImage });
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
    pageReferenceMock.emit(examplePageRef);
    document.body.appendChild(this.element);
    return this;
  }
}

describe('c-ltng_mockupFileImage', () => {
  //-- boilerplate DOM reset
  afterEach(() => {
    while (document.body.firstChild){
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('can be created', () => {
    const ts = new TestSettings()
      .applyDefaultProperties();

    debugger;

    ts.attachElement();
      //.attachElement();
    
    expect(ts.element).not.toBe(null);
    
    // const div = ts.element.shadowRoot.querySelector('div');
    // expect(div.textContent).toBe('Hello, World!');
  });
});