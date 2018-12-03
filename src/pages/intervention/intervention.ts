import {Component} from '@angular/core';
import {
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  Platform,
  PopoverController,
  ToastController,
  Loading
} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Media, MediaObject } from '@ionic-native/media';
import {File, FileEntry} from '@ionic-native/file';
import { Geolocation } from '@ionic-native/geolocation';
import {MapPage} from "../map/map";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RadioServiceProvider} from "../../providers/radio-service/radio-service";
import {HttpClient} from "@angular/common/http";
import {catchError, finalize} from "rxjs/operators";
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture';

/**
 * Generated class for the InterventionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-intervention',
  templateUrl: 'intervention.html',
})
export class InterventionPage {

  data : FormGroup;
  public Imgs :any[] =[];

  public myPhoto: any;
  public error: string;
  private loading: Loading;

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

  constructor(public http: HttpClient,
              public Service : RadioServiceProvider ,
              private formBuilder: FormBuilder ,
              public geolocation: Geolocation,
              public platform: Platform,
              private camera: Camera,
              public navCtrl: NavController,
              public navParams: NavParams,
              private media: Media,
              private file: File,
              public popoverCtrl: PopoverController,
              private readonly loadingCtrl: LoadingController,
              private readonly toastCtrl: ToastController,
              private mediaCapture: MediaCapture) {

    this.data = this.formBuilder.group({
      Nom: ['', Validators.required],
      prenom: ['', Validators.required],
      description: [''],
      file: [''],
    });

    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

    }).catch((error) => {
      console.log('Error getting location', error);
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
    // this.audioList.push(data);
    this.audioList = [];
    this.audioList.push(data);
    this.uploadPhoto('file://'+(JSON.stringify(this.filePath)).toString().replace(/"/g,''));
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


    let reqOpts = {
      headers: {
        'Content-Type':'multipart/form-data',
        'Accept': 'application/json, text/javascript, */*; q=0.01'
      },
      withCredentials: true
    };

      this.http.post("https://medproapp.ddns.net/Clinique/uploadFile", postData, reqOpts)
        .subscribe(data => {
          console.log(data['_body']);
        }, error => {
          console.log(error);
        });

  }

  takePhoto() {
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG
    }).then((imageData) => {
      this.Imgs.push((<any>window).Ionic.WebView.convertFileSrc(imageData));
      this.uploadPhoto(imageData);
    }, error => {
      this.error = JSON.stringify(error);
    });
  }

  private uploadPhoto(imageFileUri: any): void {
    this.error = null;
    this.loading = this.loadingCtrl.create({
      content: 'Uploading...'
    });

    this.loading.present();

    this.file.resolveLocalFilesystemUrl(imageFileUri)
      .then(entry => (entry as FileEntry).file(file => this.readFile(file)))
      .catch(err => console.log(err));
  }

  private readFile(file: any) {
    console.log('ok0');
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log('ok1');
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {type: file.type});
      formData.append('file', imgBlob, file.name);
      formData.append('num_patient','17000067');

      this.postData(formData);
    };
    reader.readAsArrayBuffer(file);
  }


  private postData(formData: FormData) {
    this.http.post<boolean>("https://medproapp.ddns.net/Clinique/uploadFile", formData)
      .pipe(
        catchError(e => this.handleError(e)),
        finalize(() => this.loading.dismiss())
      )
      .subscribe((ok : boolean)  => this.showToast(ok));
  }

  playViedo(){
    let options: CaptureImageOptions = { limit: 1 };
    this.mediaCapture.captureVideo(options)
      .then(
        (data: MediaFile[]) => {
          console.log(data[0].fullPath);
          this.uploadPhoto(data[0].fullPath);
          },
            (err: CaptureError) => console.error(err)
      );
  }

  private showToast(ok: boolean) {
    if (ok) {
      const toast = this.toastCtrl.create({
        message: 'Upload successful',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
    else {
      const toast = this.toastCtrl.create({
        message: 'Upload failed',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
  }

  private handleError(error: any) {
    const errMsg = error.message ? error.message : error.toString();
    this.error = errMsg;
    return errMsg;
  }


}
