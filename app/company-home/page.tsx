"use client";

import { useRouter } from "next/navigation";
import styles from "./company-home.module.css";

export default function CompanyHomePage() {
  const router = useRouter();

  return (
    <div className={styles.page}>
      <div className={styles.overlay}>
        <div className={styles.card}>
          <h1>Welcome, Company</h1>
          <p>
            Manage clients, projects, and design workflow from your company
            portal.
          </p>

          <button onClick={() => router.push("/company-dashboard")}>
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}