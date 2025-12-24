# Professional Image Setup

## Current Configuration
The PixelatedCanvas component is currently using your existing avatar image:
- **Current Source**: `/assets/satyam-avatar.png`
- **Dimensions**: 300x300 pixels (square)
- **Status**: ✅ Working and displaying on landing page

## To Use a Different Professional Image

### Option 1: Replace the Avatar
Upload a new image as `satyam-avatar.png` in this directory to replace the current one.

### Option 2: Add a Separate Professional Image
1. Upload your professional image as `satyam-professional.jpg` in this directory
2. Update `src/components/landing/Hero.tsx` line 60:
   ```tsx
   src="/assets/satyam-professional.jpg"
   ```
3. Adjust dimensions if needed (currently 300x300)

## Image Requirements
- **Format**: JPG, PNG, or WebP
- **Recommended Size**: 300x300 to 400x500 pixels
- **File Size**: Keep under 2MB for optimal loading
- **Quality**: High resolution for best pixelated effect

## Interactive Features
The PixelatedCanvas includes:
- ✨ Interactive swirl distortion on hover
- 🎨 Blue tint overlay
- 🖱️ Mouse-following animation
- 📱 Responsive (hidden on mobile, shows small avatar instead)
- ⚡ Smooth 60fps animations