import { Blob, NFTStorage } from "nft.storage";

const useNftStorage = () => {
    const endpoint = "https://api.nft.storage";
    const token = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY;

    const storage = new NFTStorage({ endpoint, token });

    const uploadImage = async (file) => {
        const blob = new Blob([file], { type: "image/*" });
        return await storage.storeBlob(blob);
    };

    return { uploadImage };
};

export default useNftStorage;
