import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import emailjs from 'emailjs-com';
import { Helmet } from 'react-helmet-async';

//import images
import mark from '../assets/mark.jpg';
import david from '../assets/david.jpg';
import jane from '../assets/jane.jpg';
import jessica from '../assets/jessica.jpg';
import workshop02 from '../assets/workshop02.jpg';
import image from '../assets/sbg.jpg';

// Mock data for team members
const teamMembers = [
  {
    name: "Emma Richardson",
    role: "Founder & Creative Director",
    bio: "With a background in interior design and product development, Emma founded Roodhy to create a brand that brings thoughtful design to everyday objects.",
    image: jane
  },
  {
    name: "David Chen",
    role: "Head of Design",
    bio: "David brings over 15 years of experience in furniture and product design, with a focus on sustainable materials and manufacturing processes.",
    image: david
  },
  {
    name: "Sophia Martinez",
    role: "Product Development Manager",
    bio: "Sophia oversees the journey from concept to creation, ensuring each product meets our quality standards and design philosophy.",
    image: jessica
  },
  {
    name: "Marcus Johnson",
    role: "Sustainability Officer",
    bio: "Marcus leads our initiatives for sustainable sourcing and ethical production, ensuring we minimize our environmental footprint.",
    image: mark
  }
];

// Mock data for company values
const companyValues = [
  {
    title: "සත්‍යය  මෝටර් රථ සමාලෝචන",
    description: "අපි සෑම විටම නවතම මෝටර් රථ මාදිලි පිළිබඳ අවංක සහ විනිවිද සමාලෝචන සපයනවා . අපගේ විශේෂඥ කණ්ඩායම සෑම වාහනයක්ම දැඩි ලෙස පරීක්ෂා කරන අතර, අපගේ තක්සේරු කිරීම් පරිපූර්ණ සහ අපක්ෂපාතී බව සහතික කරනවා."
  },
  {
    title: "තාක්ෂණික දැනුම",
    description: "අපගේ ප්‍රේක්ෂකයින්ට නිවැරදි තීරණ ගැනීමට අවශ්‍ය දැනුම ලබා දෙමින්, විදුලි බලයෙන් ක්‍රියාකරන වාහන සිට AI විශේෂාංග දක්වා මෝටර් රථ තාක්ෂණයේ නවතම දියුණුව අපි ගවේෂණය කරනවා."
  },
  {
    title: "තිරය ​​පිටුපස",
    description: "අපි විනිවිදභාවයෙන් යුතුව අපගෙ අදහසේ සිට ක්‍රියාත්මක කිරීම දක්වා, අපගේ නිර්මාණාත්මක ක්‍රියාවලිය පිළිබඳ කෙටි අවබෝධයක් අපගේ ප්‍රේක්ෂකයින්ට ලැබේ."
  },
  {
    title: "සිත් ඇදගන්නා සුලු  වීඩියෝ දර්ශන  ",
    description: "YouTube, TikTok සහ Instagram හි ආකර්ෂණීය වීඩියෝ. අපගේ ප්‍රේක්ෂකයින් සඳහා මෝටර් රථ ලෝකය ජීවමාන කිරීම සඳහා අපි ආකර්ෂණීය වීඩියෝ විස්තරාත්මකව නිර්මනය කරනවා."
  }
];

// Mock data for company milestones
const companyMilestones = [
  {
    year: 2014,
    title: "Founding",
    description: "Roodhy was founded with a vision to create thoughtfully designed homewares."
  },
  {
    year: 2015,
    title: "First Collection",
    description: "Launched our debut collection featuring ceramics and textiles."
  },
  {
    year: 2017,
    title: "Sustainable Commitment",
    description: "Established our sustainability framework and ethical sourcing guidelines."
  },
  {
    year: 2019,
    title: "International Expansion",
    description: "Began shipping to 20+ countries and launched collaborations with global artisans."
  },
  {
    year: 2021,
    title: "B Corp Certification",
    description: "Achieved B Corporation status, recognizing our commitment to social and environmental performance."
  },
  {
    year: 2023,
    title: "Zero Waste Initiative",
    description: "Launched our zero waste packaging program and carbon-neutral shipping."
  }
];

const AboutSin = () => {
  // Refs for sections to animate
  const storyRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [formSubmit, setFormSubmit] = useState(false);
  const [formData, setFormData] = useState({
       user_name: '',
       user_email: '',
       message: ''
     });
     const [formError, setFormError] = useState('');
     
     const handleChange = (e) => {
       setFormData({
         ...formData,
         [e.target.name]: e.target.value
       });
     };
     
     const handleSubmit = (event) => {
       event.preventDefault();
     
       const { user_name, user_email, message } = formData;
     
       // Validate the form fields
       if (!user_name || !user_email || !message) {
         setFormError('Please fill in all fields');
         return;
       }
     
       emailjs.sendForm('service_oq88bb9', 'template_1gsqs0j', event.target, 't9HDMRrmehzRQKGE9')
         .then((result) => {
           console.log(result.text);
           setFormSubmit(true);
           setFormError('');
           setFormData({ user_name: '', user_email: '', message: '' });
     
           setTimeout(() => {
             setFormSubmit(false);
           }, 3000);
         }, (error) => {
           console.log(error.text);
         });
     }; 
  
  // Intersection Observer for animations
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersect, options);
    
    if (storyRef.current) observer.observe(storyRef.current);
    if (valuesRef.current) observer.observe(valuesRef.current);
    if (teamRef.current) observer.observe(teamRef.current);
    if (timelineRef.current) observer.observe(timelineRef.current);
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen pt-32 relative">
      <Header />

      {/* SEO Tags */}
      <Helmet>
        <title>About Us | Baos Wheels</title>
        <meta
          name="description"
          content="Learn more about Baos Wheels, our mission, and the team behind the scenes."
        />
        <meta
          name="keywords"
          content="About Baos Wheels, automotive content, car enthusiasts"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.baoswheels.com/about" />

        {/* Open Graph */}
        <meta property="og:title" content="About Us | Baos Wheels" />
        <meta
          property="og:description"
          content="Discover the story behind Baos Wheels and our passion for cars."
        />
        <meta property="og:url" content="https://www.baoswheels.com/about" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://www.baoswheels.com/assets/about-preview.jpg"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | Baos Wheels" />
        <meta
          name="twitter:description"
          content="Learn more about Baos Wheels and our commitment to automotive excellence."
        />
        <meta
          name="twitter:image"
          content="https://www.baoswheels.com/assets/about-preview.jpg"
        />
      </Helmet>

      {/* Hero Section */}
      <section className=" relative z-30  pb-2 px-6 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl text-[#EEF525] font-semibold mb-4">අපි කවුරුද?</h1>
          </div>
          
          {/* Breadcrumbs */}
          <div className="flex relative z-30 justify-center items-center text-sm text-muted-foreground">
            <a href="/" className="hover:text-white transition-colors">මුල් පිටුව </a>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white">අපි ගැන</span>
          </div>
        </div>
      </section>
      
      {/* Company Story */}
      <section className="relative z-30 py-12 px-6">
        <div 
          ref={storyRef}
          className="max-w-7xl mx-auto opacity-0"
          style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 mb-6 text-xs font-medium bg-secondary rounded-full">
                අපේ ගමන
              </span>
              <h2 className="text-3xl absolute text-[#EEF525] font-semibold mb-6">Driven by Passion</h2>
                            <h2 className="text-4xl absolute text-[#ffffff] opacity-10 font-semibold mb-6">Driven by Passion</h2>
              <p className="text-muted-foreground mt-12">
               BAOS WHEELS යනු වේදිකාවක් පමණක් නොවේ, එය මෝටර් රථ සඳහා ගැඹුරු ඇල්මක් ඇති ගමනකි. අපගේ ආශාව, උද්යෝගිමත් සහ කුතුහලයෙන් පිරි මනසක්  අති අයට අන්තර්ගතයන් නිර්මාණය කිරීමටයි. අපි නවතම මාදිලි ප්‍රදර්ශනය කරන අතර යන්ත්‍ර, නවෝත්පාදන සහ මෝටර් රථ ලෝකය හැඩගස්වන පුද්ගලයින් ගැන කියනව.
              </p>
              <p className="text-muted-foreground mb-6">
                අපගේ මෝටර් රථ විශේෂඥයින් කණ්ඩායම muscle cars සිට නවතම විදුලි බලයෙන් ක්‍රියාකරන වාහන දක්වා අති සංකීර්ණ සංකල්ප හා විවිධ දෘෂ්ටිකෝණ පැහැදිලිව සපයයි.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-lg border-2 border-double border-white overflow-hidden">
                <img 
                  src={image}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-gray-50 rounded-lg p-6 shadow-sm hidden md:flex flex-col justify-center"
              style={{boxShadow: ' 4px 6px rgba(204,255,0, 0.8)',
              }}>
                <p className="text-3xl font-semibold mb-2">4+</p>
                <p className="text-sm text-muted-foreground">වාහන කර්මාන්ත දැනුම සහ විශේෂඥතාව බෙදාගත් වසර ගණන.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="relative z-30 py-20 px-6 bg-transparent">
        <div 
          ref={valuesRef}
          className="max-w-7xl mx-auto opacity-0"
          style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}
        >
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-medium bg-secondary rounded-full">
              අපේ දර්ශනය
            </span>
            <h2 className="text-3xl text-[#EEF525] font-semibold mb-4">අපි ගෙනෙන දේ</h2>

          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {companyValues.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-lg border border-gray-100"
              style={{
                    boxShadow: ' 4px 6px rgba(204,255,0, 0.8)',
              }}>
                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Page */}
          <section  className="relative z-30 py-20 px-6 bg-transparent">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <span className="inline-block px-3 py-1 mb-4 text-xs font-medium bg-secondary rounded-full">
                  අපව අමතන්න
                </span>
                <h2 className="text-3xl font-semibold mb-4">අපට කතා කරන්න</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  ප්‍රශ්නයක්, යෝජනාවක් තියෙනවද, නැත්නම් අප සමග කත කිරීමට  කැමතිද? පහත පෝරමය පුරවන්න, අපේ කණ්ඩායම හැකි ඉක්මනින් ඔබ හා සම්බන්ධ වනු ඇත
                </p>
              </div>
              <form
                onSubmit={handleSubmit}
                className="bg-gray-50 rounded-xl shadow-md p-8 space-y-6"
                data-aos="fade-left"
                data-aos-delay="100"
              >
                {formError && (
                  <div className="text-red-500 text-sm mb-2">{formError}</div>
                )}
                <div>
                  <label htmlFor="user_name" className="block text-sm font-medium text-gray-900 mb-1">
                    නම
                  </label>
                  <input
                    type="text"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="user_email" className="block text-sm font-medium text-gray-900 mb-1">
                    ඊමේල් ලිපිනය 
                  </label>
                  <input
                    type="email" 
                    name="user_email"
                    value={formData.user_email}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-1">
                    පණිවිඩය
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  ></textarea>
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-primary text-white font-semibold shadow hover:bg-primary/90 transition-colors"
                  >
                    පණිවිඩය යවන්න
                  </button>
                </div>
                {formSubmit && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center">
                    ඔබගේ පණිවිඩයට ස්තූතියි! අපි ඉක්මනින් ඔබ හා සම්බන්ධ වන්නෙමු.
                  </div>
                )}
              </form>
            </div>
          </section>

       {/*Upper Backgrounds */}
       <div className='absolute inset-0 bg-transparent  w-full overflow-hidden top-0 h-auto  to-transparent z-20'>
          <div className='absolute inset-0 bg-black rounded-full -top-40 h-[30%] rotate-[10deg] md:h-[40%] scale-150 rounded-5xl md:rotate-[10deg] z-30'></div>
          <div className='absolute inset-0 rounded-full bg-[#EEF525] -top-40 h-[30.1%] rotate-[9deg] md:h-[41%] scale-150 rounded-5xl md:rotate-[9deg] z-20'></div>
         <div className='absolute inset-0 rounded-full bg-gray-300 -top-40 h-[30.2%] rotate-[8deg] md:h-[42%] scale-150 rounded-5xl md:rotate-[8deg] z-10'></div>
        </div>

         

      
      {/* Team Section
      <section className="py-20 px-6">
        <div 
          ref={teamRef}
          className="max-w-7xl mx-auto opacity-0"
          style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}
        >
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-medium bg-secondary rounded-full">
              Our Team
            </span>
            <h2 className="text-3xl font-semibold mb-4">The People Behind Roodhy</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Meet our passionate team of designers, crafters, and visionaries
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="group">
                <div className="mb-4 overflow-hidden rounded-lg aspect-[3/4]">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-medium mb-1">{member.name}</h3>
                <p className="text-sm text-primary mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>  */}
      
   

      
      {/* Join Our Team Banner 
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary/5 rounded-xl p-10 md:p-16 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Join Our Team</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              We're always looking for talented people who share our passion for design and sustainability. 
            </p>
            <Button className="rounded-full button-hover">
              View Open Positions
            </Button>
          </div>
        </div>
      </section> */}


      
      
      <Footer />
    </div>
  );
};

export default AboutSin;