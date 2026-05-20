export default function OnboardingPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f5f5f3",
        padding: 24
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 620,
          background: "#ffffff",
          border: "1px solid #e4e4e7",
          borderRadius: 14,
          padding: 24,
          boxShadow: "0 8px 24px rgba(16,24,40,0.06)"
        }}
      >
        <h1
          style={{
            margin: "0 0 10px",
            fontSize: 34,
            fontFamily: "Georgia, 'Times New Roman', serif"
          }}
        >
          Onboarding
        </h1>
        <p style={{ margin: 0, color: "#52525b", lineHeight: 1.5 }}>
          Onboarding coming soon.
        </p>
      </section>
    </main>
  );
}
