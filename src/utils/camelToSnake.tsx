export default function camelToSnake(camelWord: string) {
  return camelWord
    .split("")
    .map((letter) => {
      return letter === letter.toUpperCase() ? `_${letter.toLowerCase()}` : letter;
    })
    .join("");
}
