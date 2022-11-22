import {ethers} from "ethers";
import {abi, contractAddress} from "../constants";
import {useAccount, useSigner} from "wagmi";

export const useContract = () => {
    const { data: signer, isError, isLoading } = useSigner();
    const { address } = useAccount();

    const contract = new ethers.Contract(
        contractAddress["dAuctionAddress"],
        abi,
        signer
    );

    const listProduct = async (name, description, image, basePrice, startDate, endDate) => {
        const price = ethers.utils.parseEther(basePrice)
        const tx = await contract.list_product(name, description, image, price, startDate, endDate);
        return await tx.wait();
    }

    const bid = async (tokenId, value, time) => {
        const tx = await contract.bid(tokenId, time, { value: ethers.utils.parseEther(value) })
        return await tx.wait()
    }

    const purchase = async (tokenId, time) => {
        const tx = await contract.bid(tokenId, time)
        return await tx.wait()
    }

    const withdraw = async () => {
        const tx = await contract.withdraw()
        return await tx.wait()
    }

    const getBalance = async () => {
        return await contract.getBalance(address)
    }

    const getHighestBidder = async (tokenId) => {
        return await contract.getHighestBidder(tokenId)
    }

    const getProductOwner = async (tokenId) => {
        return await contract.getProductOwner(tokenId)
    }


    return {
        listProduct, bid, purchase, withdraw, getBalance, getHighestBidder, getProductOwner
    };
};
