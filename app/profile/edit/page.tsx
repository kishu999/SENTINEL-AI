"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Plus, X, Check, Save, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { dataService } from "@/lib/services/dataService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function EditProfilePage() {
  const router = useRouter();
  const currentUser = dataService.getCurrentUser();

  const [fullName, setFullName] = useState(currentUser.full_name);
  const [bio, setBio] = useState(currentUser.bio || "");
  const [course, setCourse] = useState(currentUser.course);
  const [yearOfStudy, setYearOfStudy] = useState(currentUser.year_of_study);
  const [university, setUniversity] = useState(currentUser.university || currentUser.college);
  const [skills, setSkills] = useState<string[]>([...currentUser.skills]);
  const [newSkill, setNewSkill] = useState("");
  const [portfolio, setPortfolio] = useState([...(currentUser.portfolio || [])]);

  // New portfolio item modal/form
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectUrl, setNewProjectUrl] = useState("");
  const [newProjectImg, setNewProjectImg] = useState("");
  const [showAddProject, setShowAddProject] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddProject = () => {
    if (!newProjectTitle.trim()) return;
    const newProj = {
      id: `port-${Date.now()}`,
      title: newProjectTitle.trim(),
      description: newProjectDesc.trim(),
      project_url: newProjectUrl.trim() || undefined,
      image_url: newProjectImg.trim() || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
      tags: ["Student Project"],
    };
    setPortfolio([...portfolio, newProj]);
    setNewProjectTitle("");
    setNewProjectDesc("");
    setNewProjectUrl("");
    setNewProjectImg("");
    setShowAddProject(false);
  };

  const handleRemoveProject = (id: string) => {
    setPortfolio(portfolio.filter((p) => p.id !== id));
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.updateProfile(currentUser.id, {
      full_name: fullName,
      bio: bio,
      course: course,
      year_of_study: Number(yearOfStudy),
      university: university,
      skills: skills,
      portfolio: portfolio,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      router.push(`/profile/${currentUser.username}`);
    }, 1200);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href={`/profile/${currentUser.username}`}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 mb-2 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Public Profile</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Edit Student Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Keep your credentials, course details, and showcase portfolio up to date.
          </p>
        </div>

        {savedSuccess && (
          <Badge variant="success" className="gap-1.5 py-1 px-3">
            <Check className="h-4 w-4" />
            <span>Profile Saved!</span>
          </Badge>
        )}
      </div>

      <form onSubmit={handleSaveAll} className="space-y-8">
        {/* Core Info */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            Academic & Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <Input
              label="University / College"
              required
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Course / Major"
                required
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Year of Study
              </label>
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(Number(e.target.value))}
                className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-sm"
              >
                <option value={1}>Year 1</option>
                <option value={2}>Year 2</option>
                <option value={3}>Year 3</option>
                <option value={4}>Year 4</option>
                <option value={5}>Graduate</option>
              </select>
            </div>
          </div>

          <Textarea
            label="Biography"
            rows={4}
            placeholder="Tell fellow students about your background, interests, and collaboration style..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* Skills Management */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            Skills & Competencies
          </h2>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a skill (e.g. Next.js, Figma, Python)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleAddSkill}
              className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
            />
            <Button type="button" onClick={handleAddSkill} size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/50"
              >
                <span>{skill}</span>
                <X
                  className="h-3 w-3 cursor-pointer hover:text-rose-600 transition-colors"
                  onClick={() => handleRemoveSkill(skill)}
                />
              </span>
            ))}
          </div>
        </div>

        {/* Portfolio Projects Management */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Showcase Portfolio Projects
            </h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddProject(!showAddProject)}
              className="gap-1 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Project</span>
            </Button>
          </div>

          {showAddProject && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                New Project Item
              </h4>
              <Input
                label="Project Title"
                placeholder="e.g. Student Pantry Mobile App"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
              />
              <Textarea
                label="Short Description"
                rows={2}
                placeholder="Brief summary of your design or code contribution..."
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Project / Repo URL"
                  placeholder="https://github.com/..."
                  value={newProjectUrl}
                  onChange={(e) => setNewProjectUrl(e.target.value)}
                />
                <Input
                  label="Image URL (Unsplash or direct)"
                  placeholder="https://images.unsplash.com/..."
                  value={newProjectImg}
                  onChange={(e) => setNewProjectImg(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddProject(false)}>
                  Cancel
                </Button>
                <Button type="button" size="sm" onClick={handleAddProject}>
                  Save Project
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {portfolio.map((proj) => (
              <div
                key={proj.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{proj.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{proj.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveProject(proj.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full gap-2 font-bold shadow-md">
          <Save className="h-5 w-5" />
          <span>Save Changes & Update Profile</span>
        </Button>
      </form>
    </div>
  );
}
