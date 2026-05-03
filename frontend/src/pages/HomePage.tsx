import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Calendar, BookOpen, Users, MapPin, MessageSquare, ArrowRight } from 'lucide-react';

export const HomePage = () => {
  const { t } = useTranslation();

  const features = [
    { icon: <Calendar className="w-6 h-6 text-primary" />, title: t('nav_timeline'), desc: "Track election phases, registration dates, and result days.", link: "/timeline" },
    { icon: <BookOpen className="w-6 h-6 text-primary" />, title: t('nav_flashcards'), desc: "Learn democratic concepts with gamified bilingual flashcards.", link: "/learn" },
    { icon: <Users className="w-6 h-6 text-primary" />, title: t('nav_candidates'), desc: "Explore candidate profiles, assets, and backgrounds.", link: "/candidates" },
    { icon: <MapPin className="w-6 h-6 text-primary" />, title: t('nav_booth'), desc: "Find your polling station using your EPIC number.", link: "/booth" },
    { icon: <MessageSquare className="w-6 h-6 text-primary" />, title: t('nav_chatbot'), desc: "Ask our AI assistant any questions about voting in India.", link: "/chatbot" }
  ];

  return (
    <div className="py-12 space-y-20">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-accent mb-6 leading-tight">
          Your Voice. Your Vote. <br/> <span className="text-primary">Your Democracy.</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          {t('welcome_msg')} Discover everything you need to know about Indian elections in one place.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link to="/timeline" className="px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto">
            Get Started
          </Link>
          <Link to="/learn" className="px-8 py-4 bg-secondary text-white font-bold rounded-full hover:bg-secondary/90 transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto">
            Learn Basics
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-center text-accent mb-12">Empowering Indian Voters</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <Link key={idx} to={feature.link} className="block group">
              <div className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col group-hover:-translate-y-1">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground mb-6 flex-1">{feature.desc}</p>
                <div className="flex items-center text-primary font-medium text-sm group-hover:underline mt-auto">
                  Explore <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
