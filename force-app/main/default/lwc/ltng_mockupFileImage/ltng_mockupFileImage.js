import { LightningElement, api, track, wire } from 'lwc'; // eslint-disable-line no-unused-vars
import { NavigationMixin } from 'lightning/navigation';

import apexDetermineFileContentURL from '@salesforce/apex/ltng_mockupFileCtrl.determineFileContentURL';

import apexGetSettings from '@salesforce/apex/ltng_mockupFileCtrl.getSettings';

/**
 * @typedef {Object} ltng_mockupSettings__c
 * @param {Boolean} Enable_Mock_Image_Caching__c - whether the image cache should be ignored.
 */

/**
 * Updates the cache buster
 * (the unique string that invalidates the cache)
 */
export function generateCacheBuster(ignoreCache) {
  if (ignoreCache) {
    return `?t=${new Date().getTime()}`;
  }
  return '';
}

export default class Ltng_mockupFileImage extends NavigationMixin(LightningElement) {
  /**
   * Id of the File Content we want to follow
   * @type {String}
   */
  @api contentId = '069R0000000qlZcIAI';

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
   * 
   * @param {ltng_} param0 
   */
  @wire (apexGetSettings)
  handleApexSettings({ data }) {
    if (data) {
      this.cacheBuster = generateCacheBuster(data.Enable_Mock_Image_Caching__c !== true);
    }
  }

  /** 
   * Address URL of the content version
   * @type {String}
   **/
  @wire(apexDetermineFileContentURL, {contentId: '$contentId'})
  contentURL;

  /**
   * URL for the contentVersion
   * @type {String}
   */
  @track contentURL = '';
  // '/sfc/servlet.shepherd/version/download/{0}';

  //-- getters / setters

  @api get contentAddress() {
    let result = '';
    if (this.contentId && this.contentId.indexOf('/') > -1) {
      //-- if needed, we use the contentId as the whole URL (for local testing)
      result = this.contentId;
    } else if (this.contentURL) {
      result = `${this.contentURL.data}${this.cacheBuster}`;
    }
    return result;
  }

  //-- getters / setters
  /**
   * the calculated style of the image
   * @returns {String}
   */
  @api
  get calculatedStyle() {
    return `width:${this.imgWidth}; height:${this.imgHeight}`;
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
}
