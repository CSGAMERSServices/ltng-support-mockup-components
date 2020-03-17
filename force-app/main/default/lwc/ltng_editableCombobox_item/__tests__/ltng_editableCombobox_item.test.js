/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for ltng_editableCombobox_item/__tests__/ltng_editableCombobox_item **/
import { createElement } from 'lwc';
import ltng_editableCombobox_item from 'c/ltng_editableCombobox_item';
// import { isArray } from 'util';

const defaultProperties = {
  label: 'test label',
  subLabel: 'test sub-label',
  icon: 'utility:error',
  value: 'test value',
  selectedValue: null
};

class TestSettings {
  constructor() {
    /**
     * type {HtmlElement}
     */
    this.element = createElement('c-ltng_editableCombobox_item', { is:ltng_editableCombobox_item });
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

describe('c-ltng_editableCombobox_item', () => {
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

  it('has the api properties accesible', () => {
    const ts = new TestSettings()
      .applyDefaultProperties()
      .attachElement();
    
    expect(ts.element.label).toBe(defaultProperties.label);
    expect(ts.element.subLabel).toBe(defaultProperties.subLabel);
    expect(ts.element.icon).toBe(defaultProperties.icon);
    expect(ts.element.value).toBe(defaultProperties.value);
  });

  describe('it has the icon provided', () => {
    it('if the value does not match', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(customTS => {
          customTS.element.value = 'something';
          customTS.element.selectedValue = 'somethingElse';
        })
        .attachElement();
      
      const expected = defaultProperties.icon;
  
      const iconEl = ts.element.shadowRoot.querySelector('lightning-icon');
      expect(iconEl).toBeTruthy();
      expect(iconEl.iconName).toBe(expected);
    });

    it('if the selected value is undefined', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(customTS => {
          customTS.element.value = 'something';
          customTS.element.selectedValue = undefined;
        })
        .attachElement();
      
      const expected = defaultProperties.icon;
  
      const iconEl = ts.element.shadowRoot.querySelector('lightning-icon');
      expect(iconEl).toBeTruthy();
      expect(iconEl.iconName).toBe(expected);
    });

    it('if the selected value is null', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(customTS => {
          customTS.element.value = 'something';
          customTS.element.selectedValue = null;
        })
        .attachElement();
      
      const expected = defaultProperties.icon;
  
      const iconEl = ts.element.shadowRoot.querySelector('lightning-icon');
      expect(iconEl).toBeTruthy();
      expect(iconEl.iconName).toBe(expected);
    });
  });

  describe('if the value DOES match > it has the CHECKED ICON', () => {
    const ts = new TestSettings()
      .applyDefaultProperties()
      .customSetup(customTS => {
        customTS.element.value = 'something';
        customTS.element.selectedValue = 'something';
      })
      .attachElement();
    
    const expected = 'utility:check';

    const iconEl = ts.element.shadowRoot.querySelector('lightning-icon');
    expect(iconEl).toBeTruthy();
    expect(iconEl.iconName).toBe(expected);
  });
});