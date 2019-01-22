import {Component} from '@angular/core';
import {
  IonicPage,
  LoadingController,
  Platform,
  PopoverController,
  ToastController,
  Loading, AlertController, ViewController, NavController, NavParams
} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Media, MediaObject } from '@ionic-native/media';
import {File, FileEntry} from '@ionic-native/file';
import {GeolocationOptions, Geoposition} from '@ionic-native/geolocation';
import {MapPage} from "../map/map";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RadioServiceProvider} from "../../providers/radio-service/radio-service";
import {HttpClient} from "@angular/common/http";
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture';
import {PhotoViewer} from "@ionic-native/photo-viewer";
import { Sim } from '@ionic-native/sim';
/**
 * Generated class for the InterventionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface FileUpload {
  name :any,
  file :any
}

@IonicPage()
@Component({
  selector: 'page-intervention',
  templateUrl: 'intervention.html',
})
export class InterventionPage {

  data : FormGroup;


  public myPhoto: any;
  public error: string = "";
  private loading: Loading;

  recording: boolean = false;
  filePath: string;
  fileName: string;
  audio: MediaObject;

  public Imgs :any[] =[];
  public Videos :any[] =[];
  public Audios :any[] =[];
  public audioList: any[] = [];
  public FilesUpload: FileUpload[] = [];

  latitude :any ;
  longitude:any;

  imageURI:any;

  optionsG : GeolocationOptions;
  currentPos : Geoposition;

   options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
     encodingType: this.camera.EncodingType.JPEG,
     mediaType: this.camera.MediaType.PICTURE
  };

  constructor(public http: HttpClient,
              public Service : RadioServiceProvider ,
              private formBuilder: FormBuilder ,
              public platform: Platform,
              private camera: Camera,
              private sim: Sim,
              public viewCtrl: ViewController,
              private media: Media,
              private file: File,
              public navParams: NavParams,
              public popoverCtrl: PopoverController,
              private readonly loadingCtrl: LoadingController,
              private readonly toastCtrl: ToastController,
              private mediaCapture: MediaCapture,
              private alertCtrl: AlertController,
              private photoViewer: PhotoViewer) {


    let pos = this.navParams.get("Data");
    this.latitude = pos.latitude;
    this.longitude = pos.longitude;

    if(localStorage.getItem("data")) {
      let data = JSON.parse(localStorage.getItem("data"));
      console.log(data.Nom);
      this.data = this.formBuilder.group({
        Nom: [data.Nom, Validators.required],
        prenom: [data.prenom, Validators.required],
        description: [data.description],
        files: [''],
      });
    }else{
      this.data = this.formBuilder.group({
        Nom: ['', Validators.required],
        prenom: ['', Validators.required],
        description: [''],
        FilesUpload: [''],
      });
    }


    // SIM NUMBER
    this.sim.getSimInfo().then(
      (info) => console.log('Sim info: ', JSON.stringify(info["phoneNumber"])),
      (err) => console.log('Unable to get sim info: ', err)
    );

    this.sim.hasReadPermission().then(
      (info) => console.log('Has permission: ', info)
    );

    this.sim.requestReadPermission().then(
      () => console.log('Permission granted'),
      () => console.log('Permission denied')
    );

  }


  ionViewDidLoad() {

    console.log('ionViewDidLoad InterventionPage');

    // this.geolocation.getCurrentPosition().then((resp) => {
    //   // alert(JSON.stringify(resp));
    //
    //
    // }).catch((error) => {
    //   console.log('Error getting location', JSON.stringify(error));
    // });

  }


  getFiles() {
    if(localStorage.getItem("audiolist")) {
      // this.audioList = JSON.parse(localStorage.getItem("audiolist"));
      this.audioList = [];
    }
    if(localStorage.getItem("Imgs")) {
      this.Imgs = [];
    }
    if(localStorage.getItem("Videos")) {
      this.Videos = [];
    }
    if(localStorage.getItem("FilesUpload")) {
      this.FilesUpload = [];
    }

  }


  ionViewWillEnter() {
    this.getFiles();
  }


  ionViewDidEnter(){

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
    let data = {
      filename: this.fileName,
      src: 'file://'+(JSON.stringify(this.filePath)).toString().replace(/"/g,''),
      preload: 'metadata'};
    // this.audioList.push(data);
    this.audioList = [];
    this.audioList.push(data);
    this.Audios.push('file://'+(JSON.stringify(this.filePath)).toString().replace(/"/g,''));
    this.FilesUpload.push({file:'file://'+(JSON.stringify(this.filePath)).toString().replace(/"/g,''),name:''});
    // this.uploadData('file://'+(JSON.stringify(this.filePath)).toString().replace(/"/g,''));
    localStorage.setItem("audiolist", JSON.stringify(this.audioList));
    localStorage.setItem("FilesUpload", JSON.stringify(this.FilesUpload));
    this.recording = false;
    // this.getFiles();
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
      longitude:this.longitude,
      data: this.data.value
    };

    // alert(JSON.stringify(data));
    let popover = this.popoverCtrl.create(MapPage,{ Data : data});
    popover.present({
      ev: myEvent
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
      localStorage.setItem("Imgs", JSON.stringify(this.Imgs));
      this.FilesUpload.push({file:imageData,name:(<any>window).Ionic.WebView.convertFileSrc(imageData)});
      localStorage.setItem("FilesUpload", JSON.stringify(this.FilesUpload));
      // this.uploadData(imageData);
    }, error => {
      this.error = JSON.stringify(error);
    });
  }



  playViedo(){
    let options: CaptureImageOptions = { limit: 1 };
    this.mediaCapture.captureVideo(options)
      .then(
        (data: MediaFile[]) => {
          // console.log(data[0].fullPath);
          this.Videos.push((<any>window).Ionic.WebView.convertFileSrc(data[0].fullPath));
          localStorage.setItem("Videos", JSON.stringify(this.Videos));
          this.FilesUpload.push({file:data[0].fullPath,name:(<any>window).Ionic.WebView.convertFileSrc(data[0].fullPath)});
          localStorage.setItem("FilesUpload", JSON.stringify(this.FilesUpload));
          // this.uploadData(data[0].fullPath);
          },
            (err: CaptureError) => console.error(err)
      );
  }

  private showToast(ok: boolean,msg) {
    if (ok) {
      const toast = this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
    else {
      const toast = this.toastCtrl.create({
        message: msg,
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

  DeleteV(VideoPath){
    this.Videos.splice(this.Videos.indexOf(VideoPath), 1);
    const index = this.FilesUpload.findIndex(order => order.name === VideoPath);
    this.FilesUpload.splice(index, 1);
    localStorage.setItem("Videos", JSON.stringify(this.Videos));
    localStorage.setItem("FilesUpload", JSON.stringify(this.FilesUpload));
  }

  DeleteI(iMGPath){
    this.Imgs.splice(this.Imgs.indexOf(iMGPath), 1);
    const index = this.FilesUpload.findIndex(order => order.name === iMGPath);
    this.FilesUpload.splice(index, 1);
    localStorage.setItem("Imgs", JSON.stringify(this.Imgs));
    localStorage.setItem("FilesUpload", JSON.stringify(this.FilesUpload));
  }

  presentConfirm(path,type) {
    let alert = this.alertCtrl.create({
      title: 'Confirmer',
      message: 'Êtes-vous sûr de la suppression de cette jointure',
      buttons: [
        {
          text: 'Annule',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Valider',
          handler: () => {
            if(type == "video") {
              this.DeleteV(path);
            }else
              if(type == "audio"){
                this.audioList = [];
                localStorage.setItem("audiolist", JSON.stringify(this.audioList));
                const index = this.FilesUpload.findIndex(order => order.name === "");
                this.FilesUpload.splice(index, 1);
            }else{
                this.DeleteI(path);
              }

          }
        }
      ]
    });
    alert.present();
  }

  ViewImg(path){
    let found = this.FilesUpload.find(function(element) {
      return element.name == path;
    });
    this.photoViewer.show(found.file);

  }


  private uploadData(imageFileUri: any, num_intervention :any): void {
    this.error = "";

    this.file.resolveLocalFilesystemUrl(imageFileUri)
      .then(entry => (entry as FileEntry).file(file => this.readFile(file,num_intervention)))
      .catch(err => console.log(err));
  }

  private readFile(file: any, num_intervention :any) {
    console.log('ok0');
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log('ok1');
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {type: file.type});
      formData.append('file', imgBlob, file.name);
      formData.append('num_intervention',num_intervention);

      this.postData(formData);
    };
    reader.readAsArrayBuffer(file);
  }


  private postData(formData: FormData) {
    this.http.post<boolean>("https://medproapp.ddns.net/RadioBackend/uploadFile", formData)
      .subscribe((data : any)  =>{
          console.log("FIN UPLOAD FILE")
      }
      , err => {
          console.log(err);
        });
  }


  logForm(){

    if(this.data.valid && this.FilesUpload.length >0){

      localStorage.setItem("data", JSON.stringify(this.data.value));

      const formData = new FormData();
      formData.append('numIntervention','19006');
      formData.append('nom',this.data.value.Nom);
      formData.append('prenom',this.data.value.prenom);
      formData.append('description',this.data.value.description);
      formData.append('tel','');
      formData.append('localisationActuel','latitude:'+this.latitude + ',longitude:'+this.longitude);
      formData.append('localisationImage','');
      formData.append('type','En COURS');
      formData.append('etat','0');


      this.loading = this.loadingCtrl.create({
        content: 'Uploading...'
      });

      this.loading.present();



      this.Service.post("AjouterInterv",formData)
        .subscribe((data : any)  => {
          console.log(data.numIntervention);

          let IndexUploadFin = this.FilesUpload.length;
          for(let f in this.FilesUpload){

            //........................****/
            this.error = "";

            this.file.resolveLocalFilesystemUrl(this.FilesUpload[f].file)
              .then(entry => (entry as FileEntry).file(
                file =>{
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const formData = new FormData();
                    const imgBlob = new Blob([reader.result], {type: file.type});
                    formData.append('file', imgBlob, file.name);
                    formData.append('num_intervention',data.numIntervention);

                    this.Service.post("uploadFile", formData)
                      .subscribe((data : any)  =>{
                          IndexUploadFin--;
                          console.log("FIN UPLOAD FILE "+IndexUploadFin);

                          if(IndexUploadFin === 0){
                            this.loading.dismiss();
                            this.viewCtrl.dismiss();
                            this.showAlert('Intervention envoyer avec succces');
                          }
                        }
                        , err => {
                          console.log(err);
                          return;
                        });
                  };
                  reader.readAsArrayBuffer(file);
                } )
              ).catch(
                err => this.handleError(err));


          }


          this.Imgs =[];
          this.audioList =[];
          this.Videos =[];
          this.FilesUpload=[];

          // if(IndexUploadFin === 0){
          //   this.loading.dismiss();
          //   this.showAlert('Intervention envoyer avec succces !');
          // }

        },
            e => this.handleError(e));
    }else
      this.showToast(true,'il faut ajouter au moins une jointure!');
  }


  showAlert(msg) {
    const alert = this.alertCtrl.create({
      title: 'Message!',
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

}
