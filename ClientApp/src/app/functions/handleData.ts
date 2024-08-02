import { getColumnDefs } from './getColumnDefs';
import { handleRows } from './handleRows';
import { defineColumnHeaders } from './defineColumnHeaders';
export function handleData(gridData: string) {
  //console.log("handledata.ts: This grid data is:")
  //console.log(gridData)

  let newgridData = {
    columnDefs: getColumnDefs(),
    rowData: [
      {  }
    ]
  };

  if (gridData.length == 0) {

    //console.log("Griddata is empty")
    newgridData.rowData = [
      { "no": 'No data to display' }
    ]
  }


  if (gridData.indexOf("\t") > -1) {
    var rows = gridData.split("\n");
    ////console.log("line length is :", rows.length);
    //define column headers
    //this.columnDefs = this.defineColumnHeaders(rows[0]);
    newgridData = {
      columnDefs: getColumnDefs(),
      rowData: handleRows(rows, defineColumnHeaders(rows))
    };

  }
//console.log("returning:")
//console.log(newgridData)
  return newgridData;


}
