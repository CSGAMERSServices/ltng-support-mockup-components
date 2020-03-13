import { LightningElement, api, track, wire } from 'lwc'; // eslint-disable-line no-unused-vars
import { NavigationMixin } from 'lightning/navigation';

import apexDetermineContentURL from '@salesforce/apex/ltng_MockupController2.determineContentURL';

import apexGetSettings from '@salesforce/apex/ltng_MockupController2.getSettings';

/**
 * Sentinel meaning no choice was made for reource selection
 * @type {String}
 */
const RESOURCE_NAME_NOT_CHOSEN = '-- Use Manual Entry --';

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

// content id = 069R0000000qlZcIAI
// content version = 068R0000000qx8LIAQ

/**
 * Alternative version of the mockup image that uses files instead
 */
export default class Ltng_mockupImage2 extends NavigationMixin(LightningElement) {

  /**
   * Id of the File Content we want to follow
   * @type {String}
   */
  @api contentId = '069R0000000qlZcIAI';

  /**
   * Id of the content version
   * @type {String}
   */
  @track contentVersionId = '068R0000000qx8LIAQ';

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
    this.cacheBuster = generateCacheBuster(
      (data && data.Enable_Mock_Image_Caching__c === false)
    );
  }

  /** 
   * Address URL of the content version
   * @type {String}
   **/
  @wire(apexDetermineContentURL, {contentId: '$contentId'})
  contentURL;

  /**
   * Getter to determine the url to use,
   * plus optional cache busting
   * @type {String}
   */
  @api get contentAddress() {
    let result = '';
    if (this.contentURL && this.contentURL.data) {
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