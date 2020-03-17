/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for story_mockupFileImage/__tests__/story_mockupFileImage **/
import { createElement } from 'lwc';
import story_mockupFileImage from 'c/story_mockupFileImage';
import { isArray } from 'util';

import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import { CurrentPageReference } from 'lightning/navigation';
const pageReferenceMock = registerLdsTestWireAdapter(CurrentPageReference);

import apexGetSettings from '@salesforce/apex/ltng_mockupFileCtrl.getSettings';
const getSettingsMock = registerLdsTestWireAdapter(apexGetSettings);

import apexDetermineFileContentURL from '@salesforce/apex/ltng_mockupFileCtrl.determineFileContentURL';
const determineFileContentMock = registerLdsTestWireAdapter(apexDetermineFileContentURL);

class TestSettings {
  constructor() {
    /**
     * type {HtmlElement}
     */
    this.element = createElement('c-story_mockupFileImage', { is:story_mockupFileImage });
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
    
    expect(ts.element.allScenes).toBeTruthy();
    expect(isArray(ts.element.allScenes)).toBeTruthy();
    expect(ts.element.allScenes.length).toBeGreaterThan(0);
  });
});