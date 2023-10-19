import React, { ReactElement, useRef, useEffect, useState } from 'react'
import { useWeb3React } from "@web3-react/core";
import { injected } from "../../blockchain/metamaskConnector";
import GameAbi from "../../blockchain/abi/GameAbi.json";
import { useHistory } from "react-router-dom";

export default function Intro(): ReactElement {

    const history = useHistory();

    const [gamePrice, setGamePrice] = useState();
    const [gameStarted, setGameStarted] = useState(false);

    const { active, account, library, activate, deactivate, chainId } =
        useWeb3React();
    const selectedNetwork = 80001;

    let pancmanGameAddress = "0x03be71Ec45e755174abD71502B60B4F2aF815675";
    let pancmanGameContract: any;

    if (account && library) {
        pancmanGameContract = new library.eth.Contract(
            GameAbi,
            pancmanGameAddress
        );
    }

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
                setGamePrice(res);
                console.log("getGamePrice", res);
            });
        }
    }, [activate, chainId, account]);

    const getHighScore = async () => {
        return pancmanGameContract.methods
            .highScore()
            .call()
            .then((res: any) => {
                console.log("res", res);
                return res;
            });
    };

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
        // await playGame(gamePrice).then((res) => {
        //     console.log("playGame", res);
        //     if (res !== undefined) {
        //         localStorage.setItem("gameId", res.transactionHash);
        //         history.push("/game");
        //     }
        // })
        history.push("/game");
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

    return (
        <>
            <button onClick={play}>Play</button>
            <br></br>
            <button
                onClick={active ? disconnect : connectMetamask}
                style={{ color: "black", cursor: "pointer" }}
            >
                {active && account
                    ? `Connected: ${getWalletAbreviation(account!)}`
                    : "Connect Metamask"}
            </button>
        </>
    )

}