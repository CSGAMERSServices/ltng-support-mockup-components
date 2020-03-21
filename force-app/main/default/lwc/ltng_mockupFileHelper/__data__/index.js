/**
 * Loader for working with data so you don't have to.
 */

import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import { CurrentPageReference } from 'lightning/navigation';

export const pageReferenceMock = registerLdsTestWireAdapter(CurrentPageReference);
export const pageRefExample = {"type":"standard__navItemPage","attributes":{"apiName":"someAppPage"},"state":{}}
export const execPageReferenceMock = () => pageReferenceMock.emit(pageRefExample);

function convertJsonArray(obj) {
  return obj.default;
}

export const ERROR = { message: 'error' };

import apexFindFiles from '@salesforce/apex/ltng_mockupFileCtrl.findFiles';
export const findFilesMock = registerLdsTestWireAdapter(apexFindFiles);
import * as findFilesRecent from './findFilesRecent.json';
export const exec_findFilesRecent = () => findFilesMock.emit(convertJsonArray(findFilesRecent));

import * as findFilesEmpty from './findFilesEmpty.json';
export const exec_findFilesEmpty = () => findFilesMock.emit(convertJsonArray(findFilesEmpty));

import * as findFilesSearch from './findFilesSearch.json';
export const exec_findFilesSearch = () => findFilesMock.emit(convertJsonArray(findFilesSearch));
export const error_fileFilesSearch = () => findFilesMock.error(ERROR);

import * as createContentVersion from './createContentVersion.json';
import createContentVersionApex from '@salesforce/apex/ltng_mockupFileCtrl.createContentVersion';
jest.mock(
  '@salesforce/apex/ltng_mockupFileCtrl.createContentVersion',
  () => {
    return {
      default: jest.fn()
    };
  },
  { virtual: true }
);
export const createContentVersionData = createContentVersion;
export const createContentVersionMock = createContentVersionApex;
export const exec_createContentVersion = () => createContentVersionMock.mockResolvedValue(createContentVersionData);
export const error_createContentVersion = () => createContentVersionMock.mockRejectedValue({ body: ERROR });
