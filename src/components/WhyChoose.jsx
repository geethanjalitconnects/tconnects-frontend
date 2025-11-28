    import React, { useEffect, useState, useRef } from 'react';
    import './WhyChoose.css';

    const WhyChoose = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
            if (entry.isIntersecting) {
                setIsVisible(true);
            }
            });
        },
        { threshold: 0.3 }
        );

        if (sectionRef.current) {
        observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const features = [
        {
        icon: "💼",
        title: "Specialized Jobs",
        description: "Access exclusive risk management positions from top financial institutions worldwide."
        },
        {
        icon: "🎓",
        title: "Expert Courses",
        description: "Learn from industry experts with comprehensive courses in risk assessment and management."
        },
        {
        icon: "🎯",
        title: "Quality Internships",
        description: "Gain practical experience with internships at leading risk management firms."
        },
        {
        icon: "💻",
        title: "Freelancer Opportunities",
        description: "Connect with clients worldwide and work on flexible freelance projects in your expertise area."
        },
        {
        icon: "📄",
        title: "AI Resume Building",
        description: "Create professional resumes with AI-powered optimization tailored for your target roles."
        },
        {
        icon: "🎤",
        title: "Mock Interview Practice",
        description: "Schedule practice interviews with industry professionals to boost your confidence and skills."
        }
    ];

    return (
        <section className="why-choose-section" ref={sectionRef}>
        <div className="why-choose-container">
            <div className={`section-header ${isVisible ? 'animate-in' : ''}`}>
            <h2 className="section-title">
                Why Choose <span className="title-highlight">TConnects</span>?
            </h2>
            <p className="section-description">
                Discover what makes us India's most trusted risk management career platform
            </p>
            </div>

            <div className={`features-grid ${isVisible ? 'animate-in' : ''}`}>
            {features.map((feature, index) => (
                <div 
                key={index} 
                className={`feature-card ${isVisible ? 'card-animate' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                >
                <div className="feature-icon-container">
                    <span className="feature-icon">{feature.icon}</span>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                </div>
            ))}
            </div>
        </div>

        {/* Background Elements */}
        <div className={`bg-element bg-element-1 ${isVisible ? 'bg-animate' : ''}`}></div>
        <div className={`bg-element bg-element-2 ${isVisible ? 'bg-animate' : ''}`}></div>
        </section>
    );
    };

    export default WhyChoose;
