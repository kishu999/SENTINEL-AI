"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Star,
  CheckCircle2,
  Calendar,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  Edit,
  Award,
  BookOpen,
  Globe,
} from "lucide-react";
import { dataService } from "@/lib/services/dataService";
import { Profile, Review } from "@/types/database";
import { RatingStars } from "@/components/ui/rating-stars";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const currentUser = dataService.getCurrentUser();

  useEffect(() => {
    if (username) {
      const p = dataService.getProfileByUsername(username);
      if (p) {
        setProfile(p);
        setReviews(dataService.getReviewsForUser(p.id));
      }
    }
  }, [username]);

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Student Profile Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">
          The requested profile @{username} does not exist or has been made private.
        </p>
        <Link href="/explore">
          <Button className="mt-6" size="sm">Explore Tasks</Button>
        </Link>
      </div>
    );
  }

  const isOwnProfile = currentUser.id === profile.id;

  const handleStartMessage = () => {
    const conv = dataService.getOrCreateConversation([currentUser.id, profile.id], `Discussion with ${profile.full_name}`);
    router.push(`/messages?id=${conv.id}`);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-5xl">
      {/* Profile Header Banner Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-card mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <img
              src={profile.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"}
              alt={profile.full_name}
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl object-cover ring-4 ring-blue-500/20 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {profile.full_name}
                </h1>
                <span title="Verified University Student">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                </span>
              </div>

              <div className="text-xs sm:text-sm font-semibold text-blue-600 flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4" />
                <span>{profile.university || profile.college} • {profile.course}</span>
              </div>

              <div className="text-xs text-slate-400">
                @{profile.username} • Year {profile.year_of_study} Undergraduate • Joined {formatDate(profile.created_at)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {isOwnProfile ? (
              <Link href="/profile/edit" className="w-full sm:w-auto">
                <Button variant="outline" size="sm" className="w-full gap-2 font-semibold">
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </Button>
              </Link>
            ) : (
              <Button onClick={handleStartMessage} size="sm" className="w-full sm:w-auto gap-2 font-semibold">
                <MessageSquare className="h-4 w-4" />
                <span>Send Message</span>
              </Button>
            )}
          </div>
        </div>

        {/* Highlights Bar */}
        <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {profile.completed_projects || 0}
            </div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Completed Projects
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <span>{profile.rating ? Number(profile.rating).toFixed(1) : "5.0"}</span>
            </div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Verified Rating ({profile.review_count || 0})
            </div>
          </div>

          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-600">
              100%
            </div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              On-Time Rate
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Details & Portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Bio & Skills */}
        <div className="lg:col-span-4 space-y-6">
          {/* Bio card */}
          <Card>
            <CardContent className="p-6 space-y-3">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">About Me</h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {profile.bio || "No biography provided yet."}
              </p>
            </CardContent>
          </Card>

          {/* Skills Card */}
          <Card>
            <CardContent className="p-6 space-y-3">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">Verified Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((skill, i) => (
                  <Badge key={i} variant="default" className="text-xs py-1 px-2.5">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card>
            <CardContent className="p-6 space-y-3">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">Languages</h3>
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {profile.languages?.join(", ") || "English"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Portfolio & Verified Reviews */}
        <div className="lg:col-span-8 space-y-8">
          {/* Portfolio section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span>Showcase Portfolio ({profile.portfolio?.length || 0})</span>
              </h2>
            </div>

            {profile.portfolio && profile.portfolio.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.portfolio.map((item) => (
                  <div
                    key={item.id}
                    className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-card-hover transition-all"
                  >
                    {item.image_url && (
                      <div className="h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                          {item.title}
                        </h4>
                        {item.project_url && (
                          <a
                            href={item.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-blue-600"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      {item.tags && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {item.tags.map((t, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-xs text-slate-500">
                No portfolio projects listed yet.
              </div>
            )}
          </div>

          {/* Verified Peer Reviews */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              <span>Verified Client Reviews ({reviews.length})</span>
            </h2>

            {reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.reviewer?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60"}
                          alt={rev.reviewer?.full_name}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {rev.reviewer?.full_name}
                        </span>
                        <Badge variant="purple" className="text-[10px] py-0 px-1.5 h-4">
                          Verified Order
                        </Badge>
                      </div>

                      <RatingStars rating={rev.rating} size="sm" />
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                      "{rev.feedback}"
                    </p>

                    <div className="text-[10px] text-slate-400 pt-1">
                      Reviewed on {formatDate(rev.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-xs text-slate-500">
                No client reviews yet. Reviews are posted upon completing orders.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
