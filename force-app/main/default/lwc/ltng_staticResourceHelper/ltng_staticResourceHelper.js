import { LightningElement, api, track, wire } from 'lwc';

import apexFindStaticResources from '@salesforce/apex/ltng_staticResourceHelperCtrl.findStaticResources';

/**
 * @typedef {Object} StaticResource
 * @property {String} Id - id of the record
 * @property {String} Name - name of the static resource
 * @property {String} LastModifiedDate - date the resource was last modified
 */

/**
 * Converts a UTC DateTime string to local
 * @param {String} utcDateTime - ex: '2020-03-11T20:39:45.000Z'
 * @returns {String} - ex: 3/11/2020, 3:39:45 PM
 */
const utcDateToLocal = (dateStr) => {
  const parsedDate = Date.parse(dateStr);
  if (!parsedDate) {
    return dateStr;
  }
  return new Date(parsedDate).toLocaleString();
};

/**
 * Icon (group:name) to use for static resources
 * @type {String}
 */
const STATIC_RESOURCE_ICON = 'standard:file';

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
   * Static resource to update
   * @type {StaticResource}
   */
  @api resourceToUpdate;

  /**
   * Collection of static resources captured
   */
  @api staticResources = [
    {
      "Id": "081R0000000HkXpIAK1",
      "Name": "ltng_ExampleComponent",
      "LastModifiedDate": "2020-03-11T20:39:45.000Z"
    },
    {
      "Id": "081R0000000HkK7IAK2",
      "Name": "ltng_ExamplePlaceholderImage",
      "LastModifiedDate": "2020-03-11T16:20:55.000Z"
    },
    {
      "Id": "081R0000000HkXpIAK3",
      "Name": "ltng_ExampleComponent",
      "LastModifiedDate": "2020-03-11T20:39:45.000Z"
    },
    {
      "Id": "081R0000000HkK7IAK4",
      "Name": "ltng_ExamplePlaceholderImage",
      "LastModifiedDate": "2020-03-11T16:20:55.000Z"
    },
    {
      "Id": "081R0000000HkXpIAK5",
      "Name": "ltng_ExampleComponent",
      "LastModifiedDate": "2020-03-11T20:39:45.000Z"
    },
    {
      "Id": "081R0000000HkK7IAK6",
      "Name": "ltng_ExamplePlaceholderImage",
      "LastModifiedDate": "2020-03-11T16:20:55.000Z"
    },
    {
      "Id": "081R0000000HkXpIAK7",
      "Name": "ltng_ExampleComponent",
      "LastModifiedDate": "2020-03-11T20:39:45.000Z"
    },
    {
      "Id": "081R0000000HkK7IAK8",
      "Name": "ltng_ExamplePlaceholderImage",
      "LastModifiedDate": "2020-03-11T16:20:55.000Z"
    },
    {
      "Id": "081R0000000HkXpIAK9",
      "Name": "ltng_ExampleComponent",
      "LastModifiedDate": "2020-03-11T20:39:45.000Z"
    },
    {
      "Id": "081R0000000HkK7IAK0",
      "Name": "ltng_ExamplePlaceholderImage",
      "LastModifiedDate": "2020-03-11T16:20:55.000Z"
    }
  ];

  /**
   * accepted formats
   * @type {String[]}
   */
  @api acceptedFormats = ['.gif', '.png', '.jpg', '.jpeg'];

  /**
   * The static resources found
   * @type {StaticResource[]}
   */
  @wire (apexFindStaticResources, { searchStr: '$queryTerm' })
  handleResults({data}) {
    // console.log('results came in');
    if (data) {
      console.log('data came back', data);
      this.staticResources = data.map((staticResource) => {
        return staticResource ? {
          key: staticResource.Id,
          label: staticResource.Name,
          subLabel: utcDateToLocal(staticResource.LastModifiedDate),
          icon: STATIC_RESOURCE_ICON,
          value: staticResource
        } : {};
      });
    }
  }

  //-- geters / setters
  /**
   * Whether the dropdown should be shown
   * @type {Boolean}
   */
  get showDropdown() {
    // console.log('resourceToUpdate:' + (this.resourceToUpdate?'true':'false'));
    return this.staticResources && !this.resourceToUpdate;
  }

  //-- handlers

  /**
   * Handles when the user presses the return key
   * @param {CustomEvent} evt
   */
  handleKeyUp(evt) {
    const isEnterKey = evt.keyCode === ENTER_KEY || evt.detail.keyCode === ENTER_KEY;
    if (isEnterKey) {
      console.log('enter key pressed');
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

  /**
   * Handle the file upload finished
   * @param {CustomEvent}
   */
  handleUploadFinished(evt) {
    console.log('file upload finished', evt);
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
  utcDateToLocal,
  STATIC_RESOURCE_ICON
};
