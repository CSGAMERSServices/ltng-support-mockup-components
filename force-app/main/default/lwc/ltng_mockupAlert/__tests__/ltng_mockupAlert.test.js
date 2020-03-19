/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for ltng_mockupAlert/__tests__/ltng_mockupAlert **/
import { createElement } from 'lwc';
import ltng_mockupAlert from 'c/ltng_mockupAlert';
// import { isArray } from 'util';

const defaultProperties = {
  isShown: true,
  theme: 'info',
  iconCategory: 'utility',
  iconName: 'info',
  message: 'Some Messge'
};

class TestSettings {
  constructor() {
    /**
     * type {HtmlElement}
     */
    this.element = createElement('c-ltng_mockupAlert', { is:ltng_mockupAlert });
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

describe('c-ltng_mockupAlert', () => {
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
    
    expect(ts.element.isShown).toBe(defaultProperties.isShown);
    expect(ts.element.theme).toBe(defaultProperties.theme);
    expect(ts.element.iconName).toBe(defaultProperties.iconName);
    expect(ts.element.message).toBe(defaultProperties.message);
  });

  describe('when the alert is info', () => {
    it('the alert class is found', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(customTS => {
          customTS.element.theme = 'info'
        })
        .attachElement();
      const el = ts.element.shadowRoot.querySelector('.slds-theme_info');
      expect(el).toBeTruthy();
    });
    it('the icon is found', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(customTS => {
          customTS.element.theme = 'info';
          customTS.element.iconName = 'info';
        })
        .attachElement();
      
      const expected = 'utility:info';
      const el = ts.element.shadowRoot.querySelector('lightning-icon');
      expect(el).toBeTruthy();
      expect(el.iconName).toBe(expected);
    });
  });

  describe('when the alert is error', () => {
    it('the alert class is found', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(customTS => {
          customTS.element.theme = 'error'
        })
        .attachElement();
      const el = ts.element.shadowRoot.querySelector('.slds-theme_error');
      expect(el).toBeTruthy();
    });
    it('the icon is found', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(customTS => {
          customTS.element.theme = 'error';
          customTS.element.iconName = 'error';
        })
        .attachElement();
      
      const expected = 'utility:error';
      const el = ts.element.shadowRoot.querySelector('lightning-icon');
      expect(el).toBeTruthy();
      expect(el.iconName).toBe(expected);
    });
  });

  describe('when the alert is warning', () => {
    it('the alert class is found', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(customTS => {
          customTS.element.theme = 'warning'
        })
        .attachElement();
      const el = ts.element.shadowRoot.querySelector('.slds-theme_warning');
      expect(el).toBeTruthy();
    });
    it('the icon is found', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(customTS => {
          customTS.element.theme = 'warning';
          customTS.element.iconName = 'warning';
        })
        .attachElement();
      
      const expected = 'utility:warning';
      const el = ts.element.shadowRoot.querySelector('lightning-icon');
      expect(el).toBeTruthy();
      expect(el.iconName).toBe(expected);
    });
  });

  describe('when the alert is offline', () => {
    it('the alert class is found', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(customTS => {
          customTS.element.theme = 'offline'
        })
        .attachElement();
      const el = ts.element.shadowRoot.querySelector('.slds-theme_offline');
      expect(el).toBeTruthy();
    });
    it('the icon is found', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(customTS => {
          customTS.element.theme = 'offline';
          customTS.element.iconName = 'offline';
        })
        .attachElement();
      
      const expected = 'utility:offline';
      const el = ts.element.shadowRoot.querySelector('lightning-icon');
      expect(el).toBeTruthy();
      expect(el.iconName).toBe(expected);
    });
  });

  describe('when the alert is not found', () => {
    it('the alert class is found', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(customTS => {
          customTS.element.theme = 'notfound'
        })
        .attachElement();
      const el = ts.element.shadowRoot.querySelector('.slds-theme_info');
      expect(el).toBeTruthy();
    });
  });

  it('the icon is that provided', () => {
    const ts = new TestSettings()
      .applyDefaultProperties()
      .customSetup(customTS => {
        customTS.element.theme = 'info';
        customTS.element.iconName = 'announcement';
      })
      .attachElement();
    
    const expected = 'utility:announcement';
    const el = ts.element.shadowRoot.querySelector('lightning-icon');
    expect(el).toBeTruthy();
    expect(el.iconName).toBe(expected);
  });

  it('still works if the icon isnt provided', () => {
    const ts = new TestSettings()
      .applyDefaultProperties()
      .customSetup(customTS => {
        customTS.element.theme = 'info';
        customTS.element.iconName = null;
      })
      .attachElement();

    const expected = '';
    const el = ts.element.shadowRoot.querySelector('lightning-icon');
    expect(el).toBeTruthy();
    expect(el.iconName).toBe(expected);
  });

  describe('when the alert isnt initially shown', () => {
    it('the alert cannot be found', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(customTS => {
          customTS.element.isShown = false;
        })
        .attachElement();
      
      const el = ts.element.shadowRoot.querySelector('.alert');
      expect(el).toBeFalsy();
    });

    it('can be shown by telling it to show', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(customTS => {
          customTS.element.isShown = false;
        })
        .attachElement();
      
      jest.useFakeTimers();

      let el = ts.element.shadowRoot.querySelector('.alert');
      expect(el).toBeFalsy();
      
      const MESSAGE_TO_FIND = 'message to find';
      ts.element.show(MESSAGE_TO_FIND, 1000);

      expect(ts.element.isShown).toBe(true);
      expect(ts.element.message).toBe(MESSAGE_TO_FIND);

      return Promise.resolve().then(() => {

        el = ts.element.shadowRoot.querySelector('.alert');
        expect(el).toBeTruthy();
  
        const message = ts.element.shadowRoot.querySelector('h2');
        expect(message).toBeTruthy();
        expect(message.innerHTML).toBe(MESSAGE_TO_FIND);
      });
    });

    it('hides the alert again after the timer runs out', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(customTS => {
          customTS.element.isShown = false;
        })
        .attachElement();
      
      jest.useFakeTimers();
      
      ts.element.show('some message', 1000);
      
      let el = ts.element.shadowRoot.querySelector('.alert');
      expect(el).toBeFalsy();

      return Promise.resolve()
        .then(() => {
          el = ts.element.shadowRoot.querySelector('.alert');
          expect(el).toBeTruthy();

          jest.runAllTimers();

          return Promise.resolve();
        })
        .then(() => {
          el = ts.element.shadowRoot.querySelector('.alert');
          expect(el).toBeFalsy();
        });
    });

    it('doesnt throw an error if the timeout is negative', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .customSetup(customTS => {
          customTS.element.isShown = false;
        })
        .attachElement();
      
      jest.useFakeTimers();
      
      const fn = () => ts.element.show('some message', -1);
      expect(fn).not.toThrow();
    });

    it('closes when the close button is pressed', () => {
      const ts = new TestSettings()
        .applyDefaultProperties()
        .attachElement();
      
      let closeBtn = ts.element.shadowRoot.querySelector('lightning-button-icon');
      expect(closeBtn).toBeTruthy();

      const clickEvt = new CustomEvent('click');
      closeBtn.dispatchEvent(clickEvt);

      return Promise.resolve().then(() => {
        closeBtn = ts.element.shadowRoot.querySelector('lightning-button-icon');
        expect(closeBtn).toBeFalsy();  
      });
    });
  });
});