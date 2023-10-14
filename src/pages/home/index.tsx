import React, { ReactElement, useRef, useEffect, useState } from 'react'

import { Container } from './styles'

import bird from '../../components/Bird'
import background from '../../components/Background'
import floor from '../../components/Floor'
import menu from '../../components/Menu'
import pipes from '../../components/Pipes'
import score from '../../components/Score'
import endMenu from '../../components/EndMenu'
import { useHistory } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import PacManGameAbi from "../../blockchain/abi/PacManGame.json";
interface IScreen {
  renderCanvas: () => void;
  updateCanvas: () => void;
  click?: () => void;
}

declare global {
  interface Window {
    currentScreen: IScreen;
    startScreen: IScreen;
    endScreen: IScreen
    score: number;
    die: boolean;
  }
}

window.score = 0;
window.bestScore = 0;

export default function GamePage(): ReactElement {

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [canvasEl, setCanvas] = useState<HTMLCanvasElement | null>()
  const [context, setContext] = useState<CanvasRenderingContext2D | null>()
  const [gameSprite, setGameSprite] = useState<HTMLImageElement | null>()
  const [gameSounds, setGameSounds] = useState<HTMLAudioElement[] | null>(null)
  const history = useHistory();

  const [gamePrice, setGamePrice] = useState();
  const [gameStarted, setGameStarted] = useState(false);

  const { active, account, library, activate, deactivate, chainId } =
    useWeb3React();
  const selectedNetwork = 80001;

  let pancmanGameAddress = "0x0000fF0d724a25FBBcB1504642CF1713D3c13fac";
  let pancmanGameContract: any;

  if (account && library) {
    pancmanGameContract = new library.eth.Contract(
      PacManGameAbi,
      pancmanGameAddress
    );
  }


  let frames = 0;

  const switchScreen = (newScreen: IScreen) => {
    window.currentScreen = newScreen
  }

  const getGamePrice = async () => {
    return pancmanGameContract.methods
      .playPrice()
      .call()
      .then((res: any) => {
        console.log("res", res);
        return res;
      });
  };
  const isGameStarted = async () => {
    return pancmanGameContract.methods
      .gameStarted()
      .call()
      .then((res: any) => {
        console.log("res", res);
        return res;
      });
  };

  useEffect(() => {




    if (account && library) {
      isGameStarted().then((res) => {
        console.log("isGameStarted", res);

      });

      getGamePrice().then((res) => {
        setGamePrice(res);
        console.log("getGamePrice", res);
      });
    }
  }, [activate, chainId, account]);

  useEffect(() => {
    const isPaid = localStorage.getItem("gameId");
    if (isPaid == undefined || isPaid?.length === 0) {
      history.push("/");
    }
  }, [])

  useEffect(() => {



    let canvas = canvasRef.current;
    let context = canvas?.getContext('2d');
    let sprites = new Image();
    let sounds: HTMLAudioElement[] = [];

    sprites.src = 'game.png';

    sounds[0] = new Audio();
    sounds[0].src = 'efeitos_caiu.wav'
    sounds[1] = new Audio();
    sounds[1].src = 'efeitos_hit.wav'
    sounds[2] = new Audio();
    sounds[2].src = 'efeitos_ponto.wav'
    sounds[3] = new Audio();
    sounds[3].src = 'efeitos_pulo.wav'

    sprites.onload = () => {
      setGameSounds(sounds)
      setGameSprite(sprites)
      setCanvas(canvas)
      setContext(context)
    }

  }, [])

  useEffect(() => {
    if (gameSprite && context && canvasEl && gameSounds) {

      let Bird = new bird(gameSprite as HTMLImageElement, context as CanvasRenderingContext2D, canvasEl as HTMLCanvasElement)
      let Background = new background(gameSprite as HTMLImageElement, context as CanvasRenderingContext2D, canvasEl as HTMLCanvasElement)
      let Floor = new floor(gameSprite as HTMLImageElement, context as CanvasRenderingContext2D, canvasEl as HTMLCanvasElement)
      let Menu = new menu(gameSprite as HTMLImageElement, context as CanvasRenderingContext2D, canvasEl as HTMLCanvasElement)
      let Pipes = new pipes(gameSprite as HTMLImageElement, context as CanvasRenderingContext2D, canvasEl as HTMLCanvasElement)
      let Score = new score(context as CanvasRenderingContext2D, canvasEl as HTMLCanvasElement)
      let EndMenu = new endMenu(gameSprite as HTMLImageElement, context as CanvasRenderingContext2D, canvasEl as HTMLCanvasElement)

      let gameScreen: IScreen = {
        renderCanvas: () => {
          Background.render();
          Bird.render();
          Pipes.render();
          Score.render();
          Floor.render();
        },
        click: () => {
          Bird.jumping(gameSounds[3]);
        },
        updateCanvas: () => {
          Floor.update();
          Bird.update(Floor.y, gameSounds[1]);
          Bird.animation(frames);
          Bird.fallAnimation(frames);
          Pipes.update(frames, Bird.y, Bird.x, Bird.height, Bird.width, gameSounds[0], gameSounds[1]);
          Score.update(frames, gameSounds[2]);
        }
      }

      let initScreen: IScreen = {
        renderCanvas: () => {
          Background.render();
          Floor.render();
          Menu.render();
          Bird.render();
        },
        click: () => {
          switchScreen(gameScreen)
        },
        updateCanvas: () => {
          Bird.animation(frames);
          Floor.update();
        }
      }

      let endScreen: IScreen = {
        renderCanvas: () => {
          Background.render();
          Pipes.render();
          EndMenu.render(window.bestScore, window.score);
          Floor.render();
          Bird.render();
        },
        click: () => {
          play().then(() => {
            console.log("play");
          })

          Score.reset();
          Bird.reset();
          Pipes.resetPipes();
          Pipes.reset(null);
          switchScreen(initScreen)



          //localStorage.setItem("gameId", "");
          //window.removeEventListener('click', () => { });
          //history.push("/");
        },
        updateCanvas: () => {
          Bird.update((Floor.y + 23), null);
        }
      }

      switchScreen(initScreen)
      window.startScreen = initScreen;
      window.endScreen = endScreen;
    }
  }, [gameSprite, context, canvasEl, gameSounds])

  useEffect(() => {
    if (window.currentScreen && gameSprite && context) {
      looping()
    }
  }, [gameSprite, context])

  window.addEventListener('click', async (e) => {

    if (window.currentScreen && window.currentScreen.click) {
      window.currentScreen.click()
    }

  })


  const playGame = async (gamePrice: any) => {
    return pancmanGameContract.methods
      .play()
      .send({ from: account, value: gamePrice })
      .then((res: any) => {
        console.log("res", res);
        return res;
      })
      .catch((ex: any) => {
        console.error(ex.message);
        return undefined;
      });
  };



  async function play() {
    await playGame(gamePrice).then((res) => {
      console.log("playGame", res);
      if (res !== undefined) {
        localStorage.setItem("gameId", res.transactionHash);
        history.push("/game");
      }
    })
  }



  const looping = () => {
    context?.clearRect(0, 0, canvasEl?.width as number, canvasEl?.height as number);

    frames += 1
    window.currentScreen?.renderCanvas();
    window.currentScreen?.updateCanvas();

    requestAnimationFrame(looping)

  }

  return (
    <Container className='display-flex'>
      <canvas width='518' height='540' ref={canvasRef} />
    </Container>
  )
}
