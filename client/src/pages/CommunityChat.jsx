import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const CommunityChat = () => {
  const { language } = useLanguage();
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Best time to plant tomatoes in North India?',
      author: 'Rajesh Kumar',
      date: '2024-01-15',
      content: 'I am planning to grow tomatoes in my farm in Punjab. What would be the best time to plant them? Any specific varieties recommended?',
      category: 'Crop Planning',
      replies: 5,
      likes: 12
    },
    {
      id: 2,
      title: 'Organic pest control methods for rice',
      author: 'Priya Sharma',
      date: '2024-01-14',
      content: 'Looking for organic ways to control pests in my rice field. Has anyone tried neem oil or other natural methods?',
      category: 'Pest Control',
      replies: 8,
      likes: 15
    },
    {
      id: 3,
      title: 'Weather forecast for next week - Maharashtra',
      author: 'Amit Patil',
      date: '2024-01-13',
      content: 'Heavy rains expected in Maharashtra next week. Farmers in the region, please take necessary precautions.',
      category: 'Weather',
      replies: 3,
      likes: 7
    }
  ]);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: ''
  });
  const [showNewPost, setShowNewPost] = useState(false);

  const handleInputChange = (e) => {
    setNewPost({
      ...newPost,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitPost = (e) => {
    e.preventDefault();
    if (newPost.title && newPost.content && newPost.category) {
      const post = {
        id: Date.now(),
        title: newPost.title,
        author: 'Current User',
        date: new Date().toISOString().split('T')[0],
        content: newPost.content,
        category: newPost.category,
        replies: 0,
        likes: 0
      };
      setPosts([post, ...posts]);
      setNewPost({ title: '', content: '', category: '' });
      setShowNewPost(false);
    }
  };

  const pageStyle = {
    padding: 'var(--spacing-xxl) 0',
    minHeight: '60vh'
  };

  const cardStyle = {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-lg)',
    boxShadow: 'var(--shadow-sm)',
    marginBottom: 'var(--spacing-lg)'
  };

  const categories = ['Crop Planning', 'Pest Control', 'Weather', 'Market Prices', 'Equipment', 'General'];

  return (
    <div style={pageStyle}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
          <h1>{getTranslation('communityChat', language)}</h1>
          <button
            onClick={() => setShowNewPost(!showNewPost)}
            className="btn-primary"
          >
            New Post
          </button>
        </div>

        {/* New Post Form */}
        {showNewPost && (
          <div style={cardStyle}>
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Create New Post</h2>
            <form onSubmit={handleSubmitPost}>
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={newPost.title}
                  onChange={handleInputChange}
                  placeholder="Enter post title"
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
                  Category *
                </label>
                <select
                  name="category"
                  value={newPost.category}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%' }}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500' }}>
                  Content *
                </label>
                <textarea
                  name="content"
                  value={newPost.content}
                  onChange={handleInputChange}
                  placeholder="Write your post content..."
                  required
                  rows="5"
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                <button type="submit" className="btn-primary">
                  Post
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPost(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts List */}
        <div>
          {posts.map((post) => (
            <div key={post.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>{post.title}</h3>
                  <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)' }}>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                      by {post.author}
                    </span>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                      {post.date}
                    </span>
                    <span style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-white)',
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem'
                    }}>
                      {post.category}
                    </span>
                  </div>
                </div>
              </div>

              <p style={{ marginBottom: 'var(--spacing-lg)', lineHeight: '1.6' }}>
                {post.content}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
                  <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                    👍 {post.likes}
                  </button>
                  <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                    💬 {post.replies} replies
                  </button>
                </div>
                <button className="btn-outline">
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityChat;


