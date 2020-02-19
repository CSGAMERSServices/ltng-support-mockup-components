/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for story_exampleSimple/__tests__/story_exampleSimple **/
import { createElement } from 'lwc';
import story_exampleSimple from 'c/story_exampleSimple';

describe('c-story_exampleSimple', () => {

  //-- boilerplate DOM reset
  afterEach(() => {
    while (document.body.firstChild){
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('can be created', () => {
    const element = createElement('c-story_exampleSimple', { is:story_exampleSimple });
    document.body.appendChild(element);
    expect(element).not.toBe(null);
    
    const storyBook = element.shadowRoot.querySelector('c-story_book');
    expect(storyBook).not.toBeNull();

    expect(element.currentScene).not.toBeNull();
  });
});