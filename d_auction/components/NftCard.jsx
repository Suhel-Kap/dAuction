import {Card, Text, createStyles, Image, Button, Group, NumberInput,} from '@mantine/core';
import {useEffect, useState} from "react";
import {useContract} from "../hooks/useContract";
import {showNotification} from "@mantine/notifications";
import {ethers} from "ethers";

const useStyles = createStyles((theme) => ({
    card: {
        position: 'relative',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        maxWidth: 350
    },

    rating: {
        position: 'absolute',
        top: theme.spacing.xs,
        right: theme.spacing.xs + 2,
        pointerEvents: 'none',
    },

    title: {
        display: 'block',
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.xs / 2,
    },

    action: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        ...theme.fn.hover({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
        }),
    },

    footer: {
        marginTop: theme.spacing.md,
    },
}));

export default function NftCard({basePrice, description, endDate, image, name, owner, startDate, tokenId}) {
    const {classes, cx, theme} = useStyles();
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState(basePrice);
    const {bid, getHighestBidder} = useContract()
    const [highestBid, setHighestBid] = useState("0");

    useEffect(() => {
        getHighestBidder(tokenId).then((bid) => {
            const highestBid = ethers.utils.formatEther(bid[1]);
            setHighestBid(highestBid);
        })
    }, [])

    const handleClick = async () => {
        setLoading(true)
        const date = new Date()
        try {
            await bid(tokenId, price.toString(), date.toDateString())
            showNotification({
                title: "Success",
                message: "Bid placed successfully",
            })
        } catch (e) {
            console.log(e)
            showNotification({
                title: "Error",
                message: "Something went wrong. Check console for details",
            })
        }
        setLoading(false)
    }

    return (
        <Card withBorder radius="md" className={cx(classes.card)} m={"md"}>
            <Card.Section>
                <Image height={350} width={350} src={image} alt={name}/>
            </Card.Section>

            <Text mt={"md"} size="xl" weight={700}>
                Highest Bid: {highestBid} MATIC
            </Text>

            <Text my={"sm"} size="md" weight={500}>
                Base Price: {basePrice} MATIC
            </Text>
            <Text size={"sm"} color={"dimmed"}>
                From: {startDate}
            </Text>
            <Text size={"sm"} color={"dimmed"}>
                To: {endDate}
            </Text>

            <Text className={classes.title} weight={500}>
                {name} <span className={classes.rating}>#{tokenId}</span>
            </Text>

            <Text size="sm" color="dimmed" lineClamp={4}>
                {description}
            </Text>
            <NumberInput
                my={"sm"}
                value={price}
                onChange={(event) => setPrice(event)}
                description="Enter your bid (MATIC)"
                defaultValue={1 * basePrice}
                required
                precision={2}
                min={1 * highestBid}
                step={0.05}
            />
            <Button disabled={loading} onClick={async () => await handleClick()}>
                Bid
            </Button>
        </Card>
    );
}