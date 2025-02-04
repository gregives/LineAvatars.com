import { AvatarData } from "@/types";
import Link from "next/link";
import { useLocalStorage } from "usehooks-ts";
import { Avatar } from "./Avatar";

export function Saved() {
  const [avatars] = useLocalStorage<AvatarData[]>("avatars", [], {
    initializeWithValue: false,
  });

  if (avatars.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="font-semibold">Avatars you&rsquo;ve generated</h2>
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-6">
        {avatars.map((avatar) => (
          <Link
            key={avatar.id}
            className="rounded-xl"
            href={`/customize?avatar=${avatar.id}`}
          >
            <Avatar avatar={avatar} />
          </Link>
        ))}
      </div>
    </div>
  );
}
