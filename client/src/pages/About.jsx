import React from 'react'

import Header from '../components/AboutPage/Header';
import TechStack from '../components/AboutPage/TechStack';
import Features from '../components/AboutPage/Features';

import aboutimage from  '../assets/aboutimage.jpeg'
import BackgroundLayout from '../components/Layout/BackgroundLayout.jsx';
export default function About() {
  return (
    <BackgroundLayout image={aboutimage}>
      <div>
       <Header />
       <TechStack />
       <Features />
     </div>
    </BackgroundLayout>
    
  );
}