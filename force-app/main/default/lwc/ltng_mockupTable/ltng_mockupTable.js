import { LightningElement, api, track } from 'lwc';

import {parseCsvToLabelValue, ResponsiveTableData} from 'c/ltng_mockupCsvParser';

const DEFAULT_TABLE = 'Row, Header A, Header B\n1, 1:A, 1:B\n2, 2:A, 2:B'

/**
 * Applies newline escapes, as the App Builder (at present)
 * does not support newlines
 * and strips them before sending to the component
 * @param {String} csv -
 * @returns {String}
 */
function prepForExport(str) {
  let results = `${str}`;
  results = results.replace(/[\n\r]+/gi, '\n')
    .replace(/\n/gi, '\\n\n');
  return results;
}

/**
 * Replaces newline escapes, so the text appears as expected
 * @param {String} csv -
 * @returns {String}
 */
function cleanFromExport(str) {
  let results = `${str}`;
  results = results.replace(/\\[rn]/gi, '\n')
    .replace(/[\r\n]+/gi, '\n');
  return results;
}

/**
 * A responsive table using the lightning design system.
 */
export default class Ltng_mockupTable extends LightningElement {

  /**
   * Constants used for test visibility
   */
  @api constants = {
    prepForExport,
    cleanFromExport
  };

  /**
   * The data to show in the table.
   * @type {String}
   */
  @api tablecsv = DEFAULT_TABLE;

  /**
   * Whether the table is responsive (true) or not (false)
   * @type {Boolean}
   */
  @api isResponsive = false;

  /**
   * Whether the component is in edit mode(true) or display mode (false)
   * @type {Boolean}
   */
  @track editMode = false;

  /**
   * The data in label value pairs
   * @type {String[][][]}
   */
  @track tableData = new ResponsiveTableData();

  /**
   * Timeout used for resetting text after exporting.
   * @type {Timeout}
   */
  copyTimeout;

  //-- getters / setters

  /**
   * Determines the css classes to use for the table
   * (makes the table responsive or not)
   * @returns {String[]}
   */
  get tableCssClasses() {
    let results = 'slds-table slds-table--bordered slds-table--cell-buffer';
    if (this.isResponsive) {
      results += ' slds-max-medium-table--stacked-horizontal';
    } 
    return results;
  }

  //-- lifecycle events / handlers

  connectedCallback() {
    //-- convert the table csv string into table data.
    const cleanedTableCSV = cleanFromExport(this.tablecsv);
    this.tablecsv = cleanedTableCSV;
    this.tableData = parseCsvToLabelValue(cleanedTableCSV);
  }

  disconnectedCallback() {
    this.clearTimeouts();
  }

  /**
   * Handles when the user clicks on the 'edit' button
   */
  handleEditToggle() {
    this.editMode = !this.editMode;
  }
  
  /**
   * Handles when the user has clicked the submit button on the edit form.
   */
  handleSubmit() {
    let newcsv = this.template.querySelector('.edit-form textarea.input-csv').value;
    
    newcsv = cleanFromExport(newcsv);
    
    const newTableData = parseCsvToLabelValue(newcsv);

    //-- currently there is no known situation where we do not have tableData
    // if (newTableData) {

      this.tableData = newTableData;
      this.tablecsv = newcsv;
      this.handleEditToggle();

    // }
  }

  /**
   * Copies the current information to clipboard
   * @param {CustomEvent} evt -
   */
  handleCopyToClipboard(evt) {
    const textarea = this.template.querySelector('.edit-form textarea.input-csv');
    let orignalCSV = `${textarea.value}`;

    let cleanedCSV = prepForExport(orignalCSV);

    //-- allow tests to shim instead of mocking the entirety of document
    let document = window.document;
    if (evt.detail.document) document = evt.detail.document;

    if (document.execCommand) {
      //-- unfortunately, clipboard methods are still not well accepted.
      //-- using the fallback of document.execCommand
      //-- @see https://www.lucidchart.com/techblog/2014/12/02/definitive-guide-copying-pasting-javascript/

      textarea.value = cleanedCSV;

      textarea.select();

      document.execCommand('copy');

      this.clearTimeouts();
      window.setTimeout(() => { // eslint-disable-line
        textarea.value = orignalCSV;
        this.clearTimeouts();
      }, 100);
    }
  }

  //-- internal methods

  /**
   * Clears any timeouts
   */
  clearTimeouts() {
    window.clearTimeout(this.copyTimeout);
  }
}