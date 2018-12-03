import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, PopoverController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Media, MediaObject} from "@ionic-native/media";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {HttpClient} from "@angular/common/http";
import {RadioServiceProvider} from "../../providers/radio-service/radio-service";
import {Geolocation} from "@ionic-native/geolocation";
import {File} from "@ionic-native/file";
import {MapPage} from "../map/map";

/**
 * Generated class for the DeduPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dedu',
  templateUrl: 'dedu.html',
})
export class DeduPage {

  data : FormGroup;
  Imgs :any []=[];

  recording: boolean = false;
  filePath: string;
  fileName: string;
  audio: MediaObject;
  audioList: any[] = [];

  latitude :any ;
  longitude:any;

  imageURI:any;

  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  };

  constructor(public http: HttpClient,public Service : RadioServiceProvider , private formBuilder: FormBuilder ,public geolocation: Geolocation,public platform: Platform,private camera: Camera,public navCtrl: NavController, public navParams: NavParams,private media: Media, private file: File,public popoverCtrl: PopoverController) {
    this.data = this.formBuilder.group({
      Nom: ['', Validators.required],
      prenom: ['', Validators.required],
      description: [''],
      file: [''],
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad InterventionPage');
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
      this.latitude = data.coords.latitude;
      this.longitude = data.coords.longitude;

      console.log(data);
    });
  }

  openCamera(){
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

    }).catch((error) => {
      console.log('Error getting location', error);
    });

    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = "data:image/jpeg;base64," + imageData;

      this.Imgs.push(base64Image);


    }, (err) => {
      // Handle error
    });
  }

  getAudioList() {
    if(localStorage.getItem("audiolist")) {
      this.audioList = JSON.parse(localStorage.getItem("audiolist"));
      console.log(this.audioList);
    }
  }


  ionViewWillEnter() {
    this.getAudioList();
  }




  startRecord() {
    if (this.platform.is('ios')) {
      this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.3gp';
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.audio = this.media.create(this.filePath);
    } else if (this.platform.is('android')) {
      this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.3gp';
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.audio = this.media.create(this.filePath);
    }
    this.audio.startRecord();
    this.recording = true;
  }

  stopRecord() {
    this.audio.stopRecord();
    let data = { filename: this.fileName };
    this.audioList.push(data);
    localStorage.setItem("audiolist", JSON.stringify(this.audioList));
    this.recording = false;
    this.getAudioList();
  }

  playAudio(file,idx) {
    if (this.platform.is('ios')) {
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + file;
      this.audio = this.media.create(this.filePath);
    } else if (this.platform.is('android')) {
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + file;
      this.audio = this.media.create(this.filePath);
    }
    this.audio.play();
    this.audio.setVolume(0.8);
  }


  callMap(myEvent){
    let data  ={
      latitude :this.latitude ,
      longitude:this.longitude
    };

    let popover = this.popoverCtrl.create(MapPage,{ Data : data});
    popover.present({
      ev: myEvent
    });
  }


  logForm() {
    console.log(this.data);



    let postData = {
      'file': this.data.value.file,
      'num_patient': 50,
    };

    let urlSearchParams = new URLSearchParams();

    urlSearchParams.append('file',this.data.value.file);
    urlSearchParams.append('num_patient', '2');

    let reqOpts = {
      headers: {
        'Content-Type':'multipart/form-data',
      },
      withCredentials: true
    };
    // this.http.post("http://127.0.0.1:3000/customers", postData, requestOptions)
    //   .subscribe(data => {
    //     console.log(data['_body']);
    //   }, error => {
    //     console.log(error);
    //   });


    this.http.post('http://192.168.43.19:8187/Radio/uploadFile',postData).subscribe(
      data =>{
        console.log(data);
      },err=>{

      }
    )
  }



}
