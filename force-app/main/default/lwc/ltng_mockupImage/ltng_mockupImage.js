import { LightningElement, api, track, wire } from 'lwc'; // eslint-disable-line no-unused-vars
import { NavigationMixin } from 'lightning/navigation';

// import apexGetResource from '@salesforce/apex/ltng_MockupController.getResource';

/**
 * Sentinel meaning no choice was made for reource selection
 * @type {String}
 */
const RESOURCE_NAME_NOT_CHOSEN = '-- Use Manual Entry --';

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

    return `/resource/${this.resourceName}`;
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