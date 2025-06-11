import React, { useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

//import images
import mark from '../assets/mark.jpg';
import david from '../assets/david.jpg';
import jane from '../assets/jane.jpg';
import jessica from '../assets/jessica.jpg';
import workshop02 from '../assets/workshop02.jpg';

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
    title: "Design Excellence",
    description: "We believe that thoughtful design has the power to improve everyday life. Each product is crafted with attention to form, function, and the small details that make a big difference."
  },
  {
    title: "Sustainable Practices",
    description: "We're committed to responsible sourcing, ethical manufacturing, and creating products that are built to last. We continuously work to reduce our environmental impact."
  },
  {
    title: "Intentional Living",
    description: "We encourage a mindful approach to consumption, creating products that serve a purpose and bring lasting value rather than following fleeting trends."
  },
  {
    title: "Transparent Relationships",
    description: "We believe in honesty and openness with our customers, partners, and team members. We share our processes and practices to build trust and foster connection."
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

const About = () => {
  // Refs for sections to animate
  const storyRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
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
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">Our Story</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Get to know the people and principles behind Roodhy
            </p>
          </div>
          
          {/* Breadcrumbs */}
          <div className="flex justify-center items-center text-sm text-muted-foreground">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-foreground">About Us</span>
          </div>
        </div>
      </section>
      
      {/* Company Story */}
      <section className="py-20 px-6">
        <div 
          ref={storyRef}
          className="max-w-7xl mx-auto opacity-0"
          style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 mb-6 text-xs font-medium bg-secondary rounded-full">
                Our Journey
              </span>
              <h2 className="text-3xl font-semibold mb-6">Crafting Beauty Through Intention</h2>
              <p className="text-muted-foreground mb-6">
                Founded in 2014, Roodhy began as a small studio in Brooklyn with a simple mission: to create home goods that combine beauty, functionality, and sustainability. What started as a passion project has grown into a community of designers, artisans, and conscious consumers who share our vision.
              </p>
              <p className="text-muted-foreground mb-6">
                Our approach is guided by the belief that everyday objects should be both beautiful and useful. We work with skilled craftspeople who share our commitment to quality and detail, creating pieces that are designed to be cherished for years to come.
              </p>
              <p className="text-muted-foreground mb-6">
                As we've grown, our commitment to responsible practices has remained at our core. We continuously seek out sustainable materials and ethical production methods, ensuring that our environmental footprint is minimized at every step.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="rounded-full button-hover">
                  Our Sustainability Commitment
                </Button>
                <Button variant="outline" className="rounded-full button-hover">
                  Contact Us
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-lg overflow-hidden">
                <img 
                  src={workshop02}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-gray-50 rounded-lg p-6 shadow-sm hidden md:flex flex-col justify-center">
                <p className="text-3xl font-semibold mb-2">9+</p>
                <p className="text-sm text-muted-foreground">Years of crafting products with purpose and intention</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div 
          ref={valuesRef}
          className="max-w-7xl mx-auto opacity-0"
          style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}
        >
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-medium bg-secondary rounded-full">
              Our Philosophy
            </span>
            <h2 className="text-3xl font-semibold mb-4">What We Stand For</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our values guide every decision we make, from design to delivery
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {companyValues.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-lg border border-gray-100">
                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Team Section */}
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
      </section>
      
      {/* Timeline Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div 
          ref={timelineRef}
          className="max-w-7xl mx-auto opacity-0"
          style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}
        >
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-medium bg-secondary rounded-full">
              Our Journey
            </span>
            <h2 className="text-3xl font-semibold mb-4">Milestones</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Key moments in our journey of growth and evolution
            </p>
          </div>
          
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-0 sm:left-1/2 transform sm:-translate-x-1/2 h-full w-px bg-gray-200"></div>
            
            {/* Timeline items */}
            <div className="relative z-10">
              {companyMilestones.map((milestone, index) => (
                <div key={index} className={`flex flex-col sm:flex-row mb-12 relative ${index % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}>
                  {/* Year indicator */}
                  <div className="flex-shrink-0 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-white border border-primary mb-4 sm:mb-0 z-20">
                    <span className="text-sm font-semibold">{milestone.year}</span>
                  </div>
                  
                  {/* Content */}
                  <div className={`w-full sm:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'sm:pr-0 sm:pl-8' : 'sm:pl-0 sm:pr-8'}`}>
                    <div className="bg-white p-6 rounded-lg border border-gray-100">
                      <h3 className="text-lg font-medium mb-2">{milestone.title}</h3>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Join Our Team Banner */}
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
      </section>
      
      {/* Instagram Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Follow Our Journey</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-10">
            Get a behind-the-scenes look at our process and team on Instagram
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[...Array(6)].map((_, index) => (
              <a 
                key={index}
                href="#"
                className="block aspect-square overflow-hidden rounded-lg"
              >
                <img 
                  src={`https://source.unsplash.com/random/300x300?minimalism&sig=${index}`}
                  alt="Instagram post"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </a>
            ))}
          </div>
          
          <Button variant="outline" className="mt-8 rounded-full">
            @Roodhy_design
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;
