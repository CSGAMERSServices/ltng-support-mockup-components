/**
 * Way to select data to use for testing
 **/

import { LightningElement, api, track } from 'lwc'; // eslint-disable-line no-unused-vars
import { Scene } from 'c/story_book'; // eslint-disable-line no-unused-vars

/**
 * Storybook Event
 * 
 * @event CustomEvent#scene
 * @type {object}
 * @property {Scene} detail - the scene changed
 */

/**
 * Component to choose between a set of scenes.
 * 
 * @fires CustomEvent#scene - when the scene changes
 */
export default class Story_sceneSelector extends LightningElement {

  //-- @TODO: convert the scenes and index to getter/setters
  //-- as they are linked, the getter/setters allow for setting race conditions
  //-- as it is now though, it is not expected they will change through code.

  /**
   * {Label, Value} pairs that represent scenes
   * so we can test different scenarios.
   * @type {Scene[]]}
   */
  @api scenes;

  /**
   * The internal scene index we are using
   * @type {Integer}
   */
  @api index = 0;

  //-- getters / setters

  //-- private

  /**
   * Used to default the scene based on sceneIndex,
   * so the user doesn't have to choose when re-running.
   * This is the value used in the combobox so it defaults correctly.
   * @type {any}
   */
  @track _comboboxOption;

  /**
   * Internal representation of the scene information
   * so scenes can support objects while the combobox does not complain)
   */
  @track _comboboxOptions;

  /**
   * Handler for when the scene changed
   * @type {function}
   */
  @track handleSceneChanged;

  //-- handlers

  /**
   * Handle when the user chose a different story
   * @param {CustomEvent} evt 
   */
  handleSceneChange(evt) {
    evt.preventDefault();
 
    let newSceneIndex = parseInt(evt.target.value, 10);
    this.handleSceneIndexChanged(newSceneIndex);
  }
 
  connectedCallback(){
    //-- use a numeric string based index
    //-- because the combobox doesn't work well outside of strings...
    //-- we will use the index to then get the actual value
    let _comboboxOptions = [];
    if (Array.isArray(this.scenes) && this.scenes.length > 0) {
      this.scenes.forEach((scene, index) => {
        _comboboxOptions.push({label:scene.label, value:''+index})
      });
    }
    this._comboboxOptions = _comboboxOptions;
 
    //-- pre select the index
    this.handleSceneIndexChanged(this.index);
  }

  /**
   * Dispatch an event letting everyone know the scene has changed
   * @param {Integer} newSceneIndexStr - index of the new scene to use.
   * @fires CustomEvent:scene
   */
  handleSceneIndexChanged(newSceneIndexStr) {
    const newSceneIndex = parseInt(newSceneIndexStr, 10);
    if (this.scenes && this.scenes.length > 0) {
      let indexToUse = newSceneIndex;
      if (indexToUse < 0 || indexToUse >= this.scenes.length) {
        indexToUse = 0;
      }
      this.index = indexToUse;
      
      //-- select the option in the combobox.
      this._comboboxOption = this._comboboxOptions[indexToUse].value;
      
      //-- identify the scene
      const newSceneObject = this.scenes[this.index];
      const sceneChangeEvt = new CustomEvent('scene', { detail: newSceneObject });
      this.dispatchEvent(sceneChangeEvt);
    }
  }
}