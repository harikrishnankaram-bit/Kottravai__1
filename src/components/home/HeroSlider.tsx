import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const SLIDES = [
    {
        id: 1,
        image: "/hero1.jpg",
        link: "#"
    },
    {
        id: 2,
        image: "/hero2.jpg",
        link: "#"
    }
];

const HeroSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Simplest possible autoplay logic
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="kottravai-hero">
            <Helmet>
                <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap" rel="stylesheet" />
            </Helmet>

            <style>{`
                .kottravai-hero {
                    position: relative;
                    width: 100%;
                    height: 600px;
                    background: #f5f5f5;
                    overflow: hidden;
                }

                .slide-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }

                .slide {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    transition: opacity 1s ease-in-out;
                    z-index: 1;
                }

                .slide.active {
                    opacity: 1;
                    z-index: 2;
                }

                .slide img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    background: #ffffff;
                    display: block;
                }

                /* Dots */
                .kottravai-dots {
                    position: absolute;
                    bottom: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 10;
                    display: flex;
                    gap: 12px;
                }

                .dot {
                    width: 12px;
                    height: 12px;
                    border: 2px solid white;
                    border-radius: 50%;
                    cursor: pointer;
                    background: rgba(255,255,255,0.4);
                    transition: all 0.3s;
                }

                .dot.active {
                    background: white;
                    transform: scale(1.2);
                }

                @media (max-width: 768px) {
                    .kottravai-hero {
                        height: auto;
                        aspect-ratio: 3/2;
                    }
                    .slide img {
                        object-fit: contain;
                        background: #f9f9f9;
                    }
                }
            `}</style>

            <div className="slide-container">
                {SLIDES.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`slide ${index === currentIndex ? 'active' : ''}`}
                    >
                        <a href={slide.link}>
                            <img
                                src={slide.image}
                                alt="Hero Banner"
                                referrerPolicy="no-referrer"
                                loading="eager"
                            />
                        </a>
                    </div>
                ))}
            </div>

            <div className="kottravai-dots">
                {SLIDES.map((_, index) => (
                    <div
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroSlider;
