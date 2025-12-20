import { Metadata } from 'next';
import AcademicNav from '@/components/academic/AcademicNav';
import { Brain, Target, Zap, MapPin, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Research - Satyam Singh',
  description: 'Current research work and contributions in Computer Vision and Machine Learning',
};

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <AcademicNav />
      
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <Brain className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Research Experience</h1>
          <p className="text-xl text-gray-600">Advancing Computer Vision and Deep Learning</p>
        </div>

        {/* Current Research Position */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Research Intern - Computer Vision and Remote Sensing
              </h2>
              <p className="text-lg text-purple-600 font-medium mb-4">
                Indian Institute of Technology (IIT) Mandi
              </p>
              <div className="flex items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Mandi, Himachal Pradesh</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Current Position</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <Target className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Research Focus</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Small object detection in high-resolution remote sensing imagery, 
                with specific emphasis on objects below 32 x 32 pixels under severe 
                background clutter and scale imbalance.
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6">
              <Zap className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Multi-scale feature fusion with global context modeling, 
                incorporating customized feature enhancement and channel-aware 
                reweighting mechanisms.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Research Contributions</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">YOLO Architecture Redesign</h4>
                    <p className="text-gray-700 text-sm">
                      Redesigned YOLO-based detection architectures by incorporating customized feature enhancement, 
                      multi-scale feature fusion, and global context modeling components to improve localization 
                      and classification robustness.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Contextual Representation Learning</h4>
                    <p className="text-gray-700 text-sm">
                      Investigated local contextual representation learning through multi-branch convolutional 
                      structures and receptive field expansion to strengthen weak and low-contrast object features.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Feature Fusion Strategies</h4>
                    <p className="text-gray-700 text-sm">
                      Developed refined multi-scale feature fusion strategies to mitigate semantic inconsistencies 
                      between shallow and deep feature representations via channel-aware reweighting.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Global Context Modeling</h4>
                    <p className="text-gray-700 text-sm">
                      Integrated global context modeling mechanisms to capture long-range spatial and cross-channel 
                      dependencies, enabling effective suppression of confounding background regions.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Deployment Optimization</h4>
                    <p className="text-gray-700 text-sm">
                      Optimized inference latency, memory footprint, and parameter efficiency through architectural 
                      simplifications and partial convolution-based design choices targeting deployment-ready inference.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Research Methodology</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Experimental Design</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• End-to-end model training and validation</li>
                    <li>• Controlled ablation studies</li>
                    <li>• Comparative benchmarking using mAP metrics</li>
                    <li>• Constrained computational budget analysis</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Data & Evaluation</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Dataset curation and annotation verification</li>
                    <li>• Extreme class imbalance handling</li>
                    <li>• Stress-test evaluation with synthetic degradations</li>
                    <li>• Systematic robustness analysis</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Challenges Addressed</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">Scale Imbalance</h4>
                  <p className="text-gray-700 text-xs">
                    Handling severe scale variations in small objects within high-resolution imagery
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">Background Clutter</h4>
                  <p className="text-gray-700 text-xs">
                    Suppressing confounding background regions through context modeling
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">Adverse Conditions</h4>
                  <p className="text-gray-700 text-xs">
                    Robustness under blur, noise, low illumination, and shadow occlusion
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Future Research Directions */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Future Research Directions</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Short-term Goals</h4>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li>• Complete current research on small object detection</li>
                <li>• Publish findings in top-tier computer vision conferences</li>
                <li>• Extend work to real-time deployment scenarios</li>
                <li>• Collaborate on multi-modal sensing applications</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Long-term Vision</h4>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li>• Develop next-generation neural architectures</li>
                <li>• Explore self-supervised learning paradigms</li>
                <li>• Contribute to sustainable AI and green computing</li>
                <li>• Bridge research-industry gap in computer vision</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}