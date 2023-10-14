class Menu{
  sprites: HTMLImageElement;
  context : CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;

  width = 174;
  height = 152;
  sourceX = 134;
  sourceY = 0;
  x = 0;
  y = 50;

  constructor(sprites : HTMLImageElement, context : CanvasRenderingContext2D, canvas: HTMLCanvasElement){
    this.sprites = sprites
    this.context = context
    this.canvas = canvas
    this.x = (canvas.height / 2) - this.width / 1.7
  }

  render(){
    this.context.drawImage(this.sprites, this.sourceX, this.sourceY, this.width, this.height, this.x, this.y, this.width, this.height)
  }
}

export default Menu;
