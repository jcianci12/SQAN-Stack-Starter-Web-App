import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sortheader',
  templateUrl: './sortheader.component.html',
  styleUrls: ['./sortheader.component.scss']
})
export class SortheaderComponent implements OnInit {


  @Output() sortChanged = new EventEmitter();
  @Input() sortOrder!: string;
  @Input() sortingByField: any;
  @Input() columnDisplayName!: string;
  @Input() columnPropertyName!: string

  constructor(
  ) {
    console.log("columnDisplayName", this.columnDisplayName)

  }

  ngOnInit() {
  }

  childtoggleSort(field: string) {
    console.log(field)
    console.log(this.sortOrder)
    //this.sortingByField = field;


    console.log(this.sortOrder)

    let ss = new SortState();
    ss.sortColumnDisplayName = this.columnDisplayName;
    ss.sortColumnPropertyName = this.columnPropertyName;
    ss.sortOrder = this.sortOrder?this.sortOrder:"";
    this.sortChanged.emit(ss)

  }
}
export class SortState {
  sortOrder!: string;
  sortColumnPropertyName!: string;
  sortColumnDisplayName!: string;
}
