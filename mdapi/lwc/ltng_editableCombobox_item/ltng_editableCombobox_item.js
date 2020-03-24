import { LightningElement, api } from 'lwc';

/**
 * Icon to use if the value is currently selected
 * @type {String}
 */
const SELECTED_ICON = 'utility:check';

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

  /**
   * The currently selected value
   * (Used to identify if this value is selected)
   * @type {any}
   */
  @api selectedValue;

  /**
   * Whether to use the icon or the selected icon
   * @returns {String}
   */
  get _icon() {
    return (
      this.selectedValue !== undefined &&
      this.selectedValue !== null &&
      this.selectedValue === this.value
    )
      ? SELECTED_ICON
      : this.icon;
  }
}
