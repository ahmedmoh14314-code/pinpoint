// Uses the same styles as Product
import PageNav from "../components/PageNav";
import styles from "./Product.module.css";

export default function Product() {
  return (
    <main className={styles.product}>
      <PageNav />
      <section>
        <div>
          <h2>
            Simple pricing.
            <br />
            Just $9/month.
          </h2>
          <p>
            One price, every feature. Unlimited cities, unlimited notes, and
            the map stays yours to export whenever you want it. No tiers to
            compare and nothing held back for a plan above this one.
          </p>
        </div>
        <img src="img-2.jpg" alt="A camper van on an empty desert road" />
      </section>
    </main>
  );
}
