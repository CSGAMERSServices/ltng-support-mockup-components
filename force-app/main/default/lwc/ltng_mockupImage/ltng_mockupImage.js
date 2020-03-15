import { LightningElement, api, track, wire } from 'lwc'; // eslint-disable-line no-unused-vars
import { NavigationMixin } from 'lightning/navigation';

import apexGetSettings from '@salesforce/apex/ltng_MockupController.getSettings';

// import apexGetResource from '@salesforce/apex/ltng_MockupController.getResource';

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

/**
 * Simple component to let us put up a placeholder image.
 */
export default class Ltng_mockupImage extends NavigationMixin(LightningElement) {
  /**
   * The API name of the resource to show
   * @type {String}
   */
  @api resourceNameManualEntry;

  /**
   * The API name of the resource to show (selected by picklist)
   * @type {String}
   */
  @api resourceNameFromPicklist;

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

  /*
  NOTE: the shortcut /resource/resourceName is expected to remain for the foreseeable future.
  In the case this ever is not the case, we also included the more 'robust' means
  (as this uses /resource/SystemModstamp in milliseconds/resourceName)
  but this requires a call to the server, and muddies the water a bit.

  If this is ever needed, please uncomment this version

  /#
   * The address of the static resource
   * @visibility Private
   * @type {String}
   #/
  @track resourceAddress;

  @wire(apexGetResource, {resourceName: '$resourceName'})
  resourceAddress({error, data}) {
    if (data) {
      this.resourceAddress = data;
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.resourceAddress = undefined;
    }
  }
  */

  /**
   * The ResourceName to use
   * @return {String}
   */
  @api
  get resourceName() {
    if (!this.resourceNameFromPicklist
      || this.resourceNameFromPicklist === RESOURCE_NAME_NOT_CHOSEN
    ){
      return this.resourceNameManualEntry;
    }
    return this.resourceNameFromPicklist;
  }

  /**
   * Calculated Address
   * @returns {String}
   */
  @api
  get resourceAddress() {
    if (this.resourceName && this.resourceName.indexOf('/') > -1) {
      return this.resourceName;
    }

    return `/resource/${this.resourceName}${this.cacheBuster}`;
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

  /**
   * The tooltip to show on the image
   * @returns {String}
   */
  @api get tooltip() {
    return `resource:${this.resourceName} - ${this.description ? this.description : ''}`;
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