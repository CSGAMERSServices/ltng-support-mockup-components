import { LightningElement, api, track } from 'lwc';

/**
 * Represents an editable combobox
 */

/**
 * The key code for the enter key
 * @type {Number}
 */
const ENTER_KEY = 13;

/**
 * @typedef {Object} EditableComboboxOption
 * @property {String} label - 
 * @property {String} subLabel -
 * @property {String} icon - (group:iconName)
 * @property {any} value -
 */

export default class Ltng_editableCombobox extends LightningElement {

  @api constants = {
    ENTER_KEY
  };

  /**
   * Collection of combobox options
   * @type {EditableComboboxOption}
   */
  @api options = [];

  /**
   * In addition to updating the options,
   * it also clears the current combobox selection.
   * @param options {EditableComboboxOption}
   */
  @api updateOptions(options) {
    this._selection = null;
    this.options = options;
  }

  /**
   * Whether the combobox is open when it first is created
   * @type {String}
   */
  @api isOpen = false;

  /**
   * Label of the input
   * @type {String}
   */
  @api label = '';

  /**
   * Placeholder to use for the input
   * @type {String}
   */
  @api placeholder = 'Search or enter a value';

  //-- getter / setters

  /**
   * The editable text value
   * @type {String}
   */
  get text(){
    const el = this.template.querySelector('.editable-text');
    return el ? el.value : this._text;
  }
  @api
  set text(val) {
    this._text = val;
    const el = this.template.querySelector('.editable-text');
    if (el) {
      el.value = val;
    }
  }
  @track _text = '';

  /**
   * Which dropdown value is initially set
   * @type {any}
   */
  get selection() {
    return this._selection;
    // const el = this.template.querySelector('.combobox');
    // return el ? el.value : this._selection;
  }
  @api
  set selection(val) {
    this._selection = val;
    /*
    const el = this.template.querySelector('.combobox');
    if (el) {
      el.value = val;
    }
    */
  }
  @track _selection = null;

  /**
   * Whether the value has changed.
   * @type {Boolean}
   */
  // get hasChanged() {
  //   return this._text !== this._selection;
  // }

  /**
   * The current value of the combobox.
   * (If the user has made a selection, then that value is returned,
   * otherwise it is the user written value)
   * @returns {Object}
   */
  @api
  get value(){
    let result = this.selection;
    if (!result) result = this.text;
    return result;
  }

  /**
   * Resets the combobox
   */
  @api clear() {
    this.selection = null;
    this.text = null;
    this.isOpen = false;
  }

  //-- internal getters / setters
  /**
   * Classes used for the combobox
   * @returns {String}
   */
  get comboboxCSS_Classes() {
    return `slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click ${this.isOpen === 'true'?'slds-is-open':''}`;
  }

  //-- handlers
  /**
   * When the user has focus on the editable text
   */
  handleEditableTextFocus() {
    this.isOpen = 'true';
  }
  // handleEditableTextBlur() {
  //   this.isOpen = 'false';
  // }

  /**
   * Handles when the user clicks a combobox item
   * @param {CustomEvent} evt -
   */
  handleItemClicked(evt) {
    // console.log('item was clicked');

    this._selection = evt.target.value;
    this.text = evt.target.label;
    this.dispatchChange(this._selection);
  }
  
  /**
   * Detect key up to check for the enter key
   * @param {CustomEvent} evt - 
   */
  handleKeyUp(evt) {
    const wasEnterPressed = evt.keyCode === ENTER_KEY ||
      (evt.detail.keyCode === ENTER_KEY);

    if (wasEnterPressed) {
      // console.log('enter was pressed');

      evt.preventDefault();
      evt.stopPropagation();
      evt.stopImmediatePropagation();

      this.dispatchChange(this.value);
    } else {
      this._text = evt.target.value;
      this._selection = null;
    }
  }

  /**
   * Close the input if currently open and the user clicks it.
   * @param {CustomEvent} evt
   */
  /*
  handleInputClicked() {
    // const isInputFocused = this.template.querySelector('.editable-text.slds-has-focus') ? true : false;
    // console.log('isInputFocused:' + isInputFocused);
    // const isInputFocused = this.template.querySelector('.editable-text.slds-has-focus') ? true : false;
    if (this.hasChanged) {
      this.isOpen = !this.isOpen;
      this.dispatchChange(this._text);
    }
  }
  */

  //-- internal methods

  /**
   * Dispatch change event
   * @param {Object} newValue -
   */
  dispatchChange(newValue) {
    this.isOpen = false;
    this._selection = newValue;
    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        value: newValue
      }
    }));
  }
}