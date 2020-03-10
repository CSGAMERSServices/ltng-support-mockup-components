import { LightningElement, api, track } from 'lwc';

import {parseCsvToLabelValue, ResponsiveTableData} from 'c/ltng_mockupCsvParser';

const DEFAULT_TABLE = 'Row, Header A, Header B\n1, 1:A, 1:B\n2, 2:A, 2:B'

/**
 * A responsive table using the lightning design system.
 */
export default class Ltng_mockupResponsiveTable extends LightningElement {
  /**
   * The data to show in the responsive table.
   * @type {String}
   */
  @api tablecsv = DEFAULT_TABLE;

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