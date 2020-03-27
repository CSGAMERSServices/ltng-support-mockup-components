/* istanbul ignore file */

/**
 * More complex demo allowing multiple scenes to be tested.
 **/
import { LightningElement, api } from 'lwc';
import {Scene} from 'c/story_book';
// import { isObject } from 'util';

export default class Story_mockupPlaceholder extends LightningElement {

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
    new Scene('Empty Placeholder', {
      width: 'large'
    }),
    new Scene('Only Title', {
      width: 'large',
      title: 'Title'
    }),
    new Scene('Only SubTitle', {
      width: 'large',
      subTitle: 'Some SubTitle'
    }),
    new Scene('Long SubTitle', {
      width: 'narrow',
      title: 'Some Title',
      subTitle: 'Very very very very very very very very very very very very very very very very very very long subtitle'
    }),
    new Scene('Explicit Width', {
      width: 'large',
      title: 'Title',
      cmpWidth: '400px'
    }),
    new Scene('Explicit Height', {
      width: 'large',
      title: 'Title',
      cmpHeight: '200px'
    }),
    new Scene('Explicit Size', {
      width: 'large',
      title: 'Title',
      cmpWidth: '200px',
      cmpHeight: '200px'
    })
  ];
}