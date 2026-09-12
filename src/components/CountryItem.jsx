import styles from "./CountryItem.module.css";
import Flag from "./Flag";

function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      <span>
        <Flag emoji={country.emoji} country={country.country} />
      </span>
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
