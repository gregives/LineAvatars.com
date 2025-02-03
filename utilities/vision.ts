import {
  FaceLandmarker,
  FilesetResolver,
  ImageSegmenter,
  NormalizedLandmark,
} from "@mediapipe/tasks-vision";
import { SEGMENTS, VIEWBOX } from "./constants";
import { Avatar, Bounds, Segment } from "@/types";
import { convertImageToPath } from "./convert";

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

export async function createAvatar(photo: string): Promise<Avatar> {
  const image = document.createElement("img");

  await new Promise((resolve) => {
    image.onload = resolve;
    image.src = photo;
  });

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

  const middleOfNose = faceLandmarkerResult.faceLandmarks[0][5];
  const leftEye = faceLandmarkerResult.faceLandmarks[0][468];
  const rightEye = faceLandmarkerResult.faceLandmarks[0][473];

  const eyes: NormalizedLandmark[] = [];

  if (leftEye.x < middleOfNose.x) {
    eyes.push(leftEye);
  }

  if (rightEye.x > middleOfNose.x) {
    eyes.push(rightEye);
  }

  const leftEyebrow = [
    averageLandmark(
      faceLandmarkerResult.faceLandmarks[0][65],
      faceLandmarkerResult.faceLandmarks[0][55],
      2 / 3
    ),
    faceLandmarkerResult.faceLandmarks[0][65],
    faceLandmarkerResult.faceLandmarks[0][52],
    faceLandmarkerResult.faceLandmarks[0][53],
    averageLandmark(
      faceLandmarkerResult.faceLandmarks[0][46],
      faceLandmarkerResult.faceLandmarks[0][225]
    ),
  ].filter((point, index, points) =>
    index ? point.x < points[index - 1].x : true
  );

  const rightEyebrow: NormalizedLandmark[] = [
    averageLandmark(
      faceLandmarkerResult.faceLandmarks[0][295],
      faceLandmarkerResult.faceLandmarks[0][285],
      2 / 3
    ),
    faceLandmarkerResult.faceLandmarks[0][295],
    faceLandmarkerResult.faceLandmarks[0][282],
    faceLandmarkerResult.faceLandmarks[0][283],
    averageLandmark(
      faceLandmarkerResult.faceLandmarks[0][276],
      faceLandmarkerResult.faceLandmarks[0][445]
    ),
  ].filter((point, index, points) =>
    index ? point.x > points[index - 1].x : true
  );

  const leftNostril = faceLandmarkerResult.faceLandmarks[0][60];
  const endOfNose = faceLandmarkerResult.faceLandmarks[0][4];
  const rightNostril = faceLandmarkerResult.faceLandmarks[0][290];

  let nose: NormalizedLandmark[];
  let noseDirection: number;

  if (
    Math.abs(endOfNose.x - leftNostril.x) >
    Math.abs(endOfNose.x - rightNostril.x)
  ) {
    noseDirection = 1;
    nose = [
      faceLandmarkerResult.faceLandmarks[0][168],
      faceLandmarkerResult.faceLandmarks[0][6],
      faceLandmarkerResult.faceLandmarks[0][197],
      faceLandmarkerResult.faceLandmarks[0][195],
      faceLandmarkerResult.faceLandmarks[0][5],
      faceLandmarkerResult.faceLandmarks[0][4],
      faceLandmarkerResult.faceLandmarks[0][1],
      faceLandmarkerResult.faceLandmarks[0][19],
      faceLandmarkerResult.faceLandmarks[0][94],
      faceLandmarkerResult.faceLandmarks[0][99],
      faceLandmarkerResult.faceLandmarks[0][240],
    ];
  } else {
    noseDirection = -1;
    nose = [
      faceLandmarkerResult.faceLandmarks[0][168],
      faceLandmarkerResult.faceLandmarks[0][6],
      faceLandmarkerResult.faceLandmarks[0][197],
      faceLandmarkerResult.faceLandmarks[0][195],
      faceLandmarkerResult.faceLandmarks[0][5],
      faceLandmarkerResult.faceLandmarks[0][4],
      faceLandmarkerResult.faceLandmarks[0][1],
      faceLandmarkerResult.faceLandmarks[0][19],
      faceLandmarkerResult.faceLandmarks[0][94],
      faceLandmarkerResult.faceLandmarks[0][328],
      faceLandmarkerResult.faceLandmarks[0][460],
    ];
  }

  const leftTopLip: NormalizedLandmark[] = [
    faceLandmarkerResult.faceLandmarks[0][0],
    faceLandmarkerResult.faceLandmarks[0][37],
    faceLandmarkerResult.faceLandmarks[0][39],
    faceLandmarkerResult.faceLandmarks[0][40],
    faceLandmarkerResult.faceLandmarks[0][185],
    faceLandmarkerResult.faceLandmarks[0][61],
    faceLandmarkerResult.faceLandmarks[0][78],
    faceLandmarkerResult.faceLandmarks[0][191],
    faceLandmarkerResult.faceLandmarks[0][80],
    faceLandmarkerResult.faceLandmarks[0][81],
    faceLandmarkerResult.faceLandmarks[0][82],
    faceLandmarkerResult.faceLandmarks[0][13],
  ];

  const rightTopLip: NormalizedLandmark[] = [
    faceLandmarkerResult.faceLandmarks[0][0],
    faceLandmarkerResult.faceLandmarks[0][267],
    faceLandmarkerResult.faceLandmarks[0][269],
    faceLandmarkerResult.faceLandmarks[0][270],
    faceLandmarkerResult.faceLandmarks[0][409],
    faceLandmarkerResult.faceLandmarks[0][291],
    faceLandmarkerResult.faceLandmarks[0][308],
    faceLandmarkerResult.faceLandmarks[0][415],
    faceLandmarkerResult.faceLandmarks[0][310],
    faceLandmarkerResult.faceLandmarks[0][311],
    faceLandmarkerResult.faceLandmarks[0][312],
    faceLandmarkerResult.faceLandmarks[0][13],
  ];

  const leftBottomLip: NormalizedLandmark[] = [
    faceLandmarkerResult.faceLandmarks[0][17],
    faceLandmarkerResult.faceLandmarks[0][84],
    faceLandmarkerResult.faceLandmarks[0][181],
    faceLandmarkerResult.faceLandmarks[0][91],
    faceLandmarkerResult.faceLandmarks[0][146],
    faceLandmarkerResult.faceLandmarks[0][61],
    faceLandmarkerResult.faceLandmarks[0][78],
    faceLandmarkerResult.faceLandmarks[0][95],
    faceLandmarkerResult.faceLandmarks[0][88],
    faceLandmarkerResult.faceLandmarks[0][178],
    faceLandmarkerResult.faceLandmarks[0][87],
    faceLandmarkerResult.faceLandmarks[0][14],
  ];

  const rightBottomLip: NormalizedLandmark[] = [
    faceLandmarkerResult.faceLandmarks[0][17],
    faceLandmarkerResult.faceLandmarks[0][314],
    faceLandmarkerResult.faceLandmarks[0][405],
    faceLandmarkerResult.faceLandmarks[0][321],
    faceLandmarkerResult.faceLandmarks[0][375],
    faceLandmarkerResult.faceLandmarks[0][291],
    faceLandmarkerResult.faceLandmarks[0][308],
    faceLandmarkerResult.faceLandmarks[0][324],
    faceLandmarkerResult.faceLandmarks[0][318],
    faceLandmarkerResult.faceLandmarks[0][402],
    faceLandmarkerResult.faceLandmarks[0][317],
    faceLandmarkerResult.faceLandmarks[0][14],
  ];

  const ears: NormalizedLandmark[][] = [];

  const leftEarReference1 = faceLandmarkerResult.faceLandmarks[0][227];
  const leftEarReference2 = faceLandmarkerResult.faceLandmarks[0][234];

  if (leftEarReference1.x - leftEarReference2.x > 0) {
    ears.push([
      averageLandmark(leftEarReference1, leftEarReference2, 2),
      averageLandmark(
        leftEarReference2,
        faceLandmarkerResult.faceLandmarks[0][127]
      ),
      faceLandmarkerResult.faceLandmarks[0][93],
    ]);
  }

  const rightEarReference1 = faceLandmarkerResult.faceLandmarks[0][447];
  const rightEarReference2 = faceLandmarkerResult.faceLandmarks[0][454];

  if (rightEarReference2.x - rightEarReference1.x > 0) {
    ears.push([
      averageLandmark(rightEarReference1, rightEarReference2, 2),
      averageLandmark(
        rightEarReference2,
        faceLandmarkerResult.faceLandmarks[0][356]
      ),
      faceLandmarkerResult.faceLandmarks[0][323],
    ]);
  }

  const bounds = getBounds(faceLandmarkerResult.faceLandmarks[0]);

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

  return {
    segments,
    landmarks: {
      eyes,
      eyebrows: [leftEyebrow, rightEyebrow],
      nose,
      noseDirection,
      lips: [
        [...leftTopLip.reverse(), ...rightTopLip.slice(1, -1)],
        [...rightBottomLip.reverse(), ...leftBottomLip.slice(1, -1)],
      ],
      shadow: [
        faceLandmarkerResult.faceLandmarks[0][93],
        faceLandmarkerResult.faceLandmarks[0][58],
        averageLandmark(
          faceLandmarkerResult.faceLandmarks[0][18],
          faceLandmarkerResult.faceLandmarks[0][152],
          2.5
        ),
        faceLandmarkerResult.faceLandmarks[0][288],
        faceLandmarkerResult.faceLandmarks[0][323],
      ],
      ears,
    },
    bounds,
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

function averageLandmark(
  landmark1: NormalizedLandmark,
  landmark2: NormalizedLandmark,
  weight = 0.5
): NormalizedLandmark {
  return {
    x: landmark1.x + (landmark2.x - landmark1.x) * weight,
    y: landmark1.y + (landmark2.y - landmark1.y) * weight,
    z: landmark1.z + (landmark2.z - landmark1.z) * weight,
    visibility: 1,
  };
}
