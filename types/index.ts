import { SEGMENTS } from "@/utilities/constants";
import { NormalizedLandmark } from "@mediapipe/tasks-vision";

export type Segment = (typeof SEGMENTS)[number];

export type Bounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  scale: number;
};

export type AvatarData = {
  id: string;
  createdAt: number;
  updatedAt: number;
  segments: Record<Segment, string | undefined>;
  landmarks: NormalizedLandmark[];
  bounds: Bounds;
  customizations?: {
    strokeWidth?: number;
    colors?: {
      outline?: string;
      background?: string;
      hair?: string;
      body?: string;
      face?: string;
      clothes?: string;
      accessories?: string;
      eyes?: string;
      eyebrows?: string;
      nose?: string;
      lips?: string;
      shadow?: string;
    };
  };
};

export type Features = {
  eyes: NormalizedLandmark[];
  eyebrows: NormalizedLandmark[][];
  nose: NormalizedLandmark[];
  noseDirection: number;
  lips: NormalizedLandmark[][];
  shadow: NormalizedLandmark[];
};

export type Feature = keyof Features;
