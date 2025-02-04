import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { FaQuoteLeft } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/pagination';

const TestimonialCard = ({ name, role, image, quote }) => (
  <div className="bg-white rounded-xl shadow-lg p-8 h-full flex flex-col">
    <div className="flex items-center mb-6">
      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-100 flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="ml-4">
        <h4 className="text-xl font-semibold text-gray-800">{name}</h4>
        <p className="text-blue-600">{role}</p>
      </div>
    </div>
    <div className="flex-grow">
      <FaQuoteLeft className="text-blue-100 text-4xl mb-4" />
      <blockquote className="text-gray-600 italic leading-relaxed">
        "{quote}"
      </blockquote>
    </div>
  </div>
);

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Web Developer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
      quote: "SkillNet helped me improve my design skills while teaching coding. The platform made it easy to connect with other professionals."
    },
    {
      name: "Michael Chen",
      role: "Digital Marketer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
      quote: "I've met amazing people and learned valuable skills. The community here is supportive and knowledgeable. The experience has been transformative."
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
      quote: "The skill exchange concept is brilliant! I've grown both professionally and personally through these interactions. Highly recommend it!"
    }
  ];

  return (
    <section className="py-20 px-40 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            What Our Community Says
          </h2>
          <p className="text-gray-600 text-lg">
            Join thousands of satisfied members who are already sharing and learning
          </p>
        </div>
        
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ 
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-blue-600'
          }}
          autoplay={{ delay: 5000 }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-16"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index} className="h-auto">
              <TestimonialCard {...testimonial} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
