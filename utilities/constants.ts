export const PRODUCTION_HOST = "www.lineavatars.com";
export const DEVELOPMENT_HOST = "localhost:3000";

export const BASE_HOST =
  typeof window === "undefined"
    ? process.env.VERCEL_ENV === "production"
      ? PRODUCTION_HOST
      : process.env.VERCEL_BRANCH_URL
      ? process.env.VERCEL_BRANCH_URL
      : DEVELOPMENT_HOST
    : window.location.host;

export const BASE_ORIGIN = `https://${BASE_HOST}`;

export const SEGMENTS = [
  "Hair",
  "Body",
  "Face",
  "Clothes",
  "Accessories",
] as const;

export const FEATURES = [
  "Eyes",
  "Eyebrows",
  "Nose",
  "Nose direction",
  "Lips",
  "Shadow",
  "Ears",
] as const;

export const VIEWBOX = 48;

export const CROPPED_RESOLUTION = 1024;
