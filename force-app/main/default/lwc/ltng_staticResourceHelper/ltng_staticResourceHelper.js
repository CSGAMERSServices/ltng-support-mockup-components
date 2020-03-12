import { LightningElement, api, track, wire } from 'lwc';

import apexFindStaticResources from '@salesforce/apex/ltng_staticResourceHelperCtrl.findStaticResources';

/**
 * @typedef {Object} StaticResource
 * @property {String} Id - id of the record
 * @property {String} Name - name of the static resource
 * @property {String} LastModifiedDate - date the resource was last modified
 */

const ENTER_KEY = 13;

/**
 * This is a component to allow a user to upload static resources
 * (so we can provide images for mockups)
 * without having to go to the setup screen.
 * 
 * This will hopefully make it much simpler to hold discussions with mockups.
 */
export default class Ltng_staticResourceHelper extends LightningElement {

  /**
   * The term to search for
   * @type {String}
   */
  @api queryTerm = 'ltng_'

  /**
   * Collection of static resources captured
   */
  @api staticResources;


  /**
   * The static resources found
   * @type {StaticResource[]}
   */
  @wire (apexFindStaticResources, { searchStr: '$queryTerm' })
  handleResults({data}) {
    // console.log('results came in');
    if (data) {
      this.staticResources = data;
    }
  }

  //-- handlers

  /**
   * Handles when the user presses the return key
   * @param {CustomEvent} evt
   */
  handleKeyUp(evt) {
    const isEnterKey = evt.keyCode === ENTER_KEY || evt.detail.keyCode === ENTER_KEY;
    if (isEnterKey) {
      this.queryTerm = this.queryTransition;

      /*
      @TODO - investigate why the demo works here:
      https://developer.salesforce.com/docs/component-library/bundle/lightning-input/example
      specifically 'Search Input'
      but:
      * evt.target.value == undefined
      * evt.target.getSource() == not a function
      * this.template.querySelector(...).value == undefined
      */
    }
  }

  //-- kludge

  /**
   * @KLUDGE
   * because we could not get the value of the input any other way.
   */
  @track queryTransition = '';

  /**
   * @KLUDGE
   * Handle when the user changed the value on the input
   * @param {CustomEvent} evt 
   */
  handleSearchChanged(evt) {
    this.queryTransition=evt.detail.value;
  }
}

export {
  ENTER_KEY
};