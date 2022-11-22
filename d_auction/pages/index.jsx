import {Title, Text, Grid, Container} from "@mantine/core";
import Head from "next/head";
import {Layout} from "../components/Layout";
import {useEffect, useState} from "react";
import getProducts from "../utils/getProducts";
import NftCard from "../components/NftCard";
import {ethers} from "ethers";

export default function Home() {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        getProducts().then((products) => setProducts(products));
    }, [])
    console.log(products);
    let productcards
    if (products.length > 0) {
        productcards = products.map((product) => {
            return (
                <Grid.Col key={product.tokenID} lg={4} md={6}>
                    <NftCard tokenId={product.tokenID} basePrice={ethers.utils.formatEther(product.basePrice)}
                             description={product.description} image={product.image} name={product.name}
                             endDate={product.endDate} owner={product.owner} startDate={product.startDate}/>
                </Grid.Col>
            )
        })
    } else {
        productcards = <Text>No products found</Text>
    }
    return (
        <>
            <Head>
                <title>Home</title>
            </Head>
            <Layout>
                <Container>
                    <Grid gutter={"xl"}>
                        {productcards}
                    </Grid>
                </Container>
            </Layout>
        </>
    );
}
