// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Heart, Shield, Users, Clock } from "lucide-react";
// import Image from "next/image";

// // Mock professional data (can be replaced with DB fetch)
// const professionals = [
//   { id: "dr-kamanzi", name: "Dr. Kamanzi" },
//   { id: "dr-mukamana", name: "Dr. Mukamana" },
//   { id: "dr-ndoli", name: "Dr. Ndoli" },
// ];

// const Hero = () => {
//   return (
//     <section
//       id="home"
//       className="min-h-screen bg-gradient-hero flex items-center relative overflow-hidden"
//     >
//       {/* Background Pattern */}
//       <div className="absolute inset-0 opacity-5 pointer-events-none">
//         <div className="absolute top-20 left-20 w-32 h-32 bg-primary-light rounded-full animate-float" />
//         <div
//           className="absolute top-60 right-32 w-20 h-20 bg-primary-dark rounded-full animate-float"
//           style={{ animationDelay: "1s" }}
//         />
//         <div
//           className="absolute bottom-40 left-1/3 w-24 h-24 bg-primary rounded-full animate-float"
//           style={{ animationDelay: "2s" }}
//         />
//       </div>

//       <div className="container mx-auto px-6 py-24 relative z-10">
//         <div className="grid lg:grid-cols-2 gap-16 items-center">
//           {/* Left Content */}
//           <div className="text-white animate-fade-in">
//             <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
//               Your Mental Health{" "}
//               <span className="block text-primary-light">Matters</span>
//             </h1>
//             <p className="text-xl mb-8 opacity-90 leading-relaxed max-w-xl">
//               Access professional, confidential, and affordable mental health support from licensed therapists in Rwanda. Break the silence, break the stigma.
//             </p>

//             {/* Sign Up Button */}
//             <Button
//               size="lg"
//               className="bg-white text-primary hover:bg-white/90 transition-all shadow-lg mb-6"
//             >
//               Sign Up
//             </Button>

//             {/* Horizontal Booking Container */}
//             <div className="flex flex-col lg:flex-row items-center gap-4 bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
//               {/* Doctor Dropdown */}
//               <Select>
//                 <SelectTrigger className="w-full lg:w-1/3 bg-white text-primary">
//                   <SelectValue placeholder="Select Doctor" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {professionals.map((doc) => (
//                     <SelectItem key={doc.id} value={doc.id}>
//                       {doc.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               {/* Date Picker */}
//               <Input
//                 type="date"
//                 className="w-full lg:w-1/3 bg-white text-primary"
//                 placeholder="Select Date"
//               />

//               {/* Book Now Button */}
//               <Button
//                 size="lg"
//                 className="w-full lg:w-1/3 bg-primary-light text-white hover:bg-primary transition-all"
//               >
//                 Book Now
//               </Button>
//             </div>

//             {/* Feature Cards Below Booking Form */}
//             <div className="grid grid-cols-2 gap-4 mt-8">
//               {[
//                 {
//                   icon: <Heart className="h-6 w-6 text-primary-light" />,
//                   title: "Compassionate",
//                 },
//                 {
//                   icon: <Shield className="h-6 w-6 text-primary-light" />,
//                   title: "Private",
//                 },
//                 {
//                   icon: <Users className="h-6 w-6 text-primary-light" />,
//                   title: "Expert",
//                 },
//                 {
//                   icon: <Clock className="h-6 w-6 text-primary-light" />,
//                   title: "Flexible",
//                 },
//               ].map((feature, i) => (
//                 <div key={i} className="flex items-center gap-3 text-white">
//                   {feature.icon}
//                   <span className="text-sm font-medium">{feature.title}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Right Content - Hero Image */}
//           <div className="relative w-full h-[600px] rounded-xl overflow-hidden shadow-2xl animate-slide-up">
//             <Image
//               src="/hero.png"
//               alt="Mental Health Support - Professional therapists providing compassionate care"
//               fill
//               className="object-cover rounded-xl"
//               priority
//               sizes="(max-width: 768px) 100vw, 50vw"
//             />
            
//             {/* Optional: Add an overlay or decorative elements */}
//             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;

import { useMemo, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { MessageCircle } from 'lucide-react';

// Memoized professional data
const PROFESSIONALS = [
  { id: "dr-kamanzi", name: "Dr. Kamanzi" },
  { id: "dr-mukamana", name: "Dr. Mukamana" },
  { id: "dr-ndoli", name: "Dr. Ndoli" },
] as const;

// Floating Chat Button Component
const FloatingChatButton = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleChatClick = useCallback(() => {
    // Implement chat functionality here
    console.log('Opening live chat...');
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={handleChatClick}
      className="fixed bottom-6 right-6 z-50 group animate-bounce hover:animate-none"
      aria-label="Live Chat"
    >
      <div className="relative">
        {/* Pulsing effect */}
        <div className="absolute inset-0 bg-primary-light rounded-full animate-ping opacity-20" />
        
        {/* Main button */}
        <div className="relative bg-gradient-to-r from-primary to-primary-light text-white p-4 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-3xl group-hover:rotate-12">
          <MessageCircle size={24} />
        </div>
        
        {/* Notification badge */}
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
          1
        </div>
      </div>
    </button>
  );
};

// Optimized Background Pattern Component
const BackgroundPattern = () => (
  <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
    {useMemo(() => [
      { top: '20%', left: '20%', size: 'w-32 h-32', delay: '0s' },
      { top: '60%', right: '20%', size: 'w-20 h-20', delay: '1s' },
      { top: '70%', left: '30%', size: 'w-24 h-24', delay: '2s' },
      { top: '30%', right: '30%', size: 'w-16 h-16', delay: '1.5s' },
    ].map((circle, index) => (
      <div
        key={index}
        className={`absolute bg-primary-light rounded-full animate-float ${circle.size}`}
        style={{
          top: circle.top,
          left: circle.left,
          right: circle.right,
          animationDelay: circle.delay,
        }}
      />
    )), [])}
  </div>
);

// Booking Form Component
const BookingForm = () => {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const handleBooking = useCallback(() => {
    if (!selectedDoctor || !selectedDate) {
      alert('Please select both doctor and date');
      return;
    }
    // Implement booking logic
    console.log('Booking appointment...');
  }, [selectedDoctor, selectedDate]);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-lg transition-all duration-300 hover:shadow-2xl hover:bg-white/15">
      <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
        <SelectTrigger className="w-full sm:flex-1 bg-white text-primary rounded-md shadow-sm transition-all hover:shadow-md">
          <SelectValue placeholder="Select Doctor" />
        </SelectTrigger>
        <SelectContent>
          {PROFESSIONALS.map((doc) => (
            <SelectItem key={doc.id} value={doc.id}>
              {doc.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="w-full sm:flex-1 bg-white text-primary rounded-md shadow-sm transition-all hover:shadow-md"
      />

      <Button
        onClick={handleBooking}
        size="lg"
        className="w-full sm:flex-1 bg-primary-light text-white hover:bg-primary transition-all rounded-md shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        Book Now
      </Button>
    </div>
  );
};

const Hero = () => {
  const handleSignUp = useCallback(() => {
    // Implement sign up logic
    console.log('Sign up clicked...');
  }, []);

  return (
    <section
      id="home"
      className="min-h-screen bg-gradient-hero flex items-center relative overflow-hidden"
    >
      <BackgroundPattern />
      
      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Right Side - Content (Reversed position) */}
          <div className="text-white animate-fade-in order-2 lg:order-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Your Mental Health{" "}
              <span className="block text-primary-light bg-gradient-to-r from-primary-light to-primary bg-clip-text text-transparent">
                Matters
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl mb-8 opacity-90 leading-relaxed max-w-xl">
              Access professional, confidential, and affordable mental health support 
              from licensed therapists in Rwanda. Break the silence, break the stigma.
            </p>

            <Button
              onClick={handleSignUp}
              size="lg"
              className="bg-white text-primary hover:bg-white/90 transition-all shadow-lg mb-6 w-full sm:w-auto transform hover:-translate-y-0.5 hover:shadow-xl"
            >
              Sign Up Free
            </Button>

            <BookingForm />
          </div>

          {/* Left Side - Hero Image (Reversed position) */}
          <div className="w-full h-auto rounded-xl overflow-hidden shadow-2xl animate-slide-up order-1 lg:order-2 transform hover:scale-105 transition-transform duration-300">
            <img
              src="/hero.png"
              alt="Mental Health Support"
              className="w-full h-full object-cover rounded-xl"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>

      <FloatingChatButton />
    </section>
  );
};

export default Hero;