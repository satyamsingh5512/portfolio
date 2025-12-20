export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string[];
  technologies: string[];
  location: string;
  companyUrl?: string;
  logo?: string;
}

export const experiences: Experience[] = [
  {
    id: 'iit-mandi-ml-intern',
    company: 'IIT Mandi',
    position: 'Machine Learning Research Intern',
    startDate: 'June 2024',
    endDate: 'August 2024',
    isCurrent: false,
    location: 'Mandi, Himachal Pradesh',
    companyUrl: 'https://www.iitmandi.ac.in/',
    logo: '/company/iit-mandi.svg',
    technologies: [
      'PyTorch',
      'Computer Vision',
      'YOLO',
      'Python',
      'CUDA',
      'Deep Learning',
      'Remote Sensing',
      'Object Detection'
    ],
    description: [
      'Conducted research on **Computer Vision for small object detection in remote sensing** using advanced deep learning techniques.',
      'Developed and optimized **FFCA-YOLO (Feature Fusion and Channel Attention YOLO)** model for improved detection accuracy of small objects in satellite imagery.',
      'Implemented deep learning models using **PyTorch and CUDA** for real-time inference and performance optimization.',
      'Worked on cutting-edge research in **remote sensing applications** with focus on agricultural monitoring and environmental analysis.',
      'Collaborated with research team on **computer vision algorithms** and contributed to ongoing research publications.',
      'Gained hands-on experience with **GPU acceleration** and optimization techniques for deep learning models.'
    ]
  }
];