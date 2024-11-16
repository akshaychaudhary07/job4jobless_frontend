import axios from 'axios';

export const uploadImageAWS = async (img: any): Promise<string | null> => {
    try {
        let imgUrl: string | null = null;

        const { data: { uploadURL } } = await axios.get("https://job4jobless.in:3016/get-upload-url");

        await axios({
            method: 'PUT',
            url: uploadURL,
            headers: { 'Content-Type': 'multipart/form-data' },
            data: img
        });

        imgUrl = uploadURL.split("?")[0];

        return imgUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
};
