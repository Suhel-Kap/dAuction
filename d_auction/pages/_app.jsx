import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import "@rainbow-me/rainbowkit/styles.css";
import {
    getDefaultWallets,
    RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { NotificationsProvider } from "@mantine/notifications";

export default function App(props) {
    const { Component, pageProps } = props;
    const { chains, provider, webSocketProvider } = configureChains(
        [chain.polygonMumbai],
        [
            alchemyProvider({
                apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
            }),
            publicProvider(),
        ]
    );
    const { connectors } = getDefaultWallets({
        appName: "Decentralised Auction",
        chains,
    });
    const wagmiClient = createClient({
        autoConnect: true,
        connectors,
        provider,
        webSocketProvider,
    });

    return (
        <>
            <Head>
                <title>The Crypto Studio</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
                <meta
                    name={"description"}
                    content={
                        "This is a place where you can create tradable, digital assets from any piece of audio. What’s more, you don’t need to be an expert to use this great new app.\n"
                    }
                />
                <meta
                    property={"og:title"}
                    content={
                        "This is a place where you can create tradable, digital assets from any piece of audio. What’s more, you don’t need to be an expert to use this great new app.\n"
                    }
                />
                <meta
                    property={"og:description"}
                    content={
                        "This is a place where you can create tradable, digital assets from any piece of audio. What’s more, you don’t need to be an expert to use this great new app.\n"
                    }
                />
                <meta
                    property={"og:url"}
                    content={"https://the-crypto-studio-20be90.spheron.app"}
                />
                <meta property="og:type" content="website" />
            </Head>

            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider chains={chains}>
                    <MantineProvider withGlobalStyles withNormalizeCS>
                        <NotificationsProvider>
                            <Component {...pageProps} />
                        </NotificationsProvider>
                    </MantineProvider>
                </RainbowKitProvider>
            </WagmiConfig>
        </>
    );
}
