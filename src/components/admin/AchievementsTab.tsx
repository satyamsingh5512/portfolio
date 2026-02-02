"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export interface AchievementData {
  id: string;
  title: string;
  issuer: string;
  date: string;
  file: string;
  createdAt: string;
}

interface AchievementsTabProps {
  initialAchievements: AchievementData[];
}

export function AchievementsTab({ initialAchievements }: AchievementsTabProps) {
  const [achievements, setAchievements] =
    useState<AchievementData[]>(initialAchievements);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] =
    useState<AchievementData | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState("");

  const resetForm = () => {
    setTitle("");
    setIssuer("");
    setDate("");
    setFile("");
    setEditingAchievement(null);
  };

  const openEditDialog = (achievement: AchievementData) => {
    setEditingAchievement(achievement);
    setTitle(achievement.title);
    setIssuer(achievement.issuer);
    setDate(achievement.date);
    setFile(achievement.file);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const achievementData = {
      title,
      issuer,
      date,
      file,
    };

    try {
      const url = editingAchievement
        ? `/api/admin/achievements?id=${editingAchievement.id}`
        : "/api/admin/achievements";
      const method = editingAchievement ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(achievementData),
      });

      if (!res.ok) throw new Error("Failed to save achievement");

      const savedAchievement = await res.json();

      if (editingAchievement) {
        setAchievements(
          achievements.map((a) =>
            a.id === editingAchievement.id ? savedAchievement : a,
          ),
        );
        toast.success("Achievement updated successfully");
      } else {
        setAchievements([savedAchievement, ...achievements]);
        toast.success("Achievement added successfully");
      }

      setIsDialogOpen(false);
      resetForm();
    } catch {
      toast.error("Failed to save achievement");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;

    try {
      const res = await fetch(`/api/admin/achievements?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");

      setAchievements(achievements.filter((a) => a.id !== id));
      toast.success("Achievement deleted successfully");
    } catch {
      toast.error("Failed to delete achievement");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Achievements & Certificates
          </h2>
          <p className="text-muted-foreground">
            Manage your achievements and certificates here.
          </p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Achievement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAchievement
                  ? "Edit Achievement"
                  : "Add New Achievement"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="1st Prize - Competition Name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuer">Issuer *</Label>
                <Input
                  id="issuer"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="Organization or Institution"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Certificate Image Path *</Label>
                <Input
                  id="file"
                  value={file}
                  onChange={(e) => setFile(e.target.value)}
                  placeholder="/certificates/my-certificate.png"
                  required
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading
                  ? "Saving..."
                  : editingAchievement
                    ? "Update Achievement"
                    : "Add Achievement"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {achievements.map((achievement) => (
          <Card key={achievement.id}>
            <CardContent className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                  <Award className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{achievement.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {achievement.issuer}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {new Date(achievement.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditDialog(achievement)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(achievement.id)}
                >
                  <Trash2 className="text-destructive h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {achievements.length === 0 && (
          <div className="text-muted-foreground py-10 text-center">
            No achievements found. Add one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
