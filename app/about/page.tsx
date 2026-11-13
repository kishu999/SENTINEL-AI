import React from "react";
import Link from "next/link";
import { Sparkles, Heart, Users, Target, Shield, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl space-y-16">
      {/* Intro */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <Badge variant="purple">Our Mission</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Empowering The Next Generation of Builders
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          SkillConnect was born out of a simple observation: universities are packed with extraordinary young talent, yet students struggle to find flexible work that builds their resumes.
        </p>
      </div>

      {/* Story Card */}
      <div className="rounded-3xl bg-slate-50 dark:bg-slate-900 p-8 sm:p-10 border border-slate-200 dark:border-slate-800 space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">The Student Dilemma</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Traditional freelance platforms take up to 20% fees, penalize beginners without decades of client ratings, and match students with multinational corporations that demand full-time availability during exam seasons.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          On campus, meanwhile, student startup founders, engineering teams, club leads, and researchers desperately need presentation design, video editing, and front-end coding assistance.
        </p>
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs sm:text-sm text-blue-900 dark:text-blue-200 font-medium">
          SkillConnect bridges this exact campus gap: authentic peer-to-peer collaboration with safe payments, low 5% fees, and zero tolerance for academic dishonesty.
        </div>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4">
            <Shield className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Verified University IDs</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Only enrolled students with validated institutional emails participate, creating a high-trust campus network.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4">
            <Target className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Portfolio Building</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Students leave university with tangible client work, public reviews, and practical deliverables recruiters love.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4">
            <Heart className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Fair Student Economics</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Our 5% platform fee is the lowest in the gig industry, ensuring earnings stay in students' pockets.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-8">
        <Link href="/auth/register">
          <Button size="lg" className="rounded-xl font-bold px-8">
            Get Started With SkillConnect
          </Button>
        </Link>
      </div>
    </div>
  );
}
