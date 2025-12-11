import React, { useState } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const messages = [
  { id: 1, title: "Sample Title", text: "Beautiful high-resolution photograph showcasing a vibrant outdoor scene with rich colors and natural lighting.", image: "https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg" },
  { id: 2, title: "Sample Title", text: "Beautiful high-resolution photograph showcasing a vibrant outdoor scene with rich colors and natural lighting.", image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg" },
  { id: 3, title: "Sample Title", text: "Beautiful high-resolution photograph showcasing a vibrant outdoor scene with rich colors and natural lighting.", image: "https://images.pexels.com/photos/3972755/pexels-photo-3972755.jpeg" },
  { id: 4, title: "Sample Title", text: "Beautiful high-resolution photograph showcasing a vibrant outdoor scene with rich colors and natural lighting.", image: "https://images.pexels.com/photos/9735311/pexels-photo-9735311.jpeg" },
  { id: 5, title: "Sample Title", text: "Beautiful high-resolution photograph showcasing a vibrant outdoor scene with rich colors and natural lighting.", image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg" },
  { id: 6, title: "Sample Title", text: "Beautiful high-resolution photograph showcasing a vibrant outdoor scene with rich colors and natural lighting.", image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg" },
  { id: 7, title: "Sample Title", text: "Beautiful high-resolution photograph showcasing a vibrant outdoor scene with rich colors and natural lighting.", image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg" },
  { id: 8, title: "Sample Title", text: "Beautiful high-resolution photograph showcasing a vibrant outdoor scene with rich colors and natural lighting.", image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg" },
  { id: 9, title: "Sample Title", text: "Beautiful high-resolution photograph showcasing a vibrant outdoor scene with rich colors and natural lighting.", image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg" },
  { id: 10, title: "Sample Title", text: "Beautiful high-resolution photograph showcasing a vibrant outdoor scene with rich colors and natural lighting.", image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg" },
  { id: 11, title: "Sample Title", text: "Beautiful high-resolution photograph showcasing a vibrant outdoor scene with rich colors and natural lighting.", image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg" },
  { id: 12, title: "Sample Title", text: "Beautiful high-resolution photograph showcasing a vibrant outdoor scene with rich colors and natural lighting.", image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg" },
  { id: 13, title: "Sample Title", text: "Beautiful high-resolution photograph showcasing a vibrant outdoor scene with rich colors and natural lighting.", image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg" },
  { id: 14, title: "Sample Title", text: "Beautiful high-resolution photograph showcasing a vibrant outdoor scene with rich colors and natural lighting.", image: "https://images.pexels.com/photos/3771649/pexels-photo-3771649.jpeg" },
  { id: 15, title: "Sample Title", text: "Beautiful high-resolution photograph showcasing a vibrant outdoor scene with rich colors and natural lighting.", image: "https://images.pexels.com/photos/9502094/pexels-photo-9502094.jpeg" },
  { id: 16, title: "Sample Title", text: "Beautiful high-resolution photograph showcasing a vibrant outdoor scene with rich colors and natural lighting.", image: "https://images.pexels.com/photos/248747/pexels-photo-248747.jpeg" },
  { id: 17, title: "Sample Title", text: "Beautiful high-resolution photograph showcasing a vibrant outdoor scene with rich colors and natural lighting.", image: "https://images.pexels.com/photos/13680217/pexels-photo-13680217.jpeg" },
  { id: 18, title: "Sample Title", text: "Beautiful high-resolution photograph showcasing a vibrant outdoor scene with rich colors and natural lighting.", image: "https://images.pexels.com/photos/16186414/pexels-photo-16186414.jpeg" },
  { id: 19, title: "Sample Title", text: "Beautiful high-resolution photograph showcasing a vibrant outdoor scene with rich colors and natural lighting.", image: "https://images.pexels.com/photos/376481/pexels-photo-376481.jpeg" },
];



// Action Bar Component
const ActionBar = () => (
  <div className='fixed flex w-full justify-start -mt-4 h-[10vh] z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm'>
    <div className='flex w-full md:w-[40%] lg:w-[25%] items-center justify-evenly gap-2 md:gap-3 px-2 md:px-4'>
      <button className='flex items-center justify-center rounded-full px-3 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs md:text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'>
        <svg className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span className='hidden sm:inline'>Add Post</span>
        <span className='sm:hidden'>Add</span>
      </button>
      <button className='flex items-center justify-center rounded-full px-3 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs md:text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'>
        <svg className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className='hidden sm:inline'>Manage Posts</span>
        <span className='sm:hidden'>Manage</span>
      </button>
    </div>
  </div>
);

// Sidebar Item Component
const SidebarItem: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => (
  <div className={`w-full h-[8vh] md:h-[8vh] border-b border-gray-200 transition-all duration-300 cursor-pointer group ${
    isActive ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
  }`}>
    <div className="h-full flex items-center justify-center">
      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all ${
        isActive ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-blue-100'
      }`}>
        <svg className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
        </svg>
      </div>
    </div>
  </div>
);

// Post Card Component
const PostCard: React.FC<{ post: typeof messages[0] }> = ({ post }) => (
  <div className='w-full md:w-[90%] flex flex-col sm:flex-row h-auto sm:h-[32vh] rounded-2xl border border-gray-200 drop-shadow-md bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group'>
    <div className='relative w-full sm:w-[40%] h-48 sm:h-full overflow-hidden'>
      <img 
        src={post.image} 
        alt={post.title} 
        className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
      />
      <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
    </div>
    <div className='relative flex items-start justify-start p-4 md:p-6 flex-col w-full sm:w-[60%]'>
      <div className='flex items-center gap-2 mb-2 md:mb-3'>
        <div className='w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600' />
        <span className='text-xs text-gray-500 font-medium'>Community Member</span>
      </div>
      <h2 className='text-start font-bold text-base md:text-lg font-sans text-gray-900 mb-1 md:mb-2 line-clamp-1'>
        {post.title}
      </h2>
      <p className='text-xs md:text-sm text-start text-gray-600 font-sans line-clamp-2 sm:line-clamp-3 leading-relaxed'>
        {post.text}
      </p>
      <div className='mt-auto pt-3 md:pt-4 flex gap-3 md:gap-4 items-center text-gray-500'>
        <button className='flex items-center gap-1 md:gap-1.5 hover:text-blue-600 transition-colors'>
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className='text-xs font-medium'>24</span>
        </button>
        <button className='flex items-center gap-1 md:gap-1.5 hover:text-blue-600 transition-colors'>
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className='text-xs font-medium'>12</span>
        </button>
      </div>
    </div>
  </div>
);

const Community = () => {
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  return (
    <div className="h-auto mt-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header/>
      <div className='relative h-[100vh] w-full z-10'>
        <ActionBar />

        <div className='relative w-full mt-12 md:mt-20 h-[100vh] bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20'>
          {/* Mobile Menu Buttons */}
          <div className='lg:hidden fixed left-2 top-20 z-30 flex flex-col gap-2'>
            <button 
              onClick={() => setShowLeftSidebar(!showLeftSidebar)}
              className='w-10 h-10 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors'
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className='lg:hidden fixed right-2 top-20 z-30'>
            <button 
              onClick={() => setShowRightSidebar(!showRightSidebar)}
              className='w-10 h-10 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-colors'
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </button>
          </div>

          {/* Left Sidebar 
          <div className={`fixed flex-col left-0 top-20 z-30 flex h-full bg-white border-r border-gray-200 shadow-lg transition-transform duration-300 ${
            showLeftSidebar ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 w-[70%] sm:w-[40%] lg:w-[10%]`}>
            <div className='p-3 md:p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 flex justify-between items-center'>
              <h3 className='text-white text-xs md:text-sm font-bold'>Categories</h3>
              <button 
                onClick={() => setShowLeftSidebar(false)}
                className='lg:hidden text-white'
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {messages.slice(0, 8).map((mess, index) => (
              <SidebarItem key={mess.id} isActive={index === 0} />
            ))}
          </div> */}

          {/* Main Content */}
          <div className='relative overflow-y-scroll flex items-start justify-center left-0 top-14 z-10 h-full bg-transparent w-full py-4 md:py-8 px-2 md:px-0'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 place-items-center min-h-full w-full md:w-[90%] lg:w-[60%] pb-20'>
              {messages.map((mess) => (
                <PostCard key={mess.id} post={mess} />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className={`fixed h-full flex-col right-0 z-30 top-20 flex bg-white border-l border-gray-200 shadow-lg transition-transform duration-300 ${
            showRightSidebar ? 'translate-x-0' : 'translate-x-full'
          } lg:translate-x-0 w-[70%] sm:w-[50%] lg:w-[20%]`}>
            <div className='p-3 md:p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600 flex justify-between items-center'>
              <h3 className='text-white text-xs md:text-sm font-bold'>Trending</h3>
              <button 
                onClick={() => setShowRightSidebar(false)}
                className='lg:hidden text-white'
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className='overflow-y-auto flex-1'>
              {messages.slice(0, 9).map((mess) => (
                <div key={mess.id} className='w-full p-3 md:p-4 border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer group'>
                  <div className='flex items-center gap-2 md:gap-3'>
                    <div className='w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-sm'>
                      <img src={mess.image} alt="" className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-xs font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors'>
                        Trending Topic #{mess.id}
                      </p>
                      <p className='text-xs text-gray-500 mt-0.5'>2.3k posts</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overlay for mobile sidebars */}
          {(showLeftSidebar || showRightSidebar) && (
            <div 
              className='lg:hidden fixed inset-0 bg-black/50 z-10 top-14'
              onClick={() => {
                setShowLeftSidebar(false);
                setShowRightSidebar(false);
              }}
            />
          )}
        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default Community;
