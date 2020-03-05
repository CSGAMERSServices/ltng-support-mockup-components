/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for ltng_mockupImage/__tests__/ltng_mockupImage **/
import { createElement } from 'lwc';
import ltng_mockupImage from 'c/ltng_mockupImage';

// import ltng_ExamplePlaceholderImage from '@salesforce/resourceUrl/ltng_ExamplePlaceholderImage';

//-- @see https://gist.github.com/paulroth3d/8f91d88a823d566da9f404645d1bd30c
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

const elementDefaults = {
  resourceNameFromPicklist: '',
  resourceNameManualEntry: 'ltng_ExamplePlaceholderImage',
  description: 'Example Description',
  targetAddress: 'about:blank',
  imgWidth: 100,
  imgHeight: 100
};

class TestSettings {
  constructor() {
    /**
     * type {HtmlElement}
     */
    this.element = createElement('c-ltng_mockupImage', { is:ltng_mockupImage });
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
   * Specifies the description, resource name and target address
   */
  setupDefaults() {
    Object.assign(this.element, elementDefaults);
    return this;
  }

  attachElement() {
    document.body.appendChild(this.element);
    return this;
  }
}

describe('c-ltng_mockupImage', () => {
  //-- boilerplate DOM reset
  afterEach(() => {
    while (document.body.firstChild){
      document.body.removeChild(document.body.firstChild);
    }
  });
  
  it('can be created', () => {
    const ts = new TestSettings()
      .setupDefaults()
      .attachElement();
    
    expect(ts.element).not.toBe(null);
    expect(ts.element.description).toBe(elementDefaults.description);
    expect(ts.element.resourceNameFromPicklist).toBe(elementDefaults.resourceNameFromPicklist);
    expect(ts.element.resourceNameManualEntry).toBe(elementDefaults.resourceNameManualEntry);
    expect(ts.element.resourceName).toBe(elementDefaults.resourceNameManualEntry);
    expect(ts.element.targetAddress).toBe(elementDefaults.targetAddress);
    expect(ts.element.height).toBe(elementDefaults.height);
    expect(ts.element.width).toBe(elementDefaults.width);
  });

  it('calculates the resourceAddress', () => {
    const ts = new TestSettings()
      .setupDefaults()
      .attachElement();
    
    expect(ts.element.resourceAddress).toBe('/resource/ltng_ExamplePlaceholderImage');
  });

  it('calculates the style based on the height and width provided', (done) => {
    const ts = new TestSettings()
      .setupDefaults()
      .customSetup((customTS) => {
        customTS.element.imgWidth = 999;
        customTS.element.imgHeight = 999;
      })
      .attachElement();

    expect(ts.element.calculatedStyle).toBe('width:999; height:999');
    done();
  });

  it('uses the url provided for a resource name', () => {
    const expectedAssetURL='/assets/a5f03e4dde/ltng_ExamplePlaceholderImage';
    const ts = new TestSettings()
      .setupDefaults()
      .customSetup((customTS) => {
        customTS.element.resourceNameManualEntry = expectedAssetURL;
      })
      .attachElement();

    expect(ts.element.resourceAddress).toBe(expectedAssetURL);
  });

  it('navigates on click', (done) => {
    const ts = new TestSettings()
      .setupDefaults()
      .attachElement();
    
    const target = ts.element.shadowRoot.querySelector('a');

    const navigateHandler = jest.fn();
    ts.element.addEventListener('navigate', navigateHandler);

    const clickEvent = new CustomEvent('click');
    target.dispatchEvent(clickEvent);

    expect(navigateHandler).toHaveBeenCalled();
    expect(navigateHandler).toHaveBeenCalledTimes(1);

    const navigateDetail = navigateHandler.mock.calls[0][0].detail;
    expect(navigateDetail.attributes.url).toBe(elementDefaults.targetAddress);

    done();
  });

  it('uses the picklist resource name if provided', (done) => {
    const picklistName = 'ltng_somePicklistName';
    const manualEntryName = '';

    const ts = new TestSettings()
      .setupDefaults()
      .customSetup((customTS) => {
        customTS.element.resourceNameFromPicklist = picklistName;
        customTS.element.resourceNameManualEntry = manualEntryName;
      })
      .attachElement();

    expect(ts.element.resourceName).toBe(picklistName);
    done();
  });

  it('uses the picklist resource name even if manual entry is provided', (done) => {
    const picklistName = 'ltng_somePicklistName';
    const manualEntryName = 'ltng_somethingElse';

    const ts = new TestSettings()
      .setupDefaults()
      .customSetup((customTS) => {
        customTS.element.resourceNameFromPicklist = picklistName;
        customTS.element.resourceNameManualEntry = manualEntryName;
      })
      .attachElement();

    expect(ts.element.resourceName).toBe(picklistName);
    done();
  });

  it('uses the manual entry resource name only if the picklist name is blank', (done) => {
    const picklistName = '';
    const manualEntryName = 'ltng_manualEntryName';

    const ts = new TestSettings()
      .setupDefaults()
      .customSetup((customTS) => {
        customTS.element.resourceNameFromPicklist = picklistName;
        customTS.element.resourceNameManualEntry = manualEntryName;
      })
      .attachElement();

    expect(ts.element.resourceName).toBe(manualEntryName);
    done();
  });

  it('DOES NOT NAVIGATE if no url is provided', (done) => {
    const ts = new TestSettings()
      .setupDefaults()
      .customSetup((customTS) => {
        customTS.element.targetAddress = null;
      })
      .attachElement();
    
    const target = ts.element.shadowRoot.querySelector('a');

    const navigateHandler = jest.fn();
    ts.element.addEventListener('navigate', navigateHandler);

    const clickEvent = new CustomEvent('click');
    target.dispatchEvent(clickEvent);

    expect(navigateHandler).not.toHaveBeenCalled();

    done();
  });
});
