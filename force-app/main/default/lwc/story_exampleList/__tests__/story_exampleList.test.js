/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for story_exampleList/__tests__/story_exampleList **/
import { createElement } from 'lwc';
import story_exampleList from 'c/story_exampleList';
import {isArray} from 'util';

describe('c-story_exampleList', () => {

  //-- boilerplate DOM reset
  afterEach(() => {
    while (document.body.firstChild){
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('says hello', () => {
    const element = createElement('c-story_exampleList', { is:story_exampleList });
    document.body.appendChild(element);
    expect(element).not.toBe(null);
    
    expect(element.scenes).not.toBeNull();
    expect(isArray(element.scenes)).toBeTruthy();
    expect(element.scenes.length).toBeGreaterThan(0);

    const scene = element.scenes[0];
    expect(scene.label).not.toBeNull();
    expect(scene.label).not.toBeNull();
  });
});