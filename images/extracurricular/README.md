# Extracurricular Image Carousel Setup

Each event card now features an **auto-rotating image carousel** that cycles through 3 images every 4 seconds.

## Image Directory Structure

Place your event images in this folder (`images/extracurricular/`) with the following naming convention:

### Event 1: CodeOS Workshops
- `codeos-1.jpg` - Main workshop image
- `codeos-2.jpg` - Event/participants image
- `codeos-3.jpg` - Bootcamp/certificate image

### Event 2: CSR Sessions
- `csr-1.jpg` - CSR session image
- `csr-2.jpg` - Event/participants image
- `csr-3.jpg` - Digital literacy session image

### Event 3: IETE RAIT
- `iete-1.jpg` - College event image
- `iete-2.jpg` - Hackathon image
- `iete-3.jpg` - eYantra/robotics image

### Event 4: CodeOS Podcast & YouTube
- `podcast-1.jpg` - Podcast recording/studio image
- `podcast-2.jpg` - YouTube channel/setup image
- `podcast-3.jpg` - Recording/session image

## Technical Details

- **Image Format**: JPG, PNG, or WebP (JPG recommended for web optimization)
- **Aspect Ratio**: 16:9 (recommended: 1920x1080px or 1280x720px)
- **Auto-Rotation**: Every 4 seconds
- **Dots**: Clickable navigation indicators below each image

## Notes

- All images will be lazy-loaded for better performance
- Images will maintain aspect ratio and fill the container
- Carousel auto-rotates infinitely
- Dots at the bottom show current position and allow manual navigation
