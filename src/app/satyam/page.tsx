import { Metadata } from 'next';
import AcademicPortfolio from '@/components/academic/AcademicPortfolio';

export const metadata: Metadata = {
  title: 'Satyam Singh - ML Engineer & Researcher',
  description: 'Machine Learning Engineer & Computer Vision Researcher | Neural Networks, Deep Learning & AI Systems | IIT Mandi Research Intern',
  keywords: [
    'machine learning engineer',
    'computer vision',
    'deep learning',
    'neural networks',
    'artificial intelligence',
    'pytorch',
    'tensorflow',
    'research',
    'YOLO',
    'object detection',
    'IIT Mandi',
    'NIST university',
  ],
};

// Academic portfolio page for Satyam Singh
export default function SatyamPage() {
  return <AcademicPortfolio />;
}