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
  @api currentScene = null;

  /**
   * List of all scenes we have
   * @type {Scene[]}
   */
  @api allScenes = [
    new Scene('Large Width Scene', {
      width: 'large',
      tablecsv: `"FirstName", LastName, "Age" , Color
Eve, Jackson, 94, Red
Rob, Mite, 24, Blue
Bob, Parr, 42, Red`
    }),
    new Scene('Narrow Width Scene', {
      width: 'narrow',
      tablecsv: `"FirstName", LastName, "Age" , Color
Eve, Jackson, 94, Red
Rob, Mite, 24, Blue
Bob, Parr, 42, Red`
    }),
    new Scene('narrow Width Scene', {
      description: 'Default Table',
      width: 'narrow',
      tablecsv: `"FirstName", LastName, "Age" , Color`
    })
  ];

  connectedCallback() {
    this.currentScene = this.allScenes[0];
  }
}