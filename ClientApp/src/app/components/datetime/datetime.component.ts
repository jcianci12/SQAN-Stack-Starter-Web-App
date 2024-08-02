import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-datetime',
  templateUrl: './datetime.component.html',
  styleUrls: ['./datetime.component.scss']
})
export class DatetimeComponent implements OnInit {


  _inputdate: Date | undefined

  set time(value: string) {
    let m = moment(value, "HH:mm");
    if (m.isValid()) {
     // m = moment(value, "HH:mm")
      let hours = m.get("hours");
      let minutes = m.get("minutes")
      console.log("value", value, "moment", m, "Hours", hours, "minutes", minutes)
      this.hours = hours;
      this.minutes = minutes;
      // this.inputdateChange.emit(this.inputdate)
      this.emittest(this.inputdate)

    }

  }
  get time() {
    if (this.inputdate) {
      let r = this.converttodoubledigits(this.inputdate.getHours()) + ":" + this.converttodoubledigits(this.inputdate.getMinutes())
      console.log("returning :", r)
      return (r)
    }
    else {
      return null
    }

  }

  get hours() { return (this._inputdate!?.getHours()) }
  set hours(value: number) {
    console.log("setting hours prop", value)
    this._inputdate?.setHours(value)
    //let d = moment(this.inputdate).toDate()
    //this.inputdate = d
    //this.inputdateChange.emit(this.inputdate)
  }

  get minutes() { return 0 }
  set minutes(value: number) {
    console.log("setting minutes prop", value)
    this._inputdate?.setMinutes(value)
    //let d = moment(this._inputdate).toDate()
    //this._inputdate = d
    // this.inputdateChange.emit(this._inputdate)
  }

  get dateproperty() { return this.inputdate! }
  set dateproperty(value: Date) {
    console.log("setting date prop", value)
    let d = new Date(value.getFullYear(), value.getMonth(), value.getDate(), this.hours, this.minutes)
    this.inputdate = d
    //this.inputdateChange.emit(this._inputdate)
  }
  @Input() min: Date | undefined
  @Input() max: Date | undefined

  get _minhours(): string {
    return this.min ? this.converttodoubledigits(this.min.getHours()) : "00"
  }
  get _maxhours(): string {
    return this.max ? this.converttodoubledigits(this.max.getHours()) : "24"
  }
  converttodoubledigits(value: number) {
    return ('0' + value).slice(-2)
  }

  @Input() set inputdate(value: Date) {
    if(value){
          this._inputdate = value

    }
    else{
      this._inputdate = new Date()
    }
    //this.inputdateChange.emit(this.inputdate)
    this.emittest(this.inputdate)
  }
  get inputdate() { return this._inputdate }

  @Output() inputdateChange = new EventEmitter<Date>()
  @Input() text!: string

  @Output() emittestChange = new EventEmitter<string>()
  constructor() { }

  ngOnInit(): void {

    //this.inputdateChange.emit(this.inputdate)
    this.emittest(this.inputdate)
  }
  emittest(value) {
    this.emittestChange.emit(value)
    this.inputdateChange.emit(value)
  }
}
