/**
 * Loader for working with data so you don't have to.
 */

const EXAMPLE_OPTION = {
  key: '081R0000000HkXpIAK1',
  label: 'Label',
  subLabel: 'Sub Label',
  icon: 'standard:file',
  value: {
    "Id": "081R0000000HkXpIAK1",
    "Name": "ltng_ExampleComponent",
    "LastModifiedDate": "2020-03-11T20:39:45.000Z"
  }
};

function generateOptions(count) {
  const results = [];
  let currentOption;
  for ( let i = 0; i < count; i = i+1) {
    currentOption = Object.assign({}, EXAMPLE_OPTION);
    currentOption.key = `${currentOption.key}_${i}`;
    currentOption.label = `${currentOption.label} - ${i}`;
    currentOption.value = Object.assign({}, EXAMPLE_OPTION.value);
    currentOption.value.Id=currentOption.key;
    results.push(currentOption);
  }
  return results;
}

/*
const LONG_OPTIONS = [{
  key: '081R0000000HkXpIAK1',
  label: 'ltng_ExampleComponent',
  subLabel: '2020-03-11T20:39:45.000Z',
  icon: 'standard:file',
  value: {
    "Id": "081R0000000HkXpIAK1",
    "Name": "ltng_ExampleComponent",
    "LastModifiedDate": "2020-03-11T20:39:45.000Z"
  }
},{
  key: '081R0000000HkXpIAK2',
  label: 'ltng_ExampleComponent',
  subLabel: '2020-03-11T20:39:45.000Z',
  icon: 'standard:file',
  value: {
    "Id": "081R0000000HkXpIAK1",
    "Name": "ltng_ExampleComponent",
    "LastModifiedDate": "2020-03-11T20:39:45.000Z"
  }
},{
  key: '081R0000000HkXpIAK3',
  label: 'ltng_ExampleComponent',
  subLabel: '2020-03-11T20:39:45.000Z',
  icon: 'standard:file',
  value: {
    "Id": "081R0000000HkXpIAK1",
    "Name": "ltng_ExampleComponent",
    "LastModifiedDate": "2020-03-11T20:39:45.000Z"
  }
},{
  key: '081R0000000HkXpIAK4',
  label: 'ltng_ExampleComponent',
  subLabel: '2020-03-11T20:39:45.000Z',
  icon: 'standard:file',
  value: {
    "Id": "081R0000000HkXpIAK1",
    "Name": "ltng_ExampleComponent",
    "LastModifiedDate": "2020-03-11T20:39:45.000Z"
  }
},{
  key: '081R0000000HkXpIAK5',
  label: 'ltng_ExampleComponent',
  subLabel: '2020-03-11T20:39:45.000Z',
  icon: 'standard:file',
  value: {
    "Id": "081R0000000HkXpIAK1",
    "Name": "ltng_ExampleComponent",
    "LastModifiedDate": "2020-03-11T20:39:45.000Z"
  }
}];
*/
const SHORT_OPTIONS = generateOptions(3);
const LONG_OPTIONS = generateOptions(10);

export {
  generateOptions,
  EXAMPLE_OPTION,
  SHORT_OPTIONS,
  LONG_OPTIONS
}