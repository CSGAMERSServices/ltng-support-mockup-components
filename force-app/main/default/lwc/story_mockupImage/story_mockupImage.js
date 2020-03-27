/* istanbul ignore file */

/**
 * More complex demo allowing multiple scenes to be tested.
 **/
import { LightningElement, api } from 'lwc';
import {Scene} from 'c/story_book';
// import { isObject } from 'util';

import ltng_ExamplePlaceholderImage from '@salesforce/resourceUrl/ltng_ExamplePlaceholderImage';

export default class Story_mockupImage extends LightningElement {

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
    new Scene('Wide Resource', {
      resourceNameFromPicklist: '',
      resourceNameManualEntry: ltng_ExamplePlaceholderImage, // 'ltng_ExamplePlaceholderImage',
      imgWidth: '',
      imgHeight: '',
      targetAddress: 'https://www.google.com',
      sceneWidth: 'wide'
    }),
    new Scene('Medium Resource', {
      resourceNameFromPicklist: '',
      resourceNameManualEntry: ltng_ExamplePlaceholderImage, // 'ltng_ExamplePlaceholderImage',
      imgWidth: '',
      imgHeight: '',
      targetAddress: 'https://www.google.com',
      sceneWidth: 'medium'
    }),
    new Scene('Narrow Resource', {
      resourceNameFromPicklist: '',
      resourceNameManualEntry: ltng_ExamplePlaceholderImage, // 'ltng_ExamplePlaceholderImage',
      imgWidth: '',
      imgHeight: '',
      targetAddress: 'https://www.google.com',
      sceneWidth: 'narrow'
    }),
    new Scene('Narrow Square Resource', {
      resourceNameFromPicklist: '',
      resourceNameManualEntry: ltng_ExamplePlaceholderImage, // 'ltng_ExamplePlaceholderImage',
      description: '400px/400px Narrow',
      imgWidth: '400px',
      imgHeight: '400px',
      targetAddress: 'https://www.google.com',
      sceneWidth: 'narrow'
    }),
    new Scene('Medium Square Resource', {
      resourceNameFromPicklist: '',
      resourceNameManualEntry: ltng_ExamplePlaceholderImage, // 'ltng_ExamplePlaceholderImage',
      description: '400px/400px Narrow',
      imgWidth: '400px',
      imgHeight: '400px',
      targetAddress: 'https://www.google.com',
      sceneWidth: 'medium'
    }),
    new Scene('Wide Square Resource', {
      resourceNameFromPicklist: '',
      resourceNameManualEntry: ltng_ExamplePlaceholderImage, // 'ltng_ExamplePlaceholderImage',
      description: '400px/400px Narrow',
      imgWidth: '400px',
      imgHeight: '400px',
      targetAddress: 'https://www.google.com',
      sceneWidth: 'wide'
    })
  ];
}