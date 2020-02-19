/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for story_exampleComplex/__tests__/story_exampleComplex **/
import { createElement } from 'lwc';
import story_exampleComplex from 'c/story_exampleComplex';
import {isArray, isObject} from 'util'; // eslint-disable-line no-unused-vars

describe('c-story_exampleComplex', () => {

  //-- boilerplate DOM reset
  afterEach(() => {
    while (document.body.firstChild){
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('has scenes attached', () => {
    const element = createElement('c-story_exampleComplex', { is:story_exampleComplex });
    document.body.appendChild(element);
    expect(element).not.toBe(null);
    
    expect(element.allScenes).not.toBeNull();
    expect(isArray(element.allScenes)).toBeTruthy();
  });
});