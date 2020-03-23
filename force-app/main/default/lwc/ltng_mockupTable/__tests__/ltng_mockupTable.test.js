/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for ltng_mockupTable/__tests__/ltng_mockupTable **/
import { createElement } from 'lwc';
import ltng_mockupTable from 'c/ltng_mockupTable';

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
  tablecsv: tableTestInfo.csv,
  isResponsive: false
}

class TestSettings {
  constructor() {
    /**
     * type {HtmlElement}
     */
    this.element = createElement('c-ltng_mockupTable', { is:ltng_mockupTable });
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

  findEditModeButton() {
    return this.element.shadowRoot.querySelector('div.actions .edit-btn');
  }

  findTextArea() {
    return this.element.shadowRoot.querySelector('.edit-form .input-csv');
  }

  findTable() {
    return this.element.shadowRoot.querySelector('.slds-table');
  }

  findApplyButton() {
    return this.element.shadowRoot.querySelector('.edit-form .btn-apply');
  }

  findExportButton() {
    return this.element.shadowRoot.querySelector('.edit-form .btn-export');
  }

  findCloseButton() {
    return this.element.shadowRoot.querySelector('.edit-form .btn-close');
  }
}

describe('c-ltng_mockupTable', () => {
  //-- boilerplate DOM reset
  afterEach(() => {
    while (document.body.firstChild){
      document.body.removeChild(document.body.firstChild);
    }
  });

  describe('csv export', () => {
    it('escapes all carriage returns', () => {
      const ts = new TestSettings();

      const str = 'line1\rline2';
      const expected = 'line1\\n\nline2';
      const results = ts.element.constants.prepForExport(str);
      expect(results).toBe(expected);
    });
    it('escapes all newlines', () => {
      const ts = new TestSettings();

      const str = 'line1\nline2';
      const expected = 'line1\\n\nline2';
      const results = ts.element.constants.prepForExport(str);
      expect(results).toBe(expected);
    });
    it('escapes multiple newlines', () => {
      const ts = new TestSettings();

      const str = 'line1\n\n\nline2';
      const expected = 'line1\\n\nline2';
      const results = ts.element.constants.prepForExport(str);
      expect(results).toBe(expected);
    });
    it('escapes mixed newlines', () => {
      const ts = new TestSettings();

      const str = 'line1\r\r\nline2';
      const expected = 'line1\\n\nline2';
      const results = ts.element.constants.prepForExport(str);
      expect(results).toBe(expected);
    });
  });

  describe('csv import', () => {
    it('leaves newlines without escapes alone', () => {
      const ts = new TestSettings();

      const str = 'line1\nline2';
      const expected = 'line1\nline2';
      const results = ts.element.constants.cleanFromExport(str);
      expect(results).toBe(expected);
    });
    it('replaces carriage returns without escapes', () => {
      const ts = new TestSettings();

      const str = 'line1\rline2';
      const expected = 'line1\nline2';
      const results = ts.element.constants.cleanFromExport(str);
      expect(results).toBe(expected);
    });
    it('handles escapes + newlines', () => {
      const ts = new TestSettings();

      const str = 'line1\\n\nline2';
      const expected = 'line1\nline2';
      const results = ts.element.constants.cleanFromExport(str);
      expect(results).toBe(expected);
    });
    it('handles newlines + escapes', () => {
      const ts = new TestSettings();

      const str = 'line1\n\\nline2';
      const expected = 'line1\nline2';
      const results = ts.element.constants.cleanFromExport(str);
      expect(results).toBe(expected);
    });
    it('handles escapes + carriage returns', () => {
      const ts = new TestSettings();

      const str = 'line1\r\\rline2';
      const expected = 'line1\nline2';
      const results = ts.element.constants.cleanFromExport(str);
      expect(results).toBe(expected);
    });
    it('handles carriage returns + escapes', () => {
      const ts = new TestSettings();

      const str = 'line1\r\\rline2';
      const expected = 'line1\nline2';
      const results = ts.element.constants.cleanFromExport(str);
      expect(results).toBe(expected);
    });
    it('handles mixed carriage returns', () => {
      const ts = new TestSettings();

      const str = 'line1\n\rline2';
      const expected = 'line1\nline2';
      const results = ts.element.constants.cleanFromExport(str);
      expect(results).toBe(expected);
    });
    it('handles mixed carriage returns + escapes', () => {
      const ts = new TestSettings();

      const str = 'line1\n\\n\\r\nline2';
      const expected = 'line1\nline2';
      const results = ts.element.constants.cleanFromExport(str);
      expect(results).toBe(expected);
    });
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

  describe('enters edit mode', () => {
    it('changes to edit mode when the user presses the edit button', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .attachElement();

      let table = ts.findTable();
      expect(table).toBeTruthy(); 

      let submitBtn = ts.findApplyButton();
      expect(submitBtn).toBeFalsy();

      let editModeButton = ts.findEditModeButton();
      expect(editModeButton).toBeTruthy();

      const clickEvt = new CustomEvent('click');
      editModeButton.dispatchEvent(clickEvt);

      return Promise.resolve().then(() => {
        table = ts.findTable();
        expect(table).toBeFalsy(); 

        submitBtn = ts.findApplyButton();
        expect(submitBtn).toBeTruthy();
      });
    });

    it('changes to edit mode when the user double clicks on the table', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .attachElement();

      let table = ts.findTable();
      expect(table).toBeTruthy(); 

      let submitBtn = ts.findApplyButton();
      expect(submitBtn).toBeFalsy();

      const tableEl = ts.findTable();
      expect(tableEl).toBeTruthy();

      const clickEvt = new CustomEvent('dblclick');
      tableEl.dispatchEvent(clickEvt);

      return Promise.resolve().then(() => {
        table = ts.findTable();
        expect(table).toBeFalsy(); 

        submitBtn = ts.findApplyButton();
        expect(submitBtn).toBeTruthy();
      });
    });
  });

  describe('responsive mode', () => {
    it('has the responsive class if isResponsive = true', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(customTS => {
          customTS.element.isResponsive = true;
        })
        .attachElement();
      
      let table = ts.findTable();
      expect(table).toBeTruthy();

      expect(table.classList).toContain('slds-max-medium-table--stacked-horizontal');
    });

    it('does not have the responsive class if isResponsive = false', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(customTS => {
          customTS.element.isResponsive = false;
        })
        .attachElement();
      
      let table = ts.findTable();
      expect(table).toBeTruthy();

      expect(table.classList).not.toContain('slds-max-medium-table--stacked-horizontal');
    });
  });

  describe('edit form', () => {
    it('applies the updated text when the edit form is applied', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .attachElement();

      let table = ts.findTable();
      expect(table).toBeTruthy(); 
      
      const clickEvt = new CustomEvent('dblclick');
      table.dispatchEvent(clickEvt);

      let textArea;

      return Promise.resolve().then(() => {
        let submitBtn = ts.findApplyButton();
        expect(submitBtn).toBeTruthy();

        const updatedCSV = 'testValue';

        textArea = ts.findTextArea();
        expect(textArea).toBeTruthy();

        textArea.value = updatedCSV;

        const applyEvt = new CustomEvent('click');
        submitBtn.dispatchEvent(applyEvt);

        expect(ts.element.tablecsv).toBe(updatedCSV);

        return Promise.resolve();
      }).then(() => {
        table = ts.findTable();
        expect(table).toBeTruthy();

        expect(table.parentElement.innerHTML).toContain('testValue');
      });
    });

    it('closing the edit form does not apply any values', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .attachElement();

      let table = ts.findTable();
      expect(table).toBeTruthy(); 
      
      const clickEvt = new CustomEvent('dblclick');
      table.dispatchEvent(clickEvt);

      const originalCSV = ts.element.tablecsv;

      let textArea;

      return Promise.resolve().then(() => {
        let closeBtn = ts.findCloseButton();
        expect(closeBtn).toBeTruthy();

        const updatedCSV = 'testValue';

        textArea = ts.findTextArea();
        expect(textArea).toBeTruthy();

        textArea.value = updatedCSV;

        const applyEvt = new CustomEvent('click');
        closeBtn.dispatchEvent(applyEvt);

        expect(ts.element.tablecsv).toBe(originalCSV);

        return Promise.resolve();
      }).then(() => {
        table = ts.findTable();
        expect(table).toBeTruthy();

        textArea = ts.findTextArea();
        expect(textArea).toBeFalsy();

        expect(table.parentElement.innerHTML).not.toContain('testValue');
      });
    });

    it('does not apply the text if the table cannot be parsed', () => {
      //-- currently we are always expecting the table to be parsed.
      //-- so it is not possible to get the other side of the logic yet.

      const ts = new TestSettings()
        .applyDefaultProperties()
        .attachElement();

      let table = ts.findTable();
      expect(table).toBeTruthy(); 
      
      const clickEvt = new CustomEvent('dblclick');
      table.dispatchEvent(clickEvt);

      let textArea;

      return Promise.resolve().then(() => {
        let submitBtn = ts.findApplyButton();
        expect(submitBtn).toBeTruthy();

        const updatedCSV = '';

        textArea = ts.findTextArea();
        expect(textArea).toBeTruthy();

        textArea.value = updatedCSV;

        const applyEvt = new CustomEvent('click');
        submitBtn.dispatchEvent(applyEvt);

        expect(ts.element.tablecsv).toBe(updatedCSV);

        return Promise.resolve();
      }).then(() => {
        table = ts.findTable();
        expect(table).toBeTruthy();

        const tr = table.querySelectorAll('tr');
        expect(tr.length).toBeGreaterThan(0);
      });
    });
  });

  describe('export to clipboard', () => {
    it('copies the values to clipboard', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .attachElement();
      
      let table = ts.findTable();
      expect(table).toBeTruthy(); 

      let exportBtn = ts.findExportButton();
      expect(exportBtn).toBeFalsy();

      let editModeButton = ts.findEditModeButton();
      expect(editModeButton).toBeTruthy();

      const clickEvt = new CustomEvent('click');
      editModeButton.dispatchEvent(clickEvt);

      let textArea;

      let newValue = 'line1\nline2';

      const documentMock = {
        execCommand: jest.fn()
      };

      return Promise.resolve().then(() => {
        textArea = ts.findTextArea();
        expect(textArea).toBeTruthy();

        textArea.value = newValue;

        exportBtn = ts.findExportButton();

        const exportEvt = new CustomEvent('click', {
          detail: {
            document: documentMock
          }
        });
        exportBtn.dispatchEvent(exportEvt);

        const resultValue = textArea.value;
        const expectedValue = 'line1\\n\nline2';
        expect(resultValue).toBe(expectedValue);

        expect(documentMock.execCommand).toHaveBeenCalled();
        const callArgs = documentMock.execCommand.mock.calls[0][0];
        expect(callArgs).toBe('copy');
      });
    });

    it('does not throw an error if document.execCommand is not found', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .attachElement();
      
      let table = ts.findTable();
      expect(table).toBeTruthy(); 

      let exportBtn = ts.findExportButton();
      expect(exportBtn).toBeFalsy();

      let editModeButton = ts.findEditModeButton();
      expect(editModeButton).toBeTruthy();

      const clickEvt = new CustomEvent('click');
      editModeButton.dispatchEvent(clickEvt);

      let textArea;

      let newValue = 'line1\nline2';

      const documentMock = {
      };

      return Promise.resolve().then(() => {
        textArea = ts.findTextArea();
        expect(textArea).toBeTruthy();

        textArea.value = newValue;

        exportBtn = ts.findExportButton();

        const exportEvt = new CustomEvent('click', {
          detail: {
            document: documentMock
          }
        });
        exportBtn.dispatchEvent(exportEvt);

        const resultValue = textArea.value;
        expect(resultValue).toBe(newValue);
      });
    });

    it('resets the value after a timeout from exporting', () => {
      jest.useFakeTimers();

      const ts = new TestSettings()
        .applyDefaultProperties()
        .attachElement();
      
      let table = ts.findTable();
      expect(table).toBeTruthy(); 

      let exportBtn = ts.findExportButton();
      expect(exportBtn).toBeFalsy();

      let editModeButton = ts.findEditModeButton();
      expect(editModeButton).toBeTruthy();

      const clickEvt = new CustomEvent('click');
      editModeButton.dispatchEvent(clickEvt);

      let textArea;

      let newValue = 'line1\nline2';

      const documentMock = {
        execCommand: jest.fn()
      };

      return Promise.resolve().then(() => {
        textArea = ts.findTextArea();
        expect(textArea).toBeTruthy();

        textArea.value = newValue;

        exportBtn = ts.findExportButton();

        const exportEvt = new CustomEvent('click', {
          detail: {
            document: documentMock
          }
        });
        exportBtn.dispatchEvent(exportEvt);

        let resultValue = textArea.value;
        let expectedValue = 'line1\\n\nline2';
        expect(resultValue).toBe(expectedValue);

        expect(documentMock.execCommand).toHaveBeenCalled();
        const callArgs = documentMock.execCommand.mock.calls[0][0];
        expect(callArgs).toBe('copy');

        jest.runAllTimers();

        resultValue = textArea.value;
        expectedValue = newValue;
        expect(resultValue).toBe(expectedValue);
      });
    });
  });
});