
export function defineColumnHeaders(rows:Array<any>) {
  ////console.log("defining headers with data:");
  let firstRow = rows[0].split("\t");
  let columnDefs: { headerName: any; field: any; sortable: boolean; filter: boolean; editable: boolean; resizable: boolean; }[] = [];
  //clear the column definitions
  firstRow.forEach((element: any) => {
    let coldef = { headerName: element, field: element, sortable: true, filter: true,editable:true,resizable:true };
    columnDefs.push(coldef);
    ////console.log(columnDefs);
  });
  return columnDefs;
}
