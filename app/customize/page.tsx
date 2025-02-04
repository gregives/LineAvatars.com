"use client";

import { Avatar } from "@/components/Avatar";
import { AvatarPlaceholder } from "@/components/AvatarPlaceholder";
import { Button } from "@/components/Button";
import { ColorPicker } from "@/components/ColorPicker";
import { Container } from "@/components/Container";
import { DownloadButton } from "@/components/DownloadButton";
import { Paragraph } from "@/components/Paragraph";
import { Saved } from "@/components/Saved";
import { Wrap } from "@/components/Wrap";
import { AvatarData } from "@/types";
import { capitalizeFirstLetter } from "@/utilities/constants";
import { mdiAutorenew } from "@mdi/js";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useLocalStorage } from "usehooks-ts";

const CUSTOMIZABLE_FEATURES = [
  "outline",
  "background",
  "hair",
  "body",
  "face",
  "clothes",
  "accessories",
  "eyes",
  "eyebrows",
  "nose",
  "lips",
  "shadow",
  "ears",
] as const;

type CustomizableFeature = (typeof CUSTOMIZABLE_FEATURES)[number];

function CustomizeAvatar() {
  const [avatars, setAvatars] = useLocalStorage<AvatarData[]>("avatars", [], {
    initializeWithValue: false,
  });

  const searchParams = useSearchParams();

  const avatarId = searchParams.get("avatar");
  const avatar = avatars.find((avatar) => avatar.id === avatarId);

  const updateColor = (feature: CustomizableFeature, color: string) => {
    const avatarIndex = avatars.findIndex((avatar) => avatar.id === avatarId);

    avatars[avatarIndex].customizations = {
      ...avatars[avatarIndex].customizations,
      colors: {
        ...avatars[avatarIndex].customizations?.colors,
        [feature]: color,
      },
    };

    setAvatars([...avatars]);
  };

  const resetColor = (feature: CustomizableFeature) => {
    const avatarIndex = avatars.findIndex((avatar) => avatar.id === avatarId);

    delete avatars[avatarIndex].customizations?.colors?.[feature];

    setAvatars([...avatars]);
  };

  return (
    <>
      <div className="w-40 my-6">
        {avatar ? (
          <Avatar id="download" avatar={avatar} />
        ) : (
          <AvatarPlaceholder />
        )}
      </div>
      <div className="space-y-2">
        {CUSTOMIZABLE_FEATURES.map((feature) => (
          <div key={feature} className="flex items-center space-x-2">
            <h2 className="mr-auto">{capitalizeFirstLetter(feature)}</h2>
            <Button color="zinc" size="xs" onClick={() => resetColor(feature)}>
              Reset
            </Button>
            <ColorPicker
              size="sm"
              color={avatar?.customizations?.colors?.[feature]}
              onChange={(color) => updateColor(feature, color)}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default function CustomizePage() {
  return (
    <Container>
      <h1 className="font-semibold">Customize your avatar</h1>
      <Suspense
        fallback={
          <>
            <div className="w-40 my-6">
              <AvatarPlaceholder />
            </div>
            <Paragraph>Loading&hellip;</Paragraph>
          </>
        }
      >
        <CustomizeAvatar />
      </Suspense>
      <Wrap className="mt-6">
        <DownloadButton />
        <Button color="zinc" leadingIcon={mdiAutorenew} href="/">
          Generate another
        </Button>
      </Wrap>
      <Saved />
    </Container>
  );
}
