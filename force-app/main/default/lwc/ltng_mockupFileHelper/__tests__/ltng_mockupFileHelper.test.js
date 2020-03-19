/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for ltng_mockupFileHelper/__tests__/ltng_mockupFileHelper **/
import { createElement } from 'lwc';
import ltng_mockupFileHelper from 'c/ltng_mockupFileHelper';
// import { isArray } from 'util';

import * as data from '../__data__';

const defaultProperties = {
  showDropDownSpacer: false
};

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

  attachElement() {
    document.body.appendChild(this.element);
    return this;
  }
}

describe('c-ltng_mockupFileHelper', () => {
  //-- boilerplate DOM reset
  afterEach(() => {
    while (document.body.firstChild){
      document.body.removeChild(document.body.firstChild);
    }
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

      const valToCheck = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgA…';
      const result = ts.element.constants.extractFileReaderBase64(valToCheck);
      const expected = 'iVBORw0KGgoAAAANSUhEUgAAABgA…';

      expect(result).toBe(expected);
    });
    it('returns base64 if base64 is sent', () => {
      const ts = new TestSettings();

      const valToCheck = 'iVBORw0KGgoAAAANSUhEUgAAABgA…';
      const result = ts.element.constants.extractFileReaderBase64(valToCheck);
      const expected = 'iVBORw0KGgoAAAANSUhEUgAAABgA…';

      expect(result).toBe(expected);
    });
  });

  describe('loading file as base64', () => {
    it('loads the file as base64 with FileReader', () => {
      expect.assertions(1);

      const ts = new TestSettings();

      const mockFileReader = {
        readAsDataURL: jest.fn(),
        result: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgA…'
      };

      const fileToLoad = '/path/to/my/file';
      const expected = mockFileReader.result;

      const resultPromise = ts.element.constants
        .loadFileAsBase64(fileToLoad, mockFileReader)
        .then(result => {
          expect(result).toEqual(expected);
        });

      mockFileReader.onload();

      return resultPromise;
    });

    it('rejects the promise if filereader cannot load the file', () => {
      expect.assertions(1);

      const ts = new TestSettings();

      const mockFileReader = {
        readAsDataURL: jest.fn(),
        result: 'iVBORw0KGgoAAAANSUhEUgAAABgA…'
      };

      const fileToLoad = '/path/to/my/file';
      const error = 'some error';

      const resultPromise = ts.element.constants
        .loadFileAsBase64(fileToLoad, mockFileReader)
        .catch(err => {
          expect(err).toEqual(error);
        });

      mockFileReader.onerror(error);
      
      return resultPromise;
    });
  });
});