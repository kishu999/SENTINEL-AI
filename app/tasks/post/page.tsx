"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  PlusCircle,
  Calendar,
  DollarSign,
  Upload,
  AlertCircle,
  CheckCircle2,
  X,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { dataService } from "@/lib/services/dataService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function PostTaskPage() {
  const router = useRouter();
  const currentUser = dataService.getCurrentUser();
  const categories = dataService.getCategories();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "cat-1");
  const [budget, setBudget] = useState<number | "">(100);
  const [budgetType, setBudgetType] = useState<"fixed" | "hourly">("fixed");
  const [deadlineDays, setDeadlineDays] = useState(5);
  const [requiredSkills, setRequiredSkills] = useState<string[]>(["Figma", "UI/UX Design"]);
  const [skillInput, setSkillInput] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [honorCodeAgreed, setHonorCodeAgreed] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    if (skillInput.trim() && !requiredSkills.includes(skillInput.trim())) {
      setRequiredSkills([...requiredSkills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skill));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please provide a task title.");
      return;
    }
    if (!description.trim() || description.trim().length < 20) {
      setError("Please write a detailed description of at least 20 characters.");
      return;
    }
    if (!budget || Number(budget) <= 0) {
      setError("Please enter a valid budget greater than $0.");
      return;
    }
    if (!honorCodeAgreed) {
      setError("You must confirm compliance with the SkillConnect Academic Integrity Policy.");
      return;
    }

    setIsLoading(true);

    try {
      const deadlineDate = new Date(Date.now() + Number(deadlineDays) * 86400000).toISOString();

      const newTask = dataService.createTask({
        title: title.trim(),
        description: description.trim(),
        category_id: categoryId,
        budget: Number(budget),
        budget_type: budgetType,
        deadline: deadlineDate,
        required_skills: requiredSkills,
        additional_instructions: additionalInstructions.trim() || undefined,
      });

      router.push(`/tasks/${newTask.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create task.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-3xl">
      <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
        <Badge variant="purple" className="gap-1">
          <Sparkles className="h-3 w-3" />
          <span>Hire Talented Peers</span>
        </Badge>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Post a Campus Task
        </h1>
        <p className="text-sm text-slate-500">
          Find skilled students to assist with design, programming, presentation decks, or tutoring.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <Input
            label="Task Title *"
            required
            placeholder="e.g. Design 6 Figma Mockups for Campus Food Rescue App"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            helperText="Write a clear, descriptive headline of the deliverable you need."
          />

          {/* Category */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Discipline / Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-sm"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <Textarea
            label="Detailed Requirements & Scope *"
            required
            rows={5}
            placeholder="Detail what you need built, intended audience, any required software (e.g. Figma, Python), and expectations..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Budget & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Estimated Budget ($ USD) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  min="5"
                  step="1"
                  required
                  placeholder="100"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value === "" ? "" : Number(e.target.value))}
                  className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-8 pr-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Budget Type
              </label>
              <select
                value={budgetType}
                onChange={(e) => setBudgetType(e.target.value as any)}
                className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-sm"
              >
                <option value="fixed">Fixed Price Project</option>
                <option value="hourly">Hourly Rate</option>
              </select>
            </div>
          </div>

          {/* Deadline */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Turnaround Time (Deadline)
            </label>
            <select
              value={deadlineDays}
              onChange={(e) => setDeadlineDays(Number(e.target.value))}
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-sm"
            >
              <option value={2}>Urgent (2 Days)</option>
              <option value={4}>4 Days</option>
              <option value={7}>1 Week (7 Days)</option>
              <option value={14}>2 Weeks (14 Days)</option>
              <option value={30}>1 Month (30 Days)</option>
            </select>
          </div>

          {/* Skills Picker */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Required Skills
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type skill & press Enter (e.g. Next.js, Keynote)..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
              />
              <Button type="button" onClick={handleAddSkill} variant="outline" size="sm">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                  <span>{skill}</span>
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-rose-600"
                    onClick={() => handleRemoveSkill(skill)}
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Academic Integrity Checkbox */}
          <div className="rounded-2xl bg-blue-50/70 dark:bg-slate-800/80 p-4 border border-blue-100 dark:border-slate-700 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={honorCodeAgreed}
                onChange={(e) => setHonorCodeAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  Academic Integrity Affirmation (Required)
                </span>
                I certify that this task is for legitimate creative, technical, or learning assistance (such as UI design, tutoring, coding, data modeling, or club media). It does <strong>not</strong> solicit completing a graded exam, quiz, essay, or homework meant for independent submission.
              </div>
            </label>
          </div>

          <Button type="submit" size="lg" isLoading={isLoading} className="w-full font-bold shadow-md">
            Publish Task to Marketplace
          </Button>
        </form>
      </div>
    </div>
  );
}
