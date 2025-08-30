import { Component } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { LottieModule } from 'ngx-lottie'; 
import { IonicModule } from '@ionic/angular'; 

@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.scss'],
  standalone: true, 
  imports: [ IonicModule ], 
})
export class SuccessModalComponent {

  constructor() { }
}