# Specification

## Summary
**Goal:** Implement chunked video upload system supporting up to 5GB files with public upload access and admin-only deletion.

**Planned changes:**
- Add backend chunked upload system accepting 2MB fragments and reassembling into complete video files (max 5GB)
- Remove URL-based video field from data model and replace with direct blob storage reference
- Update frontend upload interface with chunked upload, progress tracking, and estimated time remaining
- Remove URL input field from admin upload form, keeping only direct file upload
- Allow all authenticated users to upload movies and series content
- Restrict deletion functionality to admin users only
- Update video player to stream from backend blob storage instead of external URLs

**User-visible outcome:** All authenticated users can upload videos up to 5GB with real-time progress tracking, while only admins can delete content. Videos are stored and streamed directly from the platform without external URLs.
