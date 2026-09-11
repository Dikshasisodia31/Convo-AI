import { useState } from 'react'
import axios from "axios";
import './App.css'

function App() {

  const [conversation, setConversation] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAnalyze = async () => {
    if (!conversation.trim()) {
      setMessage("Please enter a conversation first to analyze");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        "http://localhost:3000/api/conversations",
        {
          content: conversation,
        }
      );

      const conversationId = response.data.data._id;

      const analyzeResponse = await axios.post(
        `http://localhost:3000/api/conversations/${conversationId}/analyze`
      );

      setAnalysis(
        analyzeResponse.data.data.analysis
      );

      setMessage("Conversation analyzed successfully! 🎉");
      setConversation("");
    } catch (err) {
      console.log("Error in fetching data");
      setMessage(
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrap">
      <p className="eyebrow">Conversation analysis</p>
      <h1>Welcome to CONVO-AI</h1>
      <p className="sub">
        Turn overwhelming conversations into actionable insights.
      </p>

      <div className="transcript-field">
        <textarea
          value={conversation}
          onChange={(e) => setConversation(e.target.value)}
          placeholder='Paste your conversation here ..'
          rows={15}>
        </textarea>
      </div>

      <div className="actions">
        <button onClick={handleAnalyze} disabled={loading}>
          {loading ? "Analyzing ... " : "✨ Analyze Conversation"}
        </button>

        {message && <p className="status-msg">{message}</p>}

        {analysis && (
          <div>
          <h2>Here is AI insights of your project</h2>

          <section>
            <h3>Summary</h3>
            <p>{analysis.summary}</p>
          </section>

          <section>
            <h3>Tasks</h3>
            {analysis.tasks.length == 0 ? (
              <p>No tasks found</p>
            ) : (
              <ul>
                {analysis.tasks.map((task,index) => {
                  <li
                  key ={index}>
                    <strong>{task.task}</strong>
                    <br></br>
                    <strong>{task.assignedTo}</strong>
                    <br></br>
                    <strong>{task.deadline}</strong>
                  </li>
                })}
              </ul>
            )}
          </section>

          <section>
            <h3>🚧 Blockers</h3>

            {analysis.blockers.length === 0 ? (
              <p>No blockers found.</p>
            ) : (
              <ul>
                {analysis.blockers.map((blocker, index) => (
                  <li key={index}>{blocker}</li>
                ))}
              </ul>
            )}
          </section>

          {/* Decisions */}
          <section>
            <h3>Decisions</h3>

            {analysis.decisions.length === 0 ? (
              <p>No decisions found.</p>
            ) : (
              <ul>
                {analysis.decisions.map((decision, index) => (
                  <li key={index}>{decision}</li>
                ))}
              </ul>
            )}
          </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default App
