export default function snakeToCamel(snake_word: string) {
  return snake_word
    .split("_")
    .map((word, index) => {
      return index != 0 ? word[0].toUpperCase().concat(word.slice(1, undefined)) : word;
    })
    .join("");
}
