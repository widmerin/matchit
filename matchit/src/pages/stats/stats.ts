import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html'
})
export class StatsPage {
  players: Observable<any[]>;
  playerStat: any;
  canvasSize = 100;

  // 'plug into' DOM canvas element using @ViewChild
  @ViewChild('canvas') canvasEl: ElementRef;

  // Reference Canvas object
  private _CANVAS: any;

  // Reference the context for the Canvas element
  private _CONTEXT: any;

  constructor(public navCtrl: NavController, public firebaseService: FirebaseServiceProvider) {
    this.players = this.firebaseService.getItems();

    this.playerStat = {
      key: null,
      img: './assets/imgs/avatar.png',
      name: ''
    };
  }

  /**
    * Implement functionality as soon as the template view has loaded
    *
    * @public
    * @method ionViewDidLoad
    * @return {none}
    */
  ionViewDidLoad(): void {
    this._CANVAS = this.canvasEl.nativeElement;
    this._CANVAS.width = this.canvasSize;
    this._CANVAS.height = this.canvasSize;

    this.initialiseCanvas();
    this.progressPie(this._CANVAS, 0.65); //TODO: second argument is percent of Wins
  }

  /**
    * Detect if HTML5 Canvas is supported and, if so, configure the
    * canvas element accordingly
    *
    * @public
    * @method initialiseCanvas
    * @return {none}
    */
  initialiseCanvas(): void {
    if (this._CANVAS.getContext) {
      this.setupCanvas();
    }
  }

  /**
      * Configure the Canvas element
      *
      * @public
      * @method setupCanvas
      * @return {none}
      */
  setupCanvas(): void {
    this._CONTEXT = this._CANVAS.getContext('2d');
    this._CONTEXT.fillStyle = "#ffffff";
    this._CONTEXT.fillRect(0, 0, this.canvasSize, this.canvasSize);
  }

  /**
    * Reset the Canvas element/clear previous content
    *
    * @public
    * @method clearCanvas
    * @return {none}
    */
  clearCanvas(): void {
    this._CONTEXT.clearRect(0, 0, this._CANVAS.width, this._CANVAS.height);
    this.setupCanvas();
  }

  progressPie(canvas, progressFraction) {
    let radius = 0;
    let centerx = 0;
    let centery = 0;
    const initialWidth = canvas.width;
    //const getCSS = propname => window.getComputedStyle(canvas, null).getPropertyValue(propname).toString().trim();
    const fullRad = 2.0 * Math.PI;
    const adjust = fraction => (fraction - 0.25) * fullRad;

    const ctx = canvas.getContext('2d');

    function redim() {
      centerx = canvas.width / 2;
      centery = canvas.height / 2;
      radius = Math.min(centerx, centery);
    }

    function pieSlice(start, end, radius, color) {
      ctx.beginPath();
      ctx.moveTo(centerx, centery);
      ctx.arc(centerx, centery, radius, adjust(start), adjust(end), false);
      const grad = ctx.createRadialGradient(centerx, centery, 0, centerx, centery, radius * 2);
      grad.addColorStop(0, "white");
      grad.addColorStop(1, color);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    function paint() {
      redim();

      // background circles
      const divider = Number(0.5);
      pieSlice(0, divider, radius, "red");
      pieSlice(divider, 1, radius, "blue");

      ctx.beginPath();
      ctx.moveTo(centerx, centery);
      ctx.arc(centerx, centery, radius * 0.9, adjust(0), adjust(progressFraction), false);
      ctx.fillStyle = "#74A0C2";
      ctx.fill();
    }
    paint();
    canvas.onresize = paint;
    canvas.onclick = _ => { // onclick just shows the pie in double the initial size, second click restores
      if (canvas.width > initialWidth) {
        canvas.width = initialWidth;
      } else {
        canvas.width = initialWidth * 2;
      }
      canvas.height = canvas.width;
      paint()
    }
  }

}
