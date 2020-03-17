/**
 * Loader for working with data so you don't have to.
 */

import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import { CurrentPageReference } from 'lightning/navigation';

const pageReferenceMock = registerLdsTestWireAdapter(CurrentPageReference);
const pageRef = {"type":"standard__navItemPage","attributes":{"apiName":"someAppPage"},"state":{}};
const otherPageRef = {"type":"standard__navItemPage","attributes":{"apiName":"someOtherAppPage"},"state":{}};
const execPageReferenceMock = () => pageReferenceMock.emit(pageRef);

export {
  execPageReferenceMock,
  pageRef,
  otherPageRef
}