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
  "hair",
  "body",
  "face",
  "clothes",
  "accessories",
] as const;

export const VIEWBOX = 48;

export const CROPPED_RESOLUTION = 1024;

export function capitalizeFirstLetter(string: string) {
  return String(string).charAt(0).toUpperCase() + String(string).slice(1);
}
