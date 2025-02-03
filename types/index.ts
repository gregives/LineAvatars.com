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

export type Avatar = {
  segments: Record<Segment, string | undefined>;
  landmarks: {
    eyes: NormalizedLandmark[];
    eyebrows: NormalizedLandmark[][];
    nose: NormalizedLandmark[];
    noseDirection: number;
    lips: NormalizedLandmark[][];
    shadow: NormalizedLandmark[];
    ears: NormalizedLandmark[][];
  };
  bounds: Bounds;
};
