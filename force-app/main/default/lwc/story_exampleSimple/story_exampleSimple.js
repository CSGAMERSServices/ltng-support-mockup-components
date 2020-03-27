/* istanbul ignore file */

/**
 * Component that tests a single component in a very simple way
 **/
import { LightningElement, api, track } from 'lwc'; // eslint-disable-line no-unused-vars
import {Scene} from 'c/story_book';

export default class Story_exampleSimple extends LightningElement {
  @api currentScene = new Scene('Simple Scenario',{
    messageToShow: 'Message bound from the scene'
  });
}