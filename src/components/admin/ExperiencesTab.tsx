"use client";

import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, Calendar, Edit, MapPin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export interface ExperienceData {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string[];
  technologies: string[];
  location: string;
  companyUrl?: string;
  logo?: string;
  createdAt: string;
}

interface ExperiencesTabProps {
  initialExperiences: ExperienceData[];
}

export function ExperiencesTab({ initialExperiences }: ExperiencesTabProps) {
  const [experiences, setExperiences] =
    useState<ExperienceData[]>(initialExperiences);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] =
    useState<ExperienceData | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [location, setLocation] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [logo, setLogo] = useState("");

  const resetForm = () => {
    setCompany("");
    setPosition("");
    setStartDate("");
    setEndDate("");
    setIsCurrent(false);
    setDescription("");
    setTechnologies("");
    setLocation("");
    setCompanyUrl("");
    setLogo("");
    setEditingExperience(null);
  };

  const openEditDialog = (experience: ExperienceData) => {
    setEditingExperience(experience);
    setCompany(experience.company);
    setPosition(experience.position);
    setStartDate(experience.startDate);
    setEndDate(experience.endDate);
    setIsCurrent(experience.isCurrent);
    setDescription(experience.description.join("\n"));
    setTechnologies(experience.technologies.join(", "));
    setLocation(experience.location);
    setCompanyUrl(experience.companyUrl || "");
    setLogo(experience.logo || "");
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const experienceData = {
      company,
      position,
      startDate,
      endDate: isCurrent ? "Present" : endDate,
      isCurrent,
      description: description.split("\n").filter((d) => d.trim()),
      technologies: technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      location,
      companyUrl: companyUrl || undefined,
      logo: logo || undefined,
    };

    try {
      const url = editingExperience
        ? `/api/admin/experiences?id=${editingExperience.id}`
        : "/api/admin/experiences";
      const method = editingExperience ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(experienceData),
      });

      if (!res.ok) throw new Error("Failed to save experience");

      const savedExperience = await res.json();

      if (editingExperience) {
        setExperiences(
          experiences.map((e) =>
            e.id === editingExperience.id ? savedExperience : e,
          ),
        );
        toast.success("Experience updated successfully");
      } else {
        setExperiences([savedExperience, ...experiences]);
        toast.success("Experience added successfully");
      }

      setIsDialogOpen(false);
      resetForm();
    } catch {
      toast.error("Failed to save experience");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    try {
      const res = await fetch(`/api/admin/experiences?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");

      setExperiences(experiences.filter((e) => e.id !== id));
      toast.success("Experience deleted successfully");
    } catch {
      toast.error("Failed to delete experience");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Work Experience</h2>
          <p className="text-muted-foreground">
            Manage your work experience entries here.
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
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingExperience ? "Edit Experience" : "Add New Experience"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company Name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Software Engineer"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyUrl">Company URL</Label>
                  <Input
                    id="companyUrl"
                    value={companyUrl}
                    onChange={(e) => setCompanyUrl(e.target.value)}
                    placeholder="https://company.com"
                    type="url"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="June 2024"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="August 2024"
                    disabled={isCurrent}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isCurrent"
                  checked={isCurrent}
                  onCheckedChange={setIsCurrent}
                />
                <Label htmlFor="isCurrent">Currently working here</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description (one point per line) *
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Developed feature X&#10;Improved performance by Y%&#10;Led team of Z engineers"
                  required
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="technologies">
                  Technologies (comma-separated) *
                </Label>
                <Input
                  id="technologies"
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                  placeholder="React, TypeScript, Node.js, AWS"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Company Logo Path</Label>
                <Input
                  id="logo"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="/company/company-logo.svg"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading
                  ? "Saving..."
                  : editingExperience
                    ? "Update Experience"
                    : "Add Experience"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {experiences.map((experience) => (
          <Card key={experience.id}>
            <CardContent className="py-4">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                    <Briefcase className="text-primary h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="text-lg font-medium">
                        {experience.position}
                      </h3>
                      {experience.isCurrent && (
                        <Badge variant="default">Current</Badge>
                      )}
                    </div>
                    <p className="text-primary text-sm font-medium">
                      {experience.company}
                    </p>
                    <div className="text-muted-foreground mt-1 flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {experience.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {experience.startDate} - {experience.endDate}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {experience.technologies.slice(0, 6).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {experience.technologies.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{experience.technologies.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(experience)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(experience.id)}
                  >
                    <Trash2 className="text-destructive h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {experiences.length === 0 && (
          <div className="text-muted-foreground py-10 text-center">
            No experiences found. Add one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
