import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { MatCalendar, MatCalendarCellClassFunction, MatCalendarCellCssClasses } from '@angular/material/datepicker';
import * as moment from 'moment';
import { Booking, Client, Product, ProductAvailability } from 'src/app/api/Client';

@Component({
  selector: 'app-daterange',
  templateUrl: './daterange.component.html',
  styleUrls: ['./daterange.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }], providers: [NgForm]
})
export class DaterangeComponent implements OnInit {
  @Input() product!: Product
  @Input() bookings!: Booking[]
  @Input() required!: boolean
  @Input() expanded = false
  @ViewChild(MatCalendar) calendar!: MatCalendar<Date>;
  startDate: any
  endDate: any
  @Input() bookeddates: Booking[] | undefined;
  rangeFilter!: ((date: Date) => boolean);
  now = new Date()

  // initial filter function always returns true
  constructor(public Client: Client) { }
  ngOnInit(): void {

    this.initRangeFilter()

  }

  initRangeFilter() {
    console.log(this.bookeddates)
    let y = this.bookeddates
    if (y) {
      this.rangeFilter = function (date: Date): boolean {

        //get booked dates for product id
        let booked =
          y!.some(i => {

            let x = (moment(i.startOfHire).isBefore(moment(date).startOf("day"))
             && moment(i.endOfHire).isAfter(moment(date).endOf('day')))
            console.log(i.startOfHire,i.endOfHire, date, x)
            return !x
            //i.startOfHire! >= date && i.endOfHire! <= date

          }
          )
        return booked;
      }
    }

  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      const date = cellDate.getDate();

      // Highlight the 1st and 20th day of each month.
      return date === 1 || date === 20 ? 'example-custom-date-class' : '';
    }

    return '';
  };




}

