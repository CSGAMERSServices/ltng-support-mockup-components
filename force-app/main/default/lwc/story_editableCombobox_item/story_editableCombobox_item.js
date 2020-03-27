/* istanbul ignore file */

/**
 * More complex demo allowing multiple scenes to be tested.
 **/
import { LightningElement, api } from 'lwc';
import {Scene} from 'c/story_book';
// import { isObject } from 'util';

const LONG_TEXT = 'Long long long long long long long long long long long long long long long long long long long long long';

export default class Story_editableCombobox_item extends LightningElement {

  /**
   * Current scene we are working with
   * @type {Scene}
   */
  @api currentScene = new Scene();

  /**
   * List of all scenes we have
   * @type {Scene[]}
   */
  @api allScenes = [
    new Scene('Happy Path', {
      description: 'label, subLabel, icon, value',
      width: 'large',
      label: 'ltng_ExampleComponent',
      subLabel: 'March 11, 03:39 PM',
      icon: 'standard:file',
      value: 'someIDxyz'
    }),
    new Scene('Label Only', {
      width: 'large',
      label: 'ltng_ExampleComponent',
      icon: 'standard:partners',
      value: 'someIDxyz'
    }),
    new Scene('Very Long text', {
      width: 'narrow',
      label: LONG_TEXT,
      subLabel: LONG_TEXT,
      icon: 'standard:file',
      value: 'someIDxyz'
    }),
    new Scene('No Icon', {
      width: 'large',
      label: 'ltng_ExampleComponent',
      value: 'someIDxyz'
    }),
    new Scene('Label Only: Selected', {
      width: 'large',
      description: 'if the selected value matches, the checkbox icon is used instead',
      label: 'ltng_ExampleComponent',
      icon: 'standard:file',
      value: 'someIDxyz',
      selectedValue: 'someIDxyz'
    })
  ];
}