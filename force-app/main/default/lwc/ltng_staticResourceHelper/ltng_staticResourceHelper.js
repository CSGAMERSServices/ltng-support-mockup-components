import { LightningElement, api, track, wire } from 'lwc';

import apexFindStaticResources from '@salesforce/apex/ltng_staticResourceHelperCtrl.findStaticResources';

/**
 * @typedef {Object} StaticResource
 * @property {String} Id - id of the record
 * @property {String} Name - name of the static resource
 * @property {String} LastModifiedDate - date the resource was last modified
 */

/**
 * Converts a UTC DateTime string to local
 * @param {String} utcDateTime - ex: '2020-03-11T20:39:45.000Z'
 * @returns {String} - ex: 3/11/2020, 3:39:45 PM
 */
const utcDateToLocal = (dateStr) => {
  const parsedDate = Date.parse(dateStr);
  if (!parsedDate) {
    return dateStr;
  }
  return new Date(parsedDate).toLocaleString();
};

/**
 * Icon (group:name) to use for static resources
 * @type {String}
 */
const STATIC_RESOURCE_ICON = 'standard:file';

/**
 * Length in milliseconds to wait before searching
 * @type {Number}
 */
const TIMEOUT_DELAY = 1000;

/**
 * This is a component to allow a user to upload static resources
 * (so we can provide images for mockups)
 * without having to go to the setup screen.
 * 
 * This will hopefully make it much simpler to hold discussions with mockups.
 */
export default class Ltng_staticResourceHelper extends LightningElement {

  /**
   * The term to search for
   * @type {String}
   */
  @api queryTerm = 'ltng_'

  /**
   * Static resource to update
   * @type {StaticResource}
   */
  @api resourceToUpdate = null;

  /**
   * Collection of static resources captured
   */
  @api staticResources = [];

  /**
   * timeout used to delay searching
   * @type {TimerHandler}
   */
  delayTimeout;

  /**
   * The static resources found
   * @type {StaticResource[]}
   */
  @wire (apexFindStaticResources, { searchStr: '$queryTerm' })
  handleResults({data}) {
    // console.log('results came in');
    if (data) {
      console.log('data came back', data);
      this.staticResources = data.map((staticResource) => {
        return staticResource ? {
          key: staticResource.Id,
          label: staticResource.Name,
          subLabel: utcDateToLocal(staticResource.LastModifiedDate),
          icon: STATIC_RESOURCE_ICON,
          value: staticResource
        } : {};
      });
    }
  }

  //-- getters / setters

  /**
   * Whether the static resource is new
   * @type {Boolean}
   */
  get isNewStaticResource() {
    return !this.resourceToUpdate || !this.resourceToUpdate.Id;
  }

  get hasResourceToUpdate() {
    return this.resourceToUpdate !== null;
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
  handleResourceChanged(evt) {
    const value = evt.detail.value;
    console.log('resource changed');
    if (typeof value === "string") {
      this.resourceToUpdate = {
        Name: value
      };
    } else {
      this.resourceToUpdate = value;
    }
    this.clearKeyListener();
  }

  fileToUpload = null;
  showSpinner = false;
  fileReaderObj = null;
  base64FileData = null;

  /**
   * Handles when the file input has changed
   * @param {CustomEvent} evt 
   */
  handleFileChanged(evt) {
    console.log('file changed');
    debugger;
    const fileSelector = this.template.querySelector('lightning-input.file-selector');
    const filesToUpload = evt.target.files;
    if (filesToUpload.length > 0) {
      const fileToUpload = filesToUpload[0];
      this.fileToUpload = fileToUpload;
    }
  }

  loadFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log('load');
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      }
    });
  }

  async handleUpload(evt) {
    console.log('user clicked the upload button');
    debugger;
    this.showSpinner = true;

    const result = await this.loadFileAsBase64(this.fileToUpload)
      .catch(e => {
        console.error('error occurred', e);
      });
    
    console.log('I have results:' + (typeof result));
  }

  /**
   * Handle the file upload finished
   * @param {CustomEvent}
   */
  handleUploadFinished(evt) {
    console.log('file upload finished', evt);
  }

  disconnectedCallback() {
    this.clearKeyListener();
  }

  //-- internal methods

  clearKeyListener() {
    window.clearTimeout(this.delayTimeout);
  }
}

export {
  utcDateToLocal,
  STATIC_RESOURCE_ICON
};
