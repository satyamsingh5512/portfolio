import { Metadata } from 'next';
import AcademicNav from '@/components/academic/AcademicNav';
import { BookOpen, Calendar, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Education - Satyam Singh',
  description: 'Academic background and educational qualifications of Satyam Singh',
};

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <AcademicNav />
      
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Education</h1>
          <p className="text-xl text-gray-600">Academic Background & Qualifications</p>
        </div>

        <div className="space-y-8">
          {/* Current Education */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Bachelor of Technology in Computer Science and Engineering
                </h2>
                <p className="text-lg text-blue-600 font-medium mb-2">
                  NIST University, Berhampur, Odisha
                </p>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>August 2023 - Present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span className="font-semibold text-green-600">CGPA: 8.98/10</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Relevant Coursework</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Core Computer Science</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Data Structures and Algorithms</li>
                      <li>• Object-Oriented Programming</li>
                      <li>• Database Management Systems</li>
                      <li>• Computer Networks</li>
                      <li>• Operating Systems</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Machine Learning & AI</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Machine Learning Fundamentals</li>
                      <li>• Deep Learning and Neural Networks</li>
                      <li>• Computer Vision</li>
                      <li>• Natural Language Processing</li>
                      <li>• Statistical Methods</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Academic Achievements</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Maintained consistent academic excellence with CGPA of 8.98/10</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Active participation in research projects and technical competitions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Focus on practical applications of machine learning and computer vision</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Skills Developed</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Python", "Java", "C++", "JavaScript", "PyTorch", "TensorFlow", 
                    "OpenCV", "NumPy", "Pandas", "Scikit-learn", "Git", "Docker", 
                    "Linux", "SQL", "MongoDB", "React", "Node.js"
                  ].map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Future Plans */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Future Academic Plans</h3>
            <p className="text-gray-700">
              Planning to pursue advanced studies in Machine Learning and Computer Vision, 
              with a focus on research in neural architecture optimization and deployment-ready AI systems. 
              Considering graduate programs at top-tier institutions to further develop expertise in 
              deep learning and contribute to cutting-edge research in the field.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}