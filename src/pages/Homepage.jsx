import { Link } from "react-router-dom";
import styles from "./Homepage.module.css";
import PageNav from "../components/PageNav";

export default function Homepage() {
  return (
    <main className={styles.homepage}>
      <PageNav />
      <section>
        <h1>
          Drop a pin.
          <br />
          Keep the memory.
        </h1>
        <h2>
          Pinpoint is a map of the places you have actually stood in. Log a
          city, write down what happened there, and watch the map fill in one
          trip at a time.
        </h2>
        <Link to="/login" className="cta">
          Drop your first pin
        </Link>
      </section>
    </main>
  );
}
