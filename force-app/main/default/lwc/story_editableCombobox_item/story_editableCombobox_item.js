/**
 * More complex demo allowing multiple scenes to be tested.
 **/
import { LightningElement, api } from 'lwc';
import {Scene} from 'c/story_book';
// import { isObject } from 'util';

export default class Story_exampleComplex extends LightningElement {

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
      icon: 'standard:file',
      value: 'someIDxyz'
    })
  ];
}