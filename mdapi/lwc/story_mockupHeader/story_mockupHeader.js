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
    new Scene('Bare Header', {
      description: 'Header without subtitle or icons',
      width: 'large',
      mainTitle: 'Header',
      subTitle: null,
      iconCategory: null,
      iconName: null
    }),
    new Scene('Standard Header with subtitle', {
      width: 'large',
      mainTitle: 'Home 123',
      subTitle: 'Account',
      iconCategory: 'standard',
      iconName: 'account'
    }),
    new Scene('Standard Header without subtitle', {
      width: 'large',
      mainTitle: 'Home 123',
      subTitle: null,
      iconCategory: 'standard',
      iconName: 'account'
    }),
    new Scene('Action Header', {
      width: 'large',
      mainTitle: 'Title',
      subTitle: 'Subtitle',
      iconCategory: 'action',
      iconName: 'add_contact'
    }),
    new Scene('Custom Header', {
      width: 'large',
      mainTitle: 'Title',
      subTitle: 'Subtitle',
      iconCategory: 'custom',
      iconName: 'custom1'
    }),
    new Scene('Doctype Header', {
      width: 'large',
      mainTitle: 'Title',
      subTitle: 'Subtitle',
      iconCategory: 'doctype',
      iconName: 'audio'
    }),
    new Scene('Utility Header', {
      width: 'large',
      mainTitle: 'Title',
      subTitle: 'Subtitle',
      iconCategory: 'utility',
      iconName: 'activity'
    })
  ];
}