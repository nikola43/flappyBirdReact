class Pipes{
  sprites: HTMLImageElement;
  context : CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;

  width = 52;
  height = 400;

  die = false;

  source1X = 52;
  source1Y = 169;

  source2X = 0;
  source2Y = 169;

  x = 0;
  y = 0;

  groupPipes : any = []

  constructor(sprites : HTMLImageElement, context : CanvasRenderingContext2D, canvas: HTMLCanvasElement){
    this.sprites = sprites
    this.canvas = canvas
    this.context = context
  }

  render(){
    this.groupPipes.forEach((pipes : any) => {
      const yRandom = pipes.y;
      const spacing  = 196;

      // Pipe Up
      const position1X = pipes.x;
      const position1Y = yRandom;
      this.context.drawImage(this.sprites, this.source1X, this.source1Y, this.width, this.height, position1X, position1Y, this.width, this.height)

      // Pipe Down
      const position2X = pipes.x;
      const position2Y = this.height + spacing + yRandom;
      this.context.drawImage(this.sprites, this.source2X, this.source2Y, this.width, this.height, position2X, position2Y , this.width, this.height);

      pipes.up = {
        x: position1X,
        y: this.height + position1Y
      }

      pipes.down = {
        x: position2X,
        y: position2Y
      }

    })
  }

  observerCollision(pipe: any, birdY: number, birdX: number, birdHeight : number, birdWidth : number){
    const headBird = birdY
    const downBird = birdY + birdHeight;

    if((birdX + birdWidth) >= pipe.x){
      if(headBird <= (pipe.up.y + 30)){
        return true;
      }
      if(downBird >= pipe.down.y){
        return true;
      }
    }
    return false;
  }

  resetPipes(){
    this.die = false;
    this.groupPipes = []
  }

  reset(bird : any){
    if(bird) {bird.reset()}
  }

  update(frames : number, birdY : number, birdX : number, birdHeight : number, birdWidth : number, fallSound : HTMLAudioElement, hitSound : HTMLAudioElement){

      if(this.die){
        window.currentScreen = window.endScreen;
        return;
      }

      const requestGenPipe = frames % 100 === 0;
      if(requestGenPipe){
        this.groupPipes.push({
          x: this.canvas.width,
          y: -120 * (Math.random() + 1),
        })
      }

      this.groupPipes.forEach((pipe : any) => {
        pipe.x = pipe.x - 2;

        if(this.observerCollision(pipe, birdY, birdX, birdHeight, birdWidth)){
          this.die = true;
          hitSound.play();
          fallSound.play();
          this.reset(null)
        }

        if(pipe.x + this.width <= 0){
          this.groupPipes.shift();
        }
      })
  }
}

export default Pipes
