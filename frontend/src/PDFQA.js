import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

export default function PDFQA() {
  
  const [uploadedFilename, setUploadedFilename] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:8000/upload', formData);
        setUploadedFilename(response.data.filename);
        setMessages((prev) => [...prev, { type: 'system', text: `📄 Uploaded: ${file.name}` }]);
      } catch (err) {
        console.error('Upload failed', err);
        setMessages((prev) => [...prev, { type: 'system', text: '❌ Upload failed' }]);
      } finally {
        setUploading(false);
      }
    } else {
      alert('Please upload a valid PDF file');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !uploadedFilename) return;
    const question = input.trim();
    setMessages((prev) => [...prev, { type: 'user', text: question }]);
    setInput('');

    try {
      const response = await axios.post('http://localhost:8000/ask', {
        filename: uploadedFilename,
        question: question,
      });
      setMessages((prev) => [...prev, { type: 'bot', text: response.data.answer }]);
    } catch (error) {
      console.error('Error getting answer:', error);
      setMessages((prev) => [...prev, { type: 'bot', text: '❌ Error getting answer' }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chatgpt-wrapper">
      <header className="chat-header">
        <h1>PDF Chat Assistant</h1>
        <label className="upload-label">
          {uploading ? 'Uploading...' : 'Upload PDF'}
          <input type="file" accept="application/pdf" onChange={handleFileChange} hidden />
        </label>
      </header>

      <div className="chat-body">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-msg ${msg.type}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <footer className="chat-footer">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask a question..."
        ></textarea>
        <button onClick={handleSend}>Send</button>
      </footer>
    </div>
  );
}