
import { LightningElement, api, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

import apexFindFiles from '@salesforce/apex/ltng_mockupFileCtrl.findFiles';
import apexCreateContentVersion from '@salesforce/apex/ltng_mockupFileCtrl.createContentVersion';

import formFactorPropertyName from '@salesforce/client/formFactor';

import { fireEvent } from 'c/ltng_mockupEventBus';

/**
 * @typedef {Object} ContentDocument
 * @property {String} Id - 
 * @property {String} Title - 
 * @property {String} LatestPublishedVersionId -
 * @property {String} LastModifiedDate -
 */

/**
 * EventBus notification type dispatched when the image has changed
 * @type {String}
 */
const IMAGE_CHANGED_EVENT_TYPE = 'imageuploaded';

/**
 * Icon (group:name) to use for static resources
 * @type {String}
 */
const STATIC_RESOURCE_ICON = 'standard:file';

/**
 * Length in milliseconds to wait before searching
 * @type {Number}
 */
const TIMEOUT_SEARCH_DELAY = 1000;

/**
 * Type the number of milliseconds to wait before timing out an error
 * @type {Number}
 */
const TIMEOUT_ERROR = 10000;


/**
 * Type the number of milliseconds to wait before timing out a notification
 * @type {Number}
 */
const TIMEOUT_NOTIFICATION = 5000;

/**
 * 
 * @param {String} str - string to check
 * @returns {Boolean} - whether it is an empty string (true) or not (false) 
 */
function isEmptyString(str) {
  return str === null ? true : str === undefined ? true : (`${str}`).trim() === "" ? true : false;
}

/**
 * Converts a UTC DateTime string to local
 * @param {String} utcDateTime - ex: '2020-03-11T20:39:45.000Z'
 * @returns {String} - ex: 3/11/2020, 3:39:45 PM
 */
function utcDateToLocal(dateStr) {
  const parsedDate = Date.parse(dateStr);
  if (!parsedDate) {
    return dateStr;
  }
  return new Date(parsedDate).toLocaleString();
}

/**
 * Converts a filename into a Salesforce file title
 * @param {String} fileName
 * @returns {String}
 */
function fileNameToFileTitle(fileName) {
  return fileName.replace(/\.[^\n.]+$/i, '');
}

/**
 * Extracts the base64 content of a FileReader content
 * @param {String} str - ex: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgA…
 * @returns {String} - ex: iVBORw0KGgoAAAANSUhEUgAAABgA…
 */
function extractFileReaderBase64(str) {
  return str.substr(str.indexOf(',')+1)
}

/**
 * Loads a file and returns the base64 encoding
 * @param {File} fileToLoad -
 * @param {FileReder} fileReaderInstance - (allow for mock/testing)
 * @return {String} - base64 string of the contents of the file
 */
function loadFileAsBase64(fileToLoad, fileReaderInstance) {
  return new Promise((resolve, reject) => {
    fileReaderInstance.onload = () => {
      // console.log('loaded');
      let fileResult = fileReaderInstance.result;
      resolve(fileResult);
    }
    fileReaderInstance.onerror = (error) => {
      reject(error);
    }
    fileReaderInstance.readAsDataURL(fileToLoad);
  });
}

export default class Ltng_mockupFileHelper extends LightningElement {

  @api constants = {
    TIMEOUT_SEARCH_DELAY,
    TIMEOUT_ERROR,
    TIMEOUT_NOTIFICATION,
    STATIC_RESOURCE_ICON,
    IMAGE_CHANGED_EVENT_TYPE,

    isEmptyString,
    utcDateToLocal,
    fileNameToFileTitle,
    extractFileReaderBase64,
    loadFileAsBase64
  }

  /**
   * Current page reference
   */
  @wire(CurrentPageReference)
  pageRef;

  /**
   * Whether the section is expanded
   * @type {Boolean}
   */
  @api isExpanded = false;

  /**
   * Whether the component is collapsible (true) or will always remain open (false)
   * @type {Boolean}
   */
  @api isCollapsible = false;

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
  @api fileToUploadBase64;

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
  lastNotification;

  @wire (apexFindFiles, { searchStr: '$queryTerm' })
  handleResults({data, error}) {
    // console.log('results came in');
    if (error) {
      const msg = error.body.message;
      this.showNotification(true, `An error occurred:${msg}`, error);
    }
    if (data) {
      //console.log('data came back', data);
      let results = [];
      results = data.map((contentDocument) => {
        return contentDocument ? {
          key: contentDocument.Id, // LatestPublishedVersionId,
          label: contentDocument.Title,
          subLabel: utcDateToLocal(contentDocument.LastModifiedDate),
          icon: STATIC_RESOURCE_ICON,
          value: contentDocument
        } : null;
      }).filter(el => (el ? true : false));
      if (!isEmptyString(this.queryTerm)) {
        results.unshift({
          key: 'new',
          label: `New Resource: ${this.queryTerm}`,
          subLabel: '',
          icon: STATIC_RESOURCE_ICON,
          value: {
            Title: this.queryTerm
          }
        });
      }
      this.options = results;
    }
  }

  /**
   * timeout used to delay searching
   * @type {TimerHandler}
   */
  delayTimeout;

  //-- getters / setters

  /**
   * Whether we are on desktop (true) or not (false)
   */
  @api get isDesktop() {
    return formFactorPropertyName === 'Large';
  }

  /**
   * Styles for the section
   * @returns {String}
   */
  get sectionStyles() {
    const expandedClass = this.isExpanded ? 'slds-is-open' : '';
    return 'static-resource-helper slds-box slds-section ' +
      'slds-card slds-theme_default ' +
      expandedClass + ' ';
  }

  /**
   * Whether the ContentDocument is new
   * @type {Boolean}
   */
  get isNew() {
    return !this.recordToUpdate || !this.recordToUpdate.Id;
  }

  /**
   * Inverse of whether it is expanded to support aria
   * @type {Boolean}
   */
  get isNotExpanded() {
    return !this.isExpanded;
  }

  /**
   * Whether there is a record to update
   * @type {Boolean}
   */
  // get hasRecordToUpdate() {
  //   return this.recordToUpdate !== null;
  // }

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
    );
  }

  //-- handlers
  connectedCallback() {
    if (!this.isCollapsible) {
      this.isExpanded = true;
    }
  }

  disconnectedCallback() {
    this.clearNotifications();
  }

  /**
   * Expandable button is clicked
   */
  handleExpandToggle() {
    if (this.isCollapsible) {
      this.isExpanded = !this.isExpanded;
    }
  }

  /**
   * Handles when the user presses the return key
   * @param {CustomEvent} evt
   */
  handleKeyUp(evt) {
    let searchStr = evt.target.value || '';
    this.clearKeyListener();

    this.delayTimeout = setTimeout(() => { // eslint-disable-line
      // console.log(`searching for:${searchStr}`);
      this.queryTerm = searchStr;
    }, TIMEOUT_SEARCH_DELAY);
  }

  /**
   * Handles when the editable combobox value has changed
   * @param {CustomEvent}
   */
  handleRecordChanged(evt) {
    const value = evt.detail.value;
    // console.log('record changed');

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
  handleFileChanged(evt) {
    // console.log('file changed');
    
    const fileSelector = this.template  // eslint-disable-line
      .querySelector('lightning-input.file-selector');
    const editableCombobox = this.template // eslint-disable-line
      .querySelector('c-ltng_editable-combobox');
    
    const filesToUpload = evt.target.files;
    // const filesToUpload = evt.detail.files;

    if (filesToUpload.length > 0) {
      this.fileToUpload = filesToUpload[0];
      if (this.isDesktop && !editableCombobox.value) {
        const fileName = fileNameToFileTitle(this.fileToUpload.name);
        this.newFileName = fileName;

        editableCombobox.text = fileName;
        this.queryTerm = fileName;

        // this.openCombobox(true);
      }

      //-- allow for tests to override
      let fileReader = new FileReader();
      if (evt.detail.fileReader) {
        fileReader = evt.detail.fileReader;
      }

      evt.detail.fileReaderPromise = loadFileAsBase64(this.fileToUpload, fileReader)
        .then(fileBase64 => {
          this.fileToUploadBase64 = fileBase64;
        });
    }
  }

  /**
   * Attempts to submit to create the contentResource
   */
  handleSubmit(evt) {
    this.clearNotifications();
    this.showSpinner = true;

    /*
    console.log('mocking the upload');
    return new Promise((resolve, reject) => {
      clearTimeout(this.timeoutPointer);
      this.timeoutPointer = setTimeout(() => { // eslint-disable-line
        this.showSpinner = false;
        reject({ body: { message: 'Fake Error'} });
      }, 1000 );
    })
    */
    const submitPromise = apexCreateContentVersion({
      documentId: this.recordToUpdate.Id,
      title: this.newFileName,
      fileName: this.fileToUpload.name,
      body: extractFileReaderBase64(this.fileToUploadBase64)
    })
    
      .then(data => {
        this.showNotification(false, `Successfully updated: ${data.Title}`, data);

        this.clearFileInput();
        this.clearSelection();

        this.queryTerm = null;

        fireEvent(this.pageRef, IMAGE_CHANGED_EVENT_TYPE, data);
      })
      .catch(error => {
        // console.error(error);
        const msg = error.body.message;
        this.showNotification(true, `An error occurred:${msg}`, error);
      })
      .finally(() => {
        this.showSpinner = false;
      });
    
    //-- allow tests to pause until completed
    if (typeof jest !== 'undefined') {
      evt.detail.submitPromise = submitPromise;
    }
  }

  /**
   * Show an error message for a specific period of time
   * @param {Boolean} isError - whether the notification is an error (true) or not (false)
   * @param {String} msg - the message to show
   * @param {any} notificationInfo - any additional info to preserve
   */
  showNotification(isError, msg, notificationInfo){
    let notificationEl;
    let timeoutLength;
    if (isError) {
      notificationEl = this.template.querySelector('c-ltng_mockup-alert.error');
      timeoutLength = TIMEOUT_ERROR;
    } else {
      notificationEl = this.template.querySelector('c-ltng_mockup-alert.success');
      timeoutLength = TIMEOUT_NOTIFICATION;
    }

    if (isError && msg) {
      // debugger;
      // console.error('Error occurred', notificationInfo);
    }

    if (!msg) {
      notificationEl.isShown = false;
      notificationEl.message = '';
    } else {
      // is null 
      if (notificationEl) notificationEl.show(msg, timeoutLength);
    }

    this.lastNotification = notificationInfo;
  }

  //-- internal methods

  clearKeyListener() {
    window.clearTimeout(this.delayTimeout);
  }

  clearNotifications() {
    this.showNotification(true, null);
    this.showNotification(false, null);
    this.clearKeyListener();
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

  // openCombobox(isOpen) {
  //   const editableCombobox = this.template // eslint-disable-line
  //     .querySelector('c-ltng_editable-combobox');
  //   editableCombobox.isOpen = isOpen;
  // }
}
