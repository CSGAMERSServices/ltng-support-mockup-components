/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for story_editableCombobox/__tests__/story_editableCombobox **/
import { createElement } from 'lwc';
import story_editableCombobox from 'c/story_editableCombobox';
import { isArray } from 'util';

class TestSettings {
  constructor() {
    /**
     * type {HtmlElement}
     */
    this.element = createElement('c-story_editableCombobox', { is:story_editableCombobox });
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

  getComboboxes() {
    return [...this.element.shadowRoot.querySelectorAll('c-ltng_editable-combobox')];
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

  //-- the story only shows console logs anyway
  it('handles change events without error', () => {
    const ts = new TestSettings()
      .attachElement();
    
    let comboboxes = ts.getComboboxes();
    
    comboboxes.forEach(el => el.dispatchEvent(new CustomEvent('change')));

    //-- we are only showing console log messages
    expect(comboboxes).toBeTruthy();
  });

  it('handles key up events without error', () => {
    const ts = new TestSettings()
      .attachElement();

    jest.useFakeTimers();
    
    let comboboxes = ts.getComboboxes();
  
    comboboxes.forEach(el => el.dispatchEvent(new CustomEvent('keyup')));

    jest.runAllTimers();

    return Promise.resolve().then(() => {
      expect(comboboxes).toBeTruthy();
    });
  });

  it('can be disconnected without error', () => {
    const ts = new TestSettings()
      .attachElement();
    
    const comboboxes = ts.getComboboxes();

    document.body.removeChild(ts.element);

    return Promise.resolve().then(() => {
      expect(comboboxes).toBeTruthy();
    });
  });

});