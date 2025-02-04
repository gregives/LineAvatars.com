"use client";

import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { Paragraph } from "@/components/Paragraph";
import { Webcam } from "@/components/Webcam";
import {
  mdiAutorenew,
  mdiCamera,
  mdiDownload,
  mdiPalette,
  mdiUpload,
} from "@mdi/js";
import { ChangeEventHandler, useRef, useState } from "react";
import { CROPPED_RESOLUTION } from "@/utilities/constants";
import Image from "next/image";
import examplePNG from "@/assets/example.png";
import exampleSVG from "@/assets/example.svg";
import { Avatar } from "@/components/Avatar";
import { Example } from "@/components/Example";
import { AvatarData } from "@/types";
import { getFaceData } from "@/utilities/vision";
import { useLocalStorage } from "usehooks-ts";
import { Wrap } from "@/components/Wrap";
import { Saved } from "@/components/Saved";
import { AvatarPlaceholder } from "@/components/AvatarPlaceholder";
import { DownloadButton } from "@/components/DownloadButton";

const fileToBase64 = (file: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

export default function HomePage() {
  const uploadRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [webcamOpen, setWebcamOpen] = useState(false);

  const [photo, setPhoto] = useState<string>();
  const [avatar, setAvatar] = useState<AvatarData>();

  const [, setValue] = useLocalStorage<AvatarData[]>("avatars", [], {
    initializeWithValue: false,
  });

  const generateAvatar = async (image: string) => {
    setWebcamOpen(false);

    const canvas = document.createElement("canvas");
    canvas.width = CROPPED_RESOLUTION;
    canvas.height = CROPPED_RESOLUTION;

    const context = canvas.getContext("2d");

    if (context === null) {
      return;
    }

    const imageObject = new window.Image();

    imageObject.onload = async () => {
      const sourceSize = Math.min(imageObject.width, imageObject.height);

      context.drawImage(
        imageObject,
        imageObject.width / 2 - sourceSize / 2,
        imageObject.height / 2 - sourceSize / 2,
        sourceSize,
        sourceSize,
        0,
        0,
        CROPPED_RESOLUTION,
        CROPPED_RESOLUTION
      );

      const photo = canvas.toDataURL("image/jpeg", 0.75);

      setPhoto(photo);
      const avatar = await getFaceData(photo);
      setAvatar(avatar);
      setValue((avatars) => [avatar, ...avatars]);
    };

    imageObject.src = image;
  };

  const onChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const [file] = files;

      setUploading(true);

      const imageBase64 = await fileToBase64(file);

      generateAvatar(imageBase64);
      setUploading(false);
    }
  };

  return (
    <Container>
      {photo ? (
        <>
          <h1 className="font-semibold">Generating your avatar&hellip;</h1>
          <Example className="my-6">
            <Image
              src={photo}
              alt=""
              width={CROPPED_RESOLUTION}
              height={CROPPED_RESOLUTION}
              className="rounded-xl"
            />
            {avatar ? (
              <Avatar id="download" avatar={avatar} />
            ) : (
              <AvatarPlaceholder />
            )}
          </Example>
          {avatar && (
            <>
              <Paragraph>
                Here&rsquo;s your avatar! Download an SVG of your avatar or
                click customize to change the colors.
              </Paragraph>
              <Wrap className="mb-4">
                <DownloadButton />
                <Button
                  variant="outline"
                  color="zinc"
                  leadingIcon={mdiPalette}
                  href={`/customize?avatar=${avatar.id}`}
                >
                  Customize
                </Button>
                <Button
                  color="zinc"
                  leadingIcon={mdiAutorenew}
                  onClick={() => {
                    setPhoto(undefined);
                    setAvatar(undefined);
                  }}
                >
                  Reset
                </Button>
              </Wrap>
            </>
          )}
        </>
      ) : (
        <>
          <h1 className="font-semibold">
            Generate your line avatar in 30&nbsp;seconds
          </h1>
          <Example className="my-6">
            <Image
              src={examplePNG}
              alt="Photo from webcam"
              className="rounded-xl -scale-x-100"
              priority
            />
            <Image
              src={exampleSVG}
              alt="Photo from webcam"
              className="rounded-xl bg-zinc-200"
              priority
            />
          </Example>
          <Paragraph>
            Upload or capture a photo of your face, preferably at a slight
            angle. Then we&rsquo;ll use AI to generate a line avatar for you.{" "}
            <strong>For free!</strong>
          </Paragraph>
          <Wrap>
            <Button
              leadingIcon={mdiCamera}
              className="col-start-1"
              onClick={() => {
                setWebcamOpen(true);
              }}
            >
              Take a photo
            </Button>
            <Button
              variant="outline"
              color="zinc"
              leadingIcon={mdiUpload}
              onClick={() => {
                if (uploadRef.current) {
                  uploadRef.current.click();
                }
              }}
              loading={uploading}
            >
              Upload an image
              <input
                ref={uploadRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={onChange}
              />
            </Button>
          </Wrap>
        </>
      )}
      <Saved />
      <Webcam
        open={webcamOpen}
        onClose={() => {
          setWebcamOpen(false);
        }}
        onCapture={generateAvatar}
      />
    </Container>
  );
}
