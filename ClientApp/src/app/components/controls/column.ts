import { TemplateRef } from '@angular/core';



export class column {


  constructor(
    colName: string,
    width: number,
    cellTemplate: TemplateRef<any> | null,
    resizeable: boolean,
    canAutoResize: boolean,
    sortable: boolean,
    draggable: boolean,
    propName: string
  ) {
    this.colName = colName;
    this.width = width;
    this.cellTemplate = cellTemplate;
    this.resizeable = resizeable;
    this.canAutoResize = canAutoResize;
    this.sortable = sortable;
    this.draggable = draggable;
    this.colProp = propName;
  }


  colName: string;
  width: number;
  cellTemplate: TemplateRef<any> | null;
  resizeable: boolean;
  canAutoResize: boolean;
  sortable: boolean;
  draggable: boolean;
  colProp: string;
}
