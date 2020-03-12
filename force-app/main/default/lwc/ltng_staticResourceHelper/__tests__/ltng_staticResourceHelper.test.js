/* eslint-disable @lwc/lwc/no-inner-html */

/* eslint-disable no-unused-vars */
/** JEST Test for ltng_staticResourceHelper/__tests__/ltng_staticResourceHelper **/
import { createElement } from 'lwc';
import ltng_staticResourceHelper from 'c/ltng_staticResourceHelper';
import { ENTER_KEY } from 'c/ltng_staticResourceHelper';
// import { isArray } from 'util';

import apexFindStaticResources from '@salesforce/apex/ltng_staticResourceHelperCtrl.findStaticResources';
import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
const apexFindStaticResourcesStub = registerLdsTestWireAdapter(apexFindStaticResources);

const staticResourceResults = {
  data: [{
    type: 'StaticResource'
  }]
};
/* eslint-enable no-unused-vars */

const defaultProperties = {};

class TestSettings {
  constructor() {
    /**
     * type {HtmlElement}
     */
    this.element = createElement('c-ltng_staticResourceHelper', { is:ltng_staticResourceHelper });
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

describe('c-ltng_staticResourceHelper', () => {
  //-- boilerplate DOM reset
  afterEach(() => {
    while (document.body.firstChild){
      document.body.removeChild(document.body.firstChild);
    }
  });
  
  it('can be created', () => {
    const ts = new TestSettings()
      .applyDefaultProperties()
      .customSetup(customTS => {
        customTS.element.exampleProp = '';
      })
      .attachElement();
    
    expect(ts.element).not.toBe(null);
    
    // const div = ts.element.shadowRoot.querySelector('div');
    // expect(div.textContent).toBe('Hello, World!');
  });

  describe('user presses return on the search', () => {
    it('updates the query term', (done) => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .attachElement();

      const searchTerm = 'ltng_';

      // const searchInputContainer = ts.element.shadowRoot
      //   .querySelector('div.search-box');

      const searchInput = ts.element.shadowRoot
        .querySelector('div.search-box > lightning-input');
      
      expect(searchInput).toBeTruthy();

      searchInput.value = searchTerm;
      // see https://javascript.info/dispatch-events
      const enterEvent = new CustomEvent('keyup', {
        detail: {
          keyCode: ENTER_KEY
        },
        keyCode: ENTER_KEY,
        bubbles: true
      });
      searchInput.dispatchEvent(enterEvent);

      expect(ts.element.queryTerm).toBe(searchTerm);

      done();
    });
  });

  /*
  it('performs a search', (done) => {
    const ts = new TestSettings()
      .applyDefaultProperties()
      .attachElement();

    apexFindStaticResourcesStub.emit(staticResourceResults);

    expect(ts.staticResources).toBeTruthy();

    done();
  });
  */
});