
import { LightningElement, api, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

import apexFindFiles from '@salesforce/apex/ltng_mockupFileCtrl.findFiles';
import apexCreateContentVersion from '@salesforce/apex/ltng_mockupFileCtrl.createContentVersion';

import { fireEvent } from 'c/ltng_mockupEventBus';

const IMAGE_CHANGED_EVENT_TYPE = 'imageuploaded';

/**
 * @typedef {Object} ContentDocument
 * @property {String} Id - 
 * @property {String} Title - 
 * @property {String} LatestPublishedVersionId -
 * @property {String} LastModifiedDate -
 */

export default class Ltng_mockupFileHelper extends LightningElement {

  /**
   * Current page reference
   */
  @wire(CurrentPageReference)
  pageRef;

  /**
   * The term to search for
   * @type {String}
   */
  @api queryTerm = '';

  /**
   * Whether to include a spacer at the bottom
   * (to give space for the dropdown)
   * @type {Boolean}
   */
  @api showDropdownSpacer = false;

  /**
   * Content version to update
   * @type {ContentVersion}
   */
  @track recordToUpdate = null;

  /**
   * Information about the file to be uploaded
   * @type {File}
   */
  @track fileToUpload;

  /**
   * Name to use if new file
   * @type {String}
   */
  @track newFileName;

  /**
   * contents of the file to be uploaded to salesforce
   * @type {String}
   */
  @track fileToUploadBase64;

  /**
   * Collection of static resources captured
   * @type {EditableComboboxOption[]}
   */
  @track options = [];

  /** 
   * Whether the spinner should be shown
   * @type {Boolean}
   */
  @track showSpinner = false;

  /**
   * Error string to show
   * @type {String}
   */
  @track error;

  /**
   * Success message to show
   * @type {String}
   */
  @track success;
  successTimer = null;

  @wire (apexFindFiles, { searchStr: '$queryTerm' })
  handleResults({data, error}) {
    // console.log('results came in');
    if (error) {
      console.error('error occurred', error);
    }
    if (data) {
      console.log('data came back', data);
      const results = [];
      this.options = data.map((contentDocument) => {
        return contentDocument ? {
          key: contentDocument.Id, // LatestPublishedVersionId,
          label: contentDocument.Title,
          subLabel: Ltng_mockupFileHelper.utcDateToLocal(contentDocument.LastModifiedDate),
          icon: Ltng_mockupFileHelper.STATIC_RESOURCE_ICON,
          value: contentDocument
        } : {};
      });
      if (data.length > 0) {
        results.unshift({
          key: 'new',
          label: `New Resource: ${this.queryTerm}`,
          subLabel: '',
          icon: Ltng_mockupFileHelper.STATIC_RESOURCE_ICON,
          value: {
            Title: this.queryTerm
          }
        });
      }
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
  get isSubmissionDisabled() {
    return !(
      this.recordToUpdate !== null
      && (this.fileToUploadBase64 ? true : false)
      && (this.newFileName ? true : false)
    );
  }

  //-- handlers
  connectedCallback() {
  }

  disconnectedCallback() {
  }

  /**
   * Handles when the user presses the return key
   * @param {CustomEvent} evt
   */
  handleKeyUp(evt) {
    let searchStr = evt.target.value;
    if (searchStr === undefined) searchStr = 'q';
    this.clearKeyListener();

    this.delayTimeout = setTimeout(() => { // eslint-disable-line
      console.log(`searching for:${searchStr}`);
      this.queryTerm = searchStr;
    }, Ltng_mockupFileHelper.TIMEOUT_DELAY);
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
    // const filesToUpload = evt.detail.files;

    if (filesToUpload.length > 0) {
      this.fileToUpload = filesToUpload[0];
      if (!editableCombobox.value) {
        const fileName = Ltng_mockupFileHelper.fileNameToFileTitle(this.fileToUpload.name);
        this.newFileName = fileName;

        editableCombobox.text = fileName;
        this.queryTerm = fileName;

        // this.openCombobox(true);
      }

      this.fileToUploadBase64 = await Ltng_mockupFileHelper.loadFileAsBase64(this.fileToUpload, new FileReader());
    }
  }

  /**
   * Attempts to submit to create the contentResource
   */
  handleSubmit() {
    this.clearNotifications();

    /*
    this.showSpinner = true;
    clearTimeout(this.timeoutPointer);
    this.timeoutPointer = setTimeout(() => { // eslint-disable-line
      this.showSpinner = false;
      console.log('done');
    }, 3000 );
    */

    this.showSpinner = true;
    apexCreateContentVersion({
      documentId: this.recordToUpdate.Id,
      title: this.newFileName,
      fileName: this.fileToUpload.name,
      body: Ltng_mockupFileHelper.extractFileReaderBase64(this.fileToUploadBase64)
    })
      .then(data => {
        //-- @TODO: handle data
        // debugger;
        console.log('creation was successful', data);

        this.showSuccessMessage('Success', 1000);

        this.clearFileInput();
        this.clearSelection();

        this.queryTerm = null;

        fireEvent(this.pageRef, IMAGE_CHANGED_EVENT_TYPE, data);
      })
      .catch(error => {
        //-- @TODO: handle error
        debugger;
        console.error('error occurred', JSON.stringify(error));
        this.error = error.body.message;
      })
      .finally(() => {
        this.showSpinner = false;
      });
  }

  /**
   * Show a success message for a specific period of time
   * @param {String} msg - Message to show
   * @param {Number} timeout - Number of milliseconds to show the message.
   */
  showSuccessMessage(msg, timeout) {
    window.clearTimeout(this.successTimer);
    this.success = msg;
    this.successTimer = setTimeout(() => { // eslint-disable-line
      this.success = null;
    }, timeout);
  }

  handleImageUpdate() {
    fireEvent(this.pageRef, IMAGE_CHANGED_EVENT_TYPE, 'something');
  }

  //-- internal methods

  clearKeyListener() {
    window.clearTimeout(this.delayTimeout);
  }

  clearNotifications() {
    this.error = null;
    this.success = null;
  }

  clearFileInput() {
    const fileInput = this.template.querySelector('lightning-input.file-selector');
    fileInput.value = null;

    this.fileToUploadBase64 = null;
    this.fileToUpload = null;
    this.newFileName = null;
  }

  clearSelection() {
    const editableCombobox = this.template // eslint-disable-line
      .querySelector('c-ltng_editable-combobox');
    
    editableCombobox.clear();
  }

  openCombobox(isOpen) {
    const editableCombobox = this.template // eslint-disable-line
      .querySelector('c-ltng_editable-combobox');
    editableCombobox.isOpen = isOpen;
  }

  //-- moved

  /**
   * Converts a UTC DateTime string to local
   * @param {String} utcDateTime - ex: '2020-03-11T20:39:45.000Z'
   * @returns {String} - ex: 3/11/2020, 3:39:45 PM
   */
  static utcDateToLocal(dateStr) {
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
  static fileNameToFileTitle(fileName) {
    return fileName.replace(/\.[^\n.]+$/i, '');
  }

  /**
   * Extracts the base64 content of a FileReader content
   * @param {String} str - ex: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgA…
   * @returns {String} - ex: iVBORw0KGgoAAAANSUhEUgAAABgA…
   */
  static extractFileReaderBase64(str) {
    return str.substr(str.indexOf(',')+1)
  }

  /**
   * Loads a file and returns the base64 encoding
   * @param {File} fileToLoad -
   * @param {FileReder} fileReaderInstance - (allow for mock/testing)
   * @return {String} - base64 string of the contents of the file
   */
  static loadFileAsBase64(fileToLoad, fileReaderInstance) {
    return new Promise((resolve, reject) => {
      fileReaderInstance.readAsDataURL(fileToLoad);
      fileReaderInstance.onload = () => {
        console.log('loaded');
        let fileResult = fileReaderInstance.result;
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
  static STATIC_RESOURCE_ICON = 'standard:file';

  /**
   * Length in milliseconds to wait before searching
   * @type {Number}
   */
  static TIMEOUT_DELAY = 1000;
}
