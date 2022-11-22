import {Button, Container, FileInput, Textarea, TextInput, Loader, Group, Title, NumberInput,} from "@mantine/core";
import { DateRangePicker } from "@mantine/dates";
import { IconUpload } from "@tabler/icons";
import Head from "next/head";
import { Layout } from "../components/Layout";
import { useState } from "react";
import { useContract } from "../hooks/useContract";
import useNftStorage from "../hooks/useNftStorage";
import { showNotification } from "@mantine/notifications";

export default function Home() {
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState([new Date(), new Date()]);
  const { listProduct } = useContract();
  const { uploadImage } = useNftStorage();

  const handleSubmit = async () => {
    if (!image || !name || !description || !price || !date) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    const cid = await uploadImage(image);
    const img = `https://nftstorage.link/ipfs/${cid}`;

    try {
      await listProduct(
        name,
        description,
        img,
        price.toString(),
        date[0].toDateString(),
        date[1].toDateString()
      );
      showNotification({
        title: "Success",
        message: "Product listed successfully",
      });
    } catch (e) {
      console.log(e);
      showNotification({
        title: "Error",
        message: "Something went wrong. Check console for more details",
      });
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>List Product</title>
      </Head>
      <Layout>
        <Container>
          <Title order={1}>List Product</Title>
          <TextInput
            m={"md"}
            label={"Product Name"}
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
            placeholder="Name"
            required
          />
          <Textarea
            m="md"
            label="Product Description"
            value={description}
            onChange={(event) => setDescription(event.currentTarget.value)}
            placeholder="Something about your product"
            required
          />
          <NumberInput
            m="md"
            value={price}
            onChange={(event) => setPrice(event)}
            label="Enter price in MATIC"
            defaultValue={0.0}
            required
            precision={2}
            min={0}
            step={0.05}
          />
          <DateRangePicker
            m="md"
            label="Choose dates"
            placeholder="Pick start date and end date"
            value={date}
            onChange={setDate}
            required
          />
          <FileInput
            m={"md"}
            required
            label={"Upload your product image"}
            placeholder={"Upload image file"}
            accept={"image/*"}
            icon={<IconUpload size={14} />}
            value={image}
            onChange={setImage}
          />
          <Group>
            <Button
              color={"indigo"}
              disabled={loading}
              m={"md"}
              onClick={async () => await handleSubmit()}
            >
              {" "}
              List Product{" "}
            </Button>
            {loading && <Loader color="grape" variant="dots" />}
          </Group>
        </Container>
      </Layout>
    </>
  );
}
