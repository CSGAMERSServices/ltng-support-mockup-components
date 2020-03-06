/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for ltng_mockupResponsiveTable/__tests__/ltng_mockupResponsiveTable **/
import { createElement } from 'lwc';
import ltng_mockupResponsiveTable from 'c/ltng_mockupResponsiveTable';
import {splitRows, nextCsvCell, nextCsvStringCell, parseCsvLine, parseCSV} from 'c/ltng_mockupResponsiveTable';
import { isArray } from 'util';

const tableTestInfo = {
  csv: `"FirstName", LastName, "Age" , Color
Eve,"Jackson", 94, Red
Rob, Mite, 24, Blue
Bob, Parr, 42, Red`,
  expectedRowSplit: [
    `"FirstName", LastName, "Age" , Color`,
    `Eve,"Jackson", 94, Red`,
    `Rob, Mite, 24, Blue`,
    `Bob, Parr, 42, Red`
  ],
  expectedTable: [
    ['FirstName', 'LastName', 'Age', 'Color'],
    [`Eve`, `Jackson`, `94`, `Red`],
    [`Rob`, `Mite`, `24`, `Blue`],
    [`Bob`, `Parr`, `42`, `Red`]
  ]
};

const defaultProperties = {
  tablecsv: tableTestInfo.csv
}

class TestSettings {
  constructor() {
    /**
     * type {HtmlElement}
     */
    this.element = createElement('c-ltng_mockupResponsiveTable', { is:ltng_mockupResponsiveTable });
  }

  /**
   * Performs a custom setup step
   * @param {(TestSettings) => TestSettings}
   */
  customSetup(setupStep) {
    setupStep(this);
    return this;
  }

  /**
   * Applies the default properties on the component.
   * @returns {TestSettings}
   */
  applyDefaultProperties() {
    Object.assign(this.element, defaultProperties);
    return this;
  }

  attachElement() {
    document.body.appendChild(this.element);
    return this;
  }
}

describe('c-ltng_mockupResponsiveTable', () => {
  //-- boilerplate DOM reset
  afterEach(() => {
    while (document.body.firstChild){
      document.body.removeChild(document.body.firstChild);
    }
  });
  
  it('can be created', () => {
    const ts = new TestSettings()
      .applyDefaultProperties()
      .attachElement();
    
    expect(ts.element).not.toBe(null);
    
    expect(ts.element.tablecsv).toBe(defaultProperties.tablecsv);
  });

  it('splits the rows', () => {
    expect(splitRows).toBeTruthy();
    
    const rowSplit = splitRows(tableTestInfo.csv);
    expect(rowSplit).toStrictEqual(tableTestInfo.expectedRowSplit);
  });

  it('tokenizes the rows when there are no quotes', () => {
    var csvLine = null;
    var csvParse = nextCsvCell(csvLine);
    var expected = null;

    expect(csvParse).toBeNull();

    csvLine = '    ';
    csvParse = nextCsvCell(csvLine);
    expected = null;

    expect(csvParse).toBeNull();

    csvLine = '  one  ';
    csvParse = nextCsvCell(csvLine);
    expected = ['one', null];

    expect(csvParse).toStrictEqual(expected);

    csvLine = '  one, two, three';
    csvParse = nextCsvCell(csvLine);
    expected = ['one', 'two, three'];

    expect(csvParse).toStrictEqual(expected);

    csvLine = ' , two, three';
    csvParse = nextCsvCell(csvLine);
    expected = ['', 'two, three'];

    expect(csvParse).toStrictEqual(expected);
  });

  it('tokenizes the row when there are quotes', () => {
    var csvLine = null;
    var csvParse = nextCsvStringCell(csvLine);
    var expected = null;

    expect(csvParse).toBeNull();

    csvLine = '    ';
    csvParse = nextCsvStringCell(csvLine);
    expected = null;

    expect(csvParse).toStrictEqual(expected);

    csvLine = '  one  ';
    csvParse = nextCsvStringCell(csvLine);
    expected = null;

    expect(csvParse).toStrictEqual(expected);

    csvLine = '  "one  ';
    csvParse = nextCsvStringCell(csvLine);
    expected = null;

    expect(csvParse).toStrictEqual(expected);

    csvLine = '  "one"  ';
    csvParse = nextCsvStringCell(csvLine);
    expected = ['one',null];

    expect(csvParse).toStrictEqual(expected);

    //-- 

    csvLine = '  one , two  ';
    csvParse = nextCsvStringCell(csvLine);
    expected = null;

    expect(csvParse).toStrictEqual(expected);

    csvLine = '  "one, two ';
    csvParse = nextCsvStringCell(csvLine);
    expected = null;

    expect(csvParse).toStrictEqual(expected);

    csvLine = '  "one", two  ';
    csvParse = nextCsvStringCell(csvLine);
    expected = ['one','two'];

    expect(csvParse).toStrictEqual(expected);
    
    //--

    csvLine = '  "one", two, three';
    csvParse = nextCsvStringCell(csvLine);
    expected = ['one', 'two, three'];

    expect(csvParse).toStrictEqual(expected);

    csvLine = ' , two, three';
    csvParse = nextCsvStringCell(csvLine);
    expected = null;

    expect(csvParse).toStrictEqual(expected);
  });

  it('parses a csv line into all values', () => {
    var csvLine = null;
    var csvParse = parseCsvLine(csvLine);
    var expected = [];

    csvLine = '    ';
    csvParse = parseCsvLine(csvLine);
    expected = [];

    expect(csvParse).toStrictEqual(expected);

    csvLine = '  one  ';
    csvParse = parseCsvLine(csvLine);
    expected = ['one'];

    expect(csvParse).toStrictEqual(expected);

    csvLine = '  "one  ';
    csvParse = parseCsvLine(csvLine);
    expected = ['"one'];

    expect(csvParse).toStrictEqual(expected);

    csvLine = '  "one"  ';
    csvParse = parseCsvLine(csvLine);
    expected = ['one'];

    expect(csvParse).toStrictEqual(expected);

    //-- 

    csvLine = '  one , two  ';
    csvParse = parseCsvLine(csvLine);
    expected = ['one', 'two'];

    expect(csvParse).toStrictEqual(expected);

    csvLine = '  "one, two ';
    csvParse = parseCsvLine(csvLine);
    expected = ['"one', 'two'];

    expect(csvParse).toStrictEqual(expected);

    csvLine = '  "one", two  ';
    csvParse = parseCsvLine(csvLine);
    expected = ['one','two'];

    expect(csvParse).toStrictEqual(expected);
    
    //--

    csvLine = '  "one", two, three';
    csvParse = parseCsvLine(csvLine);
    expected = ['one', 'two', 'three'];

    expect(csvParse).toStrictEqual(expected);

    csvLine = ' , two, three';
    csvParse = parseCsvLine(csvLine);
    expected = ['', 'two','three'];

    expect(csvParse).toStrictEqual(expected);
  });

  it('parses csv string into a table', () => {
    let csv;
    let csvParse;
    let expected;

    debugger;

    csv = tableTestInfo.csv;
    csvParse = parseCSV(csv);
    expected = tableTestInfo.expectedTable;

    expect(csvParse).toStrictEqual(expected);
  });

  /*
  it('test', () => {
    const row = ts.rows[0];
    const result = [];

    expect(result).toBeTruthy();
    expect(isArray(result)).toBeTruthy();
    expect(result).toEqual(ts.expectedRowSplit);
  });
  */
});