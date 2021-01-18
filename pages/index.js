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
          <br />
          <Link href="/api/made-object">
            <a>api/made-object</a>
          </Link>
          <br />
          <Link href="/api/made-object/ubm-bf-diby-000358">
            <a>api/made-object/ubm-bf-diby-000358</a>
          </Link>
          <br />
          <Link href="/api/made-object/ubm-bf-diby-000409">
            <a>api/made-object/ubm-bf-diby-000409</a>
          </Link>
          <br />
        </p>
        <p className={styles.description}>
          Sanity JSON to RDF.
          <br />
          <Link href="/api/made-object/rdf">
            <a>api/made-object/rdf</a>
          </Link>
        </p>

        <p className={styles.description}>
          <Link href="https://github.com/seidhr/marcus-ld-api">Github</Link>
        </p>
      </main>
    </div>
  );
}
