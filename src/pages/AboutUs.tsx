import { Heart, Globe, ChevronLeft, ChevronRight, Users, HeartPulse, Wallet, Sprout, MapPin, ArrowRight } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { useState, useEffect } from 'react';

const TeamSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCards, setVisibleCards] = useState(4);
    const totalCards = teamMembers.length;

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setVisibleCards(1);
            else if (window.innerWidth < 1024) setVisibleCards(2);
            else setVisibleCards(4);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (totalCards > visibleCards) {
                setCurrentIndex((prev) => (prev + 1) % (totalCards - visibleCards + 1));
            }
        }, 6000);
        return () => clearInterval(interval);
    }, [currentIndex, visibleCards, totalCards]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % (totalCards - visibleCards + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + (totalCards - visibleCards + 1)) % (totalCards - visibleCards + 1));
    };

    return (
        <div className="relative max-w-[1200px] mx-auto px-4 md:px-10">
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-[1000ms] ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * (100 / visibleCards)}%)` }}
                >
                    {teamMembers.map((member, idx) => (
                        <div
                            key={`${member.name}-${idx}`}
                            className="flex-shrink-0 px-4 text-center group"
                            style={{ width: `${100 / visibleCards}%` }}
                        >
                            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-100 mb-4 shadow-sm">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover object-top"
                                />
                            </div>
                            <div className="px-1">
                                <h4 className="font-bold text-[#2D1B4E] text-lg mb-1">{member.name}</h4>
                                <p className="text-gray-500 text-sm font-medium tracking-wide">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            {totalCards > visibleCards && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute top-1/2 -left-2 md:left-0 transform -translate-y-1/2 p-3 rounded-full bg-white shadow-lg text-[#2D1B4E] hover:bg-[#2D1B4E] hover:text-white transition-all z-10 border border-gray-100"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute top-1/2 -right-2 md:right-0 transform -translate-y-1/2 p-3 rounded-full bg-white shadow-lg text-[#2D1B4E] hover:bg-[#2D1B4E] hover:text-white transition-all z-10 border border-gray-100"
                    >
                        <ChevronRight size={20} />
                    </button>
                </>
            )}
        </div>
    );
};

const AboutUs = () => {
    return (
        <MainLayout>
            <div className="bg-white">
                {/* About Intro Section */}
                <section className="relative py-20 overflow-hidden">
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                            {/* Left Content */}
                            <div className="space-y-8">
                                <h2 className="text-4xl md:text-5xl lg:text-5xl font-black text-[#2D1B4E] leading-tight">
                                    We build dignified livelihoods<br className="hidden lg:block" /> through <span className="text-[#8E2A8B]">craft.</span>
                                </h2>

                                <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                                    Kottravai is a women-led platform creating eco-friendly handmade products
                                    while enabling rural women artisans to earn sustainable, independent incomes.
                                    We believe economic dignity strengthens families, preserves traditions,
                                    and builds resilient communities.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-8 pt-4">
                                    <div className="border-l-4 border-[#8E2A8B] pl-4 py-1">
                                        <strong className="text-[#2D1B4E] font-bold text-lg block">Women-Led</strong>
                                        <span className="text-gray-500 text-sm">Built by women, for women</span>
                                    </div>
                                    <div className="border-l-4 border-[#8E2A8B] pl-4 py-1">
                                        <strong className="text-[#2D1B4E] font-bold text-lg block">Handcrafted</strong>
                                        <span className="text-gray-500 text-sm">Rooted in artisan skill</span>
                                    </div>
                                    <div className="border-l-4 border-[#8E2A8B] pl-4 py-1">
                                        <strong className="text-[#2D1B4E] font-bold text-lg block">Sustainable</strong>
                                        <span className="text-gray-500 text-sm">Designed with natural materials</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Visual */}
                            <div className="relative">
                                <div className="rounded-[2rem] overflow-hidden shadow-2xl">
                                    <img
                                        src="/ab.jpg"
                                        alt="Kottravai women artisans"
                                        className="w-full h-auto object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Impact Strip */}
                        <div className="relative bg-[#2D1B4E] rounded-2xl p-10 shadow-xl flex flex-col md:flex-row justify-around items-center gap-8 text-center max-w-5xl mx-auto">
                            <div className="flex flex-col items-center">
                                <strong className="text-5xl font-black text-[#FFD700] mb-1">50+</strong>
                                <span className="text-white/90 font-bold uppercase tracking-widest text-xs">Women Artisans</span>
                            </div>
                            <div className="hidden md:block w-px h-12 bg-white/20"></div>
                            <div className="flex flex-col items-center">
                                <strong className="text-5xl font-black text-[#FFD700] mb-1">100%</strong>
                                <span className="text-white/90 font-bold uppercase tracking-widest text-xs">Handmade Products</span>
                            </div>
                            <div className="hidden md:block w-px h-12 bg-white/20"></div>
                            <div className="flex flex-col items-center">
                                <strong className="text-5xl font-black text-[#FFD700] mb-1">0%</strong>
                                <span className="text-white/90 font-bold uppercase tracking-widest text-xs">Plastic Materials</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Impact Section - Premium Redesign */}
                <section className="py-10 relative overflow-hidden bg-gradient-to-b from-white via-purple-50/20 to-white">


                    <div className="container mx-auto px-4 max-w-7xl relative z-10">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-[#2D1B4E] tracking-tight mb-6">
                                Our Impact
                            </h2>
                            <div className="h-[2px] w-24 mx-auto bg-gradient-to-r from-transparent via-[#8E2A8B] to-transparent opacity-60"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                            {/* Card 1 */}
                            <div className="group relative p-8 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(142,42,139,0.1)] hover:-translate-y-2 transition-all duration-500 ease-out">
                                <div className="w-16 h-16 mb-8 rounded-2xl bg-gradient-to-br from-[#F8F0FF] to-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ease-out border border-purple-50/50">
                                    <Users className="w-7 h-7 text-[#8B2C84] opacity-90" />
                                </div>
                                <h3 className="text-xl font-bold text-[#2D1B4E] mb-4 tracking-tight">Women Empowered</h3>
                                <p className="text-[15px] text-gray-600 leading-[1.8] font-medium opacity-90">
                                    Rural women transition from hazardous Beedi work into safe, skilled, and dignified livelihoods.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="group relative p-8 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(142,42,139,0.1)] hover:-translate-y-2 transition-all duration-500 ease-out md:translate-y-8 lg:translate-y-0">
                                <div className="w-16 h-16 mb-8 rounded-2xl bg-gradient-to-br from-[#F8F0FF] to-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ease-out border border-purple-50/50">
                                    <HeartPulse className="w-7 h-7 text-[#8B2C84] opacity-90" />
                                </div>
                                <h3 className="text-xl font-bold text-[#2D1B4E] mb-4 tracking-tight">Health & Wellbeing</h3>
                                <p className="text-[15px] text-gray-600 leading-[1.8] font-medium opacity-90">
                                    Reduced exposure to toxic environments leads to improved physical health and quality of life.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="group relative p-8 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(142,42,139,0.1)] hover:-translate-y-2 transition-all duration-500 ease-out">
                                <div className="w-16 h-16 mb-8 rounded-2xl bg-gradient-to-br from-[#F8F0FF] to-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ease-out border border-purple-50/50">
                                    <Wallet className="w-7 h-7 text-[#8B2C84] opacity-90" />
                                </div>
                                <h3 className="text-xl font-bold text-[#2D1B4E] mb-4 tracking-tight">Stable Livelihoods</h3>
                                <p className="text-[15px] text-gray-600 leading-[1.8] font-medium opacity-90">
                                    Consistent income and skill development bring long-term financial security to families.
                                </p>
                            </div>

                            {/* Card 4 */}
                            <div className="group relative p-8 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(142,42,139,0.1)] hover:-translate-y-2 transition-all duration-500 ease-out md:translate-y-8 lg:translate-y-0">
                                <div className="w-16 h-16 mb-8 rounded-2xl bg-gradient-to-br from-[#F8F0FF] to-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ease-out border border-purple-50/50">
                                    <Sprout className="w-7 h-7 text-[#8B2C84] opacity-90" />
                                </div>
                                <h3 className="text-xl font-bold text-[#2D1B4E] mb-4 tracking-tight">Sustainable Future</h3>
                                <p className="text-[15px] text-gray-600 leading-[1.8] font-medium opacity-90">
                                    Eco-friendly materials and ethical production support communities and the planet together.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="py-20 bg-gray-50 relative overflow-hidden">
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-black text-[#2D1B4E] mb-4">
                                Heart & Horizon
                            </h2>
                            <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
                                Kottravai exists at the intersection of timeless heritage and ethical progress. We are not just creating products; we are cultivating a movement.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            <div className="bg-white p-10 rounded-2xl shadow-lg border border-purple-50 hover:shadow-xl transition-shadow duration-300">
                                <div className="w-16 h-16 bg-purple-50 rounded-xl flex items-center justify-center mb-6 text-[#8B2C84]">
                                    <Heart size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-[#2D1B4E] mb-4">Our Mission</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    To revive and elevate the ancient craft traditions of India by creating sustainable, dignified livelihoods for rural women artisans. We are committed to a zero-waste philosophy, ensuring that every creation contributes to the healing of our planet while celebrating the unparalleled beauty of human skill.
                                </p>
                            </div>

                            <div className="bg-white p-10 rounded-2xl shadow-lg border border-purple-50 hover:shadow-xl transition-shadow duration-300">
                                <div className="w-16 h-16 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 text-[#2D1B4E]">
                                    <Globe size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-[#2D1B4E] mb-4">Our Vision</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    To be the global beacon of ethical luxury, redefining wealth not as accumulation, but as impact. We envision a world where luxury is synonymous with conscience, where every purchase tells a story of empowerment, and where traditional Indian artistry earns its rightful place on the world stage.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Hubs Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <span className="text-sm font-bold text-[#8E2A8B] uppercase tracking-widest mb-3 block">Our Network</span>
                            <h2 className="text-3xl md:text-4xl font-black text-[#2D1B4E] mb-4">
                                Our <span className="text-[#8E2A8B]">Hubs</span>
                            </h2>
                            <p className="text-lg text-gray-600">
                                Empowering communities across our growing network of artisan centers.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    name: "Thenkasi Hub",
                                    location: "Thenkasi, Tamil Nadu",
                                    desc: "Specializing in palm leaf weaving and natural fiber crafts.",
                                    icon: Sprout
                                },
                                {
                                    name: "Madurai Hub",
                                    location: "Madurai, Tamil Nadu",
                                    desc: "The heart of our traditional textile and cotton weaving operations.",
                                    icon: Globe
                                },
                                {
                                    name: "Coimbatore Hub",
                                    location: "Coimbatore, Tamil Nadu",
                                    desc: "Focused on eco-friendly packaging and sustainable materials.",
                                    icon: Heart
                                },
                                {
                                    name: "Chennai Hub",
                                    location: "Chennai, Tamil Nadu",
                                    desc: "Our central design studio and logistics coordination center.",
                                    icon: MapPin
                                }
                            ].map((hub, idx) => (
                                <div key={idx} className="bg-[#F8F0FF] rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
                                    <h3 className="text-xl font-bold text-[#2D1B4E] mb-2">{hub.name}</h3>
                                    <p className="text-sm font-bold text-[#8E2A8B] mb-4 flex items-center gap-1 justify-center">
                                        <MapPin size={12} /> {hub.location}
                                    </p>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                        {hub.desc}
                                    </p>
                                    <button className="mt-auto text-xs font-bold uppercase tracking-widest text-[#2D1B4E] hover:text-[#8E2A8B] transition-colors flex items-center gap-2">
                                        View Hub <ArrowRight size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-20 bg-gray-50 overflow-hidden">
                    <div className="container mx-auto px-4 mb-16">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-5xl font-black text-[#2D1B4E] mb-6">
                                Our Team
                            </h2>
                            <p className="text-lg text-gray-600">
                                Meet the artisans, designers, and visionaries shaping the future of sustainable craft.
                            </p>
                        </div>

                        {/* 3 Main Images - Static */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-center">
                            <div className="space-y-4">
                                <div className="rounded-2xl overflow-hidden h-[400px] shadow-lg">
                                    <img src="/team/team-3.jpg" alt="Sridhar Vembu" className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#2D1B4E]">Sridhar Vembu</h3>
                                    <p className="text-[#8B2C84] font-medium">Chief Mentor</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="rounded-2xl overflow-hidden h-[400px] shadow-lg">
                                    <img src="/team/team-1.jpg" alt="Ananthan Ayyasamy" className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#2D1B4E]">Ananthan Ayyasamy</h3>
                                    <p className="text-[#8B2C84] font-medium">Co-Founder</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="rounded-2xl overflow-hidden h-[400px] shadow-lg">
                                    <img src="/team/team-2.jpg" alt="Karunya Gunavathy" className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#2D1B4E]">Karunya Gunavathy</h3>
                                    <p className="text-[#8B2C84] font-medium">CEO & Co-Founder</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container mx-auto px-4">
                        <TeamSlider />
                    </div>
                </section>

                {/* Advisory Panel Section */}
                <section className="py-12 lg:py-20 bg-gray-50 overflow-hidden relative">
                    {/* Background blob */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full blur-3xl opacity-60 pointer-events-none"></div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center max-w-3xl mx-auto mb-20">
                            <span className="text-sm font-black text-[#8B2C84] uppercase tracking-[0.3em] mb-4 block">Scientific Guidance</span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#2D1B4E] mb-6">Medical Advisory Panel</h2>
                            <p className="text-xl text-gray-600 font-light leading-relaxed">Our formulations are guided by traditional wisdom and validated by modern medical experts.</p>
                        </div>

                        <div className="flex flex-col gap-8 max-w-5xl mx-auto">
                            {[
                                {
                                    name: "Dr. Saranya",
                                    role: "Product Formulator & Nutritionist",
                                    image: "/doc1.jpg",
                                    imagePos: "center",
                                    quote: "\"Food is the first medicine.\"",
                                    desc: "As our lead formulator, Dr. Saranya ensures every Kottravai edible product balances traditional wisdom with modern nutritional integrity.",
                                    focusTitle: "Kottravai Expertise",
                                    focusItems: ["Therapeutic nutrition", "Bioactive ingredients", "Preventive health"]
                                },
                                {
                                    name: "Dr. N. Venthan",
                                    role: "Integrative Medicine Specialist",
                                    image: "/doc2.jpeg",
                                    imagePos: "center 20%",
                                    quote: "\"Holistic harmony through nature.\"",
                                    desc: "An Integrative Medicine Specialist (BNYS) who brings holistic strategy to Kottravai's wellness expansion and natural restoration.",
                                    focusTitle: "Kottravai Expertise",
                                    focusItems: ["Holistic healing strategy", "Natural restoration", "Yoga-based wellness"]
                                },
                                {
                                    name: "Dr. Mounisha",
                                    role: "Medical Advisor (MBBS/MD)",
                                    image: "/doc3.jpeg",
                                    imagePos: "top",
                                    quote: "\"Safety first, nature always.\"",
                                    desc: "Practicing in Obstetrics & Gynaecology, Dr. Mounisha validates the safety of Kottravai products for women's clinical purity standards.",
                                    focusTitle: "Kottravai Expertise",
                                    focusItems: ["Clinical purity validation", "Women's health safety", "Standardized medical hygiene"]
                                }
                            ].map((doc, idx) => (
                                <div key={idx} className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-xl shadow-purple-900/5 group hover:-translate-y-2 transition-all duration-500 border border-white hover:border-purple-50 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative overflow-hidden">
                                    {/* Image Section */}
                                    <div className="w-40 h-40 lg:w-48 lg:h-48 shrink-0 rounded-[2rem] overflow-hidden bg-gray-100 shadow-inner group-hover:shadow-[#8B2C84]/10 transition-all duration-500 border border-gray-100 relative">
                                        <div className="absolute inset-0 bg-[#2D1B4E]/0 group-hover:bg-[#2D1B4E]/10 transition-colors duration-500 z-10"></div>
                                        <img
                                            src={doc.image}
                                            alt={doc.name}
                                            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                            style={{ objectPosition: doc.imagePos }}
                                        />
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex-grow text-center lg:text-left space-y-4">
                                        <div>
                                            <h3 className="text-2xl font-black text-[#2D1B4E] mb-2">{doc.name}</h3>
                                            <div className="inline-block bg-[#F8F0FF] px-4 py-1.5 rounded-full border border-purple-100">
                                                <p className="text-[#8B2C84] font-bold text-[10px] uppercase tracking-widest">{doc.role}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <p className="font-bold text-[#8B2C84] italic text-sm font-serif">{doc.quote}</p>
                                            <p className="text-gray-600 text-[15px] leading-relaxed font-medium">{doc.desc}</p>
                                        </div>
                                    </div>

                                    {/* Expertise Box */}
                                    <div className="w-full lg:w-64 shrink-0 bg-gray-50/80 rounded-2xl p-6 border border-gray-100 group-hover:bg-purple-50/30 transition-all duration-500">
                                        <p className="text-[10px] font-black uppercase text-[#2D1B4E] tracking-[0.2em] mb-4 opacity-50 text-center lg:text-left">{doc.focusTitle}</p>
                                        <ul className="space-y-3">
                                            {doc.focusItems.map((item, i) => (
                                                <li key={i} className="flex items-center gap-3 text-[13px] font-bold text-[#2D1B4E]/80 justify-center lg:justify-start">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#8B2C84] shrink-0"></div>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* What Makes Kottravai Different Section */}
                <section className="py-[90px] px-5 bg-white">
                    <div className="max-w-[1200px] mx-auto">
                        <header className="text-center max-w-[720px] mx-auto mb-[70px]">
                            <span className="text-[13px] tracking-[.18em] uppercase text-[#8E2A8B] font-bold block">
                                OUR DIFFERENCE
                            </span>
                            <h2 className="text-[28px] md:text-[38px] font-extrabold text-[#2D1B4E] my-3.5">
                                What Makes Kottravai Different
                            </h2>
                            <p className="text-[#555] text-lg leading-[1.7]">
                                Kottravai stands at the intersection of tradition, sustainability,
                                and women-led craftsmanship — creating products with purpose and impact.
                            </p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-auto lg:auto-rows-[260px] gap-[26px]">
                            <article className="lg:col-span-2 lg:row-span-2 relative p-[26px] flex flex-col bg-white border-[1.8px] border-[#8E2A8B] rounded-[14px] overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-[18px] font-bold text-[#2D1B4E] mb-2">Sustainable by Nature</h3>
                                    <p className="text-[14.8px] leading-[1.65] text-[#555]">
                                        Our products are created using eco-friendly, responsibly sourced
                                        materials that honour nature and reduce environmental impact.<br /><br />
                                        We work with natural, biodegradable, and responsibly sourced materials, ensuring minimal
                                        environmental impact while maintaining durability and timeless appeal.
                                    </p>
                                </div>
                                <div className="w-full h-[200px] lg:h-[260px] mt-auto pt-5">
                                    <img
                                        src="/Picture1.png"
                                        alt="Sustainable production"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                            </article>

                            <article className="group relative min-h-[220px] p-[26px] flex flex-col bg-white border-[1.8px] border-[#8E2A8B] rounded-[16px] overflow-hidden transition-all duration-300 hover:shadow-[0_24px_60px_rgba(142,42,139,0.18)] hover:border-transparent">
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-450 z-0">
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#2D1B4E]/30 to-[#2D1B4E]/90 z-10"></div>
                                    <img src="/Picture2.png" alt="Women artisans" className="w-full h-full object-cover" />
                                </div>
                                <div className="relative z-20">
                                    <h3 className="text-[18px] font-bold text-[#2D1B4E] mb-2 group-hover:text-white group-hover:drop-shadow-md transition-colors">Women-Led Craftsmanship</h3>
                                    <p className="text-[14.8px] leading-[1.65] text-[#555] group-hover:text-white/95 group-hover:drop-shadow-md transition-colors">
                                        Every Kottravai product is handcrafted by skilled rural women,
                                        ensuring ethical production and dignified livelihoods.
                                    </p>
                                </div>
                            </article>

                            <article className="group relative min-h-[220px] p-[26px] flex flex-col bg-white border-[1.8px] border-[#8E2A8B] rounded-[16px] overflow-hidden transition-all duration-300 hover:shadow-[0_24px_60px_rgba(142,42,139,0.18)] hover:border-transparent">
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-450 z-0">
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#2D1B4E]/30 to-[#2D1B4E]/90 z-10"></div>
                                    <img src="/Picture3.png" alt="Eco creation" className="w-full h-full object-cover" />
                                </div>
                                <div className="relative z-20">
                                    <h3 className="text-[18px] font-bold text-[#2D1B4E] mb-2 group-hover:text-white group-hover:drop-shadow-md transition-colors">Eco-Conscious Creation</h3>
                                    <p className="text-[14.8px] leading-[1.65] text-[#555] group-hover:text-white/95 group-hover:drop-shadow-md transition-colors">
                                        We prioritise slow, mindful production that respects resources,
                                        communities, and future generations.
                                    </p>
                                </div>
                            </article>

                            <article className="group relative min-h-[220px] p-[26px] flex flex-col bg-white border-[1.8px] border-[#8E2A8B] rounded-[16px] overflow-hidden transition-all duration-300 hover:shadow-[0_24px_60px_rgba(142,42,139,0.18)] hover:border-transparent">
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-450 z-0">
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#2D1B4E]/30 to-[#2D1B4E]/90 z-10"></div>
                                    <img src="/Picture4.png" alt="Ethical practices" className="w-full h-full object-cover" />
                                </div>
                                <div className="relative z-20">
                                    <h3 className="text-[18px] font-bold text-[#2D1B4E] mb-2 group-hover:text-white group-hover:drop-shadow-md transition-colors">Ethical Practices</h3>
                                    <p className="text-[14.8px] leading-[1.65] text-[#555] group-hover:text-white/95 group-hover:drop-shadow-md transition-colors">
                                        Fair wages, transparency, and respect guide every partnership
                                        and production decision we make.
                                    </p>
                                </div>
                            </article>

                            <article className="group relative min-h-[220px] p-[26px] flex flex-col bg-white border-[1.8px] border-[#8E2A8B] rounded-[16px] overflow-hidden transition-all duration-300 hover:shadow-[0_24px_60px_rgba(142,42,139,0.18)] hover:border-transparent">
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-450 z-0">
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#2D1B4E]/30 to-[#2D1B4E]/90 z-10"></div>
                                    <img src="/Picture5.png" alt="Purpose impact" className="w-full h-full object-cover" />
                                </div>
                                <div className="relative z-20">
                                    <h3 className="text-[18px] font-bold text-[#2D1B4E] mb-2 group-hover:text-white group-hover:drop-shadow-md transition-colors">Purpose-Driven Impact</h3>
                                    <p className="text-[14.8px] leading-[1.65] text-[#555] group-hover:text-white/95 group-hover:drop-shadow-md transition-colors">
                                        Each purchase directly supports women’s independence,
                                        traditional crafts, and conscious living.
                                    </p>
                                </div>
                            </article>
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-20 px-4 bg-white overflow-hidden">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
                        <div className="text-center md:text-left">
                            <span className="inline-block text-sm font-bold uppercase tracking-[2px] text-[#8E2A8B] mb-5 bg-[#F8F0FF] px-4 py-2 rounded-full">
                                OUR COMMITMENT
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6 text-[#2D1B4E]">
                                Join the Kottravai Movement
                            </h2>
                            <p className="text-lg leading-relaxed mb-10 text-gray-600 max-w-lg mx-auto md:mx-0">
                                Every purchase is more than a transaction—it’s a contribution to change.
                                Support women. Preserve tradition. Choose sustainability.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
                                <a
                                    className="inline-block px-8 py-4 rounded-lg font-semibold text-center transition-all duration-300 bg-[#8E2A8B] text-white shadow-[0_4px_15px_rgba(142,42,139,0.3)] hover:bg-[#6d1e6a] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(142,42,139,0.4)]"
                                    href="https://kottravai.in/product-category/handicrafts/"
                                >
                                    Explore Our Handcrafted Collections
                                </a>
                                <a
                                    className="inline-block px-8 py-4 rounded-lg font-semibold text-center transition-all duration-300 bg-transparent text-[#8E2A8B] border border-[#8E2A8B] hover:bg-[#F8F0FF] hover:text-[#6d1e6a] hover:border-[#6d1e6a]"
                                    href="https://kottravai.in/b2b/"
                                >
                                    Get in Touch With Us
                                </a>
                            </div>
                        </div>
                        <div className="relative h-[350px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="/4.png"
                                alt="Kottravai artisans and craftsmanship"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout >
    );
};

const teamMembers = [
    {
        name: "Ahamed Musharaf Ali",
        role: "Product Manager",
        image: "/team/member-3.jpg"
    },
    {
        name: "Santhosh",
        role: "Developer",
        image: "/team/member-1.jpg"
    },
    {
        name: "Mohammed Safeek",
        role: "Sales Head",
        image: "/team/member-2.jpg"
    },
    {
        name: "Gnana Jency",
        role: "Hub Manager",
        image: "/team/gnana_jency.jpg"
    },
    {
        name: "Shunmuga Priya",
        role: "Production Manager",
        image: "/team/member-5.jpg"
    },
    {
        name: "Jayanthi",
        role: "QC Head",
        image: "/team/member-4.jpg"
    }
];

export default AboutUs;
