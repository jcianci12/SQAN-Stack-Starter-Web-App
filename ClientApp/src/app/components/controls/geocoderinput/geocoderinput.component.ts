import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { google } from "google-maps";
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
// declare const google: any;

@Component({
  selector: 'app-geocoderinput',
  templateUrl: './geocoderinput.component.html',
  styleUrls: ['./geocoderinput.component.scss']
})
export class GeocoderinputComponent implements OnInit {
  @Input() address: string | undefined
  @Input() fulladdress: boolean
  @Output() addressChange = new EventEmitter<google.maps.places.PlaceResult>()

  @Output() localityChange = new EventEmitter<string>()
  @Output() latChange = new EventEmitter<number>()
  @Output() lngChange = new EventEmitter<number>()
  @Output() fulladdresschange = new EventEmitter<string>()
@Output() latlngChange = new EventEmitter<number[]>()

  loading: boolean | undefined;
  @ViewChild("locationstringfield") locationstring!: ElementRef;

  @Input() options = new Options()
  constructor() { }

  ngOnInit(): void {
    if (!this.options) {
      this.options = new Options({
        fields: ["address_components", "formatted_address", "geometry"],
        types: ["(cities)"],
      })
    }
  }


  handleAddressChange(address: any) {
    // console.log(address)
    if(this.fulladdress){
      this.fulladdresschange.emit(address.formatted_address)
    }
    let a = address as google.maps.places.PlaceResult
    //emit the address object
    this.addressChange.emit(a)
    let lat = a.geometry?.location?.lat()
    let lng = a.geometry?.location?.lng()
    this.latChange.emit(lat)
    this.lngChange.emit(lng)
    this.latlngChange.emit([lat,lng])
    console.log(lat, lng)
    let suburb = a.address_components?.filter(i => i.types.some(t => t == "locality"))[0].long_name
    this.locationstring.nativeElement.value = suburb
    this.localityChange.emit(suburb)
  }



  getmylocation($event: any) {
    $event.preventDefault()
    $event.stopPropagation()
    this.loading = true
    this.getPosition().then(i => {
      let geocoder = new google.maps.Geocoder();
      const latlng = {
        lat: i.lat,
        lng: i.lng,
      };
      let request: google.maps.GeocoderRequest = { location: latlng }
      geocoder.geocode(request, (results, status) => {
        this.loading = false

        if (status == google.maps.GeocoderStatus.OK) {
          if (results && results[0]) {

            this.handleAddressChange(results[0])
          }
        }
      })


    })
  }


  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resp => {
        resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
      },
        err => {
          reject(err);
        });
    });

  }


}
