import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// فرض می‌کنیم SplitText را از gsap/SplitText import می‌کنید
import { SplitText } from 'gsap/SplitText';

// ثبت پلاگین‌های مورد نیاز در بالاترین سطح
gsap.registerPlugin(ScrollTrigger, SplitText);

const Home = () => {

    useEffect(() => {
        // ۱. SplitText و Fade In عنوان
        // ابتدا باید مطمئن شویم که DOM رندر شده و سپس SplitText را ایجاد کنیم.
        let splitTitle = SplitText.create("[data-split-text]", { type: "chars" });

        // A. انیمیشن SplitText برای عنوان اصلی
        gsap.from(splitTitle.chars, {
            y: 100,
            opacity: 0,
            stagger: 0.03,
            duration: 2,
            ease: "power4.out"
        });

        // B. Fade In زیرعنوان
        gsap.to("#intro-subtitle", {
            opacity: 1,
            duration: 1.5,
            delay: 1.2,
            ease: "power1.inOut"
        });

        // C. انیمیشن پارالاکس
        gsap.utils.toArray('[data-parallax-speed]').forEach(layer => {
            const speed = parseFloat(layer.dataset.parallaxSpeed);

            gsap.to(layer, {
                y: () => window.innerHeight * speed,
                ease: "none",
                scrollTrigger: {
                    trigger: "#intro-parallax",
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                }
            });
        });

        // D. انیمیشن Scroll Reveal برای کارت‌ها
        const revealTriggers = gsap.utils.toArray('[data-scroll-reveal]').map(card => {
            let vars;
            if (card.classList.contains('translate-x-40')) {
                vars = { opacity: 1, x: 160, rotate: 12 };
            } else {
                vars = { opacity: 1, y: 80 };
            }

            const animation = gsap.from(card, {
                ...vars,
                duration: 1.5,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse",
                }
            });
            return animation.scrollTrigger; // برگرداندن ScrollTrigger برای پاکسازی
        });

        // Clean-up: پاک کردن SplitText و ScrollTriggerها
        return () => {
            splitTitle.revert();
            revealTriggers.forEach(trigger => trigger.kill());
            ScrollTrigger.getAll().forEach(trigger => trigger.kill()); // مطمئن می‌شویم که همه پاک شده‌اند
        };

    }, []);

    return (
        <main>
            {/* سکشن ۱: هدر بزرگ و پارالاکس */}
            <section className="h-[120vh] relative overflow-hidden flex flex-col justify-center items-center text-white" id="intro-parallax">

                {/* لایه‌های پارالاکس: استفاده از style={{}} و backgroundImage */}
                <div className="absolute inset-0 bg-cover bg-center bg-fixed"
                    style={{ backgroundImage: "url('https://picsum.photos/1920/1200?random=1')" }}
                    data-parallax-speed="0.2"></div>
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('https://picsum.photos/1920/1200?random=2')", opacity: 0.8 }}
                    data-parallax-speed="0.6"></div>

                {/* محتوای متنی */}
                <div className="relative z-10 text-center">
                    <h1 className="text-7xl md:text-9xl font-black text-white leading-none tracking-tighter" data-split-text>
                        AURA
                    </h1>
                    <h2 className="text-3xl font-light mt-4 text-green-400 opacity-0" id="intro-subtitle">
                        The Emerald Frontier. Uncharted Beauty.
                    </h2>
                </div>
            </section>

            {/* سکشن ۲: سکشن اسکرول Reveal */}
            <section className="min-h-screen bg-gray-500 text-white py-32">
                <div className="max-w-5xl mx-auto">

                    <div className="section-card mb-24 p-12 bg-gray-800 rounded-2xl shadow-2xl opacity-0 translate-y-20" data-scroll-reveal>
                        <h3 className="text-4xl font-bold text-blue-300">Orbital Anomaly</h3>
                        <p className="mt-4 text-xl">
                            Aura circles a binary star system, resulting in cycles of perpetual twilight and intense double sunsets.
                        </p>
                    </div>

                    <div className="section-card mb-24 p-12 bg-gray-800 rounded-2xl shadow-2xl opacity-0 translate-x-40 rotate-12" data-scroll-reveal>
                        <h3 className="text-4xl font-bold text-pink-300">Silicon Forests</h3>
                        <p className="mt-4 text-xl">
                            Lifeforms here are based on silicates, giving the flora a beautiful, crystalline and metallic texture that shifts color with the twin suns' light.
                        </p>
                    </div>

                    <div className="section-card p-12 bg-gray-800 rounded-2xl shadow-2xl opacity-0 translate-y-20" data-scroll-reveal>
                        <h3 className="text-4xl font-bold text-green-300">The Twin Suns</h3>
                        <p className="mt-4 text-xl">
                            Their gravitational pull generates massive, stable aurora displays, perpetually visible at the poles, hence the planet's name.
                        </p>
                    </div>

                </div>
            </section>
        </main>
    );
};

export default Home;
