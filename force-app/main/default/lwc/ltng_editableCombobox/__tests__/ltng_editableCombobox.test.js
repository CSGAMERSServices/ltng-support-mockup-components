/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for ltng_editableCombobox/__tests__/ltng_editableCombobox **/
import { createElement } from 'lwc';
import ltng_editableCombobox from 'c/ltng_editableCombobox';
// import { isArray } from 'util';

import * as data from '../__data__';

const defaultProperties = {
  options: data.SHORT_OPTIONS,
  isOpen: 'false',
  label: 'Test Label',
  placeholder: 'Test Placeholder'
};

const optionalProperties = {
  text: 'Test Text Value',
  selection: data.SHORT_OPTIONS[1]
};

class TestSettings {
  constructor() {
    /**
     * type {HtmlElement}
     */
    this.element = createElement('c-ltng_editableCombobox', { is:ltng_editableCombobox });
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
   * Applies the text without a selection
   */
  applyText() {
    this.element.text = optionalProperties.text;
    return this;
  }
  
  /**
   * Applies the selection without text
   */
  applySelection() {
    this.element.selection = optionalProperties.selection;
    return this;
  }

  attachElement() {
    document.body.appendChild(this.element);
    return this;
  }
}

describe('c-ltng_editableCombobox', () => {
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

    expect(ts.element.options).toStrictEqual(defaultProperties.options);
    expect(ts.element.isOpen).toBe(defaultProperties.isOpen);
    expect(ts.element.label).toBe(defaultProperties.label);
    expect(ts.element.placeholder).toBe(defaultProperties.placeholder);
    
    // const div = ts.element.shadowRoot.querySelector('div');
    // expect(div.textContent).toBe('Hello, World!');
  });

  it('has data', () => {
    expect(data.EXAMPLE_OPTION).toBeTruthy();
    expect(data.LONG_OPTIONS.length).toBeGreaterThan(5);
    expect(data.SHORT_OPTIONS.length).toBeGreaterThanOrEqual(1);
  });

  describe('initial options', () => {
    it('does not throw errors if options are empty initially', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(newTS => {
          newTS.element.options = [];
        })
        .attachElement();
      
      const dropdownEl = ts.element.shadowRoot.querySelector('.slds-dropdown');
      expect(dropdownEl).toBeTruthy();
      expect(dropdownEl.getAttribute('role')).toBe('listbox');
    });

    it('can have options list updated', () => {
      const ts = new TestSettings()
        .customSetup(newTS => {
          const {options, ...propsWithoutOptions} = defaultProperties;
          expect(options).toBeTruthy();
          expect(propsWithoutOptions).not.toHaveProperty('options');
          Object.apply(newTS.element, propsWithoutOptions)
          newTS.element.options = [];
        })
        .attachElement();

      expect(ts.element.options).toBeTruthy();
      const initialOptionsLength = ts.element.options.length;
      
      ts.element.updateOptions(data.LONG_OPTIONS);

      const updatedOptionsLength = ts.element.options.length;

      expect(initialOptionsLength).not.toBe(updatedOptionsLength);
      expect(updatedOptionsLength).toBe(data.LONG_OPTIONS.length);
    });
  });

  describe('values', () => {
    it('is the text value if the selection is not made', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .applyText()
        .attachElement();

      expect(ts.element.selection).toBeNull();
      expect(ts.element.text).toBe(optionalProperties.text);

      expect(ts.element.value).toBe(optionalProperties.text);
    });

    it('is the selection if the text is blank', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .applySelection()
        .attachElement();

      expect(ts.element.selection).toStrictEqual(optionalProperties.selection);
      expect(ts.element.text).toBeFalsy();

      expect(ts.element.value).toStrictEqual(optionalProperties.selection);
    });

    it('is the selection if both the text and selection are made', () => {
      //-- this is assuming that someone made a selection
      //-- and then started typing.
      //-- (once they hit return in the textbox, then they unite)
      const ts = new TestSettings()
        .applyDefaultProperties()
        .applySelection()
        .applyText()
        .attachElement();

      expect(ts.element.value).toStrictEqual(optionalProperties.selection);
    });

    it('becomes the selection if the user clicks an option', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .attachElement();
      
      expect(ts.element.options.length).toBeGreaterThanOrEqual(2);

      const initialText = ts.text;
      
      const optionElements = ts.element.shadowRoot
        .querySelectorAll('c-ltng_editable-combobox_item');
      expect(optionElements).toBeTruthy();
      expect(optionElements.length).toBeGreaterThanOrEqual(2);

      const secondOption = optionElements[1];
      expect(secondOption).toBeTruthy();

      const optionValue = secondOption.value;
      // const newKey = optionValue.Id;
      const newLabel = secondOption.label;

      secondOption.dispatchEvent(new CustomEvent('click'));

      const updatedText = ts.element.text;
      expect(initialText).not.toBe(updatedText);
      expect(updatedText).toBe(newLabel);

      const newValue = ts.element.value;
      expect(newValue).toStrictEqual(optionValue);
    });

    it('dispatches a change event if someone selects an option', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .attachElement();
      
      expect(ts.element.options.length).toBeGreaterThanOrEqual(2);

      const optionElements = ts.element.shadowRoot
        .querySelectorAll('c-ltng_editable-combobox_item');
      const secondOption = optionElements[1];
      expect(secondOption).toBeTruthy();

      const optionValue = secondOption.value;

      const changeHandler = jest.fn();
      ts.element.addEventListener('change', changeHandler);

      secondOption.dispatchEvent(new CustomEvent('click'));
      
      expect(changeHandler).toHaveBeenCalled();
      const callArgument = changeHandler.mock.calls[0][0];
      expect(callArgument).toBeTruthy();
      expect(callArgument.detail.value).toBe(optionValue);
    });

    it('becomes the text area if someone presses the enter key', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .attachElement();
      
      const updatedText = 'Some New Value';
      ts.element.text = updatedText;

      const enterKeyCode = ts.element.constants.ENTER_KEY;
      const enterEvent = new CustomEvent('keyup', {
        bubbles:true,
        keyCode:enterKeyCode,
        detail: {
          keyCode: enterKeyCode
        }
      });

      const changeHandler = jest.fn();
      ts.element.addEventListener('change', changeHandler);

      const textInput = ts.element.shadowRoot.querySelector('.editable-text');
      expect(textInput.value).toBe(updatedText);

      textInput.dispatchEvent(enterEvent);

      expect(changeHandler).toHaveBeenCalled();
      const callArgs = changeHandler.mock.calls[0][0];
      expect(callArgs).toBeTruthy();
      expect(callArgs.detail.value).toBe(updatedText);
    });

    it('becomes the text area if someone presses the enter key after typing', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .attachElement();
      
      const initialText = 'Some New Value';
      ts.element.text = initialText;

      const textInput = ts.element.shadowRoot.querySelector('.editable-text');
      expect(textInput.value).toBe(initialText);

      const updatedText = 'My New Value';
      textInput.value = updatedText;

      const keyUpEvent = new CustomEvent('keyup', {
        bubbles: true,
        keyCode:11,
        detail: {
          keyCode: 11
        }
      });
      textInput.dispatchEvent(keyUpEvent);

      expect(textInput.value).toBe(updatedText);

      const enterKeyCode = ts.element.constants.ENTER_KEY;
      const enterEvent = new CustomEvent('keyup', {
        bubbles:true,
        keyCode:enterKeyCode,
        detail: {
          keyCode: enterKeyCode
        }
      });

      const changeHandler = jest.fn();
      ts.element.addEventListener('change', changeHandler);

      textInput.dispatchEvent(enterEvent);

      expect(changeHandler).toHaveBeenCalled();
      const callArgs = changeHandler.mock.calls[0][0];
      expect(callArgs).toBeTruthy();
      expect(callArgs.detail.value).toBe(updatedText);
    });

    it('can be cleared out from a selection', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .applySelection()
        .attachElement();

      expect(ts.element.selection).toStrictEqual(optionalProperties.selection);
      expect(ts.element.text).toBeFalsy();

      expect(ts.element.value).toStrictEqual(optionalProperties.selection);

      ts.element.clear();

      expect(ts.element.text).toBeFalsy();
      expect(ts.element.selection).toBeFalsy();
      expect(ts.element.values).toBeFalsy();
    });

    it('can be cleared out from the text', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .applyText()
        .attachElement();

      expect(ts.element.selection).toBeNull();
      expect(ts.element.text).toBe(optionalProperties.text);

      expect(ts.element.value).toBe(optionalProperties.text);

      ts.element.clear();

      expect(ts.element.text).toBeFalsy();
      expect(ts.element.selection).toBeFalsy();
      expect(ts.element.values).toBeFalsy();
    });

    /*
    it('is changed when the user types after selecting a value', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .attachElement();
      
      expect(ts.element.options.length).toBeGreaterThanOrEqual(2);

      const initialText = ts.text;
      
      const optionElements = ts.element.shadowRoot
        .querySelectorAll('c-ltng_editable-combobox_item');
      expect(optionElements).toBeTruthy();
      expect(optionElements.length).toBeGreaterThanOrEqual(2);

      const secondOption = optionElements[1];
      expect(secondOption).toBeTruthy();

      secondOption.dispatchEvent(new CustomEvent('click'));

      debugger;

      expect(ts.element.hasChanged).toBe(false);

      ts.element.text('SOMETHING COMPLETELY DIFFERENT');

      expect(ts.element.hasChanged).toBe(true);
    });
    */
  });

  describe('open / close', () => {
    it('will be closed if marked closed', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(customTS => {
          customTS.element.isOpen = 'false'
        })
        .applyText()
        .attachElement();
      
      expect(ts.element.isOpen).toBe('false');

      const inputIcon = ts.element.shadowRoot
        .querySelector('.slds-combobox__form-element lightning-icon');
      expect(inputIcon).toBeTruthy();

      expect(inputIcon.iconName).toBe('utility:chevrondown');
    });
    it('can be made initially open', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(customTS => {
          customTS.element.isOpen = 'true'
        })
        .applyText()
        .attachElement();
      
      expect(ts.element.isOpen).toBe('true');

      const inputIcon = ts.element.shadowRoot
        .querySelector('.slds-combobox__form-element lightning-icon');
      expect(inputIcon).toBeTruthy();

      expect(inputIcon.iconName).toBe('utility:chevrondown');
    });
    it('is made open if the user enters the focus', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(customTS => {
          customTS.element.isOpen = 'false'
        })
        .applyText()
        .attachElement();
      
      expect(ts.element.isOpen).toBe('false');

      const textInput = ts.element.shadowRoot.querySelector('.editable-text');
      expect(textInput).toBeTruthy();

      const focusEvent = new CustomEvent('focusin');
      textInput.dispatchEvent(focusEvent);

      expect(ts.element.isOpen).toBe('true');
    });
  });
});