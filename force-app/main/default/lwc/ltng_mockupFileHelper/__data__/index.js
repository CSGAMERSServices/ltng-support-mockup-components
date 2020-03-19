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

import apexFindFiles from '@salesforce/apex/ltng_mockupFileCtrl.findFiles';
export const findFilesMock = registerLdsTestWireAdapter(apexFindFiles);
import * as findFilesRecent from './findFilesRecent.json';
export const exec_findFilesRecent = () => findFilesMock.emit(convertJsonArray(findFilesRecent));

import * as findFilesEmpty from './findFilesEmpty.json';
export const exec_findFilesEmpty = () => findFilesMock.emit(convertJsonArray(findFilesEmpty));

import createContentVersionApex from '@salesforce/apex/ltng_mockupFileCtrl.createContentVersion';
export const createContentVersionMock = registerLdsTestWireAdapter(createContentVersionApex);
import * as createContentVersion from './createContentVersion.json';
export const exec_createContentVersion = () => createContentVersionMock.emit(createContentVersion);
