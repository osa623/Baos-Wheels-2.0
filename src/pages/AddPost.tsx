import React, { useState, useEffect } from 'react';
import { 
  X, Bold, Italic, Underline, Strikethrough, Link as LinkIcon, 
  Image as ImageIcon, Video, Minus, List, Heading1, Heading2, 
  Quote, MessageSquare, Lock, Globe, Upload, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddPost: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState('');
  const [allowComments, setAllowComments] = useState(true);
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [isDraft, setIsDraft] = useState(true);
  const [showToolbar, setShowToolbar] = useState(false);

  // Auto-save draft simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setIsDraft(false);
      setTimeout(() => setIsDraft(true), 2000);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const handleAddTopic = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && topicInput.trim()) {
      e.preventDefault();
      const newTopic = topicInput.trim().startsWith('#') ? topicInput.trim() : `#${topicInput.trim()}`;
      if (!topics.includes(newTopic)) {
        setTopics([...topics, newTopic]);
      }
      setTopicInput('');
    }
  };

  const removeTopic = (topicToRemove: string) => {
    setTopics(topics.filter(topic => topic !== topicToRemove));
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePublish = () => {
    console.log({ title, content, coverImage, galleryImages, topics, visibility });
    alert('Post published successfully!');
  };

  const topicColors = [
    'bg-purple-100 text-purple-700',
    'bg-pink-100 text-pink-700',
    'bg-blue-100 text-blue-700',
    'bg-green-100 text-green-700',
    'bg-orange-100 text-orange-700',
    'bg-indigo-100 text-indigo-700'
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Global Header - Full Width */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-5 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </button>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 rounded-full">
              <div className={`w-2 h-2 rounded-full ${isDraft ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                {isDraft ? 'All changes saved' : 'Saving...'}
              </span>
            </div>
            <button
              onClick={handlePublish}
              className="px-4 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm sm:text-base font-semibold hover:shadow-lg hover:scale-105 transition-all"
            >
              <span className="hidden sm:inline">Publish Now</span>
              <span className="sm:hidden">Publish</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sticky Formatting Toolbar - Glassmorphism */}
      <div className={`fixed top-16 sm:top-20 lg:top-24 left-1/2 -translate-x-1/2 z-40 bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl px-3 sm:px-6 py-2 sm:py-3 border border-gray-200/50 transition-all duration-300 max-w-[95vw] overflow-x-auto ${showToolbar ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="flex items-center gap-0.5 sm:gap-1">
          <button className="p-1.5 sm:p-2.5 hover:bg-gray-100 rounded-lg transition-colors group" title="Bold">
            <Bold className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-gray-900" />
          </button>
          <button className="p-1.5 sm:p-2.5 hover:bg-gray-100 rounded-lg transition-colors group" title="Italic">
            <Italic className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-gray-900" />
          </button>
          <button className="p-1.5 sm:p-2.5 hover:bg-gray-100 rounded-lg transition-colors group" title="Underline">
            <Underline className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-gray-900" />
          </button>
          <button className="hidden sm:block p-1.5 sm:p-2.5 hover:bg-gray-100 rounded-lg transition-colors group" title="Strikethrough">
            <Strikethrough className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-gray-900" />
          </button>
          <div className="w-px h-5 sm:h-6 bg-gray-300 mx-1 sm:mx-2" />
          <button className="p-1.5 sm:p-2.5 hover:bg-gray-100 rounded-lg transition-colors group" title="Heading 1">
            <Heading1 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-gray-900" />
          </button>
          <button className="p-1.5 sm:p-2.5 hover:bg-gray-100 rounded-lg transition-colors group" title="Heading 2">
            <Heading2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-gray-900" />
          </button>
          <div className="w-px h-5 sm:h-6 bg-gray-300 mx-1 sm:mx-2" />
          <button className="p-1.5 sm:p-2.5 hover:bg-gray-100 rounded-lg transition-colors group" title="Bullet List">
            <List className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-gray-900" />
          </button>
          <button className="hidden sm:block p-1.5 sm:p-2.5 hover:bg-gray-100 rounded-lg transition-colors group" title="Quote">
            <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-gray-900" />
          </button>
          <button className="p-1.5 sm:p-2.5 hover:bg-gray-100 rounded-lg transition-colors group" title="Add Link">
            <LinkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-gray-900" />
          </button>
        </div>
      </div>

      {/* Main Grid Layout - Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 w-full min-h-screen pt-20 sm:pt-24 px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12">
        {/* Left Sidebar - Quick Tools (1 column) */}
        <aside className="hidden lg:block lg:col-span-1 pr-4 space-y-6 sticky top-32 h-fit">
          <div className="flex flex-col gap-4">
            <label className="group cursor-pointer">
              <div className="p-4 bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 rounded-2xl border-2 border-gray-200 hover:border-blue-400 transition-all hover:shadow-lg flex flex-col items-center gap-2">
                <ImageIcon className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
                <span className="text-xs font-medium text-gray-600 group-hover:text-blue-600">Image</span>
              </div>
              <input type="file" accept="image/*" onChange={handleGalleryUpload} multiple className="hidden" />
            </label>

            <button className="p-4 bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 rounded-2xl border-2 border-gray-200 hover:border-purple-400 transition-all hover:shadow-lg flex flex-col items-center gap-2 group">
              <Video className="w-6 h-6 text-gray-600 group-hover:text-purple-600 transition-colors" />
              <span className="text-xs font-medium text-gray-600 group-hover:text-purple-600">Video</span>
            </button>

            <button className="p-4 bg-white hover:bg-gradient-to-br hover:from-orange-50 hover:to-yellow-50 rounded-2xl border-2 border-gray-200 hover:border-orange-400 transition-all hover:shadow-lg flex flex-col items-center gap-2 group">
              <Minus className="w-6 h-6 text-gray-600 group-hover:text-orange-600 transition-colors" />
              <span className="text-xs font-medium text-gray-600 group-hover:text-orange-600">Divider</span>
            </button>
          </div>
        </aside>

        {/* Center Canvas - The Writing Stage (8 columns) */}
        <main className="col-span-1 lg:col-span-8 px-0 sm:px-6 lg:px-12">
          {/* Hero Cover Image */}
          {!coverImage ? (
            <label className="block w-full h-[320px] sm:h-[420px] lg:h-[500px] cursor-pointer bg-gradient-to-br from-gray-100 via-gray-50 to-white rounded-2xl sm:rounded-3xl border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all group mb-8 sm:mb-12 overflow-hidden">
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-10 h-10 text-blue-600" />
                </div>
                <p className="text-2xl font-semibold text-gray-700 mb-2">Add a stunning cover image</p>
                <p className="text-sm text-gray-400">Click to upload or drag & drop</p>
              </div>
              <input type="file" accept="image/*" onChange={handleCoverImageUpload} className="hidden" />
            </label>
          ) : (
            <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden mb-8 sm:mb-12 group shadow-xl">
              <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <button className="absolute top-3 right-3 sm:top-6 sm:right-6 p-2 sm:p-3 bg-white/90 backdrop-blur rounded-full shadow-2xl hover:bg-white transition-all opacity-0 group-hover:opacity-100 hover:scale-110">
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              </button>
            </div>
          )}

          {/* Title Input - Huge Serif Typography */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setShowToolbar(true)}
            placeholder="Your story begins here..."
            className="w-full text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 placeholder-gray-300 border-none outline-none focus:ring-0 mb-8 sm:mb-12 leading-tight font-serif"
            style={{ fontFamily: "'Playfair Display', serif" }}
          />

          {/* Body Content Area - Serif Font */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setShowToolbar(true)}
            onBlur={() => setTimeout(() => setShowToolbar(false), 200)}
            placeholder="Share your thoughts, experiences, and insights with the world. Let your words flow naturally..."
            className="w-full min-h-[280px] sm:min-h-[360px] lg:min-h-[400px] text-lg sm:text-xl leading-relaxed text-gray-800 placeholder-gray-300 border-none outline-none focus:ring-0 resize-none mb-12 sm:mb-16 font-serif"
            style={{ fontFamily: "'Merriweather', serif" }}
          />

          {/* Masonry Gallery Component - Within Content Flow */}
          {galleryImages.length > 0 && (
            <div className="mb-12 sm:mb-16">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 font-sans">Image Gallery</h3>
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
                {galleryImages.map((img, index) => (
                  <div key={index} className="relative break-inside-avoid group">
                    <img
                      src={img}
                      alt={`Gallery ${index + 1}`}
                      className="w-full rounded-2xl shadow-lg hover:shadow-2xl transition-shadow"
                    />
                    <button
                      onClick={() => setGalleryImages(prev => prev.filter((_, i) => i !== index))}
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 p-2 sm:p-2.5 bg-white/90 backdrop-blur rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add More Images Button */}
              <label className="flex items-center justify-center gap-2 sm:gap-3 w-full mt-4 sm:mt-6 py-3 sm:py-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-50 rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all cursor-pointer group">
                <Plus className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                <span className="font-medium text-gray-600 group-hover:text-blue-600">Add more images</span>
                <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
              </label>
            </div>
          )}
        </main>

        {/* Right Sidebar - Context & Settings (3 columns) */}
        <aside className="col-span-1 lg:col-span-3 pl-0 lg:pl-8 space-y-6 mt-8 lg:mt-0">
          <div className="sticky top-24 space-y-6">
            {/* Topics/Tagging System */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600">#</span>
                </div>
                Topics
              </h3>

              <div className="flex flex-wrap gap-2 mb-4">
                {topics.map((topic, index) => (
                  <span
                    key={topic}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${topicColors[index % topicColors.length]} hover:scale-105 transition-transform`}
                  >
                    {topic}
                    <button onClick={() => removeTopic(topic)} className="hover:bg-white/30 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={handleAddTopic}
                placeholder="Add topics (e.g., #Travel)"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:bg-white transition-all outline-none text-sm"
              />
            </div>

            {/* Settings Card */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 space-y-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Settings</h3>

              {/* Visibility */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Who can view this?</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setVisibility('public')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      visibility === 'public'
                        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-400 shadow-md'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Globe className={`w-6 h-6 ${visibility === 'public' ? 'text-blue-600' : 'text-gray-600'}`} />
                    <span className={`text-sm font-medium ${visibility === 'public' ? 'text-blue-700' : 'text-gray-700'}`}>
                      Public
                    </span>
                  </button>
                  <button
                    onClick={() => setVisibility('private')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      visibility === 'private'
                        ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-400 shadow-md'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Lock className={`w-6 h-6 ${visibility === 'private' ? 'text-purple-600' : 'text-gray-600'}`} />
                    <span className={`text-sm font-medium ${visibility === 'private' ? 'text-purple-700' : 'text-gray-700'}`}>
                      Private
                    </span>
                  </button>
                </div>
              </div>

              {/* Allow Comments Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Allow Comments</p>
                    <p className="text-xs text-gray-500">Let readers share thoughts</p>
                  </div>
                </div>
                <button
                  onClick={() => setAllowComments(!allowComments)}
                  className={`relative w-14 h-8 rounded-full transition-all ${
                    allowComments ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform shadow-md ${
                      allowComments ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Quick Stats Preview */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-xl">
              <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Words</span>
                  <span className="text-lg font-bold">{content.split(/\s+/).filter(Boolean).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Images</span>
                  <span className="text-lg font-bold">{galleryImages.length + (coverImage ? 1 : 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Topics</span>
                  <span className="text-lg font-bold">{topics.length}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AddPost;
