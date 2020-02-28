/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for ltng_mockupHeader/__tests__/ltng_mockupHeader **/
import { createElement } from 'lwc';
import ltng_mockupHeader from 'c/ltng_mockupHeader';

const OBJECT_DEFAULTS = {
  title: 'Some Title',
  subTitle: 'Some SubTitle',
  iconCategory: 'standard',
  iconName: 'account'
}

class TestSettings {
  constructor() {
    this.element = createElement('c-ltng_mockup-header', { is:ltng_mockupHeader });
    Object.assign(this.element, OBJECT_DEFAULTS);
  }

  setupTitle(title, subTitle) {
    this.element.mainTitle = title;
    this.element.subTitle = subTitle;
    return this;
  }

  setupIcon(category, iconName) {
    this.element.iconCategory = category;
    this.element.iconName = iconName;
    return this;
  }

  attachElement() {
    document.body.appendChild(this.element);
    return this;
  }
}

describe('c-ltng_mockupHeader', () => {

  //-- boilerplate DOM reset
  afterEach(() => {
    while (document.body.firstChild){
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('can be created', () => {
    const ts = new TestSettings()
      .setupTitle('A', 'B')
      .setupIcon('C', 'D')
      .attachElement();
    
    expect(ts.element).not.toBe(null);
  });

  it('shows attributes provided', () => {
    const ts = new TestSettings()
      .setupTitle('A', 'B')
      .setupIcon('C', 'D')
      .attachElement();
    
    expect(ts.element).not.toBe(null);
    expect(ts.element.mainTitle).toBe('A');
    expect(ts.element.subTitle).toBe('B');
    expect(ts.element.iconCategory).toBe('C');
    expect(ts.element.iconName).toBe('D');
  });

  it('calculates the icon path based on category and name', () => {
    const ts = new TestSettings()
      .setupTitle('A', 'B')
      .setupIcon('C', 'D')
      .attachElement();
    
    expect(ts.element.iconPath).toBe('C:D');
  });

  it('displays the icon with the category and name provided', (done) => {
    const ts = new TestSettings()
      .setupTitle('Some Title', 'Some SubTitle')
      .setupIcon('standard', 'account')
      .attachElement();
    
    const icon = ts.element.shadowRoot.querySelector('lightning-icon');
    expect(icon).not.toBeNull();
    expect(icon.iconName).toBe('standard:account');
    expect(icon.alternativeText).toBe('account');
    done();
  });

  it('shows the title provided', (done) => {
    const ts = new TestSettings()
      .setupTitle('Some Title', 'Some SubTitle')
      .setupIcon('standard', 'account')
      .attachElement();
    
    const title = ts.element.shadowRoot.querySelector('.slds-media__body .slds-page-header__name-title h1 span');
    expect(title).not.toBeNull();
    expect(title.innerHTML).toBe('Some Title');

    const subTitle = ts.element.shadowRoot.querySelector('.slds-media .slds-media__body .slds-page-header__name-meta');
    expect(subTitle).not.toBeNull();
    expect(subTitle.innerHTML).toBe('Some SubTitle');
    done();
  });
});
