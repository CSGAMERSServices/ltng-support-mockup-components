import { LightningElement, api, track } from 'lwc';

import {parseCsvToLabelValue, ResponsiveTableData} from 'c/ltng_mockupCsvParser';

/**
 * A responsive table using the lightning design system.
 */
export default class Ltng_mockupResponsiveTable extends LightningElement {
  /**
   * The data to show in the responsive table.
   * @type {String}
   */
  @api tablecsv;

  /**
   * The data in label value pairs
   * @type {String[][][]}
   */
  @track tableData = new ResponsiveTableData();

  connectedCallback() {
    //-- convert the table csv string into table data.
    this.tableData = parseCsvToLabelValue(this.tablecsv);
    // console.log('tableData:' + JSON.stringify(this.tableData));
  }
}