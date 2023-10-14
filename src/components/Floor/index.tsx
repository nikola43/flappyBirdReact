class Floor{
  sprites: HTMLImageElement;
  context : CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;

  width = 224;
  height = 44;
  sourceX = 0;
  sourceY = 610;
  x = 0;
  y = 0;

  constructor(sprites : HTMLImageElement, context : CanvasRenderingContext2D, canvas: HTMLCanvasElement){
    this.sprites = sprites
    this.canvas = canvas
    this.context = context

    this.y = canvas.height
  }

  render(){
    this.context.drawImage(this.sprites, this.sourceX, this.sourceY, this.width, this.height, this.x, (this.y - this.height), (this.width * 3.3), this.height)
  }

  update(){
    let moving = 1;
    let repeat = this.width / 1.6;
    let move = this.x - moving

    this.x = move % repeat
  }
}

export default Floor
