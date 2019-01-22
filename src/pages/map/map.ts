import {Component} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import L from "leaflet";
/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  map: L.Map;
  center: L.PointTuple;
  data :any;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.data = this.navParams.get("Data");

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.center = [this.data.latitude,this.data.longitude];

    this.leafletMap();
  }


  leafletMap(){
    this.map = L.map('map', {
      center: this.center,
      zoom: 13
    });

    var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap - ProSYS</a>'
    }).addTo(this.map);

    var marker = new L.Marker(this.center);
    this.map.addLayer(marker);

    marker.bindPopup("<p>Intervation par "+this.data.data.Nom+"  "+this.data.data.prenom+"</p>");
  }

  loadMap(){


        this.leafletMap();
      // let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      //
      // let mapOptions = {
      //   center: latLng,
      //   zoom: 15,
      //   mapTypeId: google.maps.MapTypeId.ROADMAP
      // };
      //
      // this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);


  }

}
