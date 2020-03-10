/**
 * Utility for parsing a CSV formatted string
 * (Quotes for string escapes, and comma delimited)
 * into a two dimensional array.
 */

/**
 * The maximum number of iterations allowed (Failsafe
 * @type {Number}
 */
const MAX_ITERATIONS = 1000;

/**
 * Represents a label value pair
 */
class LabelValue {

  /**
   * @param {String} label 
   * @param {String} value 
   */
  constructor(label, value) {
    this.label = label;
    this.value = value;
  }
}

/**
 * Represents a responsive table set of data
 */
class ResponsiveTableData {
  /**
   * @type {String[]}
   */
  headers;

  /**
   * @type {LabelValue[][]}
   */
  data;

  /**
   * @param {String[]} headers 
   * @param {LabelValue[][]} data 
   */
  constructor(headers, data) {
    this.headers = headers || [];
    this.data = data || [];
  }
}

/**
 * Splits a string into multiple rows
 * @param {String} str 
 * @returns {String[]}
 * @testvisible
 */
const splitRows = (splitStr) =>
  splitStr.replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .split(/[\n\r]+/)
    .map(trimStr => trimStr.trim());

/**
 * Parses the next element from a csv line with the assumption we are not looking for quotes
 * @param {String} str - the current csv line
 * @returns {string[]} - [currentCell, remainingString]
 * @testvisible
 */
function nextCsvCell(str) {
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
}

/**
 * Parses the next element in a csv line with the assumption it is a string
 * @param {String} str 
 * @returns {String[]} - [currentCell, remainingString]
 * @testvisible
 */
function nextCsvStringCell(str) {
  let quoteEnd;
  let delimiterEnd;
  let currentCell;
  let remaining;

  if (!str) return null;

  remaining = str.trim()
    .replace(/(?<!\\)""/g, '\\"');

  if (remaining.charAt(0) !== '"') return null;

  remaining = remaining.substring(1);

  quoteEnd = remaining.search(/(?<!\\)["]/);

  if (quoteEnd < 0) return null;

  currentCell = remaining.substring(0, quoteEnd).replace(/\\"/g,'"');

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
}

/**
 * Parses a CSV line (with quotes) 
 * @param {String} str - a csv line
 * @returns {String[]} - a csv line into an array of strings
 * @testvisible
 */
function parseCsvLine(str) {
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
}

/**
 * Parses a CSV string (comma separated, quote escaped) into a table
 * @param {String} str - a csv table
 * @returns {string[][]}
 */
function parseCSV(str) {
  let result = [];

  if (str) {
    splitRows(str).forEach(csvRow => {
      result.push(parseCsvLine(csvRow));
    });
  }

  return result;
}

/**
 * Converts a two dimensional array into an array of label value pairs.
 * @param {string} tablecsv - comma separated, string escaped newline separated list of data to use.
 * @returns {String[][][]} - collection of label value pairs for each of the values.
 * @testaccessible
 */
function parseCsvToLabelValue(str) {
  let result = new ResponsiveTableData();
  let parsedCSV = parseCSV(str);
  var rowColumnCount;
  var resultRow;
  var resultLV;
  var arrayUniqueKey = 0;


  if (!parsedCSV ||
    parsedCSV.length < 1 ||
    parsedCSV[0].length < 1
  ) {
    return result;
  }

  const headers = [...parsedCSV[0]];
  const columnCount = headers.length;

  result.headers = [...parsedCSV[0]];

  const csvData = parsedCSV.slice(1);

  csvData.forEach((dataRow) => {
    var i;
    resultRow=[];
    rowColumnCount = dataRow.length;
    for (i = 0; i < rowColumnCount && i < columnCount; i++) {
      resultLV = new LabelValue(
        headers[i],
        dataRow[i]
      );
      resultRow.push(resultLV);
    }
    resultRow.uniqueKey = ++arrayUniqueKey;
    result.data.push(resultRow);
  });

  return result;
}

export {
  splitRows,
  nextCsvCell,
  nextCsvStringCell,
  parseCsvLine,
  parseCSV,
  parseCsvToLabelValue,
  LabelValue,
  ResponsiveTableData
};

export default parseCSV;