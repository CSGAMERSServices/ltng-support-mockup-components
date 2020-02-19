/* eslint-disable @lwc/lwc/no-inner-html */

import { createElement } from 'lwc';
import story_sampleComponent from '../story_sampleComponent';

describe('story_sampleComponent', () => {
  it('can be instantiated', (done) => {
    const element = createElement('c-story_sampleComponent', {
      is: story_sampleComponent
    });
    document.body.appendChild(element);

    expect(element.children.length).toBeGreaterThan(0);

    done();
  });

  it('has message if message is sent', (done) => {
    const expectedMessage = 'ABCDEFG';
    const expectedLabel = 'cucas';
    const element = createElement('c-story_sampleComponent', {
      is: story_sampleComponent
    });
    element.message = expectedMessage;
    element.label = expectedLabel;
    document.body.appendChild(element);

    const lfrt = element.shadowRoot.querySelector('lightning-formatted-rich-text');
    expect(lfrt).not.toBeNull();
    expect(lfrt.value).toBe(expectedMessage);

    expect(element.shadowRoot.querySelector('.error')).toBeNull();

    done();
  });

  it('does not have message if message is not sent', (done) => {
    const element = createElement('c-story_sampleComponent', {
      is: story_sampleComponent
    });
    document.body.appendChild(element);

    const expectedMessage = '- No message sent -';
    const lfrt = element.shadowRoot.querySelector('lightning-formatted-rich-text');
    const error = element.shadowRoot.querySelector('.error');

    expect(lfrt).toBeNull();
    expect(error).not.toBeNull();
    expect(error.innerHTML).toContain(expectedMessage);
    
    done();
  });
});