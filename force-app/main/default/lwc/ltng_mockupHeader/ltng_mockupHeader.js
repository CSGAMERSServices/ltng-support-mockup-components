import { LightningElement, api } from 'lwc';

/**
 * Very simple header to help separate out sections of the page.
 * 
 * Based on the Lightning Design System - Page Header:
 * @see https://www.lightningdesignsystem.com/components/page-headers/ 
 */
export default class Ltng_mockupHeader extends LightningElement {

  /**
   * The Title text to show for the header.
   * @see https://www.lightningdesignsystem.com/components/page-headers/
   * @type {String}
   */
  @api mainTitle;

  /**
   * The sub-title to show for the header.
   * @see https://www.lightningdesignsystem.com/components/page-headers/
   * @type {String}
   */
  @api subTitle;

  /**
   * The category of the icon we should show
   * @see https://lightningdesignsystem.com/icons/
   * @type {String}
   */
  @api iconCategory;

  /**
   * The name of the icon to show within the iconCategory.
   * @see https://lightningdesignsystem.com/icons/
   */
  @api iconName;

  //-- getters/setters

  /**
   * The fully qualified path for the icon to show
   * (category/name)
   * @type {String}
   */
  @api get iconPath() {
    return `${this.iconCategory}:${this.iconName}`;
  }
}