class Bird{
  sprites: HTMLImageElement;
  context : CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;

  width = 33;
  height = 24;
  sourceX = 0;
  sourceY = 0;
  gravity = 0.25;
  die = false;
  velocity = 0;
  jump = 4.5;
  x = 10;
  y = 10;
  rotateAngle = 0;

  currentFrame = 0;

  frames = [
    {spritesX: 0, spritesY: 0},
    {spritesX: 0, spritesY: 26},
    {spritesX: 0, spritesY: 52},
    {spritesX: 0, spritesY: 26}
  ]

  constructor(sprites : HTMLImageElement, context : CanvasRenderingContext2D, canvas: HTMLCanvasElement){
    this.sprites = sprites
    this.canvas = canvas
    this.context = context

    this.y = canvas.height / 2.5;
  }

  render(){
    this.context.save();
    this.context.translate(this.x + (this.width / 3), this.y);

    this.context.rotate(this.rotateAngle);
    this.context.translate(-this.x, -this.y);

    this.context.drawImage(this.sprites, this.sourceX, this.sourceY, this.width, this.height, this.x, this.y, this.width, this.height);
    this.context.restore();
  }

  observerCollision(targetY : number) : boolean{
      const birdY = (this.y - this.height);

      if(birdY >= (targetY - 115)){ this.die = true; return true;
      }else{ this.die = false; return false;}
  }


  update(floorY : number | null, fallSound : HTMLAudioElement | null){
    if(this.die){
      return;
    }

    if(floorY){
      if(this.observerCollision(floorY)){
        if(fallSound) {fallSound.play()}
        window.currentScreen = window.endScreen;
      }
    }

    this.velocity = this.velocity + this.gravity;
    this.y = this.y + this.velocity;
  }

  jumping(jumpSound : HTMLAudioElement){
    jumpSound.play();

    if(this.rotateAngle >= -1.1){ this.rotateAngle -= 0.1 };

    this.velocity = - this.jump
  }

  reset(){
    this.die = false;
    this.velocity = 0;
    this.x = 10;
    this.y = this.canvas.height / 2.5;
    this.rotateAngle = 0;
  }

  fallAnimation(frames : number){
    const delayFrames = 8;
    const delay = frames % delayFrames === 0;

    if(delay){
      if(this.rotateAngle <= 1.0){
        this.rotateAngle += 0.1
      }
    }
  }

  dieAnimation(frames : number, birdY : number, floorY : number){
    const delayFramesDie = 20;
    const delay = frames % delayFramesDie === 0;

    const framingDie = 10

    if(delay){
      if(this.y >= floorY){
          this.y -= framingDie
      }
    }
  }

  animation(frames : number){

    const { spritesX , spritesY } : any = this.frames[this.currentFrame];
    this.sourceX = spritesX;
    this.sourceY = spritesY;

    const delayFrames = 10;
    const delay = frames % delayFrames === 0;

    if(delay){
      const base = 1;
      const index = base + this.currentFrame;
      const baseIndex = this.frames.length;

      this.currentFrame =index % baseIndex;
    }
  }
}

export default Bird
