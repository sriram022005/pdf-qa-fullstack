import axios from 'axios';
import { useState } from 'react';

function AskQuestion() {
  const [filename, setFilename] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const ask = async () => {
    if (!filename || !question) return;

    try {
      const res = await axios.post('http://localhost:8000/ask', {
        filename,
        question
      });
      setAnswer(res.data.answer);
    } catch (err) {
      setAnswer("Error getting answer");
    }
  };

  return (
    <div>
      <h2>Ask a Question</h2>
      <input placeholder="Filename (e.g., sample.pdf)" onChange={e => setFilename(e.target.value)} />
      <input placeholder="Your question" onChange={e => setQuestion(e.target.value)} />
      <button onClick={ask}>Ask</button>
      <p><strong>Answer:</strong> {answer}</p>
    </div>
  );
}

export default AskQuestion;
