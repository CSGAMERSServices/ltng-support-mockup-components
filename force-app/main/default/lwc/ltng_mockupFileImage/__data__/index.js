/**
 * Loader for working with data so you don't have to.
 */

import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import { CurrentPageReference } from 'lightning/navigation';

const pageReferenceMock = registerLdsTestWireAdapter(CurrentPageReference);
import * as pageRefData from './pageRef.json';
const execPageReferenceMock = () => pageReferenceMock.emit(pageRefData);

import apexGetSettings from '@salesforce/apex/ltng_mockupFileCtrl.getSettings';
const getSettingsMock = registerLdsTestWireAdapter(apexGetSettings);
import * as getSettingsData from './getSettings.json';
const execGetSettings = () => getSettingsMock.emit(getSettingsData);

import * as getSettingsDataCaching from './getSettingsCaching.json';
const execGetSettingsDataCaching = () => getSettingsMock.emit(getSettingsDataCaching);

import apexDetermineFileContentURL from '@salesforce/apex/ltng_mockupFileCtrl.determineFileContentURL';
const determineFileContentMock = registerLdsTestWireAdapter(apexDetermineFileContentURL);
import * as determineFileContentURL_Data from './determineFileContentURL.json';
const execFileContentURL = () => determineFileContentMock.emit(determineFileContentURL_Data);

export {
  execPageReferenceMock,
  execGetSettings,
  execGetSettingsDataCaching,
  execFileContentURL,
  pageRefData,
  getSettingsData,
  determineFileContentURL_Data
}