/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for ltng_mockupFileHelper/__tests__/ltng_mockupFileHelper **/
import * as data from '../__data__';

jest.mock(
  'c/ltng_mockupEventBus',
  () => {
    return {
      fireEvent: jest.fn()
    };
  },
  { virtual: true }
);
import { fireEvent } from 'c/ltng_mockupEventBus';

import { createElement } from 'lwc';
import ltng_mockupFileHelper from 'c/ltng_mockupFileHelper';
// import { unregisterAllListeners, registerListener } from 'c/ltng_mockupEventBus';
// import { isArray } from 'util';


/**
 * Base64WithMeta
 * @type {String}
 */
const BASE64_WITH_META = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgA…';

/**
 * Base64 data without the metadata
 */
const BASE64='iVBORw0KGgoAAAANSUhEUgAAABgA…';

/**
 * Example file evt
 * @type {File}
 */
const exampleFile = {
  name:'smallLightTest.png',
  lastModified:1584635423243,
  lastModifiedDate:'2020-03-19T16:30:23.243Z',
  size:3848,
  type:'image/png'
};

/**
 * Example name of a file
 * @type {String}
 */
const EXAMPLE_FILE_PATH = '/path/to/my/file';

/**
 * Default properties to assign to the MockupFileReader instances
 */
const defaultProperties = {
  showDropDownSpacer: false
};

/**
 * Mock of a file reader.
 * (Note, this assumes that when the readDataURL is called,
 * then it should tell itself to call the onload)
 * @type {FileReader}
 */
const mockFileReader = {
  readAsDataURL: jest.fn(() => mockFileReader.onload()),
  result: BASE64_WITH_META
}

class TestSettings {
  constructor() {
    /**
     * type {HtmlElement}
     */
    this.element = createElement('c-ltng_mockupFileHelper', { is:ltng_mockupFileHelper });
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

  /**
   * Fire the wire mock for page references
   * @return {TestSettings}
   */
  firePageReference() {
    data.execPageReferenceMock();
    return this;
  }

  setQueryTerm(str) {
    this.element.queryTerm = str;
    return this;
  }
  
  /**
   * Fire wire mock to get recent files with values
   * @return {TestSettings}
   */
  fireFindFilesRecent() {
    data.exec_findFilesRecent();
    return this;
  }
  
  /**
   * Fire wire mock to get recent files with no values
   * @return {TestSettings}
   */
  fireFindFilesMockWithEmptyResults() {
    data.exec_findFilesEmpty();
    return this;
  }

  /**
   * Fire apex mock to update a content version
   * @return {TestSettings}
   */
  fireCreateContentVersion() {
    data.exec_createContentVersion();
    return this;
  }

  /**
   * mock selecting an option in the combobox
   * @param {Number} index - the index in the combobox to select
   * @returns {Object} - the value at that index
   */
  selectComboboxOption(index) {
    const combobox = this.getCombobox();
    const optionSelected = combobox.options[index];
    expect(optionSelected).toBeTruthy();

    combobox.selection = optionSelected;

    const recordUpdateEvent = new CustomEvent('change', {
      detail : {
        value: optionSelected.value
      }
    });
    combobox.dispatchEvent(recordUpdateEvent);

    return optionSelected;
  }

  /**
   * Mock typing an option and then pressing return in the combobox
   * @param {String} str - the text entered in the combobox
   * @returns {Object} the value provided
   */
  enterComboboxOption(str) {
    const combobox = this.getCombobox();
    
    combobox.text = str;

    const recordUpdateEvent = new CustomEvent('change', {
      detail: {
        value: str
      }
    });
    combobox.dispatchEvent(recordUpdateEvent);

    return str;
  }

  /**
   * mock uploading a file
   * (note the mockFileReader can then be resolved through `onload`
   * or rejected through `onerror(error)`)
   */
  uploadFile() {
    expect(mockFileReader.readAsDataURL).not.toHaveBeenCalled();

    // this.element.constants
    //  .loadFileAsBase64(EXAMPLE_FILE_PATH, mockFileReader);

    const fileChangeEvt = new CustomEvent('change', {
      detail: {
        fileReader: mockFileReader
      }
    });
    const fileInput = this.getFileInput();
    fileInput.files = [exampleFile];
    fileInput.dispatchEvent(fileChangeEvt);

    expect(fileChangeEvt.detail.fileReaderPromise).toBeTruthy();

    // fileChangeEvt.detail.fileReaderPromise.resolve(BASE64_WITH_META);

    return(fileChangeEvt.detail.fileReaderPromise);
  }

  attachElement() {
    document.body.appendChild(this.element);
    return this;
  }

  getCombobox() {
    return this.element.shadowRoot.querySelector('c-ltng_editable-combobox');
  }
  getFileInput() {
    return this.element.shadowRoot.querySelector('lightning-input.file-selector');
  }
  getPreviewImg() {
    return this.element.shadowRoot.querySelector('div.preview img');
  }
  getSubmitBtn() {
    return this.element.shadowRoot.querySelector('div.actions lightning-button');
  }
  getErrorAlert() {
    return this.element.shadowRoot.querySelector('c-ltng_mockup-alert.error');
  }
  getNotificationAlert() {
    return this.element.shadowRoot.querySelector('c-ltng_mockup-alert.success');
  }
}

describe('c-ltng_mockupFileHelper utility/critical methods', () => {
  describe('isEmptyString', () => {
    it('is empty if the string is null', () => {
      const ts = new TestSettings();

      const valToCheck = null;
      const result = ts.element.constants.isEmptyString(valToCheck);
      const expected = true;

      expect(result).toBe(expected);
    });
    it('is empty if the string is undefined', () => {
      const ts = new TestSettings();

      const valToCheck = undefined;
      const result = ts.element.constants.isEmptyString(valToCheck);
      const expected = true;

      expect(result).toBe(expected);
    });
    it('is empty if the string is empty', () => {
      const ts = new TestSettings();

      const valToCheck = '';
      const result = ts.element.constants.isEmptyString(valToCheck);
      const expected = true;

      expect(result).toBe(expected);
    });
    it('is empty if the string is pure whitespace', () => {
      const ts = new TestSettings();

      const valToCheck = '      ';
      const result = ts.element.constants.isEmptyString(valToCheck);
      const expected = true;

      expect(result).toBe(expected);
    });
    it('is empty if the string has value', () => {
      const ts = new TestSettings();

      const valToCheck = 's';
      const result = ts.element.constants.isEmptyString(valToCheck);
      const expected = false;

      expect(result).toBe(expected);
    });
    it('is empty if the string is surrounded by whitespace', () => {
      const ts = new TestSettings();

      const valToCheck = '    s    ';
      const result = ts.element.constants.isEmptyString(valToCheck);
      const expected = false;

      expect(result).toBe(expected);
    });
  });

  describe('utc to local date', () => {
    it('converts a salesforce utc date', () => {
      const ts = new TestSettings();

      const valToCheck = '2020-03-11T20:39:45.000Z';
      const result = ts.element.constants.utcDateToLocal(valToCheck);
      
      //-- uncomment only if running in US
      //const expected = '3/11/2020, 3:39:45 PM';
      //expect(result).toBe(expected);

      expect(result).not.toBe(valToCheck);
    });

    it('returns the value provided if not understood', () => {
      const ts = new TestSettings();

      const valToCheck = 'happy birthday';
      const result = ts.element.constants.utcDateToLocal(valToCheck);
      
      expect(result).toBe(valToCheck);
    });
  });

  describe('converting a filename to name of file', () => {
    it('converts the filename if there is a file extension', () => {
      const ts = new TestSettings();

      const valToCheck = 'someFile.txt';
      const result = ts.element.constants.fileNameToFileTitle(valToCheck);
      const expected = 'someFile';

      expect(result).toBe(expected);
    });
    it('converts the filename if there are multiple periods', () => {
      const ts = new TestSettings();

      const valToCheck = 'extra Fancy.test.txt';
      const result = ts.element.constants.fileNameToFileTitle(valToCheck);
      const expected = 'extra Fancy.test';

      expect(result).toBe(expected);
    });
    it('returns the original name if no extension is found', () => {
      const ts = new TestSettings();

      const valToCheck = 'something without an extension';
      const result = ts.element.constants.fileNameToFileTitle(valToCheck);
      const expected = valToCheck;

      expect(result).toBe(expected);
    });
  });

  describe('extractFileReaderBase64', () => {
    it('strips the mime type etc if provided', () => {
      const ts = new TestSettings();

      const valToCheck = BASE64_WITH_META;
      const result = ts.element.constants.extractFileReaderBase64(valToCheck);
      const expected = BASE64;

      expect(result).toBe(expected);
    });
    it('returns base64 if base64 is sent', () => {
      const ts = new TestSettings();

      const valToCheck = BASE64;
      const result = ts.element.constants.extractFileReaderBase64(valToCheck);
      const expected = BASE64;

      expect(result).toBe(expected);
    });
  });

  describe('loading file as base64', () => {
    it('loads the file as base64 with FileReader', () => {
      expect.assertions(1);

      const ts = new TestSettings();

      const fileToLoad = EXAMPLE_FILE_PATH;
      const expected = mockFileReader.result;

      const resultPromise = ts.element.constants
        .loadFileAsBase64(fileToLoad, mockFileReader)
        .then(result => {
          expect(result).toEqual(expected);
        });

      // mockFileReader.onload();

      return resultPromise;
    });

    it('rejects the promise if filereader cannot load the file', () => {
      expect.assertions(1);

      const ts = new TestSettings();

      const fileToLoad = '/path/to/my/file';
      const error = 'some error';

      const mockFileReaderThatFails = {
        readAsDataURL: jest.fn(() => mockFileReaderThatFails.onerror(error)),
        result: BASE64
      };

      const resultPromise = ts.element.constants
        .loadFileAsBase64(fileToLoad, mockFileReaderThatFails)
        .catch(err => {
          expect(err).toEqual(error);
        });

      mockFileReaderThatFails.onerror(error);
      
      return resultPromise;
    });
  });
});

describe('c-ltng_mockupFileHelper', () => {
  //-- boilerplate DOM reset

  beforeEach(() => {
    // window.FileReader = mockFileReader;
  });

  afterEach(() => {
    while (document.body.firstChild){
      document.body.removeChild(document.body.firstChild);
    }
    mockFileReader.readAsDataURL.mockClear();

    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.resetModules();

    // window.FileReader = originalFileReader;
  });
  
  it('can be created', () => {
    const ts = new TestSettings()
      .applyDefaultProperties()
      .firePageReference()
      .fireFindFilesRecent()
      .attachElement();
    
    expect(ts.element).not.toBe(null);

    expect(ts.element.showDropDownSpacer).toBe(defaultProperties.showDropDownSpacer);
    
    // const div = ts.element.shadowRoot.querySelector('div');
    // expect(div.textContent).toBe('Hello, World!');
  });

  describe('File select options', () => {
    it('the options include a NEW option if the text is currently set', () => {
      const newFileName = 'some new file';

      const ts = new TestSettings()
        .applyDefaultProperties()
        .setQueryTerm(newFileName)
        .firePageReference()
        .fireFindFilesMockWithEmptyResults()
        .attachElement();

      const combobox = ts.getCombobox();
      combobox.text = newFileName;

      ts.element.queryTerm = newFileName;
      data.exec_findFilesEmpty();

      const expected = [
        {
          "icon": "standard:file", "key": "new", "label": "New Resource: some new file",
          "subLabel": "", "value": {"Title": "some new file"}
        }
      ];

      expect(combobox.options).toStrictEqual(expected);
    });

    it('the options do not include a NEW option if the text is blank', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .setQueryTerm(null)
        .firePageReference()
        .fireFindFilesRecent()
        .attachElement();

      const combobox = ts.getCombobox();
      combobox.text = '';

      data.exec_findFilesSearch();

      const expected = [
        {"icon": "standard:file", "key": "069R0000000qydRIAQ", "label": "ltng_smallLightTest",
          "subLabel": "3/19/2020, 11:31:32 AM",
          "value": {
            "Id": "069R0000000qydRIAQ", "LastModifiedDate": "2020-03-19T16:31:32.000Z",
            "LatestPublishedVersionId": "068R0000000rAHiIAM", "Title": "ltng_smallLightTest"
          }
        },
        {"icon": "standard:file", "key": "069R0000000qs3SIAQ", "label": "ltng_Button Strip",
          "subLabel": "3/19/2020, 11:25:40 AM",
          "value": {
            "Id": "069R0000000qs3SIAQ", "LastModifiedDate": "2020-03-19T16:25:40.000Z",
            "LatestPublishedVersionId": "068R0000000rAH4IAM", "Title": "ltng_Button Strip"
          }
        },
        {"icon": "standard:file", "key": "069R0000000qrzzIAA", "label": "ltng_Button Bar",
          "subLabel": "3/17/2020, 9:01:57 AM",
          "value": {
            "Id": "069R0000000qrzzIAA", "LastModifiedDate": "2020-03-17T14:01:57.000Z",
            "LatestPublishedVersionId": "068R0000000r3bjIAA", "Title": "ltng_Button Bar"
          }
        }
      ];

      expect(combobox.options).toStrictEqual(expected);
    });

    it('shows a notification if the wire call errors', () => {
      const newFileName = 'some new file';

      const ts = new TestSettings()
        .applyDefaultProperties()
        .setQueryTerm(newFileName)
        .firePageReference()
        .attachElement();
      
      const errorEl = ts.element.shadowRoot.querySelector('c-ltng_mockup-alert.error');
      const notificationEl = ts.element.shadowRoot.querySelector('c-ltng_mockup-alert.success');

      expect(errorEl).toBeTruthy();
      expect(notificationEl).toBeTruthy();

      return Promise.resolve().then(() => {
        data.error_fileFilesSearch();

        const errorAlert = ts.getErrorAlert();
        expect(errorAlert.isShown).toBe(true);
      });
    });
  });

  describe('submit button', () => {
    it('is disabled if the user only has combobox selection and no file', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .firePageReference()
        .fireFindFilesRecent()
        .attachElement();
      
      const optionSelected = ts.selectComboboxOption(1);
      expect(optionSelected).toBeTruthy();

      //-- file is not selected

      return Promise.resolve().then(() => {
        const submitBtn = ts.getSubmitBtn();
        expect(submitBtn.disabled).toBe(true);
      });
    });

    it('is disabled if the user only has a file but no combobox selection', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .firePageReference()
        .fireFindFilesRecent()
        .attachElement();
      
      const fileReaderPromise = ts.uploadFile();

      //-- file is not selected

      return Promise.all([fileReaderPromise])
        .then(() => {
          const submitBtn = ts.getSubmitBtn();
          expect(submitBtn.disabled).toBe(true);
        });
    });

    it('is enabled if the user both selects a value and file', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .firePageReference()
        .fireFindFilesRecent()
        .attachElement();
      
      //-- select option
      const optionSelected = ts.selectComboboxOption(1);
      expect(optionSelected).toBeTruthy();

      //-- select file
      const fileReaderPromise = ts.uploadFile();

      return Promise.all([fileReaderPromise])
        .then(() => {
          expect(ts.element.fileToUploadBase64).toBeTruthy();

          const submitBtn = ts.getSubmitBtn();
          expect(submitBtn.disabled).toBe(false);
        });
    });

    it('creates a new document if a user types and presses return', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .firePageReference()
        .fireFindFilesRecent()
        .attachElement();
      
      //-- select option
      const optionSelected = ts.selectComboboxOption(1);
      expect(optionSelected).toBeTruthy();

      //-- select file
      const fileReaderPromise = ts.uploadFile();

      return Promise.all([fileReaderPromise])
        .then(() => {
          expect(ts.element.fileToUploadBase64).toBeTruthy();

          const submitBtn = ts.getSubmitBtn();
          expect(submitBtn.disabled).toBe(false);
        });
    });
  });

  describe('query term', () => {
    it('does not update the combobox text if there is no file selected', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .firePageReference()
        .fireFindFilesRecent()
        .attachElement();

      const combobox = ts.getCombobox();

      const earlierQueryTerm = combobox.text;

      //-- select file
      const fileChangeEvt = new CustomEvent('change', {
        detail: {
          fileReader: mockFileReader
        }
      });
      const fileInput = ts.getFileInput();
      fileInput.files = [];
      fileInput.dispatchEvent(fileChangeEvt);

      const currentQueryTerm = combobox.text;

      expect(currentQueryTerm).toBe(earlierQueryTerm);
    });

    it('updates the combobox text if there is a file selected, but no combobox selection', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .firePageReference()
        .fireFindFilesRecent()
        .attachElement();

      const combobox = ts.getCombobox();

      //-- select file
      ts.uploadFile();

      const expectedQueryTerm = 'smallLightTest';
      const currentQueryTerm = combobox.text;

      expect(currentQueryTerm).toBe(expectedQueryTerm);
    });

    it('does not update the combobox text if the user already made a selection and selects a file', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .firePageReference()
        .fireFindFilesRecent()
        .attachElement();
      
      const optionSelected = 'Some New File';
      ts.enterComboboxOption(optionSelected);

      const uploadPromise = ts.uploadFile();

      return Promise.all([uploadPromise])
        .then(() => {
          const submitBtn = ts.getSubmitBtn();
          const expectedLabel = 'Create File: Some New File';
          const currentLabel = submitBtn.label;
          expect(currentLabel).toBe(expectedLabel);
        });
    });
  });

  describe('key press', () => {
    it('performs a search after the user types', () => {
      jest.useFakeTimers();

      const ts = new TestSettings()
        .applyDefaultProperties()
        .firePageReference()
        .fireFindFilesRecent()
        .attachElement();
      
      const combobox = ts.getCombobox();

      const someValue = 'Some Text';
      combobox.text = someValue;
      expect(combobox.value).toBe(someValue);

      const keyUpEvent = new CustomEvent('keyup', {
        keyCode: 20,
        detail: {
          keyCode: 20
        }
      });
      combobox.dispatchEvent(keyUpEvent);

      let expectedValue = '';
      let queryTermFound = ts.element.queryTerm;
      expect(queryTermFound).toBe(expectedValue);

      //-- now let the timer play out
      jest.runAllTimers();

      expectedValue = someValue;
      queryTermFound = ts.element.queryTerm;
      expect(queryTermFound).toBe(expectedValue);
    });
  });

  describe('updating content', () => {
    it('on submit', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .firePageReference()
        .fireFindFilesRecent()
        .attachElement();
      
      //-- select option
      const optionSelected = ts.selectComboboxOption(1);
      expect(optionSelected).toBeTruthy();

      //-- select file
      const fileReaderPromise = ts.uploadFile();

      expect(ts.element.constants.IMAGE_CHANGED_EVENT_TYPE).toBeTruthy();
      
      return Promise.all([fileReaderPromise])
        .then(() => {
          expect(ts.element.fileToUploadBase64).toBeTruthy();

          data.exec_createContentVersion();

          const submitBtn = ts.getSubmitBtn();
          expect(submitBtn.disabled).toBe(false);

          const submitEvt = new CustomEvent('click', {
            detail: {}
          });
          submitBtn.dispatchEvent(submitEvt);

          return submitEvt.detail.submitPromise
        })
        .then(() => {
          expect(fireEvent).toHaveBeenCalled();
          
          const errorAlert = ts.getErrorAlert();
          const notificationAlert = ts.getNotificationAlert();

          expect(errorAlert.isShown).toBe(false);
          expect(notificationAlert.isShown).toBe(true);
        });
    });

    it('show an error message if the file update fails', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .firePageReference()
        .fireFindFilesRecent()
        .attachElement();
      
      //-- select option
      const optionSelected = ts.selectComboboxOption(1);
      expect(optionSelected).toBeTruthy();

      //-- select file
      const fileReaderPromise = ts.uploadFile();

      expect(ts.element.constants.IMAGE_CHANGED_EVENT_TYPE).toBeTruthy();
      
      return Promise.all([fileReaderPromise])
        .then(() => {
          expect(ts.element.fileToUploadBase64).toBeTruthy();

          data.error_createContentVersion();

          const submitBtn = ts.getSubmitBtn();
          expect(submitBtn.disabled).toBe(false);

          const submitEvt = new CustomEvent('click', {
            detail: {}
          });
          submitBtn.dispatchEvent(submitEvt);

          return submitEvt.detail.submitPromise
        })
        .then(() => {
          const errorAlert = ts.getErrorAlert();
          const notificationAlert = ts.getNotificationAlert();

          expect(errorAlert.isShown).toBe(true);
          expect(notificationAlert.isShown).toBe(false);
        });
    });
  });
});