import {
  InternalFileType,
  imagesFormat,
} from "../constants/interactorConstants";
import { ApiFile } from "../services/api/types";

export const isValidFileExtension = (file: ApiFile) => {
  const extension = file.filename
    .split(".")
    .pop()
    .toUpperCase() as InternalFileType;
  return imagesFormat.includes(extension);
};
