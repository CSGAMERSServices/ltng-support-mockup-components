/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for ltng_mockupResponsiveTable/__tests__/ltng_mockupResponsiveTable **/
import { createElement } from 'lwc';
import ltng_mockupResponsiveTable from 'c/ltng_mockupResponsiveTable';

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

  it('has the appropriate headers', (done) => {
    const ts = new TestSettings()
      .applyDefaultProperties()
      .attachElement();
    
    const thead = ts.element.shadowRoot.querySelector('thead');
    const thElements = thead.querySelectorAll('th');
    expect(thElements).not.toBeNull();
    expect(thElements.length).toBe(tableTestInfo.expectedTable[0].length);

    //-- @TODO: additional tests

    done();
  });

  it('has the appropriate data', (done) => {
    let trTDs;

    const ts = new TestSettings()
      .applyDefaultProperties()
      .attachElement();
    
    const headers = tableTestInfo.expectedTable[0];
    const rows = tableTestInfo.expectedTable.slice(1);

    const trElements = ts.element.shadowRoot.querySelectorAll('tbody tr');

    expect(trElements.length).toBe(rows.length);

    [...trElements].forEach(trElement => {
      trTDs = trElement.querySelectorAll('td');
      expect(trTDs.length).toBe(headers.length);
    });

    done();
  });
});