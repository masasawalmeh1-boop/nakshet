<div className={styles.topbarRight}>
  <button className={styles.alertBtn} type="button" aria-label="Notifications">
    <Bell size={18} strokeWidth={2.2} />
  </button>

  <button
    type="button"
    className={styles.themeToggleBtn}
    onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
  >
    {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    {theme === "dark" ? "Light Mode" : "Dark Mode"}
  </button>

  <div className={styles.profileBox}>
    <div className={styles.avatar}>
      {currentUser?.name?.charAt(0)?.toUpperCase() || "D"}
    </div>
    <div>
      <strong>{currentUser?.name || "Designer"}</strong>
      <span>{currentUser?.email || "designer@nakshat.com"}</span>
    </div>
  </div>

  <button className={styles.logoutBtn} onClick={handleLogout}>
    Logout
  </button>
</div>