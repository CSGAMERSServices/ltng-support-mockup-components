/* istanbul ignore file */

/* eslint-disable no-unused-vars */

/**
 * More complex demo allowing multiple scenes to be tested.
 **/
import { LightningElement, api } from 'lwc';
import {Scene} from 'c/story_book';
// import { isObject } from 'util';

import * as data from '../ltng_editableCombobox/__data__';

export default class Story_editableCombobox extends LightningElement {

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
    new Scene('Closed initially', {
      width: 'large',
      sceneStyles: 'height:100px',
      label: 'Story Label',
      placeholder: 'Story Placeholder',
      isOpen: 'false',
      text: '',
      options: data.SHORT_OPTIONS
    }),
    new Scene('Open initially', {
      width: 'large',
      sceneStyles: 'height:300px',
      label: 'Editable Picklist',
      isOpen: 'true',
      text: 'ltng_',
      options: data.LONG_OPTIONS
    })
  ];

  handleChange(evt) {
    // console.log('value changed on the combobox', JSON.parse(JSON.stringify(evt.target.value)));
    this.clearKeyListener();
  }

  handleKeyUp(evt) {
    // console.log('user was typing in the editable combobox');
    
    const searchStr = evt.target.value;
    this.clearKeyListener();

    this.delayTimeout = setTimeout(() => { // eslint-disable-line
      // console.log(`searching for:${searchStr}`);
    }, 3000);
  }

  clearKeyListener() {
    window.clearTimeout(this.delayTimeout);
    this.delayTimeout = null;
  }

  disconnectedCallback() {
    this.clearKeyListener();
  }
}