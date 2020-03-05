/* eslint-disable @lwc/lwc/no-inner-html */

import { createElement } from 'lwc';
import story_book, {Scene} from 'c/story_book';

describe('story_book', () => {
  
  test('it can be added to the page', (done) => {
    const element = createElement('c-story_book', {
      is: story_book
    });
    element.title = 'Expected title';
    document.body.appendChild(element);

    const title = element.shadowRoot.querySelector('h1');
    expect(title).not.toBeNull();
    done();
  });

  it('can find slots', (done) => {
    expect('slots can be tested.').toBeTruthy();
    //-- @TODO: slots cannot be tested at this time.
    // @see https://github.com/salesforce/sfdx-lwc-jest/issues/63
    done();
  });

  it('has a large style if width is wide', () => {
    const element = createElement('c-story_book', {
      is: story_book
    });
    element.width = 'widE';
    document.body.appendChild(element);

    const expectedContainer = element.shadowRoot.querySelector('.width-large');
    expect(expectedContainer).not.toBeNull();

    let notExpectedContainer = element.shadowRoot.querySelector('.width-medium');
    expect(notExpectedContainer).toBeNull();
    notExpectedContainer = element.shadowRoot.querySelector('.width-small');
    expect(notExpectedContainer).toBeNull();
  });

  it('has a large style if width is large', () => {
    const element = createElement('c-story_book', {
      is: story_book
    });
    element.width = 'large';
    document.body.appendChild(element);

    let container = element.shadowRoot.querySelector('.width-large');
    expect(container).not.toBeNull();
    container = element.shadowRoot.querySelector('.width-medium');
    expect(container).toBeNull();
    container = element.shadowRoot.querySelector('.width-small');
    expect(container).toBeNull();
  });

  it('has a medium style if width is medium', () => {
    const element = createElement('c-story_book', {
      is: story_book
    });
    element.width = 'medium';
    document.body.appendChild(element);

    let container = element.shadowRoot.querySelector('.width-large');
    expect(container).toBeNull();
    container = element.shadowRoot.querySelector('.width-medium');
    expect(container).not.toBeNull();
    container = element.shadowRoot.querySelector('.width-small');
    expect(container).toBeNull();
  });

  it('has a small style if width is narrow', () => {
    const element = createElement('c-story_book', {
      is: story_book
    });
    element.width = 'narrOW';
    document.body.appendChild(element);

    let container = element.shadowRoot.querySelector('.width-large');
    expect(container).toBeNull();
    container = element.shadowRoot.querySelector('.width-medium');
    expect(container).toBeNull();
    container = element.shadowRoot.querySelector('.width-small');
    expect(container).not.toBeNull();
  });

  it('has a small style if width is small', () => {
    const element = createElement('c-story_book', {
      is: story_book
    });
    element.width = 'small';
    document.body.appendChild(element);

    let container = element.shadowRoot.querySelector('.width-large');
    expect(container).toBeNull();
    container = element.shadowRoot.querySelector('.width-medium');
    expect(container).toBeNull();
    container = element.shadowRoot.querySelector('.width-small');
    expect(container).not.toBeNull();
  });

  it('does not have a width style if width is unknown', () => {
    const element = createElement('c-story_book', {
      is: story_book
    });
    element.width = 'unknown';
    document.body.appendChild(element);

    let container = element.shadowRoot.querySelector('.width-large');
    expect(container).toBeNull();
    container = element.shadowRoot.querySelector('.width-medium');
    expect(container).toBeNull();
    container = element.shadowRoot.querySelector('.width-small');
    expect(container).toBeNull();
  });

  it('has a border style if border is set to true', () => {
    const element = createElement('c-story_book', {
      is: story_book
    });
    element.border = 'true';
    document.body.appendChild(element);

    let container = element.shadowRoot.querySelector('.bordered');
    expect(container).not.toBeNull();
  });

  it('does not have a border style if border is set to false', () => {
    const element = createElement('c-story_book', {
      is: story_book
    });
    element.border = 'false';
    document.body.appendChild(element);

    let container = element.shadowRoot.querySelector('.bordered');
    expect(container).toBeNull();
  });

  it('can create a scene with literals', () => {
    const expectedLabel = 'label';
    const expectedValue = 'value';
    const scene = new Scene(expectedLabel, expectedValue);

    expect(scene.label).toBe(expectedLabel);
    expect(scene.value).toBe(expectedValue);
  });

  it('can create a scene with objects', () => {
    const expectedLabel = 'label2';
    const message = 'howdy';
    const value = { message };

    const scene = new Scene(expectedLabel, value);

    expect(scene.label).toBe(expectedLabel);
    expect(scene.value.message).toBe(message);
  });

  it('changes the width to wide when selecting in the menu', (done) => {
    const element = createElement('c-story_book', {
      is: story_book
    });
    document.body.appendChild(element);

    const buttonMenu = element.shadowRoot.querySelector('lightning-button-menu');
    expect(buttonMenu.alternativeText).toBe('Size Menu');

    buttonMenu.dispatchEvent(new CustomEvent('select', {detail:{value:'wide'}}));

    return Promise.resolve().then(() => {
      const storybookClasses=element.shadowRoot.querySelector('.storybook').getAttribute('class');
      expect(storybookClasses).toContain('width-large');
      done();
    });
  });

  it('changes the width to medium when selecting in the menu', (done) => {
    const element = createElement('c-story_book', {
      is: story_book
    });
    document.body.appendChild(element);

    const buttonMenu = element.shadowRoot.querySelector('lightning-button-menu');
    expect(buttonMenu.alternativeText).toBe('Size Menu');

    buttonMenu.dispatchEvent(new CustomEvent('select', {detail:{value:'medium'}}));

    return Promise.resolve().then(() => {
      const storybookClasses=element.shadowRoot.querySelector('.storybook').getAttribute('class');
      expect(storybookClasses).toContain('width-medium');
      done();
    });
  });

  it('changes the width to narrow when selecting in the menu', (done) => {
    const element = createElement('c-story_book', {
      is: story_book
    });
    document.body.appendChild(element);

    const buttonMenu = element.shadowRoot.querySelector('lightning-button-menu');
    expect(buttonMenu.alternativeText).toBe('Size Menu');

    buttonMenu.dispatchEvent(new CustomEvent('select', {detail:{value:'narrow'}}));

    return Promise.resolve().then(() => {
      const storybookClasses=element.shadowRoot.querySelector('.storybook').getAttribute('class');
      expect(storybookClasses).toContain('width-small');
      done();
    });
  });
});
