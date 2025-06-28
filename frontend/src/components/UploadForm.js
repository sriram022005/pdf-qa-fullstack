import axios from 'axios';
import { useState } from 'react';

function UploadForm() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const upload = async () => {
    if (!file) return setMessage("Please select a PDF file");

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://127.0.0.1:8000/upload', formData);
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Upload failed");
    }
  };

  return (
    <div>
      <h2>Upload PDF</h2>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={upload}>Upload</button>
      <p>{message}</p>
    </div>
  );
}

export default UploadForm;
