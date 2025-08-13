"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthDebug() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (session) {
    return (
      <div style={{ padding: "20px", border: "1px solid green", margin: "10px" }}>
        <h3>✅ Authenticated</h3>
        <p><strong>Name:</strong> {session.user?.name}</p>
        <p><strong>Email:</strong> {session.user?.email}</p>
        <p><strong>ID Token exists:</strong> {session.idToken ? "Yes" : "No"}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", border: "1px solid red", margin: "10px" }}>
      <h3>❌ Not authenticated</h3>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    </div>
  );
}
