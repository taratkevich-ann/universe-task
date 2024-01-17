export enum PAGE_LINKS {
  MAIN = "/",
  PAYMENT = "/payment",
  DASHBOARD = "/dashboard",
}

export enum InternalFileType {
  DOC = "DOC",
  DOCX = "DOCX",
  JPEG = "JPEG",
  JPG = "JPG",
  HEIC = "HEIC",
  HEIF = "HEIF",
  PDF = "PDF",
  PNG = "PNG",
  PPT = "PPT",
  PPTX = "PPTX",
  XLS = "XLS",
  XLSX = "XLSX",
  ZIP = "ZIP",
  BMP = "BMP",
  EPS = "EPS",
  GIF = "GIF",
  SVG = "SVG",
  TIFF = "TIFF",
  WEBP = "WEBP",
  EPUB = "EPUB",
}

export const imagesFormat = [
  InternalFileType.HEIC,
  InternalFileType.SVG,
  InternalFileType.PNG,
  InternalFileType.BMP,
  InternalFileType.EPS,
  InternalFileType.GIF,
  InternalFileType.TIFF,
  InternalFileType.WEBP,
  InternalFileType.JPG,
  InternalFileType.JPEG,
];
