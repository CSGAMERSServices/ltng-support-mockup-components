import { LightningElement } from 'lwc';

export default class TestFileInput extends LightningElement {

  /**
   * handles a file change
   * @param {CustomEvent} evt -
   */
  handleFileChanged(evt) {
    console.log(evt.target.files);
    this.dispatchEvent(new CustomEvent('filechange', {
      bubbles:true,
      detail: {
        files: evt.target.files
      }
    }));
    debugger;
  }
}