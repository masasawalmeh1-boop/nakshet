"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter email and password.");
      return;
    }

    localStorage.setItem(
      "loggedInUser",
      JSON.stringify({
        id: 2,
        name: "Sara Designer",
        email: email.trim().toLowerCase(),
        role: "designer",
      })
    );

    setSuccessMessage("Login successful. Redirecting...");

    setTimeout(() => {
      router.push("/designer-dashboard");
    }, 500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div>

      <div className={styles.loginBox}>
        <div className={styles.leftSide}>
          <h1>NAKSHET ADS</h1>
          <p>
            Manage your marketing projects, designs, approvals,
            and reports in one place.
          </p>
        </div>

        <div className={styles.rightSide}>
          <h2>Login</h2>
          <p className={styles.subtitle}>Sign in to your account</p>

          <form className={styles.form} onSubmit={handleLogin}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {errorMessage && (
              <p className={styles.errorMessage}>{errorMessage}</p>
            )}

            {successMessage && (
              <p className={styles.successMessage}>{successMessage}</p>
            )}

            <div className={styles.options}>
              <label className={styles.remember}>
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#">Forgot Password?</a>
            </div>

            <button type="submit" className={styles.loginBtn}>
              Login
            </button>
          </form>

          <p className={styles.footerText}>
            Don&apos;t have an account? <a href="/register">Create Account</a>
          </p>
        </div>
      </div>
    </div>
  );
}