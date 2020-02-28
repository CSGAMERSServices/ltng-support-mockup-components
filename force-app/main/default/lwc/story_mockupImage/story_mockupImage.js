/**
 * More complex demo allowing multiple scenes to be tested.
 **/
import { LightningElement, api } from 'lwc';
import {Scene} from 'c/story_book';
// import { isObject } from 'util';

import ltng_ExamplePlaceholderImage from '@salesforce/resourceUrl/ltng_ExamplePlaceholderImage';

export default class Story_exampleComplex extends LightningElement {

  /**
   * Current scene we are working with
   * @type {Scene}
   */
  @api currentScene = new Scene();

  @api resourceAddress = ltng_ExamplePlaceholderImage;

  /**
   * List of all scenes we have
   * @type {Scene[]}
   */
  @api allScenes = [
    new Scene('Sample Resource', {
      resourceName: ltng_ExamplePlaceholderImage, // 'ltng_ExamplePlaceholderImage',
      description: 'Example Image',
      imgWidth: '',
      imgHeight: '',
      targetAddress: 'https://www.google.com'
    })
  ];
}