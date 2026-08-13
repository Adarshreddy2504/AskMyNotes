import { useState } from "react";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const askQuestion = async () => {
    const cleanedQuestion = question.trim();

    // Check if question is empty
    if (!cleanedQuestion) {
      setError("Please enter a question.");
      setAnswer("");
      return;
    }

    // Start loading
    setLoading(true);
    setError("");
    setAnswer("");

    try {
      // Send question to deployed ML model
      const response = await fetch(
        "http://localhost:8000/ask",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            question: cleanedQuestion,
          }),
        }
      );

      // Check for HTTP errors
      if (!response.ok) {
        throw new Error(
          `Backend returned status ${response.status}`
      );
      }

      // Convert response to JSON
      const data = await response.json();

      console.log("Model response:", data);

      // Your API returns predicted_category
      setAnswer(data.answer);
    } catch (err) {
      console.error("Error:", err);

      setError(
        "Unable to connect to the backend. Please try again."
      );
    } finally {
      // Stop loading
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <section className="card">
        <h1>Ask My Notes</h1>

        <p>
          Enter a question and let the ML model classify it.
        </p>

        <label htmlFor="question">
          Your question
        </label>

        <textarea
          id="question"
          value={question}
          onChange={(event) =>
            setQuestion(event.target.value)
          }
          placeholder="For example: What is Docker?"
          rows="5"
        />

        <button
          onClick={askQuestion}
          disabled={loading}
        >
          {loading ? "Predicting..." : "Ask Question"}
        </button>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {answer && (
          <div className="answer">
            <h2>Predicted Category</h2>

            <p>{answer}</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;