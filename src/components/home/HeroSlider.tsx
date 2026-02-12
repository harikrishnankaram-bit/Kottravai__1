import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const SLIDES = [
    {
        id: 1,
        image: "https://kottravai.in/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-30-at-4.20.58-PM-e1767163041511.jpeg",
        link: "#"
    },
    {
        id: 2,
        image: "https://kottravai.in/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-31-at-10.16.33-AM-e1767163411201.jpeg",
        link: "#"
    }
];

const HeroSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="kottravai-hero-box">
            <style>{`
                .kottravai-hero-box {
                    position: relative;
                    width: 100%;
                    height: 500px;
                    background: #000;
                    overflow: hidden;
                    margin: 0;
                }

                .hero-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }

                .hero-slide {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 1s ease-in-out, visibility 1.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .hero-slide.active {
                    opacity: 1;
                    visibility: visible;
                    z-index: 2;
                }

                /* Background Fill */
                .hero-blur-fill {
                    position: absolute;
                    inset: -20px;
                    background-size: cover;
                    background-position: center;
                    filter: blur(30px) brightness(0.6);
                    transform: scale(1.1);
                    z-index: 1;
                }

                /* Main Centered Image */
                .hero-main-image {
                    position: relative;
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    z-index: 2;
                    box-shadow: 0 0 40px rgba(0,0,0,0.5);
                }

                /* Dots */
                .hero-dots {
                    position: absolute;
                    bottom: 25px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 10;
                    display: flex;
                    gap: 12px;
                }

                .hero-dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    cursor: pointer;
                    background: rgba(255,255,255,0.3);
                    border: 1px solid rgba(255,255,255,0.4);
                    transition: all 0.3s;
                }

                .hero-dot.active {
                    background: #fff;
                    transform: scale(1.3);
                }

                @media (max-width: 768px) {
                    .kottravai-hero-box {
                        height: 350px;
                    }
                }
            `}</style>

            <div className="hero-container">
                {SLIDES.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`hero-slide ${index === currentIndex ? 'active' : ''}`}
                    >
                        {/* Background Layer */}
                        <div
                            className="hero-blur-fill"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        />

                        {/* Foreground Layer */}
                        <a href={slide.link} className="relative h-full flex items-center justify-center">
                            <img
                                src={slide.image}
                                alt="Banner"
                                className="hero-main-image"
                                referrerPolicy="no-referrer"
                            />
                        </a>
                    </div>
                ))}
            </div>

            <div className="hero-dots">
                {SLIDES.map((_, index) => (
                    <div
                        key={index}
                        className={`hero-dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroSlider;
