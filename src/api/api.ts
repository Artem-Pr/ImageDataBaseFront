import axios, { AxiosResponse } from "axios";
import { File, ExifData } from "../types";

const instance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "multipart/form-data"
  }
});

export const mainApi = {
  sendPhotos(files: File[], exifDataArr: ExifData[]): Promise<AxiosResponse<any>> {
    // const code = Math.floor(Math.random() * 1000000)
    // 	.toString()
    // 	.padStart(6, "0");

    const formData = new FormData();
    // let keywordsToArr: string[][] = [];

    files.forEach((file: any) => {
      formData.append("filedata", file);
    });

    // keywords.forEach((keywordsItem: any, i: number) => {
    //   const arr = keywordsItem.split(", ");
    //   keywordsToArr.push(arr);
    // });

    // const keywordsToString = JSON.stringify(keywordsToArr);
    formData.append("exifDataArr", JSON.stringify(exifDataArr));
    return instance.post("/upload", formData);
  }
};
