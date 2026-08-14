import { useRef, useState } from "react";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  // -----------------------------
  // PDF selection
  // -----------------------------
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Please select a PDF file.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError("");
    setAnswer("");
  };

  // -----------------------------
  // Remove selected PDF
  // -----------------------------
  const removeFile = () => {
    setFile(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // -----------------------------
  // Upload PDF
  // -----------------------------
  const uploadPDF = async () => {
    if (!file) {
      setError("Please select a PDF first.");
      return;
    }

    setUploading(true);
    setError("");
    setAnswer("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      /*
       * This endpoint will be added to your FastAPI backend.
       */
      const response = await fetch(
        "http://localhost:8000/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Upload failed with status ${response.status}`
        );
      }

      const data = await response.json();

      setAnswer(
        data.message || "PDF uploaded successfully."
      );
    } catch (err) {
      console.error(err);

      setError(
        "Unable to upload the PDF. Please check the backend."
      );
    } finally {
      setUploading(false);
    }
  };

  // -----------------------------
  // Ask question
  // -----------------------------
  const askQuestion = async () => {
    const cleanedQuestion = question.trim();

    if (!cleanedQuestion) {
      setError("Please enter a question.");
      setAnswer("");
      return;
    }

    setLoading(true);
    setError("");
    setAnswer("");

    try {
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

      if (!response.ok) {
        throw new Error(
          `Backend returned status ${response.status}`
        );
      }

      const data = await response.json();

      console.log("Backend response:", data);

      setAnswer(data.answer);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to the backend. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">

      {/* Main Card */}
      <section className="card">

        {/* Header */}
        <header className="header">
          <h1>AskMyNotes</h1>

          <p>
            Upload your notes and ask questions from them.
          </p>
        </header>


        {/* PDF Upload */}
        <section className="upload-section">

          <h2>Upload your notes (PDF)</h2>

          <p className="upload-description">
            Upload a PDF and ask questions about your notes.
          </p>

          <div className="upload-area">

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              hidden
            />

            {!file ? (
              <button
                className="choose-button"
                onClick={() =>
                  fileInputRef.current.click()
                }
              >
                Choose PDF
              </button>
            ) : (
              <div className="file-selected">

                <div className="file-info">
                  <span className="pdf-icon">
                    PDF
                  </span>

                  <div>
                    <strong>{file.name}</strong>

                    <span>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>

                <button
                  className="remove-button"
                  onClick={removeFile}
                >
                  Remove
                </button>

              </div>
            )}

          </div>

          {file && (
            <button
              className="upload-button"
              onClick={uploadPDF}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload PDF"}
            </button>
          )}

        </section>


        {/* Divider */}
        <div className="divider">
          <span>OR</span>
        </div>


        {/* Question Section */}
        <section className="question-section">

          <label htmlFor="question">
            Your question
          </label>

          <textarea
            id="question"
            value={question}
            onChange={(event) =>
              setQuestion(event.target.value)
            }
            placeholder="What is AI?"
            rows="4"
          />

          <button
            className="ask-button"
            onClick={askQuestion}
            disabled={loading}
          >
            {loading ? "Thinking..." : "Ask"}
          </button>

        </section>


        {/* Error */}
        {error && (
          <div className="error">
            {error}
          </div>
        )}


        {/* Answer */}
        {answer && (
          <section className="answer-section">

            <h2>Answer</h2>

            <div className="answer-box">
              {answer}
            </div>

          </section>
        )}

      </section>

    </main>
  );
}

export default App;