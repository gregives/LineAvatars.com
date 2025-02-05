import root from "react-shadow";
import { AvatarData } from "@/types";
import { VIEWBOX } from "@/utilities/constants";
import { buildFeatures } from "@/utilities/features";
import simplifySvgPath from "@luncheon/simplify-svg-path";
import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { twMerge } from "tailwind-merge";

type AvatarProperties = JSX.IntrinsicElements["div"] & {
  avatar: AvatarData;
};

export function Avatar({ avatar, className, ...properties }: AvatarProperties) {
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

  const features = buildFeatures(avatar);

  const strokeColor = avatar.customizations?.colors?.outline ?? "#000";
  const strokeWidth = avatar.customizations?.strokeWidth ?? 1;

  return (
    <root.div
      className={twMerge(
        "w-full aspect-square rounded-xl overflow-hidden",
        className
      )}
      {...properties}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          <path id="face" d={avatar.segments.face} transform={transform} />
          <clipPath id="faceClip">
            <use href="#face" />
          </clipPath>
          <path id="body" d={avatar.segments.body} transform={transform} />
          <clipPath id="bodyClip">
            <use href="#body" />
          </clipPath>
        </defs>
        <rect
          width={48}
          height={48}
          fill={avatar.customizations?.colors?.background ?? "#e4e4e7"}
        />
        <use
          href="#body"
          fill={avatar.customizations?.colors?.body ?? "#fff"}
        />
        {features.shadow && (
          <path
            d={simplifySvgPath(
              features.shadow.map((point) => pointToViewbox(point))
            )}
            fill={avatar.customizations?.colors?.shadow ?? "#0003"}
            clipPath="url(#bodyClip)"
          />
        )}
        <path
          d={avatar.segments.clothes}
          fill={avatar.customizations?.colors?.clothes ?? strokeColor}
          stroke={avatar.customizations?.colors?.clothes ?? strokeColor}
          strokeWidth={strokeWidth / 2}
          transform={transform}
        />
        <use
          href="#body"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        <use
          href="#face"
          fill={avatar.customizations?.colors?.face ?? "#fff"}
        />
        {features.eyes.map((eye, index) => {
          const [cx, cy] = pointToViewbox(eye);

          return (
            <ellipse
              key={index}
              cx={cx}
              cy={cy}
              rx={strokeWidth}
              ry={strokeWidth * 1.25}
              clipPath="url(#faceClip)"
              fill={avatar.customizations?.colors?.eyes ?? strokeColor}
            />
          );
        })}
        {features.eyebrows.map((eyebrow, index) => (
          <path
            key={index}
            d={simplifySvgPath(eyebrow.map((point) => pointToViewbox(point)))}
            fill="none"
            stroke={avatar.customizations?.colors?.eyebrows ?? strokeColor}
            strokeWidth={strokeWidth}
            clipPath="url(#faceClip)"
          />
        ))}
        {features.nose && (
          <path
            d={simplifySvgPath(
              features.nose.map((point) =>
                pointToViewbox(point, {
                  x: features.noseDirection,
                  y: 0,
                })
              ),
              {
                precision: 2,
                tolerance: 1,
              }
            )}
            fill={avatar.customizations?.colors?.face ?? "#fff"}
            stroke={avatar.customizations?.colors?.nose ?? strokeColor}
            strokeWidth={strokeWidth}
            clipPath="url(#faceClip)"
          />
        )}
        {features.lips.map((lip, index) => (
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
            fill={avatar.customizations?.colors?.lips ?? "#e4e4e7"}
            stroke={avatar.customizations?.colors?.lips ?? "#e4e4e7"}
            strokeWidth={strokeWidth * 0.25}
            clipPath="url(#faceClip)"
          />
        ))}
        <use
          href="#face"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        {avatar.segments.hair && (
          <path
            d={avatar.segments.hair}
            fill={avatar.customizations?.colors?.hair ?? strokeColor}
            stroke={avatar.customizations?.colors?.hair ?? strokeColor}
            strokeWidth={strokeWidth}
            transform={transform}
          />
        )}
        {avatar.segments.accessories && (
          <path
            d={avatar.segments.accessories}
            fill={avatar.customizations?.colors?.accessories ?? strokeColor}
            stroke={avatar.customizations?.colors?.accessories ?? strokeColor}
            strokeWidth={strokeWidth}
            transform={transform}
          />
        )}
      </svg>
    </root.div>
  );
}
