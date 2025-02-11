import { mdiDownload, mdiStar } from "@mdi/js";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { useState } from "react";
import { Logo } from "./Logo";
import { Paragraph } from "./Paragraph";
import { Wrap } from "./Wrap";
import Image from "next/image";
import signature from "@/assets/signature.svg";
import { DonateButton } from "./DonateButton";

function download(filename: string, avatar: string) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:image/svg+xml;charset=utf-8," + encodeURIComponent(avatar)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

type DownloadButtonProperties = React.ComponentProps<typeof Button>;

export function DownloadButton(properties: DownloadButtonProperties) {
  const [open, setOpen] = useState(false);

  const downloadAvatar = () => {
    const avatar = document.getElementById("download");

    if (avatar) {
      const shadowRoot = avatar.shadowRoot;

      if (shadowRoot) {
        download(
          "avatar-" +
            new Date().toISOString().split(/\D/).slice(0, 6).join("") +
            ".svg",
          shadowRoot.innerHTML
        );
      }
    }

    setOpen(true);
  };

  return (
    <>
      <Button
        leadingIcon={mdiDownload}
        {...properties}
        onClick={downloadAvatar}
      >
        Download
      </Button>
      <Modal open={open} onClose={setOpen}>
        <h2 className="font-semibold">We hope you like your avatar</h2>
        <Paragraph className="my-6">
          If you want to show your appreciation for your new avatar, please
          consider donating. Just $1 will help us to make <Logo /> even better.
        </Paragraph>
        <Image
          src={signature}
          alt="Greg Ives"
          className="max-w-28 -ml-1 mb-1"
        />
        <Paragraph className="text-sm mb-6">
          Creator of <Logo />
        </Paragraph>
        <Wrap>
          <DonateButton />
          <Button color="zinc" onClick={() => setOpen(false)}>
            No thanks
          </Button>
        </Wrap>
      </Modal>
    </>
  );
}
