export const capFirstLetters = (words) => {
  const wordsarray = words.split(" ");
  const newwordsarray = wordsarray.map((word) => {
    return capFirstLetter(word);
  });
  return newwordsarray.join(" ");
};

const capFirstLetter = (str) => {
  return str
    .split("")
    .map((letter, idx) => (idx === 0 ? letter.toUpperCase() : letter))
    .join("");
};
