import { LightningElement, api, track } from 'lwc'; // eslint-disable-line no-unused-vars

const SIZE_SMALL = 'SMALL';
const SIZE_NARROW = 'NARROW';
const SIZE_MEDIUM = 'MEDIUM';
const SIZE_LARGE = 'LARGE';
const SIZE_WIDE = 'WIDE';

export {
  SIZE_SMALL,
  SIZE_MEDIUM,
  SIZE_LARGE
}

/**
 * A single storybook story for use in a storybook.
 **/
export default class Story_book extends LightningElement {

  /**
   * Label for the storybook story
   * @type {string}
   **/
  @api title;

  /**
   * Description for the story
   * @type {LightningElement[]}
   */
  @api description;

  /**
   * Width of the storybook story
   * @type {String} - (SMALL|MEDIUM|LARGE)
  */
  @api width;

  /**
   * Styles to apply to the sandbox.
   * Allowing us to specify explicit sizes, borders, paddings, etc.
   * @type {String}
   */
  @api sandboxStyles;

  /** whether to include a border for the component */
  @api border;

  get storyBookClasses() {
    let borderedClass = '';
    if ((''+this.border).toUpperCase()==='TRUE') {
      borderedClass = 'bordered';
    }
    let widthClass = '';
    // styleCSS += ` width: ${this.width};`;
    if (this.width) {
      switch(this.width.toUpperCase()) {
        case SIZE_NARROW:
        case SIZE_SMALL: widthClass = 'width-small'; break;
        case SIZE_MEDIUM: widthClass = 'width-medium'; break;
        case SIZE_WIDE:
        case SIZE_LARGE: widthClass = 'width-large'; break;
        default: break;
      }
    }
    return `slds-box slds-theme_default storybook ${widthClass} ${borderedClass}`;
  }

  /** 
   * The actual test is passed to the unnamed <slot />
   */

  //-- handlers
  /**
   * Handles if the user selects a size from the menu
   * @param {CustomEvent}
   */
  handleSizeSelected(evt) {
    this.width = evt.detail.value;    
  }
}

/**
 * Defines a scene within the storybook
 */
export class Scene {
  /**
   * The label of the scene (used in scene selector)
   * @type {String}
   */
  label;

  /**
   * The data we should bind to for this scene
   * @type {any}
   */
  value;

  /**
   * Constructor
   * @param {String} label 
   * @param {any} value 
   */
  constructor(label, value) {
    this.label = label;
    this.value = value || {};
  }
}