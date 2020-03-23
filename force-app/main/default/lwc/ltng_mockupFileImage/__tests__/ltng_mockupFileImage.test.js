/* eslint-disable @lwc/lwc/no-inner-html */

import * as data from '../__data__';

const mockCustomEvent = CustomEvent;
jest.mock(
  'lightning/navigation',
  () => {
    //-- see the sfdx-lwc-jest implementation for the default mock used without using mocks
    //-- https://github.com/salesforce/sfdx-lwc-jest/blob/master/src/lightning-stubs/navigation/navigation.js

    const result = {};

    result.CurrentPageReference = jest.fn();

    const Navigate = Symbol("Navigate");
    const GenerateUrl = Symbol("GenerateUrl");

    const NavigationMixin = (Base) => {
      return class extends Base {
        [Navigate](navigateArg){
          this.dispatchEvent(new mockCustomEvent('navigate', {detail:navigateArg}));
        }
        [GenerateUrl](){
          this.dispatchEvent(new mockCustomEvent('generate'));
        }
      };
    };
    NavigationMixin.Navigate = Navigate;
    NavigationMixin.GenerateUrl = GenerateUrl;

    result.NavigationMixin = NavigationMixin;

    return result;
  },
  { virtual: true }
);

jest.mock(
  'c/ltng_mockupEventBus',
  () => {
    return {
      fireEvent: jest.fn(),
      registerListener: jest.fn(),
      unregisterListener: jest.fn()
    };
  },
  { virtual: true }
);
import { registerListener, unregisterListener } from 'c/ltng_mockupEventBus';

/** JEST Test for ltng_mockupFileImage/__tests__/ltng_mockupFileImage **/
import { createElement } from 'lwc';
import ltng_mockupFileImage from 'c/ltng_mockupFileImage';
// import { isArray } from 'util';

const defaultProperties = {
  contentId: '/assets/431edcbfb2/ltng_ExamplePlaceholderImage',
  description: 'test description',
  imgWidth: '400px',
  imgHeight: '300px',
  targetAddress: 'https://www.salesforce.com'
};

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

  /**
   * Fires the default wire mocks
   */
  applyWireMocks() {
    data.execFileContentURL();
    data.execGetSettings();
    data.execPageReferenceMock();
    return this;
  }

  attachElement() {
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
    registerListener.mockReset();
    unregisterListener.mockReset();

    jest.resetModules();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('can be created', () => {
    const ts = new TestSettings()
      .applyDefaultProperties()
      .applyWireMocks()
      .attachElement();
    
    expect(ts.element).not.toBe(null);
    // const div = ts.element.shadowRoot.querySelector('div');
    // expect(div.textContent).toBe('Hello, World!');
    expect(ts.element.contentId).toBe(defaultProperties.contentId);
    expect(ts.element.description).toBe(defaultProperties.description);
    expect(ts.element.imgWidth).toBe(defaultProperties.imgWidth);
    expect(ts.element.imgHeight).toBe(defaultProperties.imgHeight);
    expect(ts.element.targetAddress).toBe(defaultProperties.targetAddress);
  });

  it('has accessible constants', () => {
    const ts = new TestSettings();

    expect(ts.element.constants.IMAGE_CHANGED_EVENT_TYPE).toBeTruthy();
    expect(ts.element.constants.generateCacheBuster).toBeTruthy();
  });

  describe('shows the files image address', () => {
    it('with the address provided', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(customTS => {
          customTS.element.contentId = null;

          data.execFileContentURL();
          data.execGetSettings();
          data.execPageReferenceMock();
        })
        .attachElement();
      
      const resultAddress = ts.element.contentAddress;
      const expected = data.determineFileContentURL_Data.Address;
      expect(resultAddress).toContain(expected);

      const imgEl = ts.element.shadowRoot.querySelector('img');
      expect(imgEl).toBeTruthy();
      expect(imgEl.getAttribute('src')).toContain(expected);
    });

    it('includes a cache buster if the settings disable caching', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(customTS => {
          customTS.element.contentId = null;
          
          data.execFileContentURL();
          data.execGetSettings();
          data.execPageReferenceMock();
        })
        .attachElement();
      
      const resultAddress = ts.element.contentAddress;
      expect(resultAddress).toContain('?t='); 
    });

    it('does not include a cache buster if the settings allow caching', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(customTS => {
          customTS.element.contentId = null;
          
          data.execFileContentURL();
          data.execGetSettingsDataCaching();
          data.execPageReferenceMock();
        })
        .attachElement();
      
      const resultAddress = ts.element.contentAddress;
      expect(resultAddress).not.toContain('?t='); 
    });

    it('does not show an image if the file could not be found', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(customTS => {
          customTS.element.contentId = null;
          
          //data.execFileContentURL();
          data.execGetSettingsDataCaching();
          data.execPageReferenceMock();
        })
        .attachElement();
      
      const resultAddress = ts.element.contentAddress;
      expect(resultAddress).toBe('');

      const imgEl = ts.element.shadowRoot.querySelector('img');
      expect(imgEl).toBeFalsy();
    });
  });

  it('width and height matches that provided', () => {
    const ts = new TestSettings()
      .applyDefaultProperties()
      .applyWireMocks()
      .attachElement();
    
    const imgSize = ts.element.calculatedStyle;
    const expected = 'width:400px; height:300px';
    expect(imgSize).toBe(expected);
  });

  describe('tooltip', () => {
    it('provides information about the file', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .applyWireMocks()
        .attachElement();

      const documentId = data.determineFileContentURL_Data.ContentDocumentId;
      const versionId = data.determineFileContentURL_Data.ContentDocumentId;
      const docTitle = data.determineFileContentURL_Data.Title;

      const toolTip = ts.element.tooltip;
      expect(toolTip).toContain(documentId);
      expect(toolTip).toContain(versionId);
      expect(toolTip).toContain(docTitle);
    });

    it('provides the description if provided', () => {
      const newDescription = 'test description';
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(runningTS => {
          runningTS.element.description = newDescription;
        })
        .applyWireMocks()
        .attachElement();

      const toolTip = ts.element.tooltip;
      expect(toolTip).toContain(newDescription);
    });

    it('does not provide description if not provided', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(runningTS => {
          runningTS.element.description = null;
        })
        .applyWireMocks()
        .attachElement();

      const toolTip = ts.element.tooltip;
      const expected = 'File:ltng_Button Strip (document:069R0000000qs3SIAQ/version:068R0000000r3iTIAQ) - ';
      expect(toolTip).toBe(expected);
    });

    it('does not throw errors if the file was not found', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(() => {
          // data.execFileContentURL();
          data.execGetSettings();
          data.execPageReferenceMock();
        })
        .attachElement();

      const toolTip = ts.element.tooltip;
      const expected = 'File:';
      expect(toolTip).toBe(expected);
    });
  });

  describe('generate cache buster', () => {
    it('generates a cache busting parameter, if true', () => {
      const ts = new TestSettings();
      
      const buster1 = ts.element.constants.generateCacheBuster(true);
      const buster2 = ts.element.constants.generateCacheBuster(true);

      expect(buster1).toContain('?t=');

      expect(buster1).not.toBe(buster2);
    });

    it('does not bust the cache if false', () => {
      const ts = new TestSettings();
      
      const buster1 = ts.element.constants.generateCacheBuster(false);
      const buster2 = ts.element.constants.generateCacheBuster(false);

      expect(buster1).not.toContain('?t=');

      expect(buster1).toBe(buster2);
    });
  });

  describe('when the user clicks the image', () => {
    it('navigates if there is a target location', () => {
      const targetAddress = 'https://www.salesforce.com';
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(runningTS => {
          runningTS.element.targetAddress = targetAddress;
        })
        .applyWireMocks()
        .attachElement();
      
      const clickEvt = new CustomEvent('click', {bubbles:true});
      const imgEl = ts.element.shadowRoot.querySelector('img');
      expect(imgEl).toBeTruthy();

      //-- listen that we want to navigate
      //-- note this is provided from the navigation mock above
      const navigationHandler = jest.fn();
      ts.element.addEventListener('navigate', navigationHandler);

      imgEl.dispatchEvent(clickEvt);

      expect(navigationHandler).toHaveBeenCalled();
      const navigationArguments = navigationHandler.mock.calls[0][0];
      expect(navigationArguments.detail).toBeTruthy();
      expect(navigationArguments.detail.attributes.url).toBe(targetAddress);
    });

    it('does not navigate if there is no target location', () => {
      const targetAddress = '';
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(runningTS => {
          runningTS.element.targetAddress = targetAddress;
        })
        .applyWireMocks()
        .attachElement();
      
      const clickEvt = new CustomEvent('click', {bubbles:true});
      const imgEl = ts.element.shadowRoot.querySelector('img');
      expect(imgEl).toBeTruthy();

      //-- listen that we want to navigate
      //-- note this is provided from the navigation mock above
      const navigationHandler = jest.fn();
      ts.element.addEventListener('navigate', navigationHandler);

      imgEl.dispatchEvent(clickEvt);

      expect(navigationHandler).not.toHaveBeenCalled();
    });
  });

  describe('event bus', () => {
    it('listens when the component is added', () => {
      expect(registerListener).toBeTruthy();
      expect(registerListener).not.toHaveBeenCalled();

      new TestSettings()
        .applyDefaultProperties()
        .applyWireMocks()
        .attachElement();
      
      expect(registerListener).toHaveBeenCalled();
      const args = registerListener.mock.calls[0];
      expect(args).toBeTruthy();

      const [eventType, listenerFn, el] = args;
      expect(eventType).toBe('imageuploaded');
      expect(listenerFn).toBeTruthy();
      expect(el).toBeTruthy();

      const fn = () => listenerFn.call(el);

      expect(fn).not.toThrow();
      fn();
    });
  });
});