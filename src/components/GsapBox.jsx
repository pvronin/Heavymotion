import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/all";
import { useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function GsapBox() {
    const h2Ref = useRef();
    const pRef = useRef();
    const outerscroller = useRef();
    const horizontalContainer = useRef();
    const [activeSection, setActiveSection] = useState(0);



    useGSAP(() => {
        // 1. SplitText animations for intro section
        const splitH2 = new SplitText(h2Ref.current, { type: "words, chars" });
        const splitP = new SplitText(pRef.current, { type: "words, chars" });

        // انیمیشن ورودی متن
        gsap.from(splitH2.chars, {
            skewX: 30,
            scale: 2,
            width: "90px",     // تغییر عرض
            height: "200px",    // تغییر ارتفاع
            left: "-800",
            color: "blue",


            rotationY: 360,
            y: -200,
            opacity: 0,
            stagger: 0.08,
            duration: 2.8,
            ease: "back.out(1.7)",
        });

        gsap.from(splitP.chars, {
            y: 100,
            opacity: 0,
            stagger: 0.02,
            duration: 0.6,
            ease: "power2.out",
            delay: 2.8
        });

        // 2. افکت نور متحرک در پشت متن
        gsap.to(h2Ref.current, {
            textShadow: "0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3), 0 0 30px rgba(59, 130, 246, 0.4)",
            duration: 1.9,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // 5. اسکرول افقی
        const sections = gsap.utils.toArray(horizontalContainer.current.children);
        const sectionCount = sections.length;

        const scrollTween = gsap.to(sections, {
            xPercent: -100 * (sectionCount - 1),
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: outerscroller.current,
                pin: true,
                scrub: 1.5,
                end: () => "+=" + (horizontalContainer.current.scrollWidth - window.innerWidth),
                markers: false,
                snap: 1 / (sectionCount - 1),
                onUpdate: (self) => {
                    const progress = self.progress * 100;
                    document.documentElement.style.setProperty('--scroll-progress', `${progress}%`);

                    // تشخیص سکشن فعال
                    const activeIndex = Math.floor(self.progress * (sectionCount - 1));
                    setActiveSection(activeIndex);
                }
            }
        });

        // 6. انیمیشن محتوای هر سکشن با افکت‌های پیشرفته
        sections.forEach((section, index) => {
            const text = section.querySelector('.section-content');
            const bgShape = section.querySelector('.bg-shape');
            const floatingElements = section.querySelectorAll('.floating-element');

            // انیمیشن ورودی سکشن
            gsap.from(section, {
                opacity: 0,
                scale: 0.95,
                duration: 1,
                scrollTrigger: {
                    trigger: section,
                    start: "left center",
                    containerAnimation: scrollTween,
                    toggleActions: "play none none reverse"
                }
            });

            // انیمیشن محتوا
            gsap.from(text, {
                opacity: 0,
                y: -150,
                scale: 0.8,
                rotationX: -30,
                duration: 1.2,
                ease: "elastic.out(1, 0.5)",
                scrollTrigger: {
                    trigger: section,
                    start: "center center",
                    containerAnimation: scrollTween,
                    toggleActions: "play none none reverse"
                }
            });

            // انیمیشن شکل پس‌زمینه
            if (bgShape) {
                gsap.from(bgShape, {
                    scale: 0,
                    duration: 2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "center center",
                        containerAnimation: scrollTween
                    }
                });
            }

            // انیمیشن عناصر شناور
            floatingElements.forEach((element, i) => {
                gsap.from(element, {
                    y: 100,
                    opacity: 0,
                    scale: 0,
                    duration: 1,
                    delay: i * 0.2,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: section,
                        start: "center center",
                        containerAnimation: scrollTween
                    }
                });

                // انیمیشن مداوم برای عناصر شناور
                gsap.to(element, {
                    y: 30,
                    duration: 2,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: i * 0.3
                });
            });

            // انیمیشن عدد شماره
            const number = section.querySelector('.section-number');
            gsap.from(number, {
                opacity: 0,
                y: 100,
                duration: 1,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: section,
                    start: "center center",
                    containerAnimation: scrollTween,
                    delay: 0.3
                }
            });

            // انیمیشن دکمه
            const button = section.querySelector('.section-button');
            if (button) {
                gsap.from(button, {
                    opacity: 0,
                    y: 50,
                    scale: 0.5,
                    duration: 1,
                    ease: "elastic.out(1, 0.5)",
                    scrollTrigger: {
                        trigger: section,
                        start: "center center",
                        containerAnimation: scrollTween,
                        delay: 0.6
                    }
                });

                // افکت هاور روی دکمه
                button.addEventListener('mouseenter', () => {
                    gsap.to(button, {
                        scale: 1.1,
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
                        duration: 0.3
                    });
                });

                button.addEventListener('mouseleave', () => {
                    gsap.to(button, {
                        scale: 1,
                        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                        duration: 0.3
                    });
                });
            }
        });



        // 8. افکت اسکرول پیشرفت
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            gsap.to(progressBar, {
                width: "100%",
                ease: "none",
                scrollTrigger: {
                    trigger: outerscroller.current,
                    start: "top top",
                    end: () => "+=" + (horizontalContainer.current.scrollWidth),
                    scrub: true
                }
            });
        }

        // 9. انیمیشن برای کارت‌های آمار
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, i) => {
            gsap.from(card, {
                opacity: 0,
                y: 50,
                duration: 0.8,
                delay: i * 0.2,
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            });

            // انیمیشن شمارنده اعداد
            const number = card.querySelector('.stat-number');
            if (number) {
                const target = parseInt(number.textContent);
                gsap.fromTo(number,
                    { innerHTML: 0 },
                    {
                        innerHTML: target,
                        duration: 2,
                        delay: 0.5,
                        snap: { innerHTML: 1 },
                        scrollTrigger: {
                            trigger: card,
                            start: "top 80%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            }
        });


        return () => {
            splitH2.revert();
            splitP.revert();
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div className="bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white overflow-hidden relative">

            {/* سکشن اول - معرفی */}
            <section className="min-h-screen w-full flex flex-col justify-center items-center p-8 relative overflow-hidden">


                <div className="relative z-10 text-center">
                    <div className="inline-block mb-8">
                        <span className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full text-blue-300 text-sm font-semibold border border-blue-500/30">
                            NEXT GENERATION ANIMATION
                        </span>
                    </div>

                    <h2 ref={h2Ref} className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-tight">
                        Heavy Motion <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 animate-gradient bg-300%">Design</span>
                    </h2>

                    <p ref={pRef} className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-300 leading-relaxed mb-12">
                        Bold, fluid motion and intricate animations possess a mesmerizing beauty that transcends traditional design boundaries.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center mb-16">
                        <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                            🚀 Get Started Now
                        </button>
                        <button className="px-8 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-700/50 transition-all duration-300">
                            📖 View Examples
                        </button>
                    </div>

                    <div className="mt-12">
                        <div className="flex justify-center space-x-4 mb-4">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse floating-element"
                                    style={{ animationDelay: `${i * 0.2}s` }}
                                />
                            ))}
                        </div>
                        <p className="text-gray-400 animate-bounce">👇 Scroll down to explore</p>
                    </div>
                </div>

                {/* نشانگر اسکرول */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
                    <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-gradient-to-b from-blue-400 to-transparent rounded-full mt-2 animate-scroll"></div>
                    </div>
                </div>
            </section>

            {/* ناوبری سکشن‌ها */}
            <div className="fixed top-1/2 right-8 transform -translate-y-1/2 z-40 hidden md:block">
                <div className="flex flex-col gap-4">
                    {["Motion", "Fluid", "Dynamic"].map((label, index) => (
                        <button
                            key={index}
                            className={`section-nav-item w-3 h-3 rounded-full transition-all duration-300 ${activeSection === index
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 w-12'
                                : 'bg-gray-600 hover:bg-gray-500'
                                }`}
                            title={`Go to ${label}`}
                        >
                            <span className="sr-only">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* بار پیشرفت اسکرول */}
            <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-800/50 backdrop-blur-sm">
                <div className="scroll-progress h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-600 w-0"></div>
            </div>

            {/* بخش اسکرول افقی */}
            <div ref={outerscroller} className="relative overflow-hidden">
                <div
                    ref={horizontalContainer}
                    className="flex w-[300%] overflow-x-hidden"
                >
                    {/* سکشن ۱ */}
                    <section className="min-h-screen w-[100%] flex justify-center items-center relative bg-gradient-to-br from-gray-800/50 via-gray-900 to-gray-800/50 overflow-hidden">
                        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                        <div className="bg-shape absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl"></div>

                        {/* عناصر شناور اضافی */}
                        <div className="floating-element absolute top-32 left-32 w-8 h-8 bg-blue-500/10 rounded-full blur-sm"></div>
                        <div className="floating-element absolute bottom-32 right-32 w-12 h-12 bg-cyan-500/10 rounded-full blur-sm"></div>

                        <div className="section-content text-center relative z-10 p-8 max-w-6xl">
                            <div className="section-number text-9xl font-bold text-gray-700/30 absolute top-8 left-8">01</div>
                            <div className="mb-8">
                                <span className="px-6 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full text-blue-300 text-sm font-semibold border border-blue-500/30 inline-block">
                                    FEATURE HIGHLIGHT
                                </span>
                            </div>
                            <h2 className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter leading-tight">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Motion</span> Graphics
                            </h2>
                            <p className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-300 mb-10 leading-relaxed">
                                Create stunning visual experiences with our advanced motion graphics toolkit. Transform static designs into living art.
                            </p>
                            <div className="flex flex-wrap justify-center gap-6 mb-12">
                                <div className="px-6 py-3 bg-gray-800/50 rounded-lg border border-gray-700">
                                    <span className="text-blue-400 mr-2">⚡</span> Real-time rendering
                                </div>
                                <div className="px-6 py-3 bg-gray-800/50 rounded-lg border border-gray-700">
                                    <span className="text-cyan-400 mr-2">🎨</span> Customizable effects
                                </div>
                                <div className="px-6 py-3 bg-gray-800/50 rounded-lg border border-gray-700">
                                    <span className="text-purple-400 mr-2">🚀</span> 60 FPS performance
                                </div>
                            </div>
                            <button className="section-button px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 group">
                                <span className="flex items-center gap-3">
                                    Explore Features
                                    <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                                </span>
                            </button>
                        </div>
                    </section>

                    {/* سکشن ۲ */}
                    <section className="min-h-screen w-[100%] flex justify-center items-center relative bg-gradient-to-br from-gray-900/50 via-purple-900/20 to-gray-900/50 overflow-hidden">
                        <div className="absolute inset-0 bg-dot-pattern opacity-10"></div>
                        <div className="bg-shape absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"></div>

                        {/* عناصر شناور اضافی */}
                        <div className="floating-element absolute top-40 right-40 w-10 h-10 bg-purple-500/10 rounded-full blur-sm"></div>
                        <div className="floating-element absolute bottom-40 left-40 w-16 h-16 bg-pink-500/10 rounded-full blur-sm"></div>

                        <div className="section-content text-center relative z-10 p-8 max-w-6xl">
                            <div className="section-number text-9xl font-bold text-gray-700/30 absolute top-8 right-8">02</div>
                            <div className="mb-8">
                                <span className="px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-purple-300 text-sm font-semibold border border-purple-500/30 inline-block">
                                    ADVANCED TECHNOLOGY
                                </span>
                            </div>
                            <h2 className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter leading-tight">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Fluid</span> Animation
                            </h2>
                            <p className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-300 mb-10 leading-relaxed">
                                Seamless transitions and smooth animations that captivate your audience. Powered by physics-based motion algorithms.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
                                <div className="p-6 bg-gray-800/30 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                                    <div className="text-3xl mb-2">🎯</div>
                                    <h4 className="font-semibold mb-2">Precision Control</h4>
                                    <p className="text-gray-400 text-sm">Pixel-perfect animation timing</p>
                                </div>
                                <div className="p-6 bg-gray-800/30 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                                    <div className="text-3xl mb-2">🌀</div>
                                    <h4 className="font-semibold mb-2">Smart Interpolation</h4>
                                    <p className="text-gray-400 text-sm">AI-powered motion smoothing</p>
                                </div>
                                <div className="p-6 bg-gray-800/30 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                                    <div className="text-3xl mb-2">⚙️</div>
                                    <h4 className="font-semibold mb-2">Real-time Editing</h4>
                                    <p className="text-gray-400 text-sm">See changes as you make them</p>
                                </div>
                            </div>
                            <button className="section-button px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 group">
                                <span className="flex items-center gap-3">
                                    View Examples
                                    <span className="group-hover:rotate-90 transition-transform duration-300">↗</span>
                                </span>
                            </button>
                        </div>
                    </section>

                    {/* سکشن ۳ */}
                    <section className="min-h-screen w-[100%] flex justify-center items-center relative bg-gradient-to-br from-black via-blue-900/10 to-black overflow-hidden">
                        <div className="absolute inset-0 bg-wave-pattern opacity-5"></div>
                        <div className="bg-shape absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-emerald-500/10 rounded-full blur-xl"></div>

                        {/* عناصر شناور اضافی */}
                        <div className="floating-element absolute top-20 right-20 w-14 h-14 bg-blue-500/10 rounded-full blur-sm"></div>
                        <div className="floating-element absolute bottom-20 left-20 w-20 h-20 bg-emerald-500/10 rounded-full blur-sm"></div>

                        <div className="section-content text-center relative z-10 p-8 max-w-6xl">
                            <div className="section-number text-9xl font-bold text-gray-700/30 absolute bottom-8 left-8">03</div>
                            <div className="mb-8">
                                <span className="px-6 py-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full text-emerald-300 text-sm font-semibold border border-emerald-500/30 inline-block">
                                    INTERACTIVE EXPERIENCE
                                </span>
                            </div>
                            <h2 className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter leading-tight">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Dynamic</span> Effects
                            </h2>
                            <p className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-300 mb-10 leading-relaxed">
                                Interactive and dynamic effects that respond to user engagement. Create memorable experiences that stand out.
                            </p>
                            <div className="flex gap-4 items-center justify-center">
                                <div className="relative inline-block">
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full blur-xl opacity-30"></div>
                                    <div className="relative px-8 py-4 bg-gray-900/80 backdrop-blur-sm rounded-full border border-gray-700">
                                        <span className="text-lg">🎮 Mouse Interactions</span>
                                        <span className="mx-4">•</span>
                                        <span className="text-lg">📱 Touch Gestures</span>
                                        <span className="mx-4">•</span>
                                        <span className="text-lg">🎯 Scroll Effects</span>
                                    </div>
                                </div>
                                <button className="section-button px-10 py-5 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300 group">
                                    <span className="flex items-center gap-3">
                                        Get Started
                                        <span className="group-hover:scale-125 transition-transform duration-300">✨</span>
                                    </span>
                                </button>
                            </div>

                        </div>
                    </section>
                </div>
            </div>

            {/* سکشن پایانی */}
            <section className="min-h-screen w-full flex flex-col justify-center items-center p-8 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient opacity-5"></div>
                </div>

                <div className="relative z-10 text-center max-w-6xl">
                    <div className="mb-12">
                        <span className="px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full text-blue-300 text-sm font-semibold border border-blue-500/30">
                            READY TO TRANSFORM YOUR PROJECTS
                        </span>
                    </div>

                    <h2 className="text-5xl md:text-7xl font-bold mb-10 leading-tight">
                        Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 animate-gradient bg-300%">Elevate</span> Your Design?
                    </h2>

                    <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
                        Join thousands of designers creating breathtaking motion experiences with our powerful animation framework.
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 justify-center mb-16">
                        <button className="px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group">
                            <span className="flex items-center gap-3">
                                🚀 Start Free Trial
                                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                            </span>
                        </button>
                        <button className="px-12 py-6 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-700/50 transition-all duration-300 group">
                            <span className="flex items-center gap-3">
                                📖 View Documentation
                                <span className="group-hover:rotate-12 transition-transform duration-300">📚</span>
                            </span>
                        </button>
                    </div>

                    <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        {[
                            { value: "60K+", label: "Projects", color: "from-blue-400 to-cyan-400" },
                            { value: "24/7", label: "Support", color: "from-purple-400 to-pink-400" },
                            { value: "99.9%", label: "Uptime", color: "from-emerald-400 to-green-400" },
                            { value: "4.9★", label: "Rating", color: "from-pink-400 to-rose-400" }
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className="stat-card p-8 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
                            >
                                <div className={`stat-number text-5xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                                    {stat.value}
                                </div>
                                <div className="text-gray-400 text-lg">{stat.label}</div>
                                <div className="mt-4 h-1 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                        style={{ width: `${85 + index * 5}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* بخش ارتباطات */}
                    <div className="mt-24 pt-12 border-t border-gray-800/50">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="text-left">
                                <h4 className="text-2xl font-bold mb-4">Stay Updated</h4>
                                <p className="text-gray-400">Get the latest animation tips and updates</p>
                            </div>
                            <div className="flex gap-4">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="px-6 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl w-64 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />
                                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300">
                                    Subscribe
                                </button>
                            </div>
                        </div>

                        <div className="mt-12 flex justify-center gap-6">
                            {["Twitter", "GitHub", "Discord", "LinkedIn"].map((social) => (
                                <button
                                    key={social}
                                    className="px-6 py-3 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300"
                                >
                                    {social}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* فوتر */}
                <footer className="mt-24 pt-8 border-t border-gray-800/30 w-full text-center text-gray-500 text-sm">
                    <p>© 2025 ALI WARSHADE. All rights reserved.</p>
                    <p className="mt-2">Crafted with ❤️ for the animation community</p>
                </footer>
            </section>

        </div>
    );
}
