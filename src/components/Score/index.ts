declare global {
    interface Window {
        score: number;
        bestScore: number;
    }
}

class Score{
  context : CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;

  score = 0;
  bestScore = window.bestScore;
  y = 50;
  color = 'white'
  x = 0;

  constructor(context : CanvasRenderingContext2D, canvas: HTMLCanvasElement){
    this.context = context
    this.canvas = canvas

    this.x = canvas.width - 15
  }

  reset(){
    window.bestScore = this.score > window.bestScore? this.score : window.bestScore;
    window.score = this.score
    this.score = 0;
  }

  render(){
    this.context.font = '35px "Dosis"';
    this.context.fillStyle = this.color;
    this.context.textAlign = 'right'
    this.context.fillText(`${this.score}s`, this.x, this.y);
  }

  update(frames : number, scoreSound : HTMLAudioElement){
    const pipeDelay = 60;
    const hasScored = frames % pipeDelay === 0;

      if(hasScored){
        this.score += 1;
        this.color = 'white'
        if(this.score % 10 === 0) { this.color = 'goldenrod'; scoreSound.play()}
        window.bestScore = window.bestScore < this.score ? this.score : window.bestScore;
        window.score = this.score
      }
  }
}

export default Score;
