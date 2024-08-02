import { keyValuePair } from "../models/keyValuePair";

export function getRowObject({ row, headers }: {
  row: any;
  headers: any;
}) {
  let rowArray = row.split("\t");
  var returnInfo: Array<any> = [];
  //console.log("array of cells is:");
  //console.log(rowArray);


  rowArray.forEach((element: any, index: string | number) => {

    console.log("Index is:")
    console.log(index)


    let header = headers[index].field;
    let value = element;
    //console.log(header, value);
    //{ test1: 'Toyota', model: 'Celica', price: 35000 },
    var newRowObj: keyValuePair;
    newRowObj = {
      headerdescriptor: header,
      value: value
    };
    returnInfo[header] = value;
  });
  console.log("returning row data");
  //console.log(returnInfo);
  return returnInfo;
}
