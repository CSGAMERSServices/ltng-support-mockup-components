/* istanbul ignore file */

/**
 * More complex demo allowing multiple scenes to be tested.
 **/
import { LightningElement, api } from 'lwc';
import {Scene} from 'c/story_book';
// import { isObject } from 'util';

export default class story_mockupFileHelper extends LightningElement {

  /**
   * Current scene we are working with
   * @type {Scene}
   */
  @api expandedScene = new Scene('Expanded', {
    width: 'large'
  });

  @api collapsedScene = new Scene('Collapsed', {
    width: 'large'
  });

  @api notCollapsibleScene = new Scene('Not Collapsible', {
    width: 'large'
  });
}