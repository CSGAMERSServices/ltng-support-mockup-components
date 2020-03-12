import { LightningElement, api, wire } from 'lwc';

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
   * The static resources found
   * @type {StaticResource[]}
   */
  @wire (apexFindStaticResources, { searchStr: '$queryTerm' })
  handleResults({data, error}) {
    console.log('results came in');
    console.log(data);
    console.log(error);
    if (data) {
      this.staticResources = data;
    }
  }

  @api staticResources;

  //-- handlers

  /**
   * Handles when the user presses the return key
   * @param {CustomEvent} evt
   */
  handleKeyUp(evt) {
    //-- @see https://developer.salesforce.com/docs/component-library/bundle/lightning-input/example
    //-- specifically 'Search Input'
    console.log('key up');
    const isEnterKey = evt.keyCode === ENTER_KEY || evt.detail.keyCode === ENTER_KEY;
    if (isEnterKey) {
      this.queryTerm = this.searchQuery;
    }
  }

  get searchQuery() {
    return this.template.querySelector('div.search-box > lightning-input').value;
  }
}

export {
  ENTER_KEY
};
