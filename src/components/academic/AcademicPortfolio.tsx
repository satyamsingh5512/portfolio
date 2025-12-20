'use client';

import { Mail, MapPin, Phone, Github, Linkedin } from 'lucide-react';
import Link from 'next/link';
import AcademicNav from './AcademicNav';

export default function AcademicPortfolio() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <AcademicNav />
      
      {/* Full Width Single Page Layout */}
      <div className="w-full px-8 py-8">
        {/* Header Section - Compact */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Satyam Singh
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                Machine Learning Engineer & Researcher
              </p>
              <p className="text-gray-500 max-w-xl">
                Computer Vision researcher at IIT Mandi, specializing in deep learning 
                for small object detection and neural architecture optimization.
              </p>
            </div>
            
            {/* Contact & Links */}
            <div className="text-right">
              <div className="flex flex-col gap-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center justify-end gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Berhampur, Odisha</span>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Mail className="w-4 h-4" />
                  <Link href="mailto:satyamsinghpx@gmail.com" className="hover:text-blue-600">
                    satyamsinghpx@gmail.com
                  </Link>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 78910 66189</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link 
                  href="https://github.com/satyamsingh5512"
                  className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
                >
                  <Github className="w-3 h-3" />
                  <span>GitHub</span>
                </Link>
                <Link 
                  href="https://www.linkedin.com/in/satyam-singh-35b365335/"
                  className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
                >
                  <Linkedin className="w-3 h-3" />
                  <span>LinkedIn</span>
                </Link>
                <Link 
                  href="mailto:satyamsinghpx@gmail.com"
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  <Mail className="w-3 h-3" />
                  <span>Contact</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid - 3 Columns */}
        <div className="grid grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="space-y-6">
            
            {/* Education */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Education
              </h2>
              <div>
                <h3 className="font-semibold text-gray-900">
                  B.Tech Computer Science
                </h3>
                <p className="text-gray-600 text-sm">NIST University, Berhampur</p>
                <p className="text-gray-500 text-xs">Aug 2023 - Present</p>
                <p className="text-blue-600 font-medium text-sm">CGPA: 8.98/10</p>
              </div>
            </section>

            {/* Technical Skills */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Technical Skills
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Machine Learning</h3>
                  <div className="flex flex-wrap gap-1">
                    {["PyTorch", "TensorFlow", "Keras", "CNNs", "RNNs", "YOLO"].map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Programming</h3>
                  <div className="flex flex-wrap gap-1">
                    {["Python", "JavaScript", "C++", "Docker", "Git", "AWS"].map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Research Interests */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Research Interests
              </h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">ML:</span> Neural Networks, Computer Vision
                </p>
                <p>
                  <span className="font-semibold">Focus:</span> Object Detection, Feature Fusion
                </p>
                <p>
                  <span className="font-semibold">Apps:</span> Remote Sensing, Medical Imaging
                </p>
              </div>
            </section>

          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            
            {/* Research Experience */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Research Experience
              </h2>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Research Intern - Computer Vision
                </h3>
                <p className="text-blue-600 font-medium mb-2 text-sm">
                  Indian Institute of Technology (IIT) Mandi
                </p>
                <ul className="space-y-1 text-gray-700 text-xs leading-relaxed">
                  <li>• Developed lightweight deep learning pipelines for small object detection</li>
                  <li>• Redesigned YOLO architectures with multi-scale feature fusion</li>
                  <li>• Optimized inference latency for deployment-ready systems</li>
                  <li>• Conducted robustness analysis under adverse conditions</li>
                </ul>
              </div>
            </section>

            {/* Awards & Achievements */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Awards & Achievements
              </h2>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold">Finalist</span> (Top 30/2400) - IIT Guwahati Tech-Expo 2025
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold">Rank 76</span> - IIT Kharagpur Hackathon 2025
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold">First Prize</span> - Research Paper Competition
                    <br />
                    <span className="text-xs text-gray-600">
                      &ldquo;Fault-Tolerant Task Scheduling for Cloud Computing&rdquo;
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold">Paper under review</span> - &ldquo;IoT for Sustainable Resource Management&rdquo;
                  </div>
                </li>
              </ul>
            </section>

          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Projects */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Projects
              </h2>
              <div className="space-y-4">
                
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Brain Tumor Classification
                    </h3>
                    <span className="text-xs text-gray-500">Feb 2025</span>
                  </div>
                  <p className="text-gray-700 mb-2 text-xs leading-relaxed">
                    Medical image analysis pipeline for automated brain tumor classification 
                    using transfer learning with VGG16 and ResNet.
                  </p>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {["PyTorch", "VGG16", "ResNet"].map((tech) => (
                      <span key={tech} className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs font-medium text-green-600">92% Validation Accuracy</p>
                </div>

                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Sign Language Recognition
                    </h3>
                    <span className="text-xs text-gray-500">Sep 2024</span>
                  </div>
                  <p className="text-gray-700 mb-2 text-xs leading-relaxed">
                    Real-time vision-based system for ASL gesture recognition 
                    optimized for live webcam input.
                  </p>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {["Computer Vision", "CNNs", "OpenCV"].map((tech) => (
                      <span key={tech} className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs font-medium text-green-600">95% Classification Accuracy</p>
                </div>

                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Fake News Detection
                    </h3>
                    <span className="text-xs text-gray-500">Jun 2024</span>
                  </div>
                  <p className="text-gray-700 mb-2 text-xs leading-relaxed">
                    NLP pipeline using LSTM models and GloVe embeddings 
                    for automated fake news detection.
                  </p>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {["LSTM", "NLP", "GloVe"].map((tech) => (
                      <span key={tech} className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs font-medium text-green-600">89% F1-Score</p>
                </div>

                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Neural Architecture Search
                    </h3>
                    <span className="text-xs text-gray-500">Ongoing</span>
                  </div>
                  <p className="text-gray-700 mb-2 text-xs leading-relaxed">
                    Automated neural architecture search for efficient model design 
                    under computational constraints.
                  </p>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {["AutoML", "Optimization", "Efficiency"].map((tech) => (
                      <span key={tech} className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs font-medium text-green-600">30% Latency Reduction</p>
                </div>

              </div>
            </section>

          </div>

        </div>
      </div>
    </div>
  );
}