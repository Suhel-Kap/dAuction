import {Button, Container, Title, Center, Stack, Text} from "@mantine/core";
import Head from "next/head";
import {Layout} from "../components/Layout";
import {useAccount} from "wagmi";
import {useEffect, useState} from "react";
import {useContract} from "../hooks/useContract";
import {ethers} from "ethers";
import {showNotification} from "@mantine/notifications";

export default function Home() {
    const {isConnected, isConnecting, isDisconnected} = useAccount()
    const [balance, setBalance] = useState("0")
    const {getBalance, withdraw} = useContract()
    const {address} = useAccount()

    useEffect(() => {
        if (isDisconnected) {
            window.location.href = "/"
            alert("Please connect your wallet")
        }
        const getBal = async () => {
            const bal = await getBalance()
            setBalance(ethers.utils.formatEther(bal))
        }
        if(address)
            getBal().then()
    }, [isDisconnected, isConnected, isConnecting, address])

    const handleWithdraw = async () => {
        try{
            await withdraw()
            showNotification({
                title: "Success",
                message: "Withdrawn successfully",
            })
        } catch (e){
            console.log(e)
            showNotification({
                title: "Error",
                message: "Something went wrong. Check console for more details",
            })
        }
    }

    return (
        <>
            <Head>
                <title>Withdraw Funds</title>
            </Head>
            <Layout>
                <Container>
                    <Title>Withdraw Your Funds</Title>
                    <Center m={"lg"} p={"lg"}>
                        <Stack m={"lg"}>
                            <Text>
                                Your current balance is {balance} MATIC
                            </Text>
                            <Button onClick={async() => {
                                await handleWithdraw()
                            }}>
                                Withdraw Funds
                            </Button>
                        </Stack>
                    </Center>
                </Container>
            </Layout>
        </>
    );
}
