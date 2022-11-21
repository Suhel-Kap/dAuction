import { Title } from "@mantine/core";
import Head from "next/head";
import { Layout } from "../components/Layout";

export default function Home() {
  return (
    <>
      <Head>
        <title>Withdraw Funds</title>
      </Head>
      <Layout>
        <Title>Withdraw Your Funds</Title>
      </Layout>
    </>
  );
}
