"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (
      normalizedEmail === "designer@nakshat.com" &&
      normalizedPassword === "123456"
    ) {
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          id: 2,
          name: "Sara Designer",
          email: "designer@nakshat.com",
          role: "designer",
        })
      );

      setSuccessMessage("Login successful. Redirecting...");

      setTimeout(() => {
        router.push("/designer-dashboard");
      }, 500);

      return;
    }

    if (
      normalizedEmail === "company@nakshat.com" &&
      normalizedPassword === "123456"
    ) {
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          id: 3,
          name: "Company User",
          email: "company@nakshat.com",
          role: "company",
        })
      );

      setSuccessMessage("Login successful. Redirecting...");

      setTimeout(() => {
        router.push("/company-home");
      }, 500);

      return;
    }

    if (
      normalizedEmail === "client@nakshat.com" &&
      normalizedPassword === "123456"
    ) {
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          id: 4,
          name: "Client User",
          email: "client@nakshat.com",
          role: "client",
        })
      );

      setSuccessMessage("Login successful. Redirecting...");

      setTimeout(() => {
        router.push("/client-dashboard");
      }, 500);

      return;
    }

    setErrorMessage("Invalid email or password.");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>
        <p className={styles.subtitle}>Welcome back to Nakshat</p>

        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          {successMessage && <p className={styles.success}>{successMessage}</p>}

          <button className={styles.button} type="submit">
            Login
          </button>
        </form>

        <div style={{ marginTop: "16px", fontSize: "14px", color: "#666" }}>
          <p><strong>Designer:</strong> designer@nakshat.com / 123456</p>
          <p><strong>Company:</strong> company@nakshat.com / 123456</p>
          <p><strong>Client:</strong> client@nakshat.com / 123456</p>
        </div>
      </div>
    </div>
  );
}