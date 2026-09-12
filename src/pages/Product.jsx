import PageNav from "../components/PageNav";
import styles from "./Product.module.css";

export default function Product() {
  return (
    <main className={styles.product}>
      <PageNav />
      <section>
        <img
          src="img-1.jpg"
          alt="A paper map with field notes, a camera and a backpack laid on top"
        />
        <div>
          <h2>About Pinpoint.</h2>
          <p>
            Photo albums tell you what a trip looked like. They are worse at
            telling you where you went, in what order, and how much of a
            country you actually saw. Pinpoint is the other half of that: a
            map that fills in as you travel.
          </p>
          <p>
            Click anywhere on the map to log a city. Pinpoint reads the
            position and fills in the city and country for you, so all you add
            is the date and what you want to remember about it. Cities group
            themselves by country on their own.
          </p>
        </div>
      </section>
    </main>
  );
}
