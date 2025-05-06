import { ref } from "vue";
import { storage } from "../lib/firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export function useFirebaseStorage() {
  const uploadStatus = ref({ status: "pending", error: null });

  const uploadFile = async (file, path) => {
    try {
      uploadStatus.value = { status: "uploading", error: null };

      const fileName = `${file.name}`;
      const fileRef = storageRef(storage, path + "/" + fileName);

      const snapshot = await uploadBytes(fileRef, file);
      uploadStatus.value = { status: "complete", error: null };
      return snapshot.metadata.fullPath;

      // const downloadURL = await getDownloadURL(snapshot.ref)

      // return downloadURL
    } catch (error) {
      console.error("Error uploading file:", error);
      uploadStatus.value = { status: "error", error: "Failed to upload file" };
      throw error;
    }
  };

  const uploadMultipleFiles = async (files, path) => {
    try {
      uploadStatus.value = { status: "uploading", error: null };

      const uploadPromises = files.map((file) => {
        const fileName = `${uuidv4()}-${file.name}`;
        const fileRef = storageRef(storage, path + "/" + fileName);
        return uploadBytes(fileRef, file).then((snapshot) =>
          getDownloadURL(snapshot.ref)
        );
      });

      const urls = await Promise.all(uploadPromises);
      uploadStatus.value = { status: "complete", error: null };
      return urls;
    } catch (error) {
      console.error("Error uploading files:", error);
      uploadStatus.value = { status: "error", error: "Failed to upload files" };
      throw error;
    }
  };

  return {
    uploadStatus,
    uploadFile,
    uploadMultipleFiles,
  };
}
