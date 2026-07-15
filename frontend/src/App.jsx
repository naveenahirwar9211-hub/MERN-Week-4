import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [commentText, setCommentText] = useState({});

  // Fetch Posts when page loads
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await axios.get('https://mern-week-4-xrf4.onrender.com/api/posts');
    setPosts(res.data);
  };

  // Create Post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    await axios.post('https://mern-week-4-xrf4.onrender.com/api/posts', { author, content });
    setAuthor('');
    setContent('');
    fetchPosts(); // Refresh feed
  };

  // Like Post
  const handleLike = async (id) => {
    await axios.post(`https://mern-week-4-xrf4.onrender.com/api/posts/${id}/like`);
    fetchPosts();
  };

  // Submit Comment
  const handleComment = async (id) => {
    if (!commentText[id]) return;
    await axios.post(`https://mern-week-4-xrf4.onrender.com/api/posts/${id}/comment`, { comment: commentText[id] });
    setCommentText({ ...commentText, [id]: '' });
    fetchPosts();
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>MERN Social Media Feed</h2>
      
      {/* Create Post Section */}
      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Your Name" 
            value={author} 
            onChange={e => setAuthor(e.target.value)} 
            required 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <textarea 
            placeholder="What's on your mind?" 
            value={content} 
            onChange={e => setContent(e.target.value)} 
            required 
            style={{ padding: '10px', minHeight: '80px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Publish Post
          </button>
        </form>
      </div>

      {/* Feed Section */}
      <div>
        {posts.map(post => (
          <div key={post._id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px', borderRadius: '8px', background: 'white' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#0056b3' }}>{post.author}</h4>
            <p style={{ fontSize: '16px', lineHeight: '1.5' }}>{post.content}</p>
            
            <button onClick={() => handleLike(post._id)} style={{ padding: '8px 15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '15px' }}>
              👍 Like ({post.likes})
            </button>

            {/* Comments Section */}
            <div style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}>
              <h5 style={{ margin: '0 0 10px 0' }}>Comments:</h5>
              {post.comments.map((c, i) => (
                <p key={i} style={{ background: '#f1f1f1', padding: '8px', borderRadius: '4px', margin: '5px 0', fontSize: '14px' }}>{c}</p>
              ))}
              
              <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Write a comment..." 
                  value={commentText[post._id] || ''} 
                  onChange={e => setCommentText({...commentText, [post._id]: e.target.value})} 
                  style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <button onClick={() => handleComment(post._id)} style={{ padding: '8px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>
                  Send
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
