import { AvatarData, Features } from "@/types";
import { NormalizedLandmark } from "@mediapipe/tasks-vision";

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

export function buildFeatures(avatar: AvatarData): Features {
  const middleOfNose = avatar.landmarks[5];
  const leftEye = avatar.landmarks[468];
  const rightEye = avatar.landmarks[473];

  const eyes: NormalizedLandmark[] = [];

  if (leftEye.x < middleOfNose.x) {
    eyes.push(leftEye);
  }

  if (rightEye.x > middleOfNose.x) {
    eyes.push(rightEye);
  }

  const leftEyebrow = [
    averageLandmark(avatar.landmarks[65], avatar.landmarks[55], 2 / 3),
    avatar.landmarks[65],
    avatar.landmarks[52],
    avatar.landmarks[53],
    averageLandmark(avatar.landmarks[46], avatar.landmarks[225]),
  ].filter((point, index, points) =>
    index ? point.x < points[index - 1].x : true
  );

  const rightEyebrow: NormalizedLandmark[] = [
    averageLandmark(avatar.landmarks[295], avatar.landmarks[285], 2 / 3),
    avatar.landmarks[295],
    avatar.landmarks[282],
    avatar.landmarks[283],
    averageLandmark(avatar.landmarks[276], avatar.landmarks[445]),
  ].filter((point, index, points) =>
    index ? point.x > points[index - 1].x : true
  );

  const leftNostril = avatar.landmarks[60];
  const endOfNose = avatar.landmarks[4];
  const rightNostril = avatar.landmarks[290];

  let nose: NormalizedLandmark[];
  let noseDirection: number;

  if (
    Math.abs(endOfNose.x - leftNostril.x) >
    Math.abs(endOfNose.x - rightNostril.x)
  ) {
    noseDirection = 1;
    nose = [
      avatar.landmarks[168],
      avatar.landmarks[6],
      avatar.landmarks[197],
      avatar.landmarks[195],
      avatar.landmarks[5],
      avatar.landmarks[4],
      avatar.landmarks[1],
      avatar.landmarks[19],
      avatar.landmarks[94],
      avatar.landmarks[99],
      avatar.landmarks[240],
    ];
  } else {
    noseDirection = -1;
    nose = [
      avatar.landmarks[168],
      avatar.landmarks[6],
      avatar.landmarks[197],
      avatar.landmarks[195],
      avatar.landmarks[5],
      avatar.landmarks[4],
      avatar.landmarks[1],
      avatar.landmarks[19],
      avatar.landmarks[94],
      avatar.landmarks[328],
      avatar.landmarks[460],
    ];
  }

  const leftTopLip: NormalizedLandmark[] = [
    avatar.landmarks[0],
    avatar.landmarks[37],
    avatar.landmarks[39],
    avatar.landmarks[40],
    avatar.landmarks[185],
    avatar.landmarks[61],
    avatar.landmarks[78],
    avatar.landmarks[191],
    avatar.landmarks[80],
    avatar.landmarks[81],
    avatar.landmarks[82],
    avatar.landmarks[13],
  ];

  const rightTopLip: NormalizedLandmark[] = [
    avatar.landmarks[0],
    avatar.landmarks[267],
    avatar.landmarks[269],
    avatar.landmarks[270],
    avatar.landmarks[409],
    avatar.landmarks[291],
    avatar.landmarks[308],
    avatar.landmarks[415],
    avatar.landmarks[310],
    avatar.landmarks[311],
    avatar.landmarks[312],
    avatar.landmarks[13],
  ];

  const leftBottomLip: NormalizedLandmark[] = [
    avatar.landmarks[17],
    avatar.landmarks[84],
    avatar.landmarks[181],
    avatar.landmarks[91],
    avatar.landmarks[146],
    avatar.landmarks[61],
    avatar.landmarks[78],
    avatar.landmarks[95],
    avatar.landmarks[88],
    avatar.landmarks[178],
    avatar.landmarks[87],
    avatar.landmarks[14],
  ];

  const rightBottomLip: NormalizedLandmark[] = [
    avatar.landmarks[17],
    avatar.landmarks[314],
    avatar.landmarks[405],
    avatar.landmarks[321],
    avatar.landmarks[375],
    avatar.landmarks[291],
    avatar.landmarks[308],
    avatar.landmarks[324],
    avatar.landmarks[318],
    avatar.landmarks[402],
    avatar.landmarks[317],
    avatar.landmarks[14],
  ];

  const ears: NormalizedLandmark[][] = [];

  const leftEarReference1 = avatar.landmarks[227];
  const leftEarReference2 = avatar.landmarks[234];

  if (leftEarReference1.x - leftEarReference2.x > 0) {
    ears.push([
      averageLandmark(leftEarReference1, leftEarReference2, 2),
      averageLandmark(leftEarReference2, avatar.landmarks[127]),
      avatar.landmarks[93],
    ]);
  }

  const rightEarReference1 = avatar.landmarks[447];
  const rightEarReference2 = avatar.landmarks[454];

  if (rightEarReference2.x - rightEarReference1.x > 0) {
    ears.push([
      averageLandmark(rightEarReference1, rightEarReference2, 2),
      averageLandmark(rightEarReference2, avatar.landmarks[356]),
      avatar.landmarks[323],
    ]);
  }

  return {
    eyes,
    eyebrows: [leftEyebrow, rightEyebrow],
    nose,
    noseDirection,
    lips: [
      [...leftTopLip.reverse(), ...rightTopLip.slice(1, -1)],
      [...rightBottomLip.reverse(), ...leftBottomLip.slice(1, -1)],
    ],
    shadow: [
      avatar.landmarks[93],
      avatar.landmarks[58],
      averageLandmark(avatar.landmarks[18], avatar.landmarks[152], 2.5),
      avatar.landmarks[288],
      avatar.landmarks[323],
    ],
    ears,
  };
}
