import { Metadata } from 'next';
import AcademicNav from '@/components/academic/AcademicNav';
import { Code, Calendar, Github } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Projects - Satyam Singh',
  description: 'Machine Learning and AI project portfolio showcasing practical applications',
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <AcademicNav />
      
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <Code className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Projects</h1>
          <p className="text-xl text-gray-600">Machine Learning & AI Project Portfolio</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Brain Tumor Classification */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Brain Tumor Classification Using CNNs
              </h2>
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Feb 2025</span>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Developed a comprehensive medical image analysis pipeline for automated brain tumor 
              classification from MRI scans. The system addresses critical challenges in medical 
              imaging including limited labeled data, inter-patient variability, and subtle 
              intra-class visual differences.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Key Features</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Transfer learning with pretrained VGG16 and ResNet architectures</li>
                  <li>• Selective layer freezing and fine-tuning strategies</li>
                  <li>• Advanced data augmentation and normalization techniques</li>
                  <li>• Comprehensive evaluation with class-wise analysis</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Technical Implementation</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• PyTorch framework for model development</li>
                  <li>• Custom data loaders for medical imaging datasets</li>
                  <li>• Regularization techniques for small-sample training</li>
                  <li>• Failure-mode analysis for clinical validation</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {["PyTorch", "VGG16", "ResNet", "Medical Imaging", "Transfer Learning", "Data Augmentation"].map((tech) => (
                <span key={tech} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-green-600 font-semibold">
                🎯 92% Validation Accuracy
              </div>
              <div className="flex gap-2">
                <Link href="#" className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  <Github className="w-3 h-3" />
                  <span>Code</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Sign Language Recognition */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Sign Language Recognition System
              </h2>
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Sep 2024</span>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Built a real-time vision-based system for American Sign Language gesture recognition 
              with emphasis on live webcam input and robustness to environmental variability. 
              The system balances accuracy with inference latency for practical deployment.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Key Features</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Real-time gesture recognition from webcam feed</li>
                  <li>• Optimized CNN architectures for low-latency inference</li>
                  <li>• Robust preprocessing for varying lighting conditions</li>
                  <li>• Multi-user evaluation across different environments</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Technical Implementation</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• OpenCV for real-time video processing</li>
                  <li>• Custom dataset curation and preprocessing</li>
                  <li>• Background clutter and illumination handling</li>
                  <li>• Performance optimization for edge deployment</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {["Computer Vision", "CNNs", "OpenCV", "Real-time Processing", "Python", "Deep Learning"].map((tech) => (
                <span key={tech} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-green-600 font-semibold">
                🎯 95% Classification Accuracy
              </div>
              <div className="flex gap-2">
                <Link href="#" className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  <Github className="w-3 h-3" />
                  <span>Code</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Fake News Detection */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Fake News Detection with LSTM
              </h2>
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Jun 2024</span>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Designed a comprehensive NLP pipeline using LSTM models and GloVe embeddings 
              for automated fake news detection. The system addresses semantic ambiguity, 
              noisy labels, and domain shift across heterogeneous news sources.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Key Features</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• LSTM-based sequence modeling for contextual understanding</li>
                  <li>• Pretrained GloVe word embeddings for semantic representation</li>
                  <li>• Extensive text preprocessing and normalization</li>
                  <li>• Qualitative error analysis for model interpretability</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Technical Implementation</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Advanced tokenization and padding strategies</li>
                  <li>• Class balancing for stable training dynamics</li>
                  <li>• Cross-domain evaluation for generalization</li>
                  <li>• Linguistic pattern analysis for misclassification</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {["LSTM", "NLP", "GloVe", "Text Processing", "Sequence Modeling", "Python"].map((tech) => (
                <span key={tech} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-green-600 font-semibold">
                🎯 89% F1-Score
              </div>
              <div className="flex gap-2">
                <Link href="#" className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  <Github className="w-3 h-3" />
                  <span>Code</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Neural Architecture Search */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Neural Architecture Search
              </h2>
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Ongoing</span>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Developing automated neural architecture search techniques for efficient model 
              design under computational constraints. Focus on performance optimization while 
              maintaining deployment feasibility for resource-limited environments.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Key Features</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Automated architecture discovery and optimization</li>
                  <li>• Multi-objective optimization for accuracy-efficiency trade-offs</li>
                  <li>• Hardware-aware design for edge deployment</li>
                  <li>• Progressive search strategies for computational efficiency</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Technical Implementation</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Evolutionary algorithms for architecture search</li>
                  <li>• Performance prediction models for early stopping</li>
                  <li>• Constraint-aware search space design</li>
                  <li>• Comprehensive benchmarking across datasets</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {["AutoML", "Neural Architecture Search", "Model Optimization", "Efficiency", "PyTorch"].map((tech) => (
                <span key={tech} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-green-600 font-semibold">
                🎯 30% Latency Reduction
              </div>
              <div className="flex gap-2">
                <Link href="#" className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  <Github className="w-3 h-3" />
                  <span>Code</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Additional Projects Section */}
        <div className="mt-12 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Additional Projects & Contributions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Open Source Contributions</h3>
              <p className="text-gray-700 text-sm">
                Active contributor to ML libraries and computer vision frameworks
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Research Prototypes</h3>
              <p className="text-gray-700 text-sm">
                Multiple proof-of-concept implementations for research validation
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Educational Content</h3>
              <p className="text-gray-700 text-sm">
                Tutorials and documentation for ML concepts and implementations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}