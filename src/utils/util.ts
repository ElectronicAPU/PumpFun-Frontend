import axios, { AxiosRequestConfig } from "axios";
import { ChartTable, coinInfo, msgInfo, replyInfo, userInfo } from "./types";

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const headers: Record<string, string> = {
  "ngrok-skip-browser-warning": "true",
};

const config: AxiosRequestConfig = {
  headers,
};

export const test = async () => {
  const res = await fetch(`${BACKEND_URL}`);
  const data = await res.json();
  console.log(data);
};
export const getUser = async ({ id }: { id: string }): Promise<any> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/user/${id}`, config);
    console.log("response:", response.data);
    return response.data;
  } catch (err) {
    return { error: "error setting up the request" };
  }
};

export const walletConnect = async ({
  data,
}: {
  data: userInfo;
}): Promise<any> => {
  try {
    console.log("============walletConnect=========");
    const response = await axios.post(`${BACKEND_URL}/user/`, data);
    console.log(
      "==============response=====================",
      response.data,
      config
    );
    return response.data;
  } catch (err) {
    return { error: "error setting up the request" };
  }
};

export const confirmWallet = async ({
  data,
}: {
  data: userInfo;
}): Promise<any> => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/user/confirm`,
      data,
      config
    );
    return response.data;
  } catch (err) {
    return { error: "error setting up the request" };
  }
};

export const createNewCoin = async (data: coinInfo) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/coin/`, data, config);
    return response.data;
  } catch (err) {
    return { error: "error setting up the request" };
  }
};

export const getCoinsInfo = async (): Promise<coinInfo[]> => {
  const res = await axios.get(`${BACKEND_URL}/coin`, config);
  console.log("coin", `${BACKEND_URL}/coin`);
  return res.data;
};
export const getCoinsInfoBy = async (id: string): Promise<coinInfo[]> => {
  const res = await axios.get<coinInfo[]>(
    `${BACKEND_URL}/coin/user/${id}`,
    config
  );
  return res.data;
};
export const getCoinInfo = async (data: string): Promise<any> => {
  try {
    console.log("coinINfo", data);
    const response = await axios.get(`${BACKEND_URL}/coin/${data}`, config);
    return response.data;
  } catch (err) {
    return { error: "error setting up the request" };
  }
};

export const getUserInfo = async (data: string): Promise<any> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/user/${data}`, config);
    return response.data;
  } catch (err) {
    return { error: "error setting up the request" };
  }
};

export const getMessageByCoin = async (data: string): Promise<msgInfo[]> => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/feedback/coin/${data}`,
      config
    );
    console.log("messages:", response.data);
    return response.data;
  } catch (err) {
    return [];
  }
};

export const getCoinTrade = async (data: string): Promise<any> => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/cointrade/${data}`,
      config
    );
    console.log("trade response::", response);
    return response.data;
  } catch (err) {
    return { error: "error setting up the request" };
  }
};

export const postReply = async (data: replyInfo) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/feedback/`, data, config);
    return response.data;
  } catch (err) {
    return { error: "error setting up the request" };
  }
};

// ===========================Functions=====================================
const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkODQ0OGRiMC1lZjhiLTQ2ZDItOTAwMy05YmFlNDZjZWJlOWEiLCJlbWFpbCI6Im1haWxtZWFrYXNoaGFsZGVyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJiODJkYWQ2Y2Y0MzVkZWE4NTk0NCIsInNjb3BlZEtleVNlY3JldCI6IjQ5MWRiNTQzMjhmMmMxMzkyMmI5Y2U0MWY2ZTEzYjk1YWY5YzZhYzRmMzRmNWM4NjA0OWU2MWJlZmU2NTAyOGUiLCJleHAiOjE3NjYzMjQ5Nzl9.Yoxp16BlsbjHsjblKt5nzShMiOXMXn57oVLX8MoNZ3g";

const pinFileToIPFS = async (blob: File) => {
  try {
    const data = new FormData();
    data.append('file', blob);

    console.log("JWT", JWT);
    
    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
      body: data,
    });

    console.log('File uploaded', res);
    const resData = await res.json();
    return resData;
  } catch (error) {
    console.log(error);
  }
};

export const uploadImage = async (url: string) => {
  const res = await fetch(url);
  console.log("blob", res.blob);
  const blob = await res.blob();

  const imageFile = new File([blob], "image.png", { type: "image/png" });
  console.log("imageFile", imageFile);
  const resData = await pinFileToIPFS(imageFile);
  console.log("RESDATA>>>>", resData);
  if (resData) {
    return `https://gateway.pinata.cloud/ipfs/${resData.IpfsHash}`;
  } else {
    return false;
  }
  // const file = await createGenericFileFromBrowserFile(imageFile);

  // const [uri] = await umi.uploader.upload([file]);
  // console.log(uri, 'uriHash');
};
