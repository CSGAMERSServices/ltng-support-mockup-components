/**
 * More complex demo allowing multiple scenes to be tested.
 **/
import { LightningElement, api } from 'lwc';
import {Scene} from 'c/story_book';
// import { isObject } from 'util';

export default class story_mockupAlert extends LightningElement {

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
    new Scene('Wide alert', {
      width: 'large',
      message: 'Example_text',
      iconName: 'error'
    }),
    new Scene('Narrow alert', {
      width: 'narrow',
      message: 'Example_text',
      iconName: 'info'
    }),
    new Scene('info', {
      width: 'large',
      theme: 'info',
      message: 'Example_text',
      iconName: 'info'
    }),
    new Scene('warning', {
      width: 'large',
      theme: 'warning',
      message: 'Example_text',
      iconName: 'warning'
    }),
    new Scene('error', {
      width: 'large',
      theme: 'error',
      message: 'Example_text',
      iconName: 'error'
    }),
    new Scene('offline', {
      width: 'large',
      theme: 'offline',
      message: 'Example_text',
      iconName: 'offline'
    })
  ];

  /**
   * Handles when the showAlert button is pressed
   */
  handleShowAlert() {
    const hiddenAlert = this.template.querySelector('.hidden-alert');
    hiddenAlert.show(
      `CURRENT TIME IS:${new Date().toLocaleString()}`,
      1000
    );
  }
}
