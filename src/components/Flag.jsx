function emojiToCountryCode(emoji) {
  if (!emoji) return "";

  const characters = [...emoji];

  if (
    characters.length === 2 &&
    characters.every((char) => /^[A-Za-z]$/.test(char))
  ) {
    return emoji.toLowerCase();
  }

  return characters
    .map((char) => String.fromCharCode(char.codePointAt(0) - 127397))
    .join("")
    .toLowerCase();
}

function Flag({ emoji, country, className = "" }) {
  const countryCode = emojiToCountryCode(emoji);

  if (!countryCode) return null;

  return (
    <span
      className={`fi fi-${countryCode} ${className}`}
      role="img"
      aria-label={`${country} flag`}
      title={country}
    />
  );
}

export default Flag;
