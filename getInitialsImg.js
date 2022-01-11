import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-initials-sprites";

export function getInitalsImg(string) {
  if (!string) return;
  return createAvatar(style, {
    seed: string[0],
    dataUri: true,
  });
}
