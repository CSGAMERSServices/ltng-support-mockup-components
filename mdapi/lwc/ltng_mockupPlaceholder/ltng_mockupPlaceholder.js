import { LightningElement, api } from 'lwc';

/**
 * This component is meant to be a spacer
 * for when you want to set the size just right.
 */
export default class Ltng_mockupPlaceholder extends LightningElement {
  /**
   * Title of the spacer
   * @type {String}
   */
  @api title;

  /**
   * Subtitle of the spacer
   * @type {String}
   */
  @api subTitle;

  /**
   * Height of the component
   * @type {String}
   */
  @api cmpHeight;

  /**
   * CSS Width of the component
   * @type {String}
   */
  @api cmpWidth;

  /**
   * Whether to show the size of the placeholder
   * @type {Boolean}
   */
  @api showSizeDisplay;

  //-- getters

  /**
   * Calculates the styles of the component
   * @type {String}
   */
  @api get componentStyles() {
    let resultCSS = [];
    if (this.cmpHeight) {
      resultCSS.push(`height: ${this.cmpHeight}`);
    }
    if (this.cmpWidth) {
      resultCSS.push(`width: ${this.cmpWidth}`);
    }
    return resultCSS.join('; ');
  }
}
