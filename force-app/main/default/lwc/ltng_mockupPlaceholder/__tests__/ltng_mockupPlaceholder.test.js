/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for ltng_mockupPlaceholder/__tests__/ltng_mockupPlaceholder **/
import { createElement } from 'lwc';
import ltng_mockupPlaceholder from 'c/ltng_mockupPlaceholder';

const defaultProperties = {
  title: 'example title',
  subTitle: 'sub title',
  cmpHeight: '200px',
  cmpWidth: 'auto',
  showSizeDisplay: false
};

class TestSettings {
  constructor() {
    /**
     * type {HtmlElement}
     */
    this.element = createElement('c-ltng_mockupPlaceholder', { is:ltng_mockupPlaceholder });
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

describe('c-ltng_mockupPlaceholder', () => {
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
    
    expect(ts.element.title).toBe(defaultProperties.title);
    expect(ts.element.subTitle).toBe(defaultProperties.subTitle);
    expect(ts.element.cmpHeight).toBe(defaultProperties.cmpHeight);
    expect(ts.element.cmpWidth).toBe(defaultProperties.cmpWidth);
    expect(ts.element.showSizeDisplay).toBe(defaultProperties.showSizeDisplay);
  });

  it('has the width and height specified', () => {
    const ts = new TestSettings()
      .applyDefaultProperties()
      .attachElement();
    
    expect(ts.element.componentStyles).toBe('height: 200px; width: auto');
  });

  it('does not have width or height if not specified', () => {
    const ts = new TestSettings()
      .customSetup(ts1 => {
        // eslint-disable-next-line
        const {cmpWidth, cmpHeight, ...noSizeProperties} = defaultProperties;

        expect(noSizeProperties).not.toHaveProperty('cmpWidth');
        expect(noSizeProperties).not.toHaveProperty('cmpHeight');

        Object.assign(ts1.element, noSizeProperties);
      })
      .attachElement();
    
    expect(ts.element.componentStyles).toBe('');
  });

  it('does not have height if not specified', () => {
    const ts = new TestSettings()
      .customSetup(ts1 => {
        // eslint-disable-next-line
        const {cmpHeight, ...noSizeProperties} = defaultProperties;

        expect(noSizeProperties).not.toHaveProperty('cmpHeight');

        Object.assign(ts1.element, noSizeProperties);
      })
      .attachElement();
    
    expect(ts.element.componentStyles).toBe('width: auto');
  });

  it('does not have width if not specified', () => {
    const ts = new TestSettings()
      .customSetup(ts1 => {
        // eslint-disable-next-line
        const {cmpWidth, ...noSizeProperties} = defaultProperties;

        expect(noSizeProperties).not.toHaveProperty('cmpWidth');

        Object.assign(ts1.element, noSizeProperties);
      })
      .attachElement();
    
    expect(ts.element.componentStyles).toBe('height: 200px');
  });
});