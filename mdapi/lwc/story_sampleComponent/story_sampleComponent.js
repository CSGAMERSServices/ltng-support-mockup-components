/**
 * Very simple component to get the idea across.
 **/
import { LightningElement, api } from 'lwc';

export default class Story_sampleComponent extends LightningElement {
  @api message;
  @api label;
}