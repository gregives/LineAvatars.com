import { MetadataRoute } from "next";
import { BASE_ORIGIN } from "@/utilities/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: `${BASE_ORIGIN}`,
      lastModified: new Date(),
    },
  ];
}
