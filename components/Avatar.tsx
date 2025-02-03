import { Avatar as AvatarType } from "@/types";
import { VIEWBOX } from "@/utilities/constants";
import simplifySvgPath from "@luncheon/simplify-svg-path";
import { NormalizedLandmark } from "@mediapipe/tasks-vision";

export function Avatar({ avatar }: { avatar: AvatarType }) {
  const translateX = Math.min(
    Math.max(
      (0.5 -
        ((avatar.bounds.minX + avatar.bounds.maxX) / 2) * avatar.bounds.scale) *
        VIEWBOX,
      VIEWBOX - VIEWBOX * avatar.bounds.scale
    ),
    0
  );

  const translateY = Math.min(
    Math.max(
      (0.5 -
        ((avatar.bounds.minY + avatar.bounds.maxY) / 2) * avatar.bounds.scale) *
        VIEWBOX,
      VIEWBOX - VIEWBOX * avatar.bounds.scale
    ),
    0
  );

  const transform = `translate(${translateX} ${translateY})`;

  const pointToViewbox = (
    point: NormalizedLandmark,
    offset = {
      x: 0,
      y: 0,
    }
  ) => {
    return [
      point.x * VIEWBOX * avatar.bounds.scale + translateX + offset.x,
      point.y * VIEWBOX * avatar.bounds.scale + translateY + offset.y,
    ] as const;
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full rounded-xl bg-zinc-200"
    >
      <defs>
        <path id="face" d={avatar.segments.Face} transform={transform} />
        <clipPath id="faceClip">
          <use href="#face" />
        </clipPath>
        <path id="body" d={avatar.segments.Body} transform={transform} />
        <clipPath id="bodyClip">
          <use href="#body" />
        </clipPath>
      </defs>
      <use href="#body" fill="white" />
      {avatar.landmarks.shadow && (
        <path
          d={simplifySvgPath(
            avatar.landmarks.shadow.map((point) => pointToViewbox(point))
          )}
          fill="#d4d4d4"
          clipPath="url(#bodyClip)"
        />
      )}
      <use href="#body" fill="none" stroke="black" strokeWidth={1} />
      <path
        d={avatar.segments.Clothes}
        stroke="black"
        strokeWidth={0.5}
        transform={transform}
      />
      <use href="#face" fill="white" />
      {avatar.landmarks.eyes.map((eye, index) => {
        const [cx, cy] = pointToViewbox(eye);

        return (
          <ellipse
            key={index}
            cx={cx}
            cy={cy}
            rx={1}
            ry={1.25}
            clipPath="url(#faceClip)"
          />
        );
      })}
      {avatar.landmarks.eyebrows.map((eyebrow, index) => (
        <path
          key={index}
          d={simplifySvgPath(eyebrow.map((point) => pointToViewbox(point)))}
          fill="none"
          stroke="black"
          strokeWidth={1}
          clipPath="url(#faceClip)"
        />
      ))}
      {avatar.landmarks.nose && (
        <path
          d={simplifySvgPath(
            avatar.landmarks.nose.map((point) =>
              pointToViewbox(point, {
                x: avatar.landmarks.noseDirection,
                y: 0,
              })
            ),
            {
              precision: 2,
              tolerance: 1,
            }
          )}
          fill="white"
          stroke="black"
          strokeWidth={1}
          clipPath="url(#faceClip)"
        />
      )}
      {avatar.landmarks.lips.map((lip, index) => (
        <path
          key={index}
          d={simplifySvgPath(
            lip.map((point) => pointToViewbox(point)),
            {
              tolerance: 0,
              precision: 10,
              closed: true,
            }
          )}
          fill="#d4d4d4"
          stroke="#d4d4d4"
          strokeWidth={0.25}
          clipPath="url(#faceClip)"
        />
      ))}
      {avatar.landmarks.ears.map((ear, index) => {
        const [firstPoint, ...otherPoints] = ear;

        return (
          <path
            key={index}
            d={`M ${pointToViewbox(firstPoint).join(" ")} Q ${otherPoints
              .map((point) => pointToViewbox(point).join(" "))
              .join(" ")}`}
            fill="none"
            stroke="black"
            strokeWidth={1}
            clipPath="url(#faceClip)"
          />
        );
      })}
      <use href="#face" fill="none" stroke="black" strokeWidth={1} />
      <path
        d={avatar.segments.Hair}
        stroke="black"
        strokeWidth={1}
        transform={transform}
      />
      <path
        d={avatar.segments.Accessories}
        stroke="black"
        strokeWidth={0.5}
        transform={transform}
      />
    </svg>
  );
}
