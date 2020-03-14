
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
 * Converts a filename into a Salesforce file title
 * @param {String} fileName
 * @returns {String}
 */
export const fileNameToFileTitle = (fileName) => {
  return fileName.replace(/\.[^\n.]+$/i, '');
}

/**
 * Loads a file and returns the base64 encoding
 * @param {File} fileToLoad -
 * @param {FileReder} fileReaderInstance - (allow for mock/testing)
 * @return {String} - base64 string of the contents of the file
 */
export const loadFileAsBase64 = (fileToLoad, fileReaderInstance) => {
  return new Promise((resolve, reject) => {
    fileReaderInstance.readAsDataURL(fileToLoad);
    fileReaderInstance.onload = () => {
      console.log('loaded');
      let fileResult = fileReaderInstance.result;
      // if (fileResult) {
      //   fileResult = fileResult.substr(fileResult.indexOf(',') + 1);
      //   resolve(fileResult);
      // }
      // reject('reader.result is empty');
      resolve(fileResult);
    }
    fileReaderInstance.onerror = (error) => {
      reject(error);
    }
  });
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
   * Information about the file to be uploaded
   * @type {File}
   */
  fileToUpload;

  /**
   * Name to use if new file
   * @type {String}
   */
  newFileName;

  /**
   * contents of the file to be uploaded to salesforce
   * @type {String}
   */
  fileToUploadBase64;

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

  /**
   * Label to show on the button
   * @type {String}
   */
  get buttonLabel() {
    let result = '';
    if (this.isNew) {
      result = `Create File: ${this.newFileName}`;
    } else {
      result = `Update File: ${this.newFileName}`;
    }
    return result;
  }

  /**
   * Whether we are ready for submission
   * @type {Boolean}
   */
  @api get isSubmissionDisabled() {
    return !(
      this.recordToUpdate !== null
      && (this.fileToUploadBase64 ? true : false)
      && (this.newFileName ? true : false)
    );
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
    this.newFileName = this.recordToUpdate.Title;

    this.clearKeyListener();
  }

  /**
   * Handles when the file input has changed
   * @param {CustomEvent} evt 
   */
  async handleFileChanged(evt) {
    console.log('file changed');
    
    const fileSelector = this.template  // eslint-disable-line
      .querySelector('lightning-input.file-selector');
    const editableCombobox = this.template // eslint-disable-line
      .querySelector('c-ltng_editable-combobox');
    
    const filesToUpload = evt.target.files;
    if (filesToUpload.length > 0) {
      this.fileToUpload = filesToUpload[0];

      const fileName = fileNameToFileTitle(this.fileToUpload.name);
      this.newFileName = fileName;

      if (!editableCombobox.text) {
        editableCombobox.text = fileName;
        this.queryTerm = fileName;
      }

      this.fileToUploadBase64 = await loadFileAsBase64(this.fileToUpload, new FileReader());
    }
  }

  //-- internal methods

  clearKeyListener() {
    window.clearTimeout(this.delayTimeout);
  }
}
