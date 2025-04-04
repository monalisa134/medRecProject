import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [symptoms, setSymptoms] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");

  const handlePredict = async () => {
    if (!symptoms) {
      toast.error("Please enter symptoms.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/predict", {
        symptoms: symptoms.split(",")
      });
      setPrediction(response.data);
    } catch (error) {
      toast.error("Prediction failed. Check backend.");
    }
  };

  const handleChat = async () => {
    if (!userMessage) return;
    setChatMessages([...chatMessages, { sender: "You", message: userMessage }]);
    try {
      const response = await axios.post("http://localhost:5000/chat", {
        message: userMessage
      });
      setChatMessages([...chatMessages, { sender: "You", message: userMessage }, { sender: "AI", message: response.data.response }]);
    } catch (error) {
      toast.error("Chat failed. Check backend.");
    }
    setUserMessage("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Disease Predictor & AI Chatbot</h1>
      
      {/* Disease Predictor */}
      <div>
        <h2>Enter Symptoms</h2>
        <input
          type="text"
          placeholder="e.g., fever, cough"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          style={{ width: "300px", padding: "10px" }}
        />
        <button onClick={handlePredict} style={{ marginLeft: "10px", padding: "10px" }}>Predict</button>
      </div>
      {prediction && (
        <div>
          <h3>Prediction: {prediction.disease}</h3>
        </div>
      )}
      
      {/* Chatbot */}
      <div style={{ marginTop: "30px" }}>
        <h2>AI Chatbot</h2>
        <div style={{ border: "1px solid black", padding: "10px", height: "200px", overflowY: "scroll" }}>
          {chatMessages.map((msg, index) => (
            <p key={index}><b>{msg.sender}:</b> {msg.message}</p>
          ))}
        </div>
        <input
          type="text"
          placeholder="Ask me anything..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          style={{ width: "300px", padding: "10px", marginTop: "10px" }}
        />
        <button onClick={handleChat} style={{ marginLeft: "10px", padding: "10px" }}>Send</button>
      </div>
      
      <ToastContainer />
    </div>
  );
}

export default App;
