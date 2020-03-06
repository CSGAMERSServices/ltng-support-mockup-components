import { LightningElement, api } from 'lwc';

const MAX_ITERATIONS = 1000;

/**
 * Splits a string into multiple rows
 * @param {String} str 
 * @returns {String[]}
 */
const splitRows = (splitStr) => (splitStr.split(/[\n\r]+/)).map(trimStr => trimStr.trim());

/**
 * Parses the next element from a csv line with the assumption we are not looking for quotes
 * @param {String} str - the current csv line
 * @returns {string[]} - [currentCell, remainingString]
 */
const nextCsvCell = (str) => {
  let delimiterEnd;
  let currentCell;
  let remaining;

  if (!str || !(str.trim())) return null;

  delimiterEnd = str.indexOf(',');

  if (delimiterEnd < 0) {
    delimiterEnd = str.length;
  }

  currentCell = str.substring(0, delimiterEnd).trim();
  remaining = str.substring(delimiterEnd+1).trim();

  if (!remaining) remaining = null;

  return [
    currentCell,
    remaining
  ];
};

/**
 * Parses the next element in a csv line with the assumption it is a string
 * @param {String} str 
 * @returns {String[]} - [currentCell, remainingString]
 */
const nextCsvStringCell = (str) => {
  let quoteEnd;
  let delimiterEnd;
  let currentCell;
  let remaining;

  if (!str) return null;

  remaining = str.trim();

  if (remaining.charAt(0) !== '"') return null;

  remaining = remaining.substring(1);

  quoteEnd = remaining.search(/(?<!\\)["']/);

  if (quoteEnd < 0) return null;

  currentCell = remaining.substring(0, quoteEnd);

  remaining = remaining.substring(quoteEnd+1);
  delimiterEnd = remaining.indexOf(',');

  if (delimiterEnd < 0) {
    remaining = null;
  } else {
    remaining = remaining.substring(delimiterEnd+1).trim();
    if (!remaining) remaining = null;
  }

  return [
    currentCell,
    remaining
  ];
};

/**
 * Parses a CSV line (with quotes) 
 * @param {String} str - a csv line
 * @returns {String[]} - a csv line into an array of strings
 */
const parseCsvLine = (str) => {
  const results = [];
  let currentCell;
  let remaining = (str || '').trim();

  if (remaining) {
    for (let i = 0; remaining && i < MAX_ITERATIONS; i++){
      if (remaining) {
        let nextToken = nextCsvStringCell(remaining);
        if (!nextToken) nextToken = nextCsvCell(remaining);

        if (!nextToken) {
          remaining = null;
        } else {
          [currentCell, remaining] = nextToken;
          results.push(currentCell);
        }
      }
    }
  }

  return results;
};

/**
 * Parses a CSV string (comma separated, quote escaped) into a table
 * @param {String} str - a csv table
 * @returns {string[][]}
 */
const parseCSV = (str) => {
  let result = [];

  if (str) {
    splitRows(str).forEach(csvRow => {
      result.push(parseCsvLine(csvRow));
    });
  }

  return result;
}

export {
  splitRows,
  nextCsvCell,
  nextCsvStringCell,
  parseCsvLine,
  parseCSV
};

/**
 * A responsive table using the lightning design system.
 */
export default class Ltng_mockupResponsiveTable extends LightningElement {
  /**
   * The data to show in the responsive table.
   * @type {String}
   */
  @api tablecsv;

  connectedCallback() {
    console.log('constructor');
  }

  CSVToArray( strData, strDelimiter ){
      /* eslint-disable */
      // Check to see if the delimiter is defined. If not,
      // then default to comma.
      strDelimiter = (strDelimiter || ",");

      // Create a regular expression to parse the CSV values.
      var objPattern = new RegExp(
          (
              // Delimiters.
              "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

              // Quoted fields.
              "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

              // Standard fields.
              "([^\"\\" + strDelimiter + "\\r\\n]*))"
          ),
          "gi"
          );


      // Create an array to hold our data. Give the array
      // a default empty first row.
      var arrData = [[]];

      // Create an array to hold our individual pattern
      // matching groups.
      var arrMatches = null;


      // Keep looping over the regular expression matches
      // until we can no longer find a match.
      while (arrMatches = objPattern.exec( strData )){

          // Get the delimiter that was found.
          var strMatchedDelimiter = arrMatches[ 1 ];

          // Check to see if the given delimiter has a length
          // (is not the start of string) and if it matches
          // field delimiter. If id does not, then we know
          // that this delimiter is a row delimiter.
          if (
              strMatchedDelimiter.length &&
              strMatchedDelimiter !== strDelimiter
              ){

              // Since we have reached a new row of data,
              // add an empty row to our data array.
              arrData.push( [] );

          }

          var strMatchedValue;

          // Now that we have our delimiter out of the way,
          // let's check to see which kind of value we
          // captured (quoted or unquoted).
          if (arrMatches[ 2 ]){

              // We found a quoted value. When we capture
              // this value, unescape any double quotes.
              strMatchedValue = arrMatches[ 2 ].replace(
                  new RegExp( "\"\"", "g" ),
                  "\""
                  );

          } else {

              // We found a non-quoted value.
              strMatchedValue = arrMatches[ 3 ];

          }


          // Now that we have our value string, let's add
          // it to the data array.
          arrData[ arrData.length - 1 ].push( strMatchedValue );
      }

      // Return the parsed data.
      return( arrData );
      /* eslint-enable */
  }
}