import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { SEGMENTS, VIEWBOX } from "./constants";
import { Bounds, AvatarData, Segment } from "@/types";
import { convertImageToPath } from "./convert";
import { generateId } from "./nanoid";

function createCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (context === null) {
    throw new Error("Could not get canvas context");
  }

  return {
    canvas,
    context,
  };
}

function getBounds(landmarks: NormalizedLandmark[]): Bounds {
  const minX = Math.min(...landmarks.map((landmark) => landmark.x));
  const maxX = Math.max(...landmarks.map((landmark) => landmark.x));
  const minY = Math.min(...landmarks.map((landmark) => landmark.y));
  const maxY = Math.max(...landmarks.map((landmark) => landmark.y));

  return {
    minX,
    maxX,
    minY,
    maxY,
    scale: Math.max(0.5 / (maxY - minY), 1),
  };
}

export async function getFaceData(photo: string): Promise<AvatarData> {
  const image = document.createElement("img");

  await new Promise((resolve) => {
    image.onload = resolve;
    image.src = photo;
  });

  const { FaceLandmarker, FilesetResolver, ImageSegmenter } = await import(
    "@mediapipe/tasks-vision"
  );

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  const [imageSegmenter, faceLandmarker] = await Promise.all([
    ImageSegmenter.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite",
      },
      outputCategoryMask: true,
      outputConfidenceMasks: false,
      runningMode: "IMAGE",
    }),
    FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
      },
      runningMode: "IMAGE",
      numFaces: 1,
    }),
  ]);

  const faceLandmarkerResult = faceLandmarker.detect(image);

  const landmarks = faceLandmarkerResult.faceLandmarks[0];
  const bounds = getBounds(landmarks);

  const imageSegmenterResult = imageSegmenter.segment(image);

  if (imageSegmenterResult.categoryMask === undefined) {
    throw new Error("Could not segment image");
  }

  const mask = imageSegmenterResult.categoryMask.getAsUint8Array();

  // @ts-ignore
  const segments: Record<Segment, string | undefined> = {};

  await Promise.all(
    SEGMENTS.map(async (segment, segmentIndex) => {
      const { canvas, context } = createCanvas(image.width, image.height);

      const imageData = context.getImageData(
        0,
        0,
        image.width,
        image.height
      ).data;

      mask.forEach((value, index) => {
        if (value === segmentIndex + 1) {
          imageData[index * 4] = 0;
          imageData[index * 4 + 1] = 0;
          imageData[index * 4 + 2] = 0;
          imageData[index * 4 + 3] = 255;
        } else {
          imageData[index * 4] = 255;
          imageData[index * 4 + 1] = 255;
          imageData[index * 4 + 2] = 255;
          imageData[index * 4 + 3] = 255;
        }
      });

      const uint8Array = new Uint8ClampedArray(imageData.buffer);
      const dataNew = new ImageData(uint8Array, image.width, image.height);
      context.putImageData(dataNew, 0, 0);

      segments[segment] = await convertImageToPath(
        canvas.toDataURL(),
        bounds.scale * VIEWBOX
      );
    })
  );

  const createdAt = Date.now();

  return {
    id: generateId(),
    createdAt,
    updatedAt: createdAt,
    segments,
    landmarks,
    bounds,
  };
}
