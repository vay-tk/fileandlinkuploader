// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './App.css';

// const API_BASE_URL = 'http://localhost:5000/api';

// function App() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   const checkAuth = () => {
//     const token = localStorage.getItem('token');
//     const userData = localStorage.getItem('user');
    
//     if (token && userData) {
//       setUser(JSON.parse(userData));
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     }
//     setLoading(false);
//   };

//   const handleLogin = (token, userData) => {
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(userData));
//     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     setUser(userData);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     delete axios.defaults.headers.common['Authorization'];
//     setUser(null);
//   };

//   if (loading) {
//     return (
//       <div className="app">
//         <div className="loading">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="app">
//       {user ? (
//         <Dashboard user={user} onLogout={handleLogout} />
//       ) : (
//         <AuthForm onLogin={handleLogin} />
//       )}
//     </div>
//   );
// }

// function AuthForm({ onLogin }) {
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: ''
//   });
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');

//     try {
//       const endpoint = isLogin ? '/auth/login' : '/auth/register';
//       const payload = isLogin 
//         ? { email: formData.email, password: formData.password }
//         : formData;

//       const response = await axios.post(`${API_BASE_URL}${endpoint}`, payload);
      
//       setMessage(response.data.message);
//       onLogin(response.data.token, response.data.user);
//     } catch (error) {
//       setMessage(error.response?.data?.message || 'An error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <h2>{isLogin ? 'Login' : 'Register'}</h2>
        
//         {message && (
//           <div className={`alert ${message.includes('error') || message.includes('Invalid') ? 'alert-error' : 'alert-success'}`}>
//             {message}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           {!isLogin && (
//             <div className="form-group">
//               <label htmlFor="username">Username</label>
//               <input
//                 type="text"
//                 id="username"
//                 name="username"
//                 className="form-control"
//                 value={formData.username}
//                 onChange={handleChange}
//                 required={!isLogin}
//               />
//             </div>
//           )}

//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               className="form-control"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               className="form-control"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               minLength="6"
//             />
//           </div>

//           <button type="submit" className="btn btn-primary" disabled={loading}>
//             {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
//           </button>
//         </form>

//         <div className="auth-switch">
//           {isLogin ? "Don't have an account? " : "Already have an account? "}
//           <button type="button" onClick={() => setIsLogin(!isLogin)}>
//             {isLogin ? 'Register' : 'Login'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Dashboard({ user, onLogout }) {
//   return (
//     <div className="container">
//       <header className="header">
//         <h1>File & Link Manager</h1>
//         <div className="user-info">
//           <span>Welcome, {user.username}!</span>
//           <button className="logout-btn" onClick={onLogout}>
//             Logout
//           </button>
//         </div>
//       </header>

//       <div className="main-content">
//         <UploadSection />
//         <SubmissionsSection />
//       </div>
//     </div>
//   );
// }

// function UploadSection() {
//   const [activeTab, setActiveTab] = useState('link');
//   const [linkUrl, setLinkUrl] = useState('');
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleLinkSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');

//     try {
//       const formData = new FormData();
//       formData.append('link', linkUrl);

//       const response = await axios.post(`${API_BASE_URL}/upload`, formData);
//       setMessage(response.data.message);
//       setLinkUrl('');
//     } catch (error) {
//       setMessage(error.response?.data?.message || 'Error uploading link');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedFile) {
//       setMessage('Please select a file');
//       return;
//     }

//     setLoading(true);
//     setMessage('');

//     try {
//       const formData = new FormData();
//       formData.append('file', selectedFile);

//       const response = await axios.post(`${API_BASE_URL}/upload`, formData);
//       setMessage(response.data.message);
//       setSelectedFile(null);
//     } catch (error) {
//       setMessage(error.response?.data?.message || 'Error uploading file');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   return (
//     <div className="upload-section">
//       <h2>Upload Content</h2>

//       {message && (
//         <div className={`alert ${message.includes('error') || message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
//           {message}
//         </div>
//       )}

//       <div className="upload-tabs">
//         <button
//           className={`tab-btn ${activeTab === 'link' ? 'active' : ''}`}
//           onClick={() => setActiveTab('link')}
//         >
//           Submit Link
//         </button>
//         <button
//           className={`tab-btn ${activeTab === 'file' ? 'active' : ''}`}
//           onClick={() => setActiveTab('file')}
//         >
//           Upload File
//         </button>
//       </div>

//       {activeTab === 'link' ? (
//         <form onSubmit={handleLinkSubmit}>
//           <div className="form-group">
//             <label htmlFor="linkUrl">Website URL</label>
//             <input
//               type="url"
//               id="linkUrl"
//               className="form-control"
//               value={linkUrl}
//               onChange={(e) => setLinkUrl(e.target.value)}
//               placeholder="https://example.com"
//               required
//             />
//           </div>
//           <button type="submit" className="btn btn-primary" disabled={loading}>
//             {loading ? 'Submitting...' : 'Submit Link'}
//           </button>
//         </form>
//       ) : (
//         <form onSubmit={handleFileSubmit}>
//           <div className="file-input-group">
//             <input
//               type="file"
//               id="fileInput"
//               className="file-input"
//               onChange={handleFileChange}
//               accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt"
//             />
//             <label htmlFor="fileInput" className="file-input-label">
//               {selectedFile ? selectedFile.name : 'Click to select a file or drag and drop'}
//             </label>
//           </div>
          
//           {selectedFile && (
//             <div className="file-preview">
//               <strong>Selected file:</strong> {selectedFile.name}
//               <br />
//               <strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
//               <br />
//               <strong>Type:</strong> {selectedFile.type}
//             </div>
//           )}

//           <button type="submit" className="btn btn-primary" disabled={loading || !selectedFile}>
//             {loading ? 'Uploading...' : 'Upload File'}
//           </button>
//         </form>
//       )}
//     </div>
//   );
// }

// function SubmissionsSection() {
//   const [submissions, setSubmissions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchSubmissions();
//   }, []);

//   const fetchSubmissions = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/submissions`);
//       setSubmissions(response.data.submissions);
//     } catch (error) {
//       console.error('Error fetching submissions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="submissions-section">
//         <h2>Your Submissions</h2>
//         <div className="loading">Loading submissions...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="submissions-section">
//       <h2>Your Submissions</h2>
      
//       {submissions.length === 0 ? (
//         <p>No submissions yet. Upload a file or submit a link to get started!</p>
//       ) : (
//         <div>
//           {submissions.map((submission) => (
//             <div key={submission.id} className="submission-item">
//               <span className={`submission-type ${submission.type}`}>
//                 {submission.type}
//               </span>
//               <div className="submission-content">
//                 {submission.type === 'link' ? (
//                   <a href={submission.content} target="_blank" rel="noopener noreferrer">
//                     {submission.content}
//                   </a>
//                 ) : (
//                   <>
//                     <strong>{submission.content}</strong>
//                     {submission.fileSize && (
//                       <span> ({(submission.fileSize / 1024 / 1024).toFixed(2)} MB)</span>
//                     )}
//                   </>
//                 )}
//               </div>
//               <div className="submission-date">
//                 {formatDate(submission.createdAt)}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;









import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  };

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <AuthForm onLogin={handleLogin} />
      )}
    </div>
  );
}

function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await axios.post(`${API_BASE_URL}${endpoint}`, payload);
      
      setMessage(response.data.message);
      onLogin(response.data.token, response.data.user);
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'FORM' : 'Register'}</h2>
        
        {message && (
          <div className={`alert ${message.includes('error') || message.includes('Invalid') ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder='mail@gmail.com'
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder='****************'
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Login' : '')}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? "" : "Already have an account? "}
          <button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? '' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  return (
    <div className="container">
      <header className="header">
        <h1>File & Link Manager</h1>
        <div className="user-info">
          <span>Welcome, {user.username}!</span>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="main-content">
        <UploadSection />
        <SubmissionsSection />
      </div>
    </div>
  );
}

function UploadSection() {
  const [activeTab, setActiveTab] = useState('link');
  const [linkUrl, setLinkUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('link', linkUrl);

      const response = await axios.post(`${API_BASE_URL}/upload`, formData);
      setMessage(response.data.message);
      setLinkUrl('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error uploading link');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage('Please select a file');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post(`${API_BASE_URL}/upload`, formData);
      setMessage(response.data.message);
      setSelectedFile(null);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="upload-section">
      <h2>Upload Content</h2>

      {message && (
        <div className={`alert ${message.includes('error') || message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <div className="upload-tabs">
        <button
          className={`tab-btn ${activeTab === 'link' ? 'active' : ''}`}
          onClick={() => setActiveTab('link')}
        >
          Submit Link
        </button>
        <button
          className={`tab-btn ${activeTab === 'file' ? 'active' : ''}`}
          onClick={() => setActiveTab('file')}
        >
          Upload File
        </button>
      </div>

      {activeTab === 'link' ? (
        <form onSubmit={handleLinkSubmit}>
          <div className="form-group">
            <label htmlFor="linkUrl">Website URL</label>
            <input
              type="url"
              id="linkUrl"
              className="form-control"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Link'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleFileSubmit}>
          <div className="file-input-group">
            <input
              type="file"
              id="fileInput"
              className="file-input"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt"
            />
            <label htmlFor="fileInput" className="file-input-label">
              {selectedFile ? selectedFile.name : 'Click to select a file or drag and drop'}
            </label>
          </div>
          
          {selectedFile && (
            <div className="file-preview">
              <strong>Selected file:</strong> {selectedFile.name}
              <br />
              <strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              <br />
              <strong>Type:</strong> {selectedFile.type}
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading || !selectedFile}>
            {loading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>
      )}
    </div>
  );
}

function SubmissionsSection() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/submissions`);
      setSubmissions(response.data.submissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (submissionId, filename) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/download/${submissionId}`, {
        responseType: 'blob'
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading file. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="submissions-section">
        <h2>Your Submissions</h2>
        <div className="loading">Loading submissions...</div>
      </div>
    );
  }

  return (
    <div className="submissions-section">
      <h2>Your Submissions</h2>
      
      {submissions.length === 0 ? (
        <p>No submissions yet. Upload a file or submit a link to get started!</p>
      ) : (
        <div>
          {submissions.map((submission) => (
            <div key={submission.id} className="submission-item">
              <span className={`submission-type ${submission.type}`}>
                {submission.type}
              </span>
              <div className="submission-content">
                {submission.type === 'link' ? (
                  <>
                    <div>{submission.content}</div>
                  </>
                ) : (
                  <>
                    <strong>{submission.content}</strong>
                    {submission.fileSize && (
                      <span> ({(submission.fileSize / 1024 / 1024).toFixed(2)} MB)</span>
                    )}
                  </>
                )}
              </div>
              <div className="submission-date">
                {formatDate(submission.createdAt)}
              </div>
              <div className="submission-actions">
                {submission.type === 'link' ? (
                  <a 
                    href={submission.content} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-link"
                  >
                    🔗 Open Link
                  </a>
                ) : (
                  <button
                    onClick={() => handleDownload(submission.id, submission.content)}
                    className="btn-download"
                  >
                    📥 Download
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;