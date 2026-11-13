-- ==============================================================================
-- SKILLCONNECT: SEED DATA
-- 10 Canonical Categories, Real-World Student Tasks, Profiles, Orders & Reviews
-- ==============================================================================

-- 1. Insert 10 Student Categories
INSERT INTO public.categories (id, name, slug, description, icon, display_order) VALUES
('c1000000-0000-0000-0000-000000000001', 'Programming & Development', 'programming-development', 'Web apps, mobile apps, bug fixing, script automation, and API integration.', 'Code2', 1),
('c1000000-0000-0000-0000-000000000002', 'Graphic Design', 'graphic-design', 'Club flyers, social media graphics, branding packages, logos, and vector art.', 'Palette', 2),
('c1000000-0000-0000-0000-000000000003', 'Video Editing', 'video-editing', 'Reels, YouTube editing, project showcase clips, color grading, and subtitles.', 'Video', 3),
('c1000000-0000-0000-0000-000000000004', 'Content Writing', 'content-writing', 'Blog posts, copywriting, technical documentation, newsletters, and resumes.', 'PenTool', 4),
('c1000000-0000-0000-0000-000000000005', 'Research & Learning Support', 'research-learning-support', 'Literature reviews, dataset sourcing, syllabus planning, and study guides.', 'BookOpenCheck', 5),
('c1000000-0000-0000-0000-000000000006', 'Presentation Design', 'presentation-design', 'Keynote & PowerPoint pitch decks, thesis slides, charts, and infographics.', 'Presentation', 6),
('c1000000-0000-0000-0000-000000000007', 'Data Entry & Analytics', 'data-entry-analytics', 'Spreadsheet cleaning, statistical models, Excel dashboards, and surveys.', 'TableProperties', 7),
('c1000000-0000-0000-0000-000000000008', 'Digital Marketing', 'digital-marketing', 'Social media management, SEO audits, campaign analytics, and email blasts.', 'TrendingUp', 8),
('c1000000-0000-0000-0000-000000000009', 'Tutoring & Mentorship', 'tutoring-mentorship', '1-on-1 subject tutoring, coding interview prep, and concept reviews.', 'GraduationCap', 9),
('c1000000-0000-0000-0000-000000000010', 'UI/UX Design', 'ui-ux-design', 'Figma prototypes, mobile app mockups, user journey flows, and wireframes.', 'Layout', 10)
ON CONFLICT (name) DO NOTHING;

-- 2. Seed Profiles
INSERT INTO public.profiles (
    id, email, full_name, username, avatar_url, college, university, course, year_of_study, bio,
    skills, languages, rating, review_count, completed_projects
) VALUES
(
    'p1000000-0000-0000-0000-000000000001',
    'alex.rivera@stanford.edu',
    'Alex Rivera',
    'arivera_tech',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    'School of Engineering',
    'Stanford University',
    'Computer Science & Human-Computer Interaction',
    3,
    'Junior at Stanford focusing on accessible software and full-stack web applications. Love building tools for students!',
    ARRAY['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
    ARRAY['English', 'Spanish'],
    4.95,
    14,
    18
),
(
    'p1000000-0000-0000-0000-000000000002',
    'priya.sharma@berkeley.edu',
    'Priya Sharma',
    'priyadesign',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    'College of Environmental Design',
    'UC Berkeley',
    'Cognitive Science & UI/UX Design',
    4,
    'Senior UI/UX designer and Figma wizard. Designed apps for 6 campus hackathons and student startups.',
    ARRAY['Figma', 'UI/UX Design', 'Design Systems', 'Wireframing', 'Prototyping'],
    ARRAY['English', 'Hindi'],
    5.00,
    22,
    26
),
(
    'p1000000-0000-0000-0000-000000000003',
    'marcus.chen@mit.edu',
    'Marcus Chen',
    'marcus_slides',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    'Sloan School of Management',
    'MIT',
    'Finance & Business Analytics',
    2,
    'Specialist in high-impact pitch decks, venture capital slides, and clean statistical visualizations.',
    ARRAY['PowerPoint', 'Keynote', 'Pitch Decks', 'Financial Modeling', 'Data Visualization'],
    ARRAY['English', 'Mandarin'],
    4.90,
    11,
    15
),
(
    'p1000000-0000-0000-0000-000000000004',
    'admin@skillconnect.edu',
    'SkillConnect Operations',
    'skillconnect_admin',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    'Operations & Trust',
    'SkillConnect Platform',
    'Platform Administration',
    4,
    'Official administrator and trust moderation team for SkillConnect.',
    ARRAY['Platform Administration', 'Trust & Safety', 'Audit'],
    ARRAY['English'],
    5.00,
    0,
    0
)
ON CONFLICT (id) DO NOTHING;

-- 3. Seed Roles
INSERT INTO public.user_roles (user_id, role) VALUES
('p1000000-0000-0000-0000-000000000001', 'student'),
('p1000000-0000-0000-0000-000000000002', 'student'),
('p1000000-0000-0000-0000-000000000003', 'student'),
('p1000000-0000-0000-0000-000000000004', 'admin')
ON CONFLICT DO NOTHING;

-- 4. Seed Wallets
INSERT INTO public.wallets (user_id, total_earnings, available_balance, pending_balance, withdrawable_balance) VALUES
('p1000000-0000-0000-0000-000000000001', 750.00, 320.00, 80.00, 320.00),
('p1000000-0000-0000-0000-000000000002', 1240.00, 540.00, 150.00, 540.00),
('p1000000-0000-0000-0000-000000000003', 490.00, 190.00, 0.00, 190.00),
('p1000000-0000-0000-0000-000000000004', 0.00, 0.00, 0.00, 0.00)
ON CONFLICT (user_id) DO NOTHING;

-- 5. Seed Tasks
INSERT INTO public.tasks (
    id, client_id, title, description, category_id, budget, budget_type, deadline,
    required_skills, status, view_count, application_count
) VALUES
(
    't1000000-0000-0000-0000-000000000001',
    'p1000000-0000-0000-0000-000000000001',
    'Design High-Fidelity Figma Mockups for Campus Food Rescue App',
    'We are a student team building an app to connect campus dining halls with food pantries. We need 6 polished mobile screens designed in Figma (Home, Donor Post, Driver Claim, Inventory, Profile, Push Alert states). Design system guidelines provided.',
    'c1000000-0000-0000-0000-000000000010',
    120.00,
    'fixed',
    NOW() + INTERVAL '7 days',
    ARRAY['Figma', 'Mobile UI', 'Prototyping', 'Design Systems'],
    'open',
    142,
    4
),
(
    't1000000-0000-0000-0000-000000000002',
    'p1000000-0000-0000-0000-000000000003',
    'Interactive Pitch Deck for Student Startup Showcase',
    'Seeking a creative student to redesign our 12-slide investor deck. Content is already written in Google Docs; we need clean typography, custom vector graphs, and consistent branding. Must be delivered in .pptx and .pdf.',
    'c1000000-0000-0000-0000-000000000006',
    85.00,
    'fixed',
    NOW() + INTERVAL '4 days',
    ARRAY['PowerPoint', 'Keynote', 'Pitch Decks', 'Graphic Design'],
    'open',
    89,
    2
),
(
    't1000000-0000-0000-0000-000000000003',
    'p1000000-0000-0000-0000-000000000001',
    'Python Web Scraper for Public Academic Research Data',
    'Need assistance writing a polite, compliant Python script using BeautifulSoup and Requests to collect publicly released climate statistics from NOAA and output them into clean CSV format for our research group.',
    'c1000000-0000-0000-0000-000000000001',
    75.00,
    'fixed',
    NOW() + INTERVAL '5 days',
    ARRAY['Python', 'Data Scraping', 'Pandas', 'CSV'],
    'open',
    115,
    3
),
(
    't1000000-0000-0000-0000-000000000004',
    'p1000000-0000-0000-0000-000000000002',
    '60-Second Promotional Reel for Solar Car Club Launch',
    'We recorded raw footage (4K 60fps) of our university solar car on the test track. Need an energetic 60-second vertical video for Instagram Reels and TikTok with smooth cuts, sound design, and subtitle captions.',
    'c1000000-0000-0000-0000-000000000003',
    95.00,
    'fixed',
    NOW() + INTERVAL '10 days',
    ARRAY['Premiere Pro', 'Video Editing', 'Reels', 'Color Grading'],
    'open',
    64,
    1
)
ON CONFLICT (id) DO NOTHING;
