"use client";

import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { Paragraph } from "@/components/Paragraph";
import { Webcam } from "@/components/Webcam";
import { mdiAutorenew, mdiCamera, mdiUpload } from "@mdi/js";
import { ChangeEventHandler, useRef, useState } from "react";
import { CROPPED_RESOLUTION } from "@/utilities/constants";
import Image from "next/image";
import examplePNG from "@/assets/example.png";
import exampleSVG from "@/assets/example.svg";
import { createAvatar } from "@/utilities/vision";
import { Avatar } from "@/components/Avatar";
import { Logo } from "@/components/Logo";
import { Avatar as AvatarType } from "@/types";

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
  const [avatar, setAvatar] = useState<AvatarType>();

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
      setAvatar(await createAvatar(photo));
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
          <div className="flex items-center my-6">
            <Image
              src={photo}
              alt=""
              width={CROPPED_RESOLUTION}
              height={CROPPED_RESOLUTION}
              className="flex-1 max-w-40 rounded-xl"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="65.76062"
              height="20.94"
              viewBox="0 0 65.76062 20.94"
              className="w-[12.5%] max-w-10 mx-4 fill-zinc-900"
            >
              <path d="M3.0696,14.35003c14.77852-4.66461,30.54831-5.6899,45.76236-2.61603,4.44585,.89825,8.8161,2.1243,13.095,3.6261,1.274,.44715,2.73515-.50817,3.0753-1.7461,.37901-1.37937-.46745-2.62652-1.7461-3.0753C47.82195,5.12165,31.2588,3.6356,15.11839,6.30519c-4.53218,.74961-8.99807,1.84099-13.37799,3.22345C-1.31727,10.49374-.01125,15.32246,3.0696,14.35003h0Z" />
              <path d="M55.97417,3.76117l2.58581,4.86421,1.32984,2.5016,.66492,1.2508c.08649,.16269,.16913,.42327,.29552,.55591-.51452-.53997,1.42541-2.15361,.51312-1.82543-.8054,.28974-1.58804,.8423-2.34456,1.24356-.82749,.4389-1.65498,.87781-2.48247,1.31671-1.65498,.87781-3.30996,1.75562-4.96494,2.63342-1.15699,.61367-1.60767,2.31798-.89688,3.42047,.75851,1.17651,2.18291,1.55329,3.42047,.89688,1.93081-1.02411,3.86162-2.04822,5.79243-3.07233,.91943-.48767,1.83887-.97534,2.7583-1.46301,1.14784-.60882,2.34415-1.1119,2.8815-2.38522,.54904-1.30103,.0367-2.54313-.58127-3.70559l-1.55149-2.91853c-1.03432-1.94569-2.06865-3.89137-3.10297-5.83706-.61473-1.15638-2.31725-1.60814-3.42047-.89688-1.17565,.75796-1.55443,2.18355-.89688,3.42047h0Z" />
            </svg>
            {avatar && (
              <div className="flex-1 max-w-40">
                <Avatar avatar={avatar} />
              </div>
            )}
          </div>
          {avatar && (
            <>
              <Paragraph>
                Here&rsquo;s your avatar! You can download it in PNG or SVG
                format:
              </Paragraph>
              <div className="flex flex-wrap -m-2 *:m-2 mb-4">
                <Button>Download PNG</Button>
                <Button variant="soft" color="zinc">
                  Download SVG
                </Button>
              </div>
              <Paragraph>
                If you want to support <Logo />, please consider donating!
              </Paragraph>
              <div className="flex flex-wrap -m-2 *:m-2">
                <Button className="bg-yellow-300 hover:bg-yellow-400">
                  Donate $1
                </Button>
                <Button
                  variant="soft"
                  color="zinc"
                  leadingIcon={mdiAutorenew}
                  onClick={() => {
                    setPhoto(undefined);
                    setAvatar(undefined);
                  }}
                >
                  Generate another
                </Button>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <h1 className="font-semibold">
            Generate your line avatar in 30&nbsp;seconds
          </h1>
          <div className="flex items-center my-6">
            <Image
              src={examplePNG}
              alt="Photo from webcam"
              className="flex-1 max-w-40 rounded-xl -scale-x-100"
              priority
              sizes="10rem"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="65.76062"
              height="20.94"
              viewBox="0 0 65.76062 20.94"
              className="w-[12.5%] max-w-10 mx-4 fill-zinc-900"
            >
              <path d="M3.0696,14.35003c14.77852-4.66461,30.54831-5.6899,45.76236-2.61603,4.44585,.89825,8.8161,2.1243,13.095,3.6261,1.274,.44715,2.73515-.50817,3.0753-1.7461,.37901-1.37937-.46745-2.62652-1.7461-3.0753C47.82195,5.12165,31.2588,3.6356,15.11839,6.30519c-4.53218,.74961-8.99807,1.84099-13.37799,3.22345C-1.31727,10.49374-.01125,15.32246,3.0696,14.35003h0Z" />
              <path d="M55.97417,3.76117l2.58581,4.86421,1.32984,2.5016,.66492,1.2508c.08649,.16269,.16913,.42327,.29552,.55591-.51452-.53997,1.42541-2.15361,.51312-1.82543-.8054,.28974-1.58804,.8423-2.34456,1.24356-.82749,.4389-1.65498,.87781-2.48247,1.31671-1.65498,.87781-3.30996,1.75562-4.96494,2.63342-1.15699,.61367-1.60767,2.31798-.89688,3.42047,.75851,1.17651,2.18291,1.55329,3.42047,.89688,1.93081-1.02411,3.86162-2.04822,5.79243-3.07233,.91943-.48767,1.83887-.97534,2.7583-1.46301,1.14784-.60882,2.34415-1.1119,2.8815-2.38522,.54904-1.30103,.0367-2.54313-.58127-3.70559l-1.55149-2.91853c-1.03432-1.94569-2.06865-3.89137-3.10297-5.83706-.61473-1.15638-2.31725-1.60814-3.42047-.89688-1.17565,.75796-1.55443,2.18355-.89688,3.42047h0Z" />
            </svg>
            <Image
              src={exampleSVG}
              alt="Photo from webcam"
              className="flex-1 max-w-40 rounded-xl bg-zinc-200"
              priority
              sizes="10rem"
            />
          </div>
          <Paragraph>
            Upload or capture a photo of your face, preferably at a slight
            angle. Then we&rsquo;ll use AI to generate a line avatar for you.{" "}
            <strong>For free!</strong>
          </Paragraph>
          <div className="flex flex-wrap -m-2 *:m-2">
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
              variant="soft"
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
          </div>
        </>
      )}
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
