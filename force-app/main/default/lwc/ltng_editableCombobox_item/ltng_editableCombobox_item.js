import { LightningElement, api } from 'lwc';

/**
 * Represents an item renderer for the editable combobox
 */
export default class Ltng_editableCombobox_item extends LightningElement {
  /**
   * label to show for the item
   * @required
   * @type {String}
   */
  @api label;

  /**
   * Sub-Label to show for the item
   * @optional
   * @type {String}
   */
  @api subLabel;

  /**
   * Icon (group:name) to show - optional
   */
  @api icon;

  /**
   * value of the item
   * @type {any}
   */
  @api value;
}
