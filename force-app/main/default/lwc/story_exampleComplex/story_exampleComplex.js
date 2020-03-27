/* istanbul ignore file */

/**
 * More complex demo allowing multiple scenes to be tested.
 **/
import { LightningElement, api } from 'lwc';
import {Scene} from 'c/story_book';
// import { isObject } from 'util';

/* eslint-disable */
const LONG_TEXT = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus vestibulum mattis ullamcorper velit sed. Tristique nulla aliquet enim tortor. Massa tincidunt dui ut ornare lectus sit amet est. Senectus et netus et malesuada fames. Pharetra et ultrices neque ornare aenean. Eget felis eget nunc lobortis mattis aliquam faucibus. Arcu bibendum at varius vel pharetra vel. Quis risus sed vulputate odio ut enim blandit volutpat. Vel eros donec ac odio tempor orci. Facilisis volutpat est velit egestas dui. Viverra nibh cras pulvinar mattis nunc sed blandit libero. Eu feugiat pretium nibh ipsum consequat nisl. Purus viverra accumsan in nisl nisi scelerisque.

Eu lobortis elementum nibh tellus molestie nunc. Dapibus ultrices in iaculis nunc sed. Nam at lectus urna duis convallis convallis tellus id interdum. Arcu risus quis varius quam quisque id diam. Egestas dui id ornare arcu odio ut sem nulla pharetra. Diam ut venenatis tellus in metus vulputate eu scelerisque. Quis viverra nibh cras pulvinar mattis. Eu tincidunt tortor aliquam nulla facilisi. Feugiat nibh sed pulvinar proin gravida hendrerit lectus. Faucibus a pellentesque sit amet. Varius sit amet mattis vulputate. Bibendum arcu vitae elementum curabitur vitae nunc. Dictum fusce ut placerat orci nulla pellentesque. Est lorem ipsum dolor sit amet consectetur adipiscing elit. Sit amet cursus sit amet dictum. Eu ultrices vitae auctor eu augue ut lectus arcu. Sodales neque sodales ut etiam sit amet nisl. Lacus sed viverra tellus in hac habitasse platea dictumst. Eu feugiat pretium nibh ipsum consequat. Pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu.

Morbi tempus iaculis urna id volutpat lacus laoreet. Diam quis enim lobortis scelerisque fermentum dui. Ut consequat semper viverra nam libero justo laoreet sit amet. Egestas congue quisque egestas diam in arcu cursus euismod quis. Sit amet nulla facilisi morbi tempus iaculis urna id. Fermentum leo vel orci porta non pulvinar. Enim tortor at auctor urna nunc id cursus metus aliquam. Morbi non arcu risus quis. Vel pretium lectus quam id leo in vitae turpis massa. Aliquam id diam maecenas ultricies mi eget mauris pharetra et. Nec tincidunt praesent semper feugiat nibh sed.`;
/* eslint-enable */

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
  @api allScenes;

  /**
   * Initial scene we want to show
   */

  connectedCallback() {
    this.allScenes = [
      new Scene('Explicit Size', {
        description: 'Component sandbox is to the explicit size 300x300, a border and padding',
        sandboxStyles: 'width: 300px; height: 300px; border: 1px solid blue; padding: 20px;',
        message: 'Message for component'
      }),
      new Scene('Small Width Scene', {
        width: 'small',
        sandboxStyles: 'height: 200px;',
        message: LONG_TEXT
      }),
      new Scene('Medium Width Scene', {
        width: 'medium',
        message: LONG_TEXT
      }),
      new Scene('Large Width Scene', {
        description: 'Wide component with a message',
        width: 'large',
        message: LONG_TEXT
      }),
      new Scene('Empty Scene', {
        description: 'Description for the scene',
        message: null
      })
    ];

    // this.currentScene = this.allScenes[0];
  }

  handleSceneChanged(sceneEvent) {
    this.currentScene = sceneEvent.detail;
  }
}