'use client';

import { Mail, MapPin, Phone, Github, Linkedin, Globe } from 'lucide-react';
import Link from 'next/link';
import AcademicNav from './AcademicNav';

export default function AcademicPortfolio() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <AcademicNav />
      
      {/* Header Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div className="mb-6 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Satyam Singh
            </h1>
            <p className="text-xl text-gray-600 italic">Curriculum Vitae</p>
          </div>
          
          <div className="text-sm text-gray-600 space-y-1 text-right">
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
            <div className="flex items-center justify-end gap-4 mt-2">
              <Link href="https://www.linkedin.com/in/satyam-singh-35b365335/" className="flex items-center gap-1 hover:text-blue-600">
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </Link>
              <Link href="https://github.com/satyamsingh5512" className="flex items-center gap-1 hover:text-blue-600">
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </Link>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Globe className="w-4 h-4" />
              <Link href="https://satymxd.vercel.app/" className="hover:text-blue-600">
                Portfolio
              </Link>
            </div>
          </div>
        </div>

        {/* Research Interests */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-red-800 border-b-2 border-red-800 pb-1 mb-4">
            Research Interests
          </h2>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Machine Learning:</span> Neural Networks, Representation Learning, Natural Language Processing
            </p>
            <p>
              <span className="font-semibold">Focus Areas:</span> Robust Model Design, Real-time Inference, Deployment-aware Learning Systems
            </p>
          </div>
        </section>

        {/* Technical Skills */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-red-800 border-b-2 border-red-800 pb-1 mb-4">
            Technical Skills
          </h2>
          <div className="grid gap-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="font-semibold">Machine Learning</div>
              <div className="md:col-span-2">PyTorch, TensorFlow, Keras, Scikit-learn, CNNs, RNNs, LSTMs, Representation Learning</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="font-semibold">Computer Vision</div>
              <div className="md:col-span-2">Image Classification, Object Detection, Feature Pyramids, Context Modeling, Data Augmentation</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="font-semibold">Natural Language Processing</div>
              <div className="md:col-span-2">Text Classification, Sequence Modeling, Word Embeddings (GloVe), Tokenization, Error Analysis</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="font-semibold">Data and Evaluation</div>
              <div className="md:col-span-2">NumPy, Pandas, Data Preprocessing, Model Evaluation, Ablation Studies</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="font-semibold">Systems and Deployment</div>
              <div className="md:col-span-2">Docker, CUDA, Model Optimization, Inference Latency Reduction</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="font-semibold">Backend and Infrastructure</div>
              <div className="md:col-span-2">REST APIs, PostgreSQL, MongoDB, Kafka, AWS</div>
            </div>
          </div>
        </section>

        {/* Research Experience */}
        <section id="research" className="mb-8">
          <h2 className="text-xl font-bold text-red-800 border-b-2 border-red-800 pb-1 mb-4">
            Research Experience
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg">Research Intern -- Computer Vision and Remote Sensing</h3>
              <p className="italic text-gray-700 mb-3">Indian Institute of Technology (IIT) Mandi</p>
              <ul className="space-y-2 text-sm leading-relaxed">
                <li>• Formulated and implemented lightweight deep learning pipelines for small object detection in high-resolution remote sensing imagery, with specific emphasis on objects below 32 x 32 pixels under severe background clutter and scale imbalance.</li>
                <li>• Redesigned YOLO-based detection architectures by incorporating customized feature enhancement, multi-scale feature fusion, and global context modeling components to improve localization and classification robustness.</li>
                <li>• Investigated local contextual representation learning through multi-branch convolutional structures and receptive field expansion to strengthen weak and low-contrast object features.</li>
                <li>• Developed refined multi-scale feature fusion strategies to mitigate semantic inconsistencies between shallow and deep feature representations via channel-aware reweighting.</li>
                <li>• Integrated global context modeling mechanisms to capture long-range spatial and cross-channel dependencies, enabling effective suppression of confounding background regions.</li>
                <li>• Conducted end-to-end model training, controlled ablation studies, and comparative benchmarking using mAP-based evaluation metrics under constrained computational budgets.</li>
                <li>• Led dataset curation efforts including annotation verification, handling extreme class imbalance, and construction of stress-test evaluation splits with synthetic degradations such as blur, Gaussian noise, low illumination, and shadow occlusion.</li>
                <li>• Performed systematic robustness analysis under adverse imaging conditions and proposed mitigation strategies through degradation-aware augmentation.</li>
                <li>• Optimized inference latency, memory footprint, and parameter efficiency through architectural simplifications and partial convolution-based design choices targeting deployment-ready inference.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="mb-8">
          <h2 className="text-xl font-bold text-red-800 border-b-2 border-red-800 pb-1 mb-4">
            Projects
          </h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">Brain Tumor Classification Using Convolutional Neural Networks</h3>
                <span className="italic text-sm">Feb 2025</span>
              </div>
              <ul className="space-y-1 text-sm leading-relaxed">
                <li>• Designed a medical image analysis pipeline for automated brain tumor classification from MRI scans, addressing limited labeled data, inter-patient variability, and subtle intra-class visual differences.</li>
                <li>• Adapted pretrained convolutional neural networks (VGG16, ResNet) to the medical imaging domain through selective layer freezing and fine-tuning strategies.</li>
                <li>• Employed data augmentation, normalization, and regularization techniques to improve generalization performance in small-sample training regimes.</li>
                <li>• Achieved 92 percent validation accuracy on held-out scans and conducted class-wise and failure-mode analyses to assess sensitivity to tumor size, contrast variation, and imaging artifacts.</li>
              </ul>
            </div>

            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">Sign Language Recognition Using Deep Learning</h3>
                <span className="italic text-sm">Sep 2024</span>
              </div>
              <ul className="space-y-1 text-sm leading-relaxed">
                <li>• Developed a vision-based sign language recognition system for American Sign Language gestures with emphasis on real-time inference and robustness to environmental variability.</li>
                <li>• Designed and trained convolutional neural networks optimized for live webcam input while balancing accuracy and inference latency.</li>
                <li>• Curated and preprocessed gesture datasets to address background clutter, illumination changes, and inter-user variability.</li>
                <li>• Achieved 95 percent classification accuracy and evaluated system robustness across multiple users and operating conditions.</li>
              </ul>
            </div>

            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">Fake News Detection Using NLP and LSTM Models</h3>
                <span className="italic text-sm">Jun 2024</span>
              </div>
              <ul className="space-y-1 text-sm leading-relaxed">
                <li>• Designed a natural language processing pipeline for automated fake news detection, addressing semantic ambiguity, noisy labels, and domain shift across heterogeneous news sources.</li>
                <li>• Implemented Long Short-Term Memory based sequence models with pretrained GloVe word embeddings to capture contextual and temporal dependencies in text.</li>
                <li>• Performed extensive text preprocessing including tokenization, padding, normalization, and class balancing to stabilize training dynamics.</li>
                <li>• Achieved an F1-score of 89 percent and conducted qualitative error analysis to identify linguistic patterns contributing to misclassification.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Awards and Achievements */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-red-800 border-b-2 border-red-800 pb-1 mb-4">
            Awards and Achievements
          </h2>
          <ul className="space-y-2">
            <li>• <span className="font-semibold">Finalist</span> (Top 30 out of 2400 teams) -- IIT Guwahati Techniche Tech-Expo 2025</li>
            <li>• <span className="font-semibold">Rank 76</span> -- IIT Kharagpur Data Science Hackathon (Kshitij) 2025</li>
            <li>• <span className="font-semibold">First Prize</span> -- College Research Paper Competition<br />
                <span className="italic text-sm ml-4">Paper titled: &ldquo;Fault-Tolerant Task Scheduling for Cloud Computing&rdquo;</span></li>
            <li>• <span className="font-semibold">Research Paper under review</span> -- &ldquo;IoT for Sustainable Resource Management&rdquo;</li>
          </ul>
        </section>

        {/* Education */}
        <section id="education" className="mb-8">
          <h2 className="text-xl font-bold text-red-800 border-b-2 border-red-800 pb-1 mb-4">
            Education
          </h2>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold">B.Tech in Computer Science and Engineering</h3>
              <p className="italic text-gray-700">NIST University, Berhampur, Odisha. CGPA: <span className="font-bold">8.98</span> / 10</p>
            </div>
            <span className="italic text-sm">Aug 2023 -- Present</span>
          </div>
        </section>

        {/* Current Focus */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-red-800 border-b-2 border-red-800 pb-1 mb-4">
            Current Focus
          </h2>
          <p className="text-sm leading-relaxed">
            Exploring efficient and robust neural architectures for perception and language tasks under data scarcity, noise, and computational constraints.
          </p>
        </section>
      </div>
    </div>
  );
}