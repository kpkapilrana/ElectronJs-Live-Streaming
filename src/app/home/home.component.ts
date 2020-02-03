import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormsModule, Validators } from '@angular/forms';
import { Observable, fromEvent, merge, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { ElectronService } from '../core/services';
import { desktopCapturer } from 'electron';
import { MatCheckboxChange } from '@angular/material';
declare var WebRTCAdaptor: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild("localVideo", {static:false}) localVideo: ElementRef;
  // @ViewChild('remoteVideo', {static:false}) remoteVideo: ElementRef;
  streamName = new FormControl('test',[Validators.required]);
  share = new FormControl(null);
  formGroup: FormGroup;
  webRTCAdaptor: any;
  btnDisabled = true;
  pc_config = null;
  availableDevices: any[] = [];
	sdpConstraints = {
		OfferToReceiveAudio : false,
		OfferToReceiveVideo : false

	};
	mediaConstraints = {
		video : true,
		audio : true
  };
  
  // mediaConstraints2 = {
  //   audio:false,
  //   video:{
  //     chromeMediaSource: 'desktop',
  //     chromeMediaSourceId: source.id,
  //     minWidth: 1280,
  //     maxWidth: 1280,
  //     minHeight: 720,
  //     maxHeight: 720
  //   }
  // }
  hideFirstWindow: boolean= true;
  hideSecondWindow: boolean= false;
  hideThirdWindow: boolean= false;
  online$: Observable<boolean>;
  isPublish = false;
  sourceId: any;
  constructor(
    private fb: FormBuilder,
    public electronService: ElectronService
  ) {
      merge(
        of(navigator.onLine),
        fromEvent(window, 'online').pipe(mapTo(true)),
        fromEvent(window, 'offline').pipe(mapTo(false))
      ).subscribe(status =>{
        console.log(status);
        
            // if(status ==) {

            // }
      })
    // this.hideSecondWindow = true;
  }
  
  ngOnInit() {
    if(navigator.onLine) {
      console.log("Online");
      
      this.hideFirstWindow = true;
      this.hideSecondWindow = false;
      this.hideThirdWindow = false;
    }else {
      console.log("Offline");
      this.hideFirstWindow = true;
      this.hideSecondWindow = false;
      this.hideThirdWindow = false;
    }
    this.createForm();
    if(navigator.getUserMedia){
      console.log("===.>", navigator.getUserMedia)
      navigator.mediaDevices.enumerateDevices().then(devices =>{
        this.availableDevices = devices;
        devices.forEach(function(device) {
            // this.availableDevices.push(device.kind);
          console.log(device.kind + ": " + device.label +
                      " id = " + device.deviceId);
        });
          
      })
    }
    // this.intialization();
    console.log("Adapter",this.webRTCAdaptor);
    
  }

  createForm() {
    this.formGroup = this.fb.group({
      'selectedDevices': [null,[Validators.required]],
      'category': [1,Validators.required]
    })
  }

  ngAfterViewInit() {
    // this.intialization();
  }
  
  submit() {
    console.log(this.formGroup.value);
    const selectedMedia: any = this.formGroup.get('selectedDevices').value;
    const selectedCategory = this.formGroup.get('selectedDevices').value;
    if (selectedMedia.includes("audioinput", "videoinput")) {
      this.mediaConstraints = {
            video : true,
            audio : true
          }
        }else if(selectedMedia.includes("videoinput")) {
          this.mediaConstraints = {
            video : true,
            audio : false
          }
        }else if(selectedMedia.includes("audioinput")) {
          this.mediaConstraints = {
            video : false,
            audio : true
          }
        }
        this.hideFirstWindow = false;
        this.hideSecondWindow = false;
        this.hideThirdWindow = true;
        this.intialization(this.mediaConstraints);
        //1. Live Stream   // 2. Share Screen // 3. Both
        // if(selectedCategory === 1) {
        //     this.publish(this.streamName.value);
            
        // }else if(selectedCategory === 2) {
        //     this.shareScreen();
        // }else if(selectedCategory === 3) {

        // }
        
  }
  
  publish(name) {
    this.webRTCAdaptor.publish(name);
    this.isPublish = true;
    // this.streamName.disable();
  }


  shareScreen(event: MatCheckboxChange) {
    let self = this;
    let n = <any>navigator;
    const _localVideo = this.localVideo.nativeElement;
    // const _video = this.remoteVideo.nativeElement;
    console.log(event);
    if(!this.streamName.value) {
        alert("Enter Stream Name");
        return;
    }
    if (event.checked === true) {
      desktopCapturer.getSources({ types: ['window', 'screen']}).then(async sources => {
        for(const source of sources) {
            if(source.name === 'Entire Screen') {
              self.sourceId = source.id;
              self.webRTCAdaptor.switchDesktopCapture(this.streamName.value, self.sourceId);
        }
      }
      });
    } else {
      self.webRTCAdaptor.switchVideoCapture(this.streamName.value);
    }    
  }

    feedback() {
      this.webRTCAdaptor.publish('stream111');
      this.webRTCAdaptor.switchDesktopCapture('stream111');
    }

  intialization(constraints: any) {
    let self = this;
    this.webRTCAdaptor = new WebRTCAdaptor({
      // websocket_url : "ws://" + location.hostname + ":"+location.port+"/WebRTCAppEE/",
      websocket_url: "ws://test.antmedia.io:5080/WebRTCAppEE/websocket",
      mediaConstraints : constraints,
      peerconnection_config : this.pc_config,
      sdp_constraints : this.sdpConstraints,
      localVideoId : "localVideo",
      remoteVideoId: "remoteVideo",
      callback : function(info) {
        if (info == "initialized") 
                          {
                            console.log("initialized");
                            self.btnDisabled = false;
          // this.webRTCAdaptor.publish('stream1');
        } 
                          else if (info == "publish_started") 
                          {
          //stream is being published 
          console.log("publish started");	
        } 
                          else if (info == "publish_finished") 
                          {
          //stream is finished
          console.log("publish finished");
        } 
                          else if (info == "screen_share_extension_available") 
                          {
                                  //screen share extension is avaiable
          console.log("screen share extension available");
        } 
                          else if (info == "screen_share_stopped") 
                          {
                                   //"Stop Sharing" is clicked in chrome screen share dialog
          console.log("screen share stopped");
        }
  
      },
      callbackError : function(error) {
        //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError
  
        console.log("error callback: " + error);
        alert(JSON.stringify(error));
      }
    });
    
  }
  onStart(){
      this.hideFirstWindow = false;
      this.hideSecondWindow = true;
  }

  onEnd(){
      this.electronService.remote.getCurrentWindow().close();
  }

  goBack() {
    this.hideSecondWindow = false;
  }

  stop(name) {
    this.webRTCAdaptor.stop(name);
    this.hideFirstWindow = true;
    this.hideSecondWindow = false;
    this.hideThirdWindow = false;
  }

  disableButton() {
    // console.log(this.streamName);
    
    if (this.btnDisabled === true && this.streamName.status === 'INVALID') {
        return true;
    }else {
      return false;
    }
    // return this.btnDisabled && this.streamName.valid;
  }

}
