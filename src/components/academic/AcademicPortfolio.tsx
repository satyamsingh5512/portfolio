'use client';

import { useState, useEffect } from 'react';
import { Mail, MapPin, Phone, Github, Linkedin, Globe, Brain, Cpu, Database, Code, Zap, Target } from 'lucide-react';
import Link from 'next/link';
import AcademicNav from './AcademicNav';

// Neural Network Animation Component
const NeuralNetworkBackground = () => {
  const [nodes, setNodes] = useState<Array<{id: number, x: number, y: number, layer: number}>>([]);
  const [connections, setConnections] = useState<Array<{from: number, to: number, active: boolean}>>([]);

  useEffect(() => {
    // Generate neural network nodes
    const newNodes: Array<{id: number, x: number, y: number, layer: number}> = [];
    const layers = [4, 6, 8, 6, 3]; // Network architecture
    let nodeId = 0;
    
    layers.forEach((layerSize, layerIndex) => {
      for (let i = 0; i < layerSize; i++) {
        newNodes.push({
          id: nodeId++,
          x: (layerIndex * 200) + 100,
          y: (i * 80) + 100 + (layerIndex % 2) * 40,
          layer: layerIndex
        });
      }
    });
    
    // Generate connections
    const newConnections: Array<{from: number, to: number, active: boolean}> = [];
    for (let layer = 0; layer < layers.length - 1; layer++) {
      const currentLayerNodes = newNodes.filter(n => n.layer === layer);
      const nextLayerNodes = newNodes.filter(n => n.layer === layer + 1);
      
      currentLayerNodes.forEach(fromNode => {
        nextLayerNodes.forEach(toNode => {
          newConnections.push({
            from: fromNode.id,
            to: toNode.id,
            active: Math.random() > 0.7
          });
        });
      });
    }
    
    setNodes(newNodes);
    setConnections(newConnections);
    
    // Animate connections
    const interval = setInterval(() => {
      setConnections(prev => prev.map(conn => ({
        ...conn,
        active: Math.random() > 0.6
      })));
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
      <svg className="w-full h-full">
        {/* Connections */}
        {connections.map((conn, index) => {
          const fromNode = nodes.find(n => n.id === conn.from);
          const toNode = nodes.find(n => n.id === conn.to);
          if (!fromNode || !toNode) return null;
          
          return (
            <line
              key={index}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={conn.active ? "#3b82f6" : "#e5e7eb"}
              strokeWidth={conn.active ? "2" : "1"}
              className="transition-all duration-1000"
            />
          );
        })}
        
        {/* Nodes */}
        {nodes.map(node => (
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r="6"
            fill="#3b82f6"
            className="animate-pulse"
            style={{
              animationDelay: `${node.id * 0.1}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </svg>
    </div>
  );
};

// Skill Card Component
const SkillCard = ({ icon: Icon, title, skills, color }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  skills: string[];
  color: string;
}) => (
  <div className="group relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${color} mb-4`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <span
          key={index}
          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
);

// Project Card Component
const ProjectCard = ({ title, description, tech, metrics, date }: {
  title: string;
  description: string;
  tech: string[];
  metrics: string;
  date: string;
}) => (
  <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h3>
      <span className="text-sm text-gray-500 font-medium">{date}</span>
    </div>
    <p className="text-gray-700 mb-4 leading-relaxed">{description}</p>
    <div className="flex flex-wrap gap-2 mb-4">
      {tech.map((t, index) => (
        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
          {t}
        </span>
      ))}
    </div>
    <div className="text-sm font-semibold text-green-600">{metrics}</div>
  </div>
);

export default function AcademicPortfolio() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900 relative">
      <NeuralNetworkBackground />
      <AcademicNav />
      
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Satyam Singh
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 mb-4 font-light">
              Machine Learning Engineer & Researcher
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
              Crafting intelligent systems that bridge the gap between cutting-edge research and real-world applications. 
              Specialized in Computer Vision, Deep Learning, and Neural Architecture Design.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link 
              href="mailto:satyamsinghpx@gmail.com"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Mail className="w-4 h-4" />
              Get In Touch
            </Link>
            <Link 
              href="https://github.com/satyamsingh5512"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              <Github className="w-4 h-4" />
              View Code
            </Link>
            <Link 
              href="https://www.linkedin.com/in/satyam-singh-35b365335/"
              className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <Linkedin className="w-4 h-4" />
              Connect
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">8.98</div>
              <div className="text-sm text-gray-500">CGPA</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">15+</div>
              <div className="text-sm text-gray-500">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">95%</div>
              <div className="text-sm text-gray-500">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">3</div>
              <div className="text-sm text-gray-500">Publications</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About Me</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate about pushing the boundaries of artificial intelligence through innovative research and practical applications.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Research Focus</h3>
                  <p className="text-gray-600">
                    Specializing in Computer Vision and Remote Sensing at IIT Mandi, developing lightweight deep learning 
                    pipelines for small object detection in high-resolution imagery.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Mission</h3>
                  <p className="text-gray-600">
                    Creating robust, deployment-ready AI systems that solve real-world problems while maintaining 
                    high performance under computational constraints.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
                  <p className="text-gray-600">
                    Pioneering novel approaches in neural architecture design, multi-scale feature fusion, 
                    and context modeling for enhanced model performance.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Current Position</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-lg text-blue-600">Research Intern</h4>
                  <p className="text-gray-700 font-medium">Indian Institute of Technology (IIT) Mandi</p>
                  <p className="text-gray-600 text-sm">Computer Vision & Remote Sensing Lab</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-purple-600">Student</h4>
                  <p className="text-gray-700 font-medium">NIST University, Berhampur</p>
                  <p className="text-gray-600 text-sm">B.Tech Computer Science & Engineering</p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>Berhampur, Odisha, India</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>+91 78910 66189</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6 bg-white/50 backdrop-blur-sm relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Technical Expertise</h2>
            <p className="text-xl text-gray-600">
              Comprehensive skill set spanning the entire ML development lifecycle
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkillCard
              icon={Brain}
              title="Machine Learning"
              skills={["PyTorch", "TensorFlow", "Keras", "Scikit-learn", "CNNs", "RNNs", "LSTMs"]}
              color="bg-blue-600"
            />
            <SkillCard
              icon={Cpu}
              title="Computer Vision"
              skills={["Object Detection", "Image Classification", "Feature Pyramids", "YOLO", "OpenCV"]}
              color="bg-purple-600"
            />
            <SkillCard
              icon={Code}
              title="Programming"
              skills={["Python", "JavaScript", "C++", "CUDA", "Docker", "Git"]}
              color="bg-green-600"
            />
            <SkillCard
              icon={Database}
              title="Data & Analytics"
              skills={["NumPy", "Pandas", "Matplotlib", "Seaborn", "Jupyter", "MLflow"]}
              color="bg-orange-600"
            />
            <SkillCard
              icon={Globe}
              title="Deployment"
              skills={["AWS", "Docker", "FastAPI", "REST APIs", "Model Optimization"]}
              color="bg-red-600"
            />
            <SkillCard
              icon={Target}
              title="Research"
              skills={["Ablation Studies", "Paper Writing", "Benchmarking", "Statistical Analysis"]}
              color="bg-indigo-600"
            />
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section id="research" className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Research Experience</h2>
            <p className="text-xl text-gray-600">
              Advancing the state-of-the-art in computer vision and deep learning
            </p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3">
                <div className="sticky top-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Computer Vision Research
                  </h3>
                  <p className="text-lg text-blue-600 font-medium mb-4">
                    IIT Mandi • Remote Sensing Lab
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Active Research</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">YOLO Architecture</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Small Object Detection</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-2/3 space-y-6">
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-bold text-blue-900 mb-2">Focus Area</h4>
                    <p className="text-blue-800 text-sm">Small object detection in high-resolution remote sensing imagery (&lt;32x32 pixels)</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-bold text-purple-900 mb-2">Innovation</h4>
                    <p className="text-purple-800 text-sm">Multi-scale feature fusion with global context modeling</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-gray-900">Key Contributions</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Redesigned YOLO architectures with customized feature enhancement and multi-scale fusion</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Developed channel-aware reweighting mechanisms for semantic consistency</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Optimized inference latency and memory footprint for deployment-ready systems</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Conducted systematic robustness analysis under adverse imaging conditions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 bg-white/50 backdrop-blur-sm relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Projects</h2>
            <p className="text-xl text-gray-600">
              Practical applications of machine learning solving real-world challenges
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <ProjectCard
              title="Brain Tumor Classification"
              description="Medical image analysis pipeline for automated brain tumor classification from MRI scans using transfer learning and data augmentation techniques."
              tech={["PyTorch", "VGG16", "ResNet", "Medical Imaging", "Transfer Learning"]}
              metrics="92% Validation Accuracy"
              date="Feb 2025"
            />
            <ProjectCard
              title="Sign Language Recognition"
              description="Real-time vision-based system for American Sign Language gesture recognition optimized for live webcam input with environmental robustness."
              tech={["Computer Vision", "CNNs", "Real-time Processing", "OpenCV"]}
              metrics="95% Classification Accuracy"
              date="Sep 2024"
            />
            <ProjectCard
              title="Fake News Detection"
              description="NLP pipeline using LSTM models and GloVe embeddings for automated fake news detection across heterogeneous news sources."
              tech={["LSTM", "NLP", "GloVe", "Text Processing", "Sequence Modeling"]}
              metrics="89% F1-Score"
              date="Jun 2024"
            />
            <ProjectCard
              title="Neural Architecture Search"
              description="Automated neural architecture search for efficient model design under computational constraints with performance optimization."
              tech={["AutoML", "Neural Architecture Search", "Model Optimization", "Efficiency"]}
              metrics="30% Latency Reduction"
              date="Ongoing"
            />
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Recognition & Achievements</h2>
            <p className="text-xl text-gray-600">
              Acknowledgments for contributions to research and innovation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-900">Competition Finalist</h3>
                  <p className="text-blue-700">IIT Guwahati Techniche Tech-Expo 2025</p>
                </div>
              </div>
              <p className="text-blue-800 font-medium">Top 30 out of 2400 teams</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-purple-900">Data Science Hackathon</h3>
                  <p className="text-purple-700">IIT Kharagpur Kshitij 2025</p>
                </div>
              </div>
              <p className="text-purple-800 font-medium">Rank 76 among top performers</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-900">Research Excellence</h3>
                  <p className="text-green-700">College Research Competition</p>
                </div>
              </div>
              <p className="text-green-800 font-medium">First Prize - &ldquo;Fault-Tolerant Task Scheduling&rdquo;</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-orange-900">Publication</h3>
                  <p className="text-orange-700">Under Review</p>
                </div>
              </div>
              <p className="text-orange-800 font-medium">&ldquo;IoT for Sustainable Resource Management&rdquo;</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Let&apos;s Collaborate</h2>
          <p className="text-xl mb-8 opacity-90">
            Interested in research collaboration, project discussions, or just want to connect? 
            I&apos;m always open to exploring new opportunities in ML and AI.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="mailto:satyamsinghpx@gmail.com"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              <Mail className="w-4 h-4" />
              satyamsinghpx@gmail.com
            </Link>
            <Link 
              href="https://github.com/satyamsingh5512"
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors font-medium"
            >
              <Github className="w-4 h-4" />
              GitHub
            </Link>
            <Link 
              href="https://www.linkedin.com/in/satyam-singh-35b365335/"
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors font-medium"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}