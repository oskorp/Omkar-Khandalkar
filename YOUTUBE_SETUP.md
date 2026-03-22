# YouTube Content Setup Guide

## How to Add Your YouTube Videos

The Content Creation section displays your YouTube videos with automatic thumbnail loading and direct links.

### Step 1: Find Your Video IDs
Each YouTube video has a unique ID. You can find it in the URL:
- **URL Example:** `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- **Video ID:** `dQw4w9WgXcQ` (the part after `v=`)

### Step 2: Edit the HTML
Open `index.html` and find the Content Creation section. Look for the video cards with:
```
https://img.youtube.com/vi/VIDEO_ID_1/0.jpg
https://www.youtube.com/watch?v=VIDEO_ID_1
```

### Step 3: Replace the IDs and Titles
Replace the placeholder video IDs and titles with your own:

**For VLOGS (First 3 videos):**
- Replace `DKhW_Z3maAE&t=109s`, `DKhW_Z3maAE&t=109s`, `DKhW_Z3maAE&t=109s` with your vlog video IDs
- Replace `Vlog Title 1`, `Vlog Title 2`, `Vlog Title 3` with your actual vlog titles

**For PODCASTS (Next 3 videos):**
- Replace `VIDEO_ID_4`, `VIDEO_ID_5`, `VIDEO_ID_6` with your podcast video IDs
- Replace `Podcast Title 1`, `Podcast Title 2`, `Podcast Title 3` with your actual podcast titles

### Example:
Before:
```html
<a href="https://www.youtube.com/watch?v=VIDEO_ID_1" target="_blank" rel="noopener" class="video-card">
  <div class="video-thumb"><img src="https://img.youtube.com/vi/VIDEO_ID_1/0.jpg" alt="Vlog 1" loading="lazy"/>
```

After:
```html
<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener" class="video-card">
  <div class="video-thumb"><img src="https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg" alt="Why I Love Design" loading="lazy"/>
```

### How It Works
- **Thumbnails** are automatically pulled from YouTube's servers (https://img.youtube.com/vi/{VIDEO_ID}/0.jpg)
- **Links** open directly to YouTube in a new tab
- **Tabs** allow switching between Vlogs and Podcasts
- **Hover effects** show a play button on the thumbnails

### YouTube Thumbnail Quality
YouTube provides different quality levels for thumbnails:
- `/0.jpg` - Default (good quality)
- `/maxresdefault.jpg` - Maximum resolution (use if available on your video)
- `/hqdefault.jpg` - High quality
- `/mqdefault.jpg` - Medium quality
- `/sddefault.jpg` - Standard quality

You can change `/0.jpg` to one of the above for higher quality if needed.

### Tips
- Make sure your YouTube videos are public or unlisted (not private)
- The thumbnail will auto-load from YouTube's servers
- Titles will display below each video thumbnail
- Keep video titles concise for better layout
