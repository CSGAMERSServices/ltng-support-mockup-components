
/**
 * More complex demo allowing multiple scenes to be tested.
 **/
import { LightningElement, api } from 'lwc';
import {Scene} from 'c/story_book';
// import { isObject } from 'util';

const EXAMPLE_OPTION = {
  key: '081R0000000HkXpIAK1',
  label: 'Label',
  subLabel: 'Sub Label',
  icon: 'standard:file',
  value: {
    "Id": "081R0000000HkXpIAK1",
    "Name": "ltng_ExampleComponent",
    "LastModifiedDate": "2020-03-11T20:39:45.000Z"
  }
};

function generateOptions(count) {
  const results = [];
  let currentOption;
  for ( let i = 0; i < count; i = i+1) {
    currentOption = Object.assign({}, EXAMPLE_OPTION);
    currentOption.key = `${currentOption.key}_${i}`;
    currentOption.label = `${currentOption.label} - ${i}`;
    currentOption.value = Object.assign({}, EXAMPLE_OPTION.value);
    currentOption.value.Id=currentOption.key;
    results.push(currentOption);
  }
  return results;
}

/*
const LONG_OPTIONS = [{
  key: '081R0000000HkXpIAK1',
  label: 'ltng_ExampleComponent',
  subLabel: '2020-03-11T20:39:45.000Z',
  icon: 'standard:file',
  value: {
    "Id": "081R0000000HkXpIAK1",
    "Name": "ltng_ExampleComponent",
    "LastModifiedDate": "2020-03-11T20:39:45.000Z"
  }
},{
  key: '081R0000000HkXpIAK2',
  label: 'ltng_ExampleComponent',
  subLabel: '2020-03-11T20:39:45.000Z',
  icon: 'standard:file',
  value: {
    "Id": "081R0000000HkXpIAK1",
    "Name": "ltng_ExampleComponent",
    "LastModifiedDate": "2020-03-11T20:39:45.000Z"
  }
},{
  key: '081R0000000HkXpIAK3',
  label: 'ltng_ExampleComponent',
  subLabel: '2020-03-11T20:39:45.000Z',
  icon: 'standard:file',
  value: {
    "Id": "081R0000000HkXpIAK1",
    "Name": "ltng_ExampleComponent",
    "LastModifiedDate": "2020-03-11T20:39:45.000Z"
  }
},{
  key: '081R0000000HkXpIAK4',
  label: 'ltng_ExampleComponent',
  subLabel: '2020-03-11T20:39:45.000Z',
  icon: 'standard:file',
  value: {
    "Id": "081R0000000HkXpIAK1",
    "Name": "ltng_ExampleComponent",
    "LastModifiedDate": "2020-03-11T20:39:45.000Z"
  }
},{
  key: '081R0000000HkXpIAK5',
  label: 'ltng_ExampleComponent',
  subLabel: '2020-03-11T20:39:45.000Z',
  icon: 'standard:file',
  value: {
    "Id": "081R0000000HkXpIAK1",
    "Name": "ltng_ExampleComponent",
    "LastModifiedDate": "2020-03-11T20:39:45.000Z"
  }
}];
*/
const SHORT_OPTIONS = generateOptions(3);
const LONG_OPTIONS = generateOptions(10);

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
    new Scene('Closed initially', {
      width: 'large',
      sceneStyles: 'height:100px',
      label: 'Static resource to update',
      isOpen: 'false',
      text: 'ltng_',
      options: SHORT_OPTIONS
    }),
    new Scene('Open initially', {
      width: 'large',
      sceneStyles: 'height:300px',
      label: 'Editable Picklist',
      isOpen: 'true',
      text: '',
      options: LONG_OPTIONS
    })
  ];

  handleChange(evt) {
    console.log('value changed on the combobox', JSON.parse(JSON.stringify(evt.target.value)));
    this.clearKeyListener();
  }

  handleKeyUp(evt) {
    console.log('user was typing in the editable combobox');
    
    const searchStr = evt.target.value;
    this.clearKeyListener();

    this.delayTimeout = setTimeout(() => { // eslint-disable-line
      console.log(`searching for:${searchStr}`);
    }, 3000);
  }

  clearKeyListener() {
    window.clearTimeout(this.delayTimeout);
  }

  handleSceneChanged(sceneEvent) {
    this.currentScene = sceneEvent.detail;
  }

  disconnectedCallback() {
    this.clearKeyListener();
  }
}