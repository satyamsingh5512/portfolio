import { Metadata } from 'next';
import AcademicPortfolio from '@/components/academic/AcademicPortfolio';

export const metadata: Metadata = {
  title: 'Satyam Singh - Computer Science Researcher',
  description: 'Computer Science Student & Researcher at NIST University | Machine Learning & Computer Vision Research | IIT Mandi Research Intern',
  keywords: [
    'computer science',
    'researcher',
    'machine learning',
    'computer vision',
    'deep learning',
    'pytorch',
    'academic research',
    'NIST university',
    'IIT Mandi',
  ],
};

// Academic portfolio page for Satyam Singh
export default function SatyamPage() {
  return <AcademicPortfolio />;
}