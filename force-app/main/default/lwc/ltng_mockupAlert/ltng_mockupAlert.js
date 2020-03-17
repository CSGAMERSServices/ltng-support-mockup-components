import { LightningElement, api } from 'lwc';

/**
 * Simple component to show a lightning design system style alert
 */
export default class Ltng_mockupAlert extends LightningElement {

  /**
   * Whether the alert is shown
   * @type {Boolean}
   */
  @api isShown = false;

  /**
   * The theme to use for the alert.
   * @type {String}
   */
  @api theme = 'info';

  /**
   * The group of icon to use
   * @type {String}
   */
  @api iconCategory = 'utility';

  /**
   * The name of the icon to use
   * @type {String}
   */
  @api iconName = 'info';

  /**
   * Message to provide
   * @type {String}
   */
  @api message;

  /**
   * Classes to use for the alert
   * @type {String}
   */
  @api get alertClasses() {
    let themeClass = 'slds-theme_info';
    const dictionary = {
      'error': 'slds-theme_error',
      'info': 'slds-theme_info',
      'warning': 'slds-theme_warning',
      'offline': 'slds-theme_offline'
    };
    if (this.theme && dictionary &&
      typeof dictionary[this.theme] !== 'undefined' // eslint-disable-line no-prototype-builtins
    ) {
      themeClass = dictionary[this.theme];
    }
    // console.log(`theme:${this.theme}, class:${themeClass}`);
    let results = `slds-notify slds-notify_alert slds-theme_alert-texture ${themeClass}`;
    return(results);
  }

  /**
   * The icon phrase to use (group:name)
   * @returns {String}
   */
  @api get iconPhrase() {
    let results = '';
    if (this.iconCategory && this.iconName) {
      results = `${this.iconCategory}:${this.iconName}`;
    }
    return results;
  }

  //-- methods

  messageTimeout = null;

  /**
   * Shows the alert for a period of time.
   * @param {String} msg - the message to show
   * @param {Number} timeout - the length of time to show the message.
   */
  @api show(msg, timeout) {
    if (timeout > 0) {
      window.clearTimeout(this.messageTimeout);
      this.message = msg;
      this.isShown = true;
      this.messageTimeout = setTimeout(() => { // eslint-disable-line
        this.isShown = false;
        window.clearTimeout(this.messageTimeout);
      }, timeout);
    }
  }
}