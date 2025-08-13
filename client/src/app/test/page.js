"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function TestPage() {
  const { data: session, status } = useSession();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testAPICall = async () => {
    try {
      setError(null);
      setResult("Loading...");
      
      if (!session) {
        throw new Error("No session found");
      }

      console.log("Session:", session);
      console.log("ID Token exists:", !!session.idToken);

      const response = await fetch("http://localhost:5000/v1/subscription", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${session.idToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error("API Test Error:", err);
      setError(err.message);
      setResult(null);
    }
  };

  if (status === "loading") return <p>Loading session...</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>API Test Page</h1>
      
      <div style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc" }}>
        <h3>Session Status</h3>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>User:</strong> {session?.user?.email || "Not logged in"}</p>
        <p><strong>ID Token:</strong> {session?.idToken ? "✅ Present" : "❌ Missing"}</p>
      </div>

      <button 
        onClick={testAPICall}
        style={{ 
          padding: "10px 20px", 
          backgroundColor: "#007bff", 
          color: "white", 
          border: "none", 
          borderRadius: "4px",
          cursor: "pointer"
        }}
        disabled={!session}
      >
        Test API Call
      </button>

      {error && (
        <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#ffe6e6", border: "1px solid red" }}>
          <h4>Error:</h4>
          <pre>{error}</pre>
        </div>
      )}

      {result && (
        <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#e6ffe6", border: "1px solid green" }}>
          <h4>Result:</h4>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}
