'use client';

import { Mail, MapPin, Phone, Github, Linkedin } from 'lucide-react';
import Link from 'next/link';
import AcademicNav from './AcademicNav';

export default function AcademicPortfolio() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <AcademicNav />
      
      {/* Simple Hero */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Satyam Singh
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Machine Learning Engineer & Researcher
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Computer Vision researcher at IIT Mandi, specializing in deep learning 
            for small object detection and neural architecture optimization.
          </p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-wrap justify-center gap-6 mb-16 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Berhampur, Odisha</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <Link href="mailto:satyamsinghpx@gmail.com" className="hover:text-blue-600">
              satyamsinghpx@gmail.com
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>+91 78910 66189</span>
          </div>
        </div>

        {/* Links */}
        <div className="flex justify-center gap-4 mb-16">
          <Link 
            href="https://github.com/satyamsingh5512"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </Link>
          <Link 
            href="https://www.linkedin.com/in/satyam-singh-35b365335/"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
          </Link>
          <Link 
            href="mailto:satyamsinghpx@gmail.com"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Contact</span>
          </Link>
        </div>

        {/* Education */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
            Education
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                B.Tech in Computer Science and Engineering
              </h3>
              <p className="text-gray-600">NIST University, Berhampur, Odisha</p>
              <p className="text-gray-500 text-sm">Aug 2023 - Present • CGPA: 8.98/10</p>
            </div>
          </div>
        </section>

        {/* Research Experience */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
            Research Experience
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Research Intern - Computer Vision & Remote Sensing
              </h3>
              <p className="text-blue-600 font-medium mb-3">
                Indian Institute of Technology (IIT) Mandi
              </p>
              <ul className="space-y-2 text-gray-700 text-sm leading-relaxed">
                <li>• Developed lightweight deep learning pipelines for small object detection in remote sensing imagery</li>
                <li>• Redesigned YOLO architectures with multi-scale feature fusion and global context modeling</li>
                <li>• Optimized inference latency and memory footprint for deployment-ready systems</li>
                <li>• Conducted systematic robustness analysis under adverse imaging conditions</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
            Technical Skills
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Machine Learning</h3>
              <div className="flex flex-wrap gap-2">
                {["PyTorch", "TensorFlow", "Keras", "Scikit-learn", "CNNs", "RNNs", "YOLO"].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Programming & Tools</h3>
              <div className="flex flex-wrap gap-2">
                {["Python", "JavaScript", "C++", "Docker", "Git", "AWS", "CUDA"].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
            Projects
          </h2>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Brain Tumor Classification Using CNNs
                </h3>
                <span className="text-sm text-gray-500">Feb 2025</span>
              </div>
              <p className="text-gray-700 mb-3">
                Medical image analysis pipeline for automated brain tumor classification from MRI scans 
                using transfer learning with VGG16 and ResNet architectures.
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                {["PyTorch", "VGG16", "ResNet", "Medical Imaging"].map((tech) => (
                  <span key={tech} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {tech}
                  </span>
                ))}
              </div>
              <p className="text-sm font-medium text-green-600">92% Validation Accuracy</p>
            </div>

            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Sign Language Recognition System
                </h3>
                <span className="text-sm text-gray-500">Sep 2024</span>
              </div>
              <p className="text-gray-700 mb-3">
                Real-time vision-based system for American Sign Language gesture recognition 
                optimized for live webcam input with environmental robustness.
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                {["Computer Vision", "CNNs", "OpenCV", "Real-time"].map((tech) => (
                  <span key={tech} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {tech}
                  </span>
                ))}
              </div>
              <p className="text-sm font-medium text-green-600">95% Classification Accuracy</p>
            </div>

            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Fake News Detection with LSTM
                </h3>
                <span className="text-sm text-gray-500">Jun 2024</span>
              </div>
              <p className="text-gray-700 mb-3">
                NLP pipeline using LSTM models and GloVe embeddings for automated fake news 
                detection across heterogeneous news sources.
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                {["LSTM", "NLP", "GloVe", "Text Processing"].map((tech) => (
                  <span key={tech} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {tech}
                  </span>
                ))}
              </div>
              <p className="text-sm font-medium text-green-600">89% F1-Score</p>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
            Awards & Achievements
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <span className="font-semibold">Finalist</span> (Top 30 out of 2400 teams) - IIT Guwahati Techniche Tech-Expo 2025
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <span className="font-semibold">Rank 76</span> - IIT Kharagpur Data Science Hackathon (Kshitij) 2025
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <span className="font-semibold">First Prize</span> - College Research Paper Competition
                <br />
                <span className="text-sm text-gray-600 ml-4">
                  Paper: &ldquo;Fault-Tolerant Task Scheduling for Cloud Computing&rdquo;
                </span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <span className="font-semibold">Research Paper under review</span> - &ldquo;IoT for Sustainable Resource Management&rdquo;
              </div>
            </li>
          </ul>
        </section>

        {/* Research Interests */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
            Research Interests
          </h2>
          <div className="space-y-3">
            <p>
              <span className="font-semibold">Machine Learning:</span> Neural Networks, Representation Learning, Computer Vision
            </p>
            <p>
              <span className="font-semibold">Focus Areas:</span> Small Object Detection, Multi-scale Feature Fusion, Model Optimization
            </p>
            <p>
              <span className="font-semibold">Applications:</span> Remote Sensing, Medical Imaging, Real-time Systems
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}