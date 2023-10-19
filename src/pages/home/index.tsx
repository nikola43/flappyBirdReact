import React, { ReactElement, useRef, useEffect, useState } from 'react'

import { Container } from './styles'

import bird from '../../components/Bird'
import background from '../../components/Background'
import floor from '../../components/Floor'
import menu from '../../components/Menu'
import pipes from '../../components/Pipes'
import score from '../../components/Score'
import endMenu from '../../components/EndMenu'
import { useWeb3React } from "@web3-react/core";
import { injected } from "../../blockchain/metamaskConnector";
import GameAbi from "../../blockchain/abi/GameAbi.json";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import style from "./table.module.css";

interface IScreen {
  renderCanvas: () => void;
  updateCanvas: () => void;
  click?: () => void;
}

interface IRank {
  address: string;
  score: number;
}

declare global {
  interface Window {
    currentScreen: IScreen;
    startScreen: IScreen;
    endScreen: IScreen
    score: number;
    die: boolean;
    account: string;
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

  const [gamePrice, setGamePrice] = useState();
  const [gameEnabled, setGameEnabled] = useState(false);
  const [highscore, setHighscore] = useState(0);
  const apiUrl = "https://flappy-api-9iej.vercel.app/updateWinnerScore"
  const [rankList, setRankList] = useState([] as IRank[]);


  const { active, account, library, activate, deactivate, chainId } =
    useWeb3React();
  const selectedNetwork = 80001;

  let gameAddress = "0x03be71Ec45e755174abD71502B60B4F2aF815675";
  let gameContract: any;

  if (account && library) {
    gameContract = new library.eth.Contract(
      GameAbi,
      gameAddress
    );
  }

  let frames = 0;

  const switchScreen = (newScreen: IScreen) => {
    window.currentScreen = newScreen
  }

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
        click: async () => {
          // Score.reset();
          // Bird.reset();
          // Pipes.resetPipes();
          // Pipes.reset(null);
          // switchScreen(initScreen)

          console.log('highscore', highscore)
          console.log('bestScore', window.bestScore)
          if (Number(window.bestScore) > Number(highscore)) {
            console.log('New highscore!')
            const data = { winnerScore: window.bestScore, winnerAddress: window.account }
            console.log(data)

            const r = await axios.post(apiUrl, data).then((res) => {
              console.log(res)
              window.location.reload();
            }).catch((err) => {
              console.log(err)
              window.location.reload();
            })
          }

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

  const looping = () => {
    context?.clearRect(0, 0, canvasEl?.width as number, canvasEl?.height as number);

    frames += 1
    window.currentScreen?.renderCanvas();
    window.currentScreen?.updateCanvas();

    requestAnimationFrame(looping)

  }

  const getGamePrice = async () => {
    return await gameContract.methods
      .playPrice()
      .call()
  };
  const isGameStarted = async () => {
    return await gameContract.methods
      .gameStarted()
      .call()
  };

  const getRanking = async () => {
    return gameContract.methods
      .getRanking()
      .call()
      .then((res: any) => {
        return res;
      });
  };

  useEffect(() => {
    if (!active) {
      connectMetamask();
    }

    if (chainId !== selectedNetwork) {
      switchNetwork();
    }

    if (account && library) {
      isGameStarted().then((res) => {
        console.log("isGameStarted", res);
      });

      getGamePrice().then((res) => {
        console.log("getGamePrice", res);
        setGamePrice(res);
      });

      getHighScore().then((res) => {
        console.log(res)
        setHighscore(res)
      })

      getRanking().then((res1) => {
        console.log("getRanking", res1);

        let rankList = [];
        for (let i = 0; i < res1.length; i++) {
          console.log("res1[i]", res1[i]);

          rankList.push({
            address: res1[i][0],
            score: res1[i][1],
          });

        }


        rankList.sort((a, b) => {
          return b.score - a.score;
        });
        console.log("rankList", rankList);
        setRankList(rankList);


      });
    }
  }, [activate, chainId, account]);

  const toHex = (num: string) => {
    const val = Number(num);
    return "0x" + val.toString(16);
  };

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(selectedNetwork.toString()) }],
      });
    } catch (switchError: any) {
      console.log(switchError);

      if (switchError.code === 4902) {
        //await addNetwork(selectedNetwork.toString());
      }
    }
  };


  async function connectMetamask() {
    try {
      if (
        window.ethereum &&
        window.ethereum.networkVersion !== selectedNetwork.toString()
      ) {
        switchNetwork();
      }

      await activate(injected, undefined, true);
      localStorage.setItem("isWalletConnected", "true");
      localStorage.setItem("connector", "injected");
    } catch (ex) {
      console.log("Please install Metamask");
      console.log(ex);
    }
  }

  function getWalletAbreviation(walletAddress: string) {
    if (walletAddress !== null && walletAddress !== undefined) {
      return walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);
    }
    return "";
  }

  async function disconnect() {
    try {
      deactivate();
      localStorage.setItem("isWalletConnected", "false");
      localStorage.removeItem("connector");
    } catch (ex) {
      console.log(ex);
    }
  }

  const getHighScore = async () => {
    return gameContract.methods
      .highScore()
      .call()
      .then((res: any) => {
        console.log("res", res);
        return res;
      });
  };

  function getRankEmoji(rank: number) {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "";
    }
  }




  return (
    <Container className='display-flex' >
      <div><Toaster /></div>
      <canvas width='518' height='540' ref={canvasRef} onClick={async (e) => {
        if (!gameEnabled) {
          await gameContract.methods
            .play()
            .send({ from: account, value: gamePrice })
            .then((res: any) => {
              console.log("res", res);
              setGameEnabled(true);
              toast.success('Game started!')
            }, (err: any) => {
              console.log("err", err);
              toast.error(err.message || 'Error')
            })
          window.account = account!;
          //setGameEnabled(true);
        }

        if (!gameEnabled) {
          e.preventDefault();
          return;
        }

        window.addEventListener('click', async () => {
          if (window.currentScreen && window.currentScreen.click) {
            window.currentScreen.click()
          }
        })
      }}>
      </canvas>

      <div className={style.rankContainer}>
        <h1 style={{ color: 'white' }}>Leaderboard</h1>

        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Wallet</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {rankList.map((row, index) => {
              return (
                <tr key={index}>
                  {<td>{index + 1}  {getRankEmoji(index + 1)}</td>}
                  <td>{row.address}</td>
                  <td>{row.score}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </Container>
  )
}

/*
      <button
        onClick={active ? disconnect : connectMetamask}
        style={{ color: "black", cursor: "pointer", marginTop: "20px" }}
      >
        {active && account
          ? `Connected: ${getWalletAbreviation(account!)}`
          : "Connect Metamask"}
      </button>
*/

/*
 getHighScore().then((res) => {
        console.log(res)
        console.log(highscore)
        if (Number(highscore) > Number(res)) {
          console.log('New highscore!')
          fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ winnerScore: highscore, winnerAddress: account }),
          })
            .then(response => response.json())
            .then(data => {
              console.log('Success:', data);
              toast.success('New highscore!')
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }
      })
*/