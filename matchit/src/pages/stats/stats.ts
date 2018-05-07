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
  scores: Observable<any[]>;
  scoresForPlayer: Observable<any[]>;
  winCountList: Observable<any[]>;
  gameCount: number;
  winCount: number;
  playerStat: any;
  canvasSize = 100;
 
  /**
      * Scores are stored like this:
      * 
      * {
          "Date" : 1523883941918,
          "playerLeft" : "-LADVQHHbBxSaRT5uM2u",
          "playerRight" : "-LADVQHN9hF26wQt4FkJ",
          "scoreLeft" : 15,
          "scoreRight" : 9
        }
      */


  // 'plug into' DOM canvas element using @ViewChild
  @ViewChild('canvas') canvasEl: ElementRef;

  // Reference Canvas object
  private _CANVAS: any;

  // Reference the context for the Canvas element
  private _CONTEXT: any;

  constructor(public navCtrl: NavController, public firebaseService: FirebaseServiceProvider) {
    this.players = this.firebaseService.getPlayers();
    this.scores = this.firebaseService.getScores();
    this.playerStat = {
      key: null,
      img: './assets/imgs/avatar.png',
      name: ''
    };
    this.gameCount = 0;
    this.winCount = 0;
  }

  getScoreForPlayer(key){
    return this.scores.map(items => 
      items.filter(score => score.playerLeft === key || score.playerRight === key));
  }

  getGameCount(){
    this.scoresForPlayer.subscribe(result => this.gameCount = result.length);
  }

  getWinCount(key){
    this.winCountList = this.scoresForPlayer.map(items => 
      items.filter(score => score.playerLeft === key && score.scoreLeft === 15 || score.playerRight === key && score.scoreRight === 15));
    
    this.winCountList.subscribe(result => this.winCount = result.length);
  }
  
  getPercentageWins(){
    console.log("wins"+this.winCount);
    console.log("games"+this.gameCount);
    console.log("%"+this.winCount/(this.gameCount/100));
    //fraction of wins (for pie) here in percent
    if (this.gameCount!==0){
      return this.winCount/(this.gameCount/100);
    } else {
      return 0; //if no games, percentage is not calculable
    }
  }

  getOpponentName(key: String): String{
    let player = this.players.map(player => player.find(player => player.key === key));
    // player.name ????
    return "Tubbel";
  }


  updateStats(): void {
    let key = this.playerStat.key;

      this.scoresForPlayer = this.getScoreForPlayer(key);
      this.getGameCount();
      this.getWinCount(key);

      this.clearCanvas();
      this.progressPie(this._CANVAS, this.getPercentageWins());
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
  }



  //******Progress Pie*******/
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
    const fullRad = 2.0 * Math.PI;
    const adjust = fraction => ((fraction/100)-0.25) * fullRad; //-0.25 to start at top

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
      //const grad = ctx.createRadialGradient(centerx, centery, 0, centerx, centery, radius * 2);
      //grad.addColorStop(0, "white");
      //grad.addColorStop(1, color);
      ctx.fillStyle = color;
      ctx.fill();
    }

    function paint() {
      redim();

      // red background 
      pieSlice(0, 100, radius*0.99, "red");
     
      //green wins
      ctx.beginPath();
      ctx.moveTo(centerx, centery);
      ctx.arc(centerx, centery, radius, adjust(0), adjust(progressFraction), false);
      ctx.fillStyle = "#6fffc8"; // matchitgreen
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
