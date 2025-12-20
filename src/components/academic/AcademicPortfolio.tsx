'use client';

import { Mail, MapPin, Phone, Github, Linkedin, Brain, Code, Target, Award, BookOpen, Briefcase } from 'lucide-react';
import Link from 'next/link';
import AcademicNav from './AcademicNav';

export default function AcademicPortfolio() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <AcademicNav />
      
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-8 py-16">
        
        {/* Main Introduction */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Satyam Singh
          </h1>
          <p className="text-2xl text-blue-600 font-medium mb-8">
            Machine Learning Engineer & Computer Vision Researcher
          </p>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
            Passionate researcher specializing in deep learning and computer vision at IIT Mandi. 
            I focus on developing lightweight neural architectures for small object detection in 
            remote sensing imagery, with expertise in YOLO-based architectures, multi-scale feature 
            fusion, and deployment-ready AI systems.
          </p>
          
          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-8 mb-12 text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Berhampur, Odisha, India</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <Link href="mailto:satyamsinghpx@gmail.com" className="hover:text-blue-600 transition-colors">
                satyamsinghpx@gmail.com
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>+91 78910 66189</span>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="flex justify-center gap-4 mb-16">
            <Link 
              href="https://github.com/satyamsingh5512"
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </Link>
            <Link 
              href="https://www.linkedin.com/in/satyam-singh-35b365335/"
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </Link>
            <Link 
              href="mailto:satyamsinghpx@gmail.com"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>Contact Me</span>
            </Link>
          </div>
        </div>

        {/* Domain Expertise */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Domain Expertise</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Machine Learning</h3>
              <p className="text-gray-600">
                Deep expertise in neural networks, CNNs, RNNs, and modern architectures like YOLO. 
                Specialized in PyTorch, TensorFlow, and deployment optimization.
              </p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <Target className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Computer Vision</h3>
              <p className="text-gray-600">
                Focus on small object detection, multi-scale feature fusion, and context modeling 
                for remote sensing and medical imaging applications.
              </p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <Code className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Research & Development</h3>
              <p className="text-gray-600">
                Active researcher at IIT Mandi with publications in progress. Experience in 
                ablation studies, benchmarking, and deployment-ready system design.
              </p>
            </div>
          </div>
        </div>

        {/* Research Interests */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Research Interests</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Core Areas</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Neural Networks & Deep Learning Architecture Design</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Computer Vision & Image Processing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Small Object Detection in High-Resolution Imagery</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Multi-scale Feature Fusion & Context Modeling</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Applications</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Remote Sensing & Satellite Imagery Analysis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Medical Image Analysis & Healthcare AI</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Real-time Systems & Edge Deployment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Model Optimization & Inference Acceleration</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation to Sections */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Explore My Work</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link 
              href="/satyam/education"
              className="group p-6 border border-gray-200 rounded-lg hover:shadow-lg hover:border-blue-300 transition-all"
            >
              <BookOpen className="w-8 h-8 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Education</h3>
              <p className="text-gray-600 text-sm">Academic background and qualifications</p>
            </Link>
            
            <Link 
              href="/satyam/research"
              className="group p-6 border border-gray-200 rounded-lg hover:shadow-lg hover:border-purple-300 transition-all"
            >
              <Brain className="w-8 h-8 text-purple-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Research</h3>
              <p className="text-gray-600 text-sm">Current research at IIT Mandi</p>
            </Link>
            
            <Link 
              href="/satyam/projects"
              className="group p-6 border border-gray-200 rounded-lg hover:shadow-lg hover:border-green-300 transition-all"
            >
              <Code className="w-8 h-8 text-green-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Projects</h3>
              <p className="text-gray-600 text-sm">ML and AI project portfolio</p>
            </Link>
            
            <Link 
              href="/satyam/achievements"
              className="group p-6 border border-gray-200 rounded-lg hover:shadow-lg hover:border-orange-300 transition-all"
            >
              <Award className="w-8 h-8 text-orange-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Achievements</h3>
              <p className="text-gray-600 text-sm">Awards and recognitions</p>
            </Link>
          </div>
        </div>

        {/* Current Status */}
        <div className="text-center bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Status</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Research Intern</p>
                <p className="text-gray-600 text-sm">IIT Mandi - Computer Vision Lab</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-purple-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">B.Tech Student</p>
                <p className="text-gray-600 text-sm">NIST University - CGPA: 8.98/10</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}