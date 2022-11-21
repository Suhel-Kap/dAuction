import { Title } from "@mantine/core";
import Head from "next/head";
import { Layout } from "../components/Layout";

export default function Home() {
    return (
        <>
            <Head>
                <title>Home</title>
            </Head>
            <Layout>
                <Title>Home</Title>
            </Layout>
        </>
    );
}
