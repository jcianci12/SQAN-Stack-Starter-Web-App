import { getRowObject } from './getRowObject';
export function handleRows(arrayOfRows: any[], headers: any[]) {
  //console.log("array of rows is:");
  //console.log(arrayOfRows);
  let newArrayOfRows: {}[] = [];

  arrayOfRows.forEach(element => {
    let rowData = getRowObject({ row: element, headers });
    newArrayOfRows.push(rowData);
  });
  //console.log("Shifted values are:")
  //console.log(newArrayOfRows.shift())

  //newArrayOfRows = [newArrayOfRows.shift()]
  console.log(newArrayOfRows)
  return newArrayOfRows
}
