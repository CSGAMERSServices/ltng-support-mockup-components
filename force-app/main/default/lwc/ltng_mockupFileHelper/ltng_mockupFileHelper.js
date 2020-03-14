
import { LightningElement, api, track, wire } from 'lwc';

import apexFindFiles from '@salesforce/apex/ltng_mockupFileCtrl.findFiles';

/**
 * @typedef {Object} ContentDocument
 * @property {String} Id - 
 * @property {String} Title - 
 * @property {String} LatestPublishedVersionId -
 * @property {String} LastModifiedDate -
 */

/** @type {import('c/ltng_editableCombobox').EditableComboboxOption} */

/**
 * Converts a UTC DateTime string to local
 * @param {String} utcDateTime - ex: '2020-03-11T20:39:45.000Z'
 * @returns {String} - ex: 3/11/2020, 3:39:45 PM
 */
export const utcDateToLocal = (dateStr) => {
  const parsedDate = Date.parse(dateStr);
  if (!parsedDate) {
    return dateStr;
  }
  return new Date(parsedDate).toLocaleString();
};

/**
 * Trims the file load contents into just the base64 data
 * ex: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA
 * @param {String} b64data - contents from FileReader.
 * @returns {String} Just the base64 data. ex: iVBORw0KGgoA...
 */
export const fileReadBase64 = (b64Data) => {
  return b64Data.substring(b64Data.indexOf(',')+1);
}

/**
 * Icon (group:name) to use for static resources
 * @type {String}
 */
export const STATIC_RESOURCE_ICON = 'standard:file';

/**
 * Length in milliseconds to wait before searching
 * @type {Number}
 */
const TIMEOUT_DELAY = 1000;

export default class Ltng_mockupFileHelper extends LightningElement {
  /**
   * The term to search for
   * @type {String}
   */
  @api queryTerm = '';

  /**
   * Content version to update
   * @type {ContentVersion}
   */
  @track recordToUpdate = null;

  /**
   * Collection of static resources captured
   */
  @track options = [];

  @wire (apexFindFiles, { searchStr: '$queryTerm' })
  handleResults({data, error}) {
    // console.log('results came in');
    if (error) {
      console.error('error occurred', error);
    }
    if (data) {
      console.log('data came back', data);
      this.options = data.map((contentDocument) => {
        return contentDocument ? {
          key: contentDocument.LatestPublishedVersionId,
          label: contentDocument.Title,
          subLabel: utcDateToLocal(contentDocument.LastModifiedDate),
          icon: STATIC_RESOURCE_ICON,
          value: contentDocument
        } : {};
      });
    }
  }

  /**
   * timeout used to delay searching
   * @type {TimerHandler}
   */
  delayTimeout;

  //-- getters / setters

  /**
   * Whether the ContentDocument is new
   * @type {Boolean}
   */
  get isNew() {
    return !this.recordToUpdate || !this.recordToUpdate.Id;
  }

  /**
   * Whether there is a record to update
   * @type {Boolean}
   */
  get hasRecordToUpdate() {
    return this.recordToUpdate !== null;
  }

  //-- handlers
  /**
   * Handles when the user presses the return key
   * @param {CustomEvent} evt
   */
  handleKeyUp(evt) {
    const searchStr = evt.target.value;
    this.clearKeyListener();

    this.delayTimeout = setTimeout(() => { // eslint-disable-line
      console.log(`searching for:${searchStr}`);
      this.queryTerm = searchStr;
    }, TIMEOUT_DELAY);
  }

  /**
   * Handles when the editable combobox value has changed
   * @param {CustomEvent}
   */
  handleRecordChanged(evt) {
    const value = evt.detail.value;
    console.log('record changed');
    if (typeof value === "string") {
      this.recordToUpdate = {
        Title: value
      };
    } else {
      this.recordToUpdate = value;
    }
    this.clearKeyListener();
  }

  //-- internal methods

  clearKeyListener() {
    window.clearTimeout(this.delayTimeout);
  }
}
