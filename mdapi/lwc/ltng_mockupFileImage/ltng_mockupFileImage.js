import { LightningElement, api, track, wire } from 'lwc'; // eslint-disable-line no-unused-vars
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';

import apexDetermineFileContentURL from '@salesforce/apex/ltng_mockupFileCtrl.determineFileContentURL';
import apexGetSettings from '@salesforce/apex/ltng_mockupFileCtrl.getSettings';

import { registerListener, unregisterListener } from 'c/ltng_mockupEventBus';

/**
 * @typedef {Object} ltng_mockupSettings__c
 * @param {Boolean} Enable_Mock_Image_Caching__c - whether the image cache should be ignored.
 */

/**
 * @typedef {Object} FileAddressInfo
 * @property {String} ContentDocumentId -
 * @property {String} ContentVersionId -
 * @property {String} Title -
 * @property {String} Address - 
 */

const IMAGE_CHANGED_EVENT_TYPE = 'imageuploaded';

let UNIQUE = 1;

/**
 * Updates the cache buster
 * (the unique string that invalidates the cache)
 */
function generateCacheBuster(ignoreCache) {
  if (ignoreCache) {
    return `?t=${++UNIQUE}_${new Date().getTime()}`;
  }
  return '';
}

export default class Ltng_mockupFileImage extends NavigationMixin(LightningElement) {

  @api constants = {
    IMAGE_CHANGED_EVENT_TYPE,
    generateCacheBuster
  };

  /**
   * Id of the File Content we want to follow
   * @type {String}
   */
  @api contentId = '';

  /**
   * The screen reader tooltip for the image
   * @type {String}
   */
  @api description;

  /**
   * The CSS width of the image
   * @type {String}
   */
  @api imgWidth;

  /**
   * The CSS height of the image
   * @type {String}
   */
  @api imgHeight;

  /**
   * The address to go when clicking the button
   * @type {String}
   */
  @api targetAddress;

  /**
   * Unique cache buster to break the cache when asking for resources
   * @type {String}
   */
  @track cacheBuster = '';

  /**
   * Current page reference
   */
  @wire(CurrentPageReference)
  pageRef;

  /**
   * 
   * @param {ltng_} param0 
   */
  @wire (apexGetSettings)
  handleApexSettings({ data }) {
    if (data) {
      this.cacheBuster = generateCacheBuster(data.Enable_Mock_Image_Caching__c !== true);
    }
  }

  @wire(apexDetermineFileContentURL, {contentId: '$contentId'})
  /** 
   * Address URL of the content version
   * @type {FileAddressInfo}
   **/
  contentFileAddress = null;
  // '/sfc/servlet.shepherd/version/download/{0}';

  //-- getters / setters

  @api get contentAddress() {
    let result = '';
    if (this.contentId && this.contentId.indexOf('/') > -1) {
      //-- if needed, we use the contentId as the whole URL (for local testing)
      result = this.contentId;
    } else if (this.contentFileAddress && this.contentFileAddress.data) {
      result = `${this.contentFileAddress.data.Address}${this.cacheBuster}`;
    }
    return result;
  }

  /**
   * the calculated style of the image
   * @returns {String}
   */
  @api
  get calculatedStyle() {
    return `width:${this.imgWidth}; height:${this.imgHeight}`;
  }

  /**
   * Tooltip to show for the image, so we can better find and update the file
   * @returns {String}
   */
  @api get tooltip() {
    let result = 'File:';
    if (this.contentFileAddress && this.contentFileAddress.data) {
      const title = this.contentFileAddress.data.Title;
      const ContentDocumentId = this.contentFileAddress.data.ContentDocumentId;
      const ContentVersionId = this.contentFileAddress.data.ContentVersionId;
      const description = this.description ? this.description : '';
      result += `${title} (document:${ContentDocumentId}/version:${ContentVersionId}) - ${description}`;
    }
    return result;
  }

  //-- handlers
  /**
   * Handler when the user clicks on the image
   * @param {CustomEvent} evt - 
   */
  handleClick() {
    if (!this.targetAddress) return;

    // @see https://developer.salesforce.com/docs/component-library/documentation/en/48.0/lwc/lwc.use_navigate_basic

    const pageReference = {
      type: 'standard__webPage',
      attributes: {
        url: this.targetAddress
      }
    };

    this[NavigationMixin.Navigate](pageReference);
  }

  /**
   * Handles when an image was uploaded by the File Helper.
   * @param {CustomEvent} evt 
   */
  handleImageUpload() {
    // console.log('image upload registered by the mockup file image', evt);
    this.cacheBuster = generateCacheBuster(true);
    refreshApex(this.contentFileAddress);
  }

  connectedCallback() {
    // console.log('file image connectedCallback');
    registerListener(IMAGE_CHANGED_EVENT_TYPE, this.handleImageUpload, this);
  }

  disconnectedCallback() {
    unregisterListener(IMAGE_CHANGED_EVENT_TYPE, this.handleImageUpload, this);
  }
}
