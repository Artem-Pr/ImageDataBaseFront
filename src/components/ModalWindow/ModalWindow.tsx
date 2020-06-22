import React, { useState, useEffect } from "react";
import {
  Alert,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container
} from "reactstrap";
import style from "./ModalWindow.module.scss";
import { useDropzone } from "react-dropzone";
import { mainApi } from "../../api/api";
const loadImage = require("blueimp-load-image");

// interface Ifile {
// 	name: string;
// 	preview: any;
// }

const extractKeywords = async (file: any) => {
  try {
    const newKeywordsResp = await loadImage(file, { meta: true });
    console.log("newKeywords", newKeywordsResp.iptc.getText("Keywords"));
    return newKeywordsResp.iptc.getText("Keywords");
  } catch (error) {
    console.log(`${file.name} не имеет exif`);
    return "error - no exif";
  }
};

export const ModalWindow = () => {
  const toggle = () => setModal(!modal);
  const [modal, setModal] = useState(false);
  const [files, setFiles] = useState<Array<any>>([]);
  const [keywords, setKeywords] = useState<Array<any>>([]);
  const [successResponse, setSuccessResponse] = useState("");
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setSuccessResponse("");

      const imgArr = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      );

      setFiles(imgArr);
    }
  });

  const getKeywords = async (imgArr: any[]) => {
    const newKeywords = await imgArr.map(async (file: any) => {
      const currentKeywords = await extractKeywords(file);
      return currentKeywords;
    });

    let keywordsToArr: string[][] = [];
    // debugger;
    await newKeywords.forEach(async (keywordsItem: any, i: number) => {
      // debugger;
      const arr = await keywordsItem;
      console.log(arr.split(", "));
      keywordsToArr.push(arr.split(", "));
    });

    console.log("newKeywords2", newKeywords);
    console.log("keywordsToArr", keywordsToArr);
    setKeywords(keywordsToArr);
  };

  const handleSubmit = async (e: any) => {
    if (files.length === 0) return;
    try {
      await mainApi.sendPhotos(files, keywords);
      setSuccessResponse("Files uploaded successfully");
      setFiles([]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log("keywordsUse", keywords);
  }, [keywords]);

  useEffect(() => {
    // debugger;
    getKeywords(files);

    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  useEffect(() => {
    if (!modal) {
      setFiles([]);
      setSuccessResponse("");
    }
  }, [modal]);

  return (
    <Container>
      <Button color="primary" onClick={toggle}>
        Upload photo
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Choose photos</ModalHeader>
        <ModalBody>
          <div {...getRootProps({ className: style.dropzone })}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="m-0">Drop the files here ...</p>
            ) : (
              <p className="m-0">
                Drag 'n' drop some files here, or click to select files
              </p>
            )}
          </div>
          <aside className="d-flex flex-row flex-wrap mt-3">
            {files.map((file, i) => (
              <div
                className="d-flex border-secondary mb-2 mr-2 p-1"
                key={file.name}
              >
                <div>
                  <img
                    src={file.preview}
                    className={style.dropzoneImg}
                    alt="uploaded"
                  />
                  {keywords.length > 0 && keywords[i].map((item: string) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </aside>
          {successResponse ? (
            <Alert color="success">{successResponse}</Alert>
          ) : (
            ""
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleSubmit}
            className={files.length ? "" : "disabled"}
          >
            Submit
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};
