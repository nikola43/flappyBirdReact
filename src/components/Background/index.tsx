class Background{
  sprites: HTMLImageElement;
  context : CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;

  width = 275;
  height = 194;
  sourceX = 390;
  sourceY = 0;
  x = 0;
  y = 0;

  constructor(sprites : HTMLImageElement, context : CanvasRenderingContext2D, canvas: HTMLCanvasElement){
    this.sprites = sprites
    this.context = context
    this.canvas = canvas
    this.y = canvas.height
  }

  render(){

    this.context.fillStyle = '#70c5ce';
    this.context.fillRect(0,0, this.canvas.width, this.canvas.height)

    this.context.drawImage(this.sprites, this.sourceX, this.sourceY, this.width, this.height, this.x, (this.y - this.height), this.width, this.height)
    this.context.drawImage(this.sprites, this.sourceX, this.sourceY, this.width, this.height, (this.x + this.width), (this.y - this.height), this.width, this.height)
  }
}

export default Background
