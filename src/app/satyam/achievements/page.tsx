import { Metadata } from 'next';
import AcademicNav from '@/components/academic/AcademicNav';
import { Award, Trophy, Medal, Star, Calendar, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Achievements - Satyam Singh',
  description: 'Awards, recognitions, and achievements in research and competitions',
};

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <AcademicNav />
      
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <Award className="w-16 h-16 text-orange-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Achievements</h1>
          <p className="text-xl text-gray-600">Awards, Recognitions & Accomplishments</p>
        </div>

        <div className="space-y-8">
          
          {/* Competition Achievements */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Competition Achievements</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-blue-900 mb-2">
                      Finalist - IIT Guwahati Techniche Tech-Expo 2025
                    </h3>
                    <p className="text-blue-700 font-medium">Top 30 out of 2400 teams</p>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">2025</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-blue-800">
                    Selected as one of the top 30 finalists from over 2400 participating teams in 
                    one of India&apos;s premier technical competitions. Demonstrated exceptional innovation 
                    and technical excellence in the field of technology and engineering.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-blue-700">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>2400+ participants</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>Top 1.25% performance</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-purple-900 mb-2">
                      Rank 76 - IIT Kharagpur Data Science Hackathon (Kshitij) 2025
                    </h3>
                    <p className="text-purple-700 font-medium">Among top performers in prestigious hackathon</p>
                  </div>
                  <div className="flex items-center gap-2 text-purple-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">2025</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-purple-800">
                    Achieved rank 76 in the highly competitive data science hackathon organized by 
                    IIT Kharagpur. Demonstrated strong analytical skills and innovative problem-solving 
                    approaches in machine learning and data analysis challenges.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-purple-700">
                    <div className="flex items-center gap-1">
                      <Medal className="w-4 h-4" />
                      <span>Top 100 ranking</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>Data Science Excellence</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Research & Academic Achievements */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Medal className="w-8 h-8 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Research & Academic Excellence</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-green-900 mb-2">
                      First Prize - College Research Paper Competition
                    </h3>
                    <p className="text-green-700 font-medium">Outstanding research contribution</p>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm">Winner</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-green-800">
                    Awarded first prize for the research paper titled 
                    <strong> &ldquo;Fault-Tolerant Task Scheduling for Cloud Computing&rdquo;</strong>. 
                    The work demonstrated innovative approaches to improving reliability and 
                    efficiency in distributed computing systems.
                  </p>
                  <div className="bg-white rounded p-3 border border-green-300">
                    <h4 className="font-semibold text-green-900 mb-1">Research Highlights:</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Novel fault-tolerance mechanisms for cloud environments</li>
                      <li>• Optimization algorithms for task scheduling</li>
                      <li>• Performance evaluation under various failure scenarios</li>
                      <li>• Practical implementation and validation</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-orange-900 mb-2">
                      Research Paper Under Review
                    </h3>
                    <p className="text-orange-700 font-medium">Pending publication</p>
                  </div>
                  <div className="flex items-center gap-2 text-orange-600">
                    <Star className="w-4 h-4" />
                    <span className="text-sm">In Progress</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-orange-800">
                    Research paper titled <strong>&ldquo;IoT for Sustainable Resource Management&rdquo;</strong> 
                    currently under review for publication. The work explores innovative applications 
                    of Internet of Things technologies for environmental sustainability and resource optimization.
                  </p>
                  <div className="bg-white rounded p-3 border border-orange-300">
                    <h4 className="font-semibold text-orange-900 mb-1">Research Focus:</h4>
                    <ul className="text-sm text-orange-800 space-y-1">
                      <li>• IoT-enabled resource monitoring systems</li>
                      <li>• Sustainable computing practices</li>
                      <li>• Environmental impact assessment</li>
                      <li>• Real-world deployment strategies</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Performance */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-8 h-8 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-900">Academic Excellence</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-indigo-900 mb-3">Outstanding CGPA</h3>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-indigo-600">8.98</div>
                  <div className="text-indigo-700">out of 10.0</div>
                </div>
                <p className="text-indigo-800 text-sm">
                  Maintained exceptional academic performance throughout the B.Tech program, 
                  demonstrating consistent excellence in computer science and engineering coursework.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Research Recognition</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Active research participation at IIT Mandi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Multiple research publications in progress</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Recognition for innovative research approaches</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Contribution to cutting-edge ML research</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Future Goals */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Future Aspirations</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Research Excellence</h3>
                <p className="text-gray-700 text-sm">
                  Aim to publish in top-tier conferences and contribute to breakthrough research in computer vision
                </p>
              </div>
              <div className="text-center">
                <Medal className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Industry Impact</h3>
                <p className="text-gray-700 text-sm">
                  Bridge the gap between academic research and practical industry applications
                </p>
              </div>
              <div className="text-center">
                <Star className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Global Recognition</h3>
                <p className="text-gray-700 text-sm">
                  Contribute to the global AI community through open-source projects and collaborations
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}