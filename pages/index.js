import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Muna LD API - demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Muna LD API - demo</h1>

        <p className={styles.description}>
          Sanity to JSON-LD PoC!
        </p>
        <ul>
          <li>
            <Link href="/api/json">
              <a>api/json</a>
            </Link>
          </li>
          <li>
            <Link href="/api/json/id/ubm-bf-diby-000358">
              <a>api/json/id/ubm-bf-diby-000358</a>
            </Link>
          </li>
          <li>
            <Link href="/api/json/id/ubm-bf-diby-000409">
              <a>api/json/id/ubm-bf-diby-000409</a>
            </Link>
          </li>
          <li>
            <Link href="/api/rdf">
              <a>api/rdf</a>
            </Link>
          </li>
          <li>
            <Link href="/api/rdf/id/ubm-bf-diby-000409">
              <a>api/rdf/id/ubm-bf-diby-000409</a>
            </Link>
          </li>
        </ul>

        <p className={styles.description}>
          <Link href="https://github.com/seidhr/marcus-ld-api">Github</Link>
        </p>
      </main>
    </div>
  );
}
