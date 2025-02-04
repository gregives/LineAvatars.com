import { customAlphabet, customRandom } from "nanoid";
// @ts-ignore
import seedrandom from "seedrandom";

const ALPHABET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const generateId = customAlphabet(ALPHABET, 20);
