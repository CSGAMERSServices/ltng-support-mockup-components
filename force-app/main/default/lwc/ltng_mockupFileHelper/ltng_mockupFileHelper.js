
import { LightningElement, api, track, wire } from 'lwc';



/**
 * Converts a UTC DateTime string to local
 * @param {String} utcDateTime - ex: '2020-03-11T20:39:45.000Z'
 * @returns {String} - ex: 3/11/2020, 3:39:45 PM
 */
export const utcDateToLocal = (dateStr) => {
  const parsedDate = Date.parse(dateStr);
  if (!parsedDate) {
    return dateStr;
  }
  return new Date(parsedDate).toLocaleString();
};

/**
 * Trims the file load contents into just the base64 data
 * ex: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA
 * @param {String} b64data - contents from FileReader.
 * @returns {String} Just the base64 data. ex: iVBORw0KGgoA...
 */
export const fileReadBase64 = (b64Data) => {
  return b64Data.substring(b64Data.indexOf(',')+1);
}

/**
 * Icon (group:name) to use for static resources
 * @type {String}
 */
export const STATIC_RESOURCE_ICON = 'standard:file';

/**
 * Length in milliseconds to wait before searching
 * @type {Number}
 */
// const TIMEOUT_DELAY = 1000;

export default class Ltng_mockupFileHelper extends LightningElement {
  /**
   * The term to search for
   * @type {String}
   */
  @api queryTerm = 'Mock'

  /**
   * Content version to update
   * @type {ContentVersion}
   */
  @api contentVersionToUpdate = null;

  /**
   * Collection of static resources captured
   */
  @api options = [];

  /**
   * timeout used to delay searching
   * @type {TimerHandler}
   */
  delayTimeout;
}
