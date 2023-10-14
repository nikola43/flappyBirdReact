class EndGame{
  sprites: HTMLImageElement;
  context : CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;

  width = 226;
  height = 200;
  sourceX = 134;
  bestScore = 0;
  score = 0;
  sourceY = 153;
  x = 0;
  y = 0;

  constructor(sprites : HTMLImageElement, context : CanvasRenderingContext2D, canvas: HTMLCanvasElement){
    this.sprites = sprites
    this.context = context
    this.canvas = canvas

    this.y = this.width
    this.x = (canvas.width / 2) - this.width / 2

  }

  render(bestScore : number, score : number){
    this.context.drawImage(this.sprites, this.sourceX, this.sourceY, this.width, this.height, this.x, (this.y - this.height), this.width, this.height)

    this.context.font = '30px "Dosis"';
    this.context.fillStyle = 'white';
    this.context.textAlign = 'right';

    this.context.fillText(`${score}s`, (this.x + this.width) - 40, (this.y - this.height) + (this.height / 2));
    this.context.fillText(`${bestScore}s`, (this.x + this.width) - 40, (this.y - this.height) + (this.height / 2) + 40);
  }
}

export default EndGame
