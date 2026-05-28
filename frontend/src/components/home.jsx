import { Heart, MessageCircle, Share2, Plus, Home, Target, Trophy, User, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authFetch, isGuest } from '../auth';
import GuestBanner from './GuestBanner';
import { useGuestGuard } from '../hooks/useGuestGuard';

const API = import.meta.env.VITE_API_URL;

export default function HomePage() {
  const navigate = useNavigate();
  const { guard, GuestPrompt } = useGuestGuard();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => { fetchCurrentUser(); fetchPosts(); }, []);

  const fetchCurrentUser = async () => {
    if (isGuest()) return;
    try {
      const res = await authFetch(`${API}/auth/user`);
      const data = await res.json();
      if (data.success) setCurrentUserId(data.user._id);
      else navigate('/acc');
    } catch { navigate('/acc'); }
  };

  const fetchPosts = async () => {
    try {
      const res = await authFetch(`${API}/post/view`);
      const data = await res.json();
      if (data.success) setPosts(data.posts.sort(() => Math.random() - 0.5));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (posts.length > 0 && currentUserId) {
      const initialLikes = {};
      posts.forEach(post => {
        initialLikes[post._id] = post.likedBy?.some(id => id.toString() === currentUserId.toString());
      });
      setLikedPosts(initialLikes);
    }
  }, [posts.length, currentUserId]);

  const handleLike = (postId) => guard(async () => {
    const alreadyLiked = likedPosts[postId];
    setLikedPosts(prev => ({ ...prev, [postId]: !alreadyLiked }));
    setPosts(prev => prev.map(p => p._id === postId ? { ...p, likes: alreadyLiked ? p.likes - 1 : p.likes + 1 } : p));
    try {
      const res = await authFetch(`${API}/post/like/${postId}`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) {
        setLikedPosts(prev => ({ ...prev, [postId]: data.liked }));
        setPosts(prev => prev.map(p => p._id === postId ? { ...p, likes: data.likes } : p));
      }
    } catch {
      setLikedPosts(prev => ({ ...prev, [postId]: alreadyLiked }));
      setPosts(prev => prev.map(p => p._id === postId ? { ...p, likes: alreadyLiked ? p.likes + 1 : p.likes - 1 } : p));
    }
  });

  if (loading) return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <GuestPrompt />
      <GuestBanner />
      <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/></svg>
            </div>
            <span className="font-bold text-green-700 text-lg">Prithvi</span>
          </div>
          <button onClick={() => guard(() => navigate("/acc/home/fund"))} className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-semibold px-3 py-2 rounded-full shadow-md active:bg-red-600">
            <Heart className="w-3.5 h-3.5" fill="white" />Donate
          </button>
        </div>
        <div className="flex border-b border-gray-200">
          <button className="flex-1 py-2.5 text-green-600 border-b-2 border-green-600 font-semibold text-sm">For You</button>
          <button className="flex-1 py-2.5 text-gray-500 text-sm">Following</button>
        </div>
      </div>

      <div className="pb-20">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <MapPin className="w-12 h-12 mb-3" />
            <p className="font-medium">No posts yet</p>
            <p className="text-sm mt-1">Be the first to post an action!</p>
          </div>
        ) : posts.map((post) => (
          <div key={post._id} className="border-b border-gray-200 pb-4">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                {post.userId?.avatar ? (
                  <img src={post.userId.avatar} alt={post.userId.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center"><User className="w-5 h-5 text-green-600" /></div>
                )}
                <div>
                  <div className="font-semibold text-sm">{post.userId?.name || 'Unknown'}</div>
                  <div className="text-xs text-gray-500">@{post.userId?.username || 'unknown'} · {new Date(post.posted_on).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                </div>
              </div>
              {post.featured && <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-1 rounded-full">⭐ Featured</span>}
            </div>
            {post.image && <img src={post.image} alt="Post" className="w-full object-cover max-h-80" />}
            {post.Video && <video src={post.Video} className="w-full max-h-80 object-cover mt-1" controls playsInline />}
            {post.description && <div className="px-4 pt-3"><p className="text-sm text-gray-800">{post.description}</p></div>}
            <div className="px-4 pt-3">
              <div className="flex items-center gap-4 text-gray-600">
                <button onClick={() => handleLike(post._id)} className="flex items-center gap-1">
                  <Heart className="w-5 h-5" fill={likedPosts[post._id] ? '#ef4444' : 'none'} stroke={likedPosts[post._id] ? '#ef4444' : 'currentColor'} />
                  <span className={`text-sm ${likedPosts[post._id] ? 'text-red-500' : ''}`}>{post.likes || 0}</span>
                </button>
                <button className="flex items-center gap-1"><MessageCircle className="w-5 h-5" /><span className="text-sm">0</span></button>
                <button className="ml-auto"><Share2 className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => navigate("/acc/bot")} className="fixed bottom-20 right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-xl z-20 active:bg-green-600">
        <span className="text-xl">🤖</span>
      </button>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="max-w-md mx-auto flex items-center justify-around py-2">
          <button className="flex flex-col items-center gap-0.5 text-green-600 min-w-[48px] py-1"><Home className="w-6 h-6" fill="currentColor" /><span className="text-xs">Home</span></button>
          <button onClick={() => navigate("/acc/home/campaign")} className="flex flex-col items-center gap-0.5 text-gray-500 min-w-[48px] py-1"><Target className="w-6 h-6" /><span className="text-xs">Campaign</span></button>
          <button onClick={() => guard(() => navigate("/acc/home/post"))} className="flex flex-col items-center gap-0.5 text-gray-500 min-w-[48px] py-1">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center -mt-5 shadow-lg"><Plus className="w-6 h-6 text-white" strokeWidth={3} /></div>
          </button>
          <button onClick={() => navigate("/acc/home/leaderboard")} className="flex flex-col items-center gap-0.5 text-gray-500 min-w-[48px] py-1"><Trophy className="w-6 h-6" /><span className="text-xs">Ranks</span></button>
          <button onClick={() => navigate("/acc/home/profile")} className="flex flex-col items-center gap-0.5 text-gray-500 min-w-[48px] py-1"><User className="w-6 h-6" /><span className="text-xs">Profile</span></button>
        </div>
      </div>
    </div>
  );
}
