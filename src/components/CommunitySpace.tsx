/* eslint-disable react-hooks/purity, react-hooks/set-state-in-effect, no-case-declarations */
import React, { useState, useEffect, useRef } from 'react';

export interface PostComment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface Post {
  id: string;
  authorName: string;
  authorAvatar: string;
  groupName?: string;
  text: string;
  tags: string[];
  likes: number;
  hasLiked: boolean;
  comments: PostComment[];
  date: string;
}

export interface CommunityGroup {
  id: string;
  name: string;
  avatar: string;
  members: number;
  description: string;
  isFollowed: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  isGroup: boolean;
  messages: ChatMessage[];
}

export interface CommunityNotification {
  id: string;
  text: string;
  date: string;
  unread: boolean;
}

type SidebarTab = 'home' | 'explore' | 'notifications' | 'messages' | 'follow' | 'profile' | 'settings';

export function CommunitySpace() {
  const [activeTab, setActiveTab] = useState<SidebarTab>('home');
  
  // Bio state
  const [bio, setBio] = useState('Alex Carter | Learning to breathe, one day at a time.');

  // Notification state
  const [notifications, setNotifications] = useState<CommunityNotification[]>([
    { id: 'notif-1', text: 'Sarah Jenkins liked your journey post in Mindfulness & Meditation.', date: '10m ago', unread: true },
    { id: 'notif-2', text: 'You were invited to join the Anger Support & Release group.', date: '2h ago', unread: true },
    { id: 'notif-3', text: 'Mindfulness Bot sent you a message: "Welcome to the channel!"', date: '5h ago', unread: false }
  ]);

  // Groups state
  const [groups, setGroups] = useState<CommunityGroup[]>([
    { id: 'grp-anger', name: 'Anger Support & Release', avatar: 'A', members: 128, description: 'A safe space to vent and learn calming grounding techniques.', isFollowed: false },
    { id: 'grp-sadness', name: 'Healing Sadness Circle', avatar: 'S', members: 256, description: 'Connect with others going through grief or sorrow and share comfort.', isFollowed: false },
    { id: 'grp-panic', name: 'Overcoming Anxiety & Panic', avatar: 'P', members: 342, description: 'Instant grounding techniques and mutual support during high stress.', isFollowed: false },
    { id: 'grp-depression', name: 'Depression Warmth Room', avatar: 'D', members: 190, description: 'Gentle motivators, small victories, and warm peer validation.', isFollowed: false },
    { id: 'grp-mindfulness', name: 'Mindfulness & Meditation', avatar: 'M', members: 512, description: 'Daily breathing check-ins and shared meditative challenges.', isFollowed: true }
  ]);

  // Posts state
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 'post-1',
      authorName: 'Sarah Jenkins',
      authorAvatar: 'A',
      groupName: 'Mindfulness & Meditation',
      text: 'Just completed the 4-4-4-4 breathing technique. The chest tightness from earlier is finally fading away. High recommendation for anyone feeling panic right now!',
      tags: ['Mindfulness', 'Breathing', 'Calm'],
      likes: 12,
      hasLiked: false,
      comments: [
        { id: 'c-1', author: 'Marcus V.', text: 'Agreed, it is a lifesaver!', date: '2h ago' }
      ],
      date: '3h ago'
    },
    {
      id: 'post-2',
      authorName: 'Emily Stone',
      authorAvatar: 'J',
      groupName: 'Anger Support & Release',
      text: 'Felt so frustrated after work today. Instead of keeping it in, I wrote a massive rant in my private journal and did 15 wall push-ups. Feeling way lighter.',
      tags: ['Anger', 'Release', 'PhysicalWorkout'],
      likes: 8,
      hasLiked: false,
      comments: [],
      date: '5h ago'
    },
    {
      id: 'post-3',
      authorName: 'David Miller',
      authorAvatar: 'M',
      groupName: 'Depression Warmth Room',
      text: 'Today I woke up, drank water, and walked outside for 5 minutes. It is a tiny step, but I am proud of it. Keeping the streak alive.',
      tags: ['Depression', 'TinyVictories', 'Healing'],
      likes: 24,
      hasLiked: true,
      comments: [
        { id: 'c-2', author: 'Emily Stone', text: 'So proud of you! Keep it up.', date: '4h ago' },
        { id: 'c-3', author: 'Sarah Jenkins', text: 'Watering the plant of wellness. Amazing.', date: '3h ago' }
      ],
      date: '6h ago'
    }
  ]);

  // Conversations state (personal DMs and Group Chats)
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'dm-sarah',
      name: 'Sarah Jenkins (Counselor)',
      avatar: 'A',
      isGroup: false,
      messages: [
        { id: 'm-1', sender: 'Sarah Jenkins (Counselor)', text: 'Hello! I noticed you checked in on the Emotions tab today. How are you holding up?', timestamp: new Date(Date.now() - 3600000) },
        { id: 'm-2', sender: 'You', text: 'Hey Sarah, been a bit anxious but working through the challenges. The breathing helps.', timestamp: new Date(Date.now() - 1800000) },
        { id: 'm-3', sender: 'Sarah Jenkins (Counselor)', text: 'That is great to hear. Remember, take it one breath at a time. I am here if you need to talk.', timestamp: new Date(Date.now() - 600000) }
      ]
    },
    {
      id: 'grp-mindfulness',
      name: 'Mindfulness & Meditation Chat',
      avatar: 'M',
      isGroup: true,
      messages: [
        { id: 'm-4', sender: 'David Miller', text: 'Anyone down for a 5-minute breathing session in 10 minutes?', timestamp: new Date(Date.now() - 4000000) },
        { id: 'm-5', sender: 'Sarah Jenkins', text: 'Count me in, David!', timestamp: new Date(Date.now() - 3600000) }
      ]
    }
  ]);

  const [activeConvId, setActiveConvId] = useState<string | null>('dm-sarah');

  // Input states
  const [newPostText, setNewPostText] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  const [newPostGroup, setNewPostGroup] = useState('Public Feed');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [chatMessageText, setChatMessageText] = useState('');
  const [exploreSearch, setExploreSearch] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync groups changes into conversations list (Adding followed groups, removing unfollowed)
  useEffect(() => {
    setConversations(prevConvs => {
      // Find which groups are followed
      const followedGroups = groups.filter(g => g.isFollowed);
      
      // Filter out conversations that are groups but no longer followed
      const filtered = prevConvs.filter(c => {
        if (!c.isGroup) return true;
        return followedGroups.some(g => g.id === c.id);
      });

      // Add groups that are followed but not yet in conversations
      followedGroups.forEach(g => {
        if (!filtered.some(c => c.id === g.id)) {
          filtered.push({
            id: g.id,
            name: `${g.name} Chat`,
            avatar: g.avatar,
            isGroup: true,
            messages: [
              { id: `welcome-${g.id}`, sender: 'System', text: `Welcome to the ${g.name} group chat!`, timestamp: new Date() }
            ]
          });
        }
      });

      return [...filtered];
    });
  }, [groups]);

  // Scroll active chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConvId, conversations]);

  // Create post handler
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const parsedTags = newPostTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newPost: Post = {
      id: Math.random().toString(36).substring(2, 9),
      authorName: 'Alex Carter',
      authorAvatar: 'U',
      groupName: newPostGroup === 'Public Feed' ? undefined : newPostGroup,
      text: newPostText.trim(),
      tags: parsedTags.length > 0 ? parsedTags : ['Reflections'],
      likes: 0,
      hasLiked: false,
      comments: [],
      date: 'Just now'
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostText('');
    setNewPostTags('');
    setNewPostGroup('Public Feed');
  };

  // Like post handler
  const handleLikePost = (postId: string) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
            hasLiked: !post.hasLiked
          };
        }
        return post;
      })
    );
  };

  // Create comment handler
  const handleCreateComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const newComment: PostComment = {
            id: Math.random().toString(36).substring(2, 9),
            author: 'Alex Carter',
            text: text.trim(),
            date: 'Just now'
          };
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      })
    );

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  // Toggle group follow handler
  const handleToggleFollowGroup = (groupId: string) => {
    setGroups(prev =>
      prev.map(g => {
        if (g.id === groupId) {
          return {
            ...g,
            isFollowed: !g.isFollowed,
            members: g.isFollowed ? g.members - 1 : g.members + 1
          };
        }
        return g;
      })
    );
  };

  // Send chat message handler
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim() || !activeConvId) return;

    const newMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'You',
      text: chatMessageText.trim(),
      timestamp: new Date()
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id === activeConvId) {
          return {
            ...c,
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      })
    );

    setChatMessageText('');

    // Trigger mock response if not a system message and conversation is private DM
    const isDm = conversations.find(c => c.id === activeConvId)?.isGroup === false;
    if (isDm) {
      setTimeout(() => {
        const replies = [
          "Thank you for sharing that with me. I appreciate your honesty.",
          "I hear you. Healing is not linear, and doing your best is more than enough.",
          "Keep checking in and taking deep breaths. You are doing wonderfully.",
          "That makes a lot of sense. How has your stress level been since completing the exercise?"
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        const botMsg: ChatMessage = {
          id: Math.random().toString(36).substring(2, 9),
          sender: 'Sarah Jenkins (Counselor)',
          text: randomReply,
          timestamp: new Date()
        };

        setConversations(currentConvs =>
          currentConvs.map(c => {
            if (c.id === activeConvId) {
              return { ...c, messages: [...c.messages, botMsg] };
            }
            return c;
          })
        );
      }, 1500);
    }
  };

  // Render Post Item helper
  const renderPostItem = (post: Post) => {
    return (
      <div key={post.id} className="post-item">
        <div className="post-header">
          <div className="post-author-avatar">{post.authorAvatar}</div>
          <div className="post-author-details">
            <span className="post-author-name">{post.authorName}</span>
            {post.groupName && (
              <span className="post-group-label">posted in <strong>{post.groupName}</strong></span>
            )}
            <span className="post-date">{post.date}</span>
          </div>
        </div>

        <p className="post-text">{post.text}</p>

        <div className="post-tags">
          {post.tags.map((tag, idx) => (
            <span key={idx} className="post-tag">#{tag}</span>
          ))}
        </div>

        <div className="post-actions">
          <button 
            className={`btn-post-action ${post.hasLiked ? 'liked' : ''}`}
            onClick={() => handleLikePost(post.id)}
          >
            {post.likes}
          </button>
        </div>

        {/* Comments Section */}
        <div className="post-comments-section">
          {post.comments.map(c => (
            <div key={c.id} className="post-comment">
              <span className="comment-author">{c.author}:</span>
              <span className="comment-text">{c.text}</span>
            </div>
          ))}
          
          <div className="post-comment-input-row">
            <input 
              type="text" 
              className="chat-input"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              placeholder="Add a comment..."
              value={commentInputs[post.id] || ''}
              onChange={e => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
              onKeyDown={e => { if (e.key === 'Enter') handleCreateComment(post.id); }}
            />
            <button 
              className="btn-send"
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              onClick={() => handleCreateComment(post.id)}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render Sub-Views based on Left Twitter-like Sidebar selection
  const renderSubView = () => {
    switch (activeTab) {
      case 'home':
        // Filter: posts from groups we follow + user's public posts
        const followedGroupNames = groups.filter(g => g.isFollowed).map(g => g.name);
        const homeFeed = posts.filter(post => 
          !post.groupName || 
          followedGroupNames.includes(post.groupName) || 
          post.authorName === 'Alex Carter'
        );

        // Recommended groups (not followed)
        const unfolGroups = groups.filter(g => !g.isFollowed);

        return (
          <div className="community-feed-pane">
            <h3>Home Feed</h3>
            
            {/* Suggested Groups (Horizontal Carousel) */}
            {unfolGroups.length > 0 && (
              <div className="suggested-groups-carousel-container">
                <h5>Who to follow</h5>
                <div className="suggested-groups-carousel">
                  {unfolGroups.map(g => (
                    <div key={g.id} className="suggested-group-card-mini">
                      <span className="group-mini-avatar">{g.avatar}</span>
                      <div className="group-mini-details">
                        <span className="group-mini-name">{g.name}</span>
                        <span className="group-mini-members">{g.members} members</span>
                      </div>
                      <button 
                        className="btn-send" 
                        style={{ padding: '4px 8px', fontSize: '0.72rem', margin: 0 }} 
                        onClick={() => handleToggleFollowGroup(g.id)}
                      >
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Journey Post Creator */}
            <form onSubmit={handleCreatePost} className="post-creator-box">
              <textarea
                className="chat-input"
                style={{ minHeight: '80px', width: '100%', resize: 'vertical', padding: '12px' }}
                placeholder="Share your journey or grounding victories today..."
                value={newPostText}
                onChange={e => setNewPostText(e.target.value)}
              />
              
              <div className="post-creator-controls">
                <input
                  type="text"
                  className="chat-input"
                  style={{ padding: '8px 12px', fontSize: '0.85rem', width: '180px' }}
                  placeholder="Tags (comma separated)..."
                  value={newPostTags}
                  onChange={e => setNewPostTags(e.target.value)}
                />

                <select
                  className="journal-date-input"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  value={newPostGroup}
                  onChange={e => setNewPostGroup(e.target.value)}
                >
                  <option value="Public Feed">Public Feed</option>
                  {groups.filter(g => g.isFollowed).map(g => (
                    <option key={g.id} value={g.name}>{g.name}</option>
                  ))}
                </select>

                <button type="submit" className="btn-send" style={{ padding: '10px 20px' }} disabled={!newPostText.trim()}>
                  Share Post
                </button>
              </div>
            </form>

            <div className="posts-feed">
              {homeFeed.map(renderPostItem)}
            </div>
          </div>
        );

      case 'explore':
        const filteredExplorePosts = posts.filter(post => 
          post.text.toLowerCase().includes(exploreSearch.toLowerCase()) ||
          (post.groupName && post.groupName.toLowerCase().includes(exploreSearch.toLowerCase())) ||
          post.tags.some(tag => tag.toLowerCase().includes(exploreSearch.toLowerCase()))
        );

        return (
          <div className="explore-view-container">
            <h3>Explore Community</h3>
            <p className="intro-text">Find new support circles and popular community entries.</p>
            
            <input 
              type="text" 
              className="chat-input"
              style={{ width: '100%', marginBottom: '20px', padding: '12px' }}
              placeholder="Search hashtags, groups, or text..."
              value={exploreSearch}
              onChange={e => setExploreSearch(e.target.value)}
            />

            <div className="explore-grid-layout">
              <div className="explore-groups-section">
                <h4>Trending Groups</h4>
                <div className="explore-groups-list">
                  {groups.map(g => (
                    <div key={g.id} className="explore-group-card">
                      <div className="explore-group-card-header">
                        <span style={{ fontSize: '2rem' }}>{g.avatar}</span>
                        <button 
                          className={g.isFollowed ? 'btn-back' : 'btn-send'}
                          style={{ padding: '6px 12px', fontSize: '0.8rem', margin: 0 }}
                          onClick={() => handleToggleFollowGroup(g.id)}
                        >
                          {g.isFollowed ? 'Following' : 'Join'}
                        </button>
                      </div>
                      <h5>{g.name}</h5>
                      <p>{g.description}</p>
                      <span className="members-count">{g.members} members</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="explore-posts-section">
                <h4>Recent Activities</h4>
                <div className="posts-feed">
                  {filteredExplorePosts.map(renderPostItem)}
                  {filteredExplorePosts.length === 0 && <p style={{ color: 'var(--text-light)' }}>No matching posts found.</p>}
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="notifications-view-container">
            <h3>Notifications</h3>
            <p className="intro-text">Stay updated on your community engagements.</p>
            
            <div className="notifications-list">
              {notifications.map(n => (
                <div key={n.id} className={`notification-item ${n.unread ? 'unread' : ''}`} onClick={() => {
                  setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item));
                }}>
                  <span className="notif-badge">{n.unread ? '•' : '○'}</span>
                  <div className="notif-info">
                    <p className="notif-text">{n.text}</p>
                    <span className="notif-date">{n.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'messages':
        const activeConv = conversations.find(c => c.id === activeConvId);

        return (
          <div className="chat-layout" style={{ height: '100%' }}>
            {/* Left selector */}
            <div className="chat-sidebar" style={{ width: '220px' }}>
              <h4 style={{ marginBottom: '12px', paddingLeft: '8px' }}>Chats</h4>
              <div className="sidebar-chats-container">
                {conversations.map(c => (
                  <div
                    key={c.id}
                    className={`sidebar-chat-item ${c.id === activeConvId ? 'active' : ''}`}
                    onClick={() => setActiveConvId(c.id)}
                  >
                    <div className="chat-item-title" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.2rem' }}>{c.avatar}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{c.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right log */}
            <div className="chat-main-area">
              {activeConv ? (
                <>
                  <div className="messages-container">
                    {activeConv.messages.map(msg => (
                      <div key={msg.id} className={`message-bubble-wrapper ${msg.sender === 'You' ? 'user' : 'companion'}`}>
                        <div className={`message-bubble ${msg.sender === 'You' ? 'user' : 'companion'}`}>
                          <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', marginBottom: '4px' }}>
                            {msg.sender}
                          </span>
                          <p className="message-text">{msg.text}</p>
                          <span className="message-time">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  <form onSubmit={handleSendChatMessage} className="chat-input-form">
                    <input
                      type="text"
                      className="chat-input"
                      value={chatMessageText}
                      onChange={e => setChatMessageText(e.target.value)}
                      placeholder={`Send a message to ${activeConv.name}...`}
                    />
                    <button type="submit" className="btn-send" disabled={!chatMessageText.trim()}>
                      Send
                    </button>
                  </form>
                </>
              ) : (
                <div className="chat-empty-state">Select a chat to send messages.</div>
              )}
            </div>
          </div>
        );

      case 'follow':
        return (
          <div className="follow-view-container">
            <h3>Support Groups</h3>
            <p className="intro-text">Follow groups matching your emotional status to enable group chats and populate your home feed.</p>
            
            <div className="groups-directory">
              {groups.map(g => (
                <div key={g.id} className="directory-group-card">
                  <span className="group-card-avatar">{g.avatar}</span>
                  <div className="group-card-details">
                    <h4>{g.name}</h4>
                    <p>{g.description}</p>
                    <span className="group-members-badge">{g.members} members</span>
                  </div>
                  <button 
                    className={`btn-follow-toggle ${g.isFollowed ? 'following' : 'join'}`}
                    onClick={() => handleToggleFollowGroup(g.id)}
                  >
                    {g.isFollowed ? 'Following' : '+ Join Group'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'profile':
        const userPosts = posts.filter(post => post.authorName === 'Alex Carter');
        const followedGroups = groups.filter(g => g.isFollowed);

        return (
          <div className="profile-view-container">
            <div className="profile-hero-banner">
              <div className="profile-avatar-large">U</div>
            </div>
            
            <div className="profile-info-section">
              <h3>Alex Carter</h3>
              <p className="profile-bio-text">{bio}</p>
              <div className="profile-stats-row">
                <span><strong>{userPosts.length}</strong> posts</span>
                <span><strong>{followedGroups.length}</strong> followed groups</span>
              </div>
            </div>

            <div className="profile-single-column">
              {followedGroups.length > 0 && (
                <div className="profile-groups-shelf" style={{ marginBottom: '12px' }}>
                  <h5>Followed Support Groups</h5>
                  <div className="suggested-groups-carousel">
                    {followedGroups.map(g => (
                      <div key={g.id} className="suggested-group-card-mini">
                        <span className="group-mini-avatar">{g.avatar}</span>
                        <div className="group-mini-details">
                          <span className="group-mini-name" style={{ fontSize: '0.8rem' }}>{g.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="profile-posts" style={{ marginTop: '12px' }}>
                <h4>My Shared Journey</h4>
                <div className="posts-feed">
                  {userPosts.map(renderPostItem)}
                  {userPosts.length === 0 && <p style={{ color: 'var(--text-light)', fontStyle: 'italic', padding: '12px 0' }}>You haven't posted any journeys yet.</p>}
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="community-settings-view">
            <h3>Community Profile Settings</h3>
            <p className="intro-text">Adjust how you appear in the Calm Space community.</p>

            <div className="settings-section">
              <h3>Edit Bio</h3>
              <div className="settings-options">
                <div className="settings-row" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
                  <label className="companion-label">Biography</label>
                  <textarea 
                    className="chat-input"
                    style={{ minHeight: '60px', width: '100%', resize: 'vertical' }}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                  />
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0 }}>This bio will be visible on your community profile page.</p>
                </div>
              </div>
            </div>

            <div className="settings-section" style={{ marginTop: '20px' }}>
              <h3>Privacy Preferences</h3>
              <div className="settings-options">
                <div className="settings-row">
                  <div className="setting-info">
                    <h4>Anonymous Posting</h4>
                    <p>Hide your real name from posts and comments</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked={false} />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="community-space-container fade-in">
      {/* Twitter-like Left Sidebar */}
      <div className="community-sidebar">
        <div className="sidebar-header">
          <h4>Community</h4>
        </div>
        <div className="sidebar-links-list">
          <button 
            className={`sidebar-nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          
          <button 
            className={`sidebar-nav-link ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            Explore
          </button>
          
          <button 
            className={`sidebar-nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
            {notifications.some(n => n.unread) && <span className="unread-badge-dot"></span>}
          </button>
          
          <button 
            className={`sidebar-nav-link ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
          
          <button 
            className={`sidebar-nav-link ${activeTab === 'follow' ? 'active' : ''}`}
            onClick={() => setActiveTab('follow')}
          >
            Join Groups
          </button>
          
          <button 
            className={`sidebar-nav-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          
          <button 
            className={`sidebar-nav-link ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Main Action Window Content */}
      <div className="community-content-pane">
        {activeTab === 'messages' ? (
          renderSubView()
        ) : (
          <div className="community-centered-column">
            {renderSubView()}
          </div>
        )}
      </div>
    </div>
  );
}
