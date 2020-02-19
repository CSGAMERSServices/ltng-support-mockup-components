/* eslint-disable @lwc/lwc/no-inner-html */

/** JEST Test for story_sceneSelector/__tests__/story_sceneSelector **/
import { createElement } from 'lwc';
import story_sceneSelector from 'c/story_sceneSelector';

const EXAMPLE_SCENES = [
  { label: 'Scenario A', value: '' },
  { label: 'Scenario B', value: 'Second scenario message' },
  { label: 'Scenario C', value: 'Last message' }
];

describe('c-story_sceneSelector', () => {

  //-- boilerplate DOM reset
  afterEach(() => {
    while (document.body.firstChild){
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('can be added to the document', () => {
    const element = createElement('c-story_sceneSelector', { is:story_sceneSelector });
    document.body.appendChild(element);
    expect(element).not.toBe(null);
  });

  it('can uses the initial story by default', (done) => {
    const sceneEventWatcher = jest.fn();

    const element = createElement('c-story_sceneSelector', { is:story_sceneSelector });
    element.scenes = EXAMPLE_SCENES;
    element.addEventListener('scene', sceneEventWatcher);
    document.body.appendChild(element);

    const combobox=element.shadowRoot.querySelector('lightning-combobox');
    combobox.value = '1';
    combobox.dispatchEvent(new CustomEvent('change'));

    expect(sceneEventWatcher).toHaveBeenCalled();

    expect(sceneEventWatcher).toHaveBeenCalledTimes(2);

    const secondCallEvent = sceneEventWatcher.mock.calls[1][0];
    const sceneToMatchTo = EXAMPLE_SCENES[1];
    expect(secondCallEvent).not.toBeNull();
    expect(secondCallEvent.detail).not.toBeNull();
    expect(secondCallEvent.detail.label).toBe(sceneToMatchTo.label);

    done();
  });

  it('captures the 0 index if the initial index is negative', (done) => {
    const element = createElement('c-story_sceneSelector', { is:story_sceneSelector });
    element.scenes = EXAMPLE_SCENES;
    element.index = 0;
    document.body.appendChild(element);

    const combobox=element.shadowRoot.querySelector('lightning-combobox');
    expect(combobox.value).toBe('0');
    done();
  });

  it('captures the 0 index if the initial index is way too big', (done) => {
    const element = createElement('c-story_sceneSelector', { is:story_sceneSelector });
    element.scenes = EXAMPLE_SCENES;
    element.index = 1000;
    document.body.appendChild(element);

    const combobox=element.shadowRoot.querySelector('lightning-combobox');
    expect(combobox.value).toBe('0');
    done();
  });

  it('instantiates even if no scenes are passed', () => {
    const element = createElement('c-story_sceneSelector', { is:story_sceneSelector });
    document.body.appendChild(element);

    expect(element).not.toBeNull();

    const sceneHandler = jest.fn();
    element.addEventListener('screen', sceneHandler);

    const combobox = element.shadowRoot.querySelector('lightning-combobox');
    expect(combobox).not.toBeNull();
    combobox.dispatchEvent(new CustomEvent('change'));

    expect(sceneHandler).not.toHaveBeenCalled();
  });

  it('instantiates even scenes are empty', () => {
    const element = createElement('c-story_sceneSelector', { is:story_sceneSelector });
    element.scenes = [];
    document.body.appendChild(element);

    expect(element).not.toBeNull();

    const sceneHandler = jest.fn();
    element.addEventListener('screen', sceneHandler);

    const combobox = element.shadowRoot.querySelector('lightning-combobox');
    expect(combobox).not.toBeNull();
    combobox.dispatchEvent(new CustomEvent('change'));

    expect(sceneHandler).not.toHaveBeenCalled();
  });

  it('instantiates even index is invalid', () => {
    const element = createElement('c-story_sceneSelector', { is:story_sceneSelector });
    element.scenes = [];
    element.index = '1';
    document.body.appendChild(element);

    expect(element).not.toBeNull();

    const sceneHandler = jest.fn();
    element.addEventListener('screen', sceneHandler);

    const combobox = element.shadowRoot.querySelector('lightning-combobox');
    expect(combobox).not.toBeNull();
    combobox.dispatchEvent(new CustomEvent('change'));

    expect(sceneHandler).not.toHaveBeenCalled();
  });
});