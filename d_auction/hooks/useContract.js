import { ethers } from "ethers";
import { abi, contractAddress } from "../constants";
import { useAccount, useSigner } from "wagmi";

export const useContract = () => {
    const { data: signer, isError, isLoading } = useSigner();
    const { address } = useAccount();

    const contract = new ethers.Contract(
        contractAddress["dAuctionAddress"],
        abi,
        signer
    );

    const getCurrentTokenId = async () => {
        return await contract.totalSupply();
    };

    const mint = async ({
        name,
        image,
        animation,
        audioCid,
        description,
        spaceName,
    }) => {
        const tx = await contract.mint_your_Art(
            name,
            image,
            animation,
            audioCid,
            description,
            spaceName,
            { value: ethers.utils.parseEther("0.01") }
        );
        return await tx.wait();
    };

    const changeAudio = async (tokenId, audioCid) => {
        const tx = await contract.changeNFTaudio(tokenId, audioCid);
        return await tx.wait();
    };

    const spaceExists = async (spaceName) => {
        return await contract.spaceExists(spaceName);
    };

    const mintSpace = async (spaceName, groupId, imageCid) => {
        const tx = await contract.SocialSpaceCreation(
            spaceName,
            groupId,
            imageCid
        );
        return await tx.wait();
    };

    const mintAudioNft = async ({
        name,
        image,
        audioCid,
        description,
        spaceName,
    }) => {
        const tx = await contract.mint_your_Art(
            name,
            image,
            audioCid,
            audioCid,
            description,
            spaceName,
            { value: ethers.utils.parseEther("0.01") }
        );
        return await tx.wait();
    };

    const mintImageNft = async ({ name, image, description, spaceName }) => {
        const tx = await contract.mint_your_Art(
            name,
            image,
            image,
            "",
            description,
            spaceName,
            { value: ethers.utils.parseEther("0.01") }
        );
        return await tx.wait();
    };

    const addAttribute = async ({ tokenId, traitType, value }) => {
        console.log("addAttribute", tokenId, traitType, value);
        const tx = await contract.addAttribute(tokenId, traitType, value);
        return await tx.wait();
    };

    const updateAttribute = async ({ tokenId, traitType, value }) => {
        const tx = await contract.updateAttribute(
            tokenId,
            traitType,
            value,
            false
        );
        return await tx.wait();
    };

    return {
        getCurrentTokenId,
        mint,
        changeAudio,
        spaceExists,
        mintSpace,
        mintAudioNft,
        mintImageNft,
        updateAttribute,
        addAttribute,
    };
};
