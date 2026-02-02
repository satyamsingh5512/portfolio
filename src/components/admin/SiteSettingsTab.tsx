"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type {
  AboutSettings,
  CTASettings,
  ContactSettings,
  FooterSettings,
  HeroSettings,
  SiteSettings,
  SocialLink,
} from "@/lib/supabase";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SiteSettingsTabProps {
  initialSettings: SiteSettings;
}

export function SiteSettingsTab({ initialSettings }: SiteSettingsTabProps) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [saving, setSaving] = useState<string | null>(null);

  const saveSection = async (key: keyof SiteSettings) => {
    setSaving(key);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: settings[key] }),
      });

      if (!res.ok) throw new Error("Failed to save");
      toast.success(
        `${key.charAt(0).toUpperCase() + key.slice(1)} settings saved!`,
      );
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(null);
    }
  };

  // Hero Settings
  const updateHero = (updates: Partial<HeroSettings>) => {
    setSettings((prev) => ({ ...prev, hero: { ...prev.hero, ...updates } }));
  };

  const addHeroSkill = () => {
    updateHero({ skills: [...settings.hero.skills, { name: "", href: "" }] });
  };

  const removeHeroSkill = (index: number) => {
    updateHero({ skills: settings.hero.skills.filter((_, i) => i !== index) });
  };

  const updateHeroSkill = (
    index: number,
    field: "name" | "href",
    value: string,
  ) => {
    const newSkills = [...settings.hero.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    updateHero({ skills: newSkills });
  };

  // About Settings
  const updateAbout = (updates: Partial<AboutSettings>) => {
    setSettings((prev) => ({ ...prev, about: { ...prev.about, ...updates } }));
  };

  // Social Links
  const addSocialLink = () => {
    setSettings((prev) => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        { name: "", href: "", icon: "website" as const },
      ],
    }));
  };

  const removeSocialLink = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  };

  const updateSocialLink = (
    index: number,
    field: keyof SocialLink,
    value: string,
  ) => {
    setSettings((prev) => {
      const newLinks = [...prev.socialLinks];
      newLinks[index] = { ...newLinks[index], [field]: value } as SocialLink;
      return { ...prev, socialLinks: newLinks };
    });
  };

  // Contact Settings
  const updateContact = (updates: Partial<ContactSettings>) => {
    setSettings((prev) => ({
      ...prev,
      contact: { ...prev.contact, ...updates },
    }));
  };

  // CTA Settings
  const updateCTA = (updates: Partial<CTASettings>) => {
    setSettings((prev) => ({ ...prev, cta: { ...prev.cta, ...updates } }));
  };

  // Footer Settings
  const updateFooter = (updates: Partial<FooterSettings>) => {
    setSettings((prev) => ({
      ...prev,
      footer: { ...prev.footer, ...updates },
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Site Settings</h2>
        <p className="text-muted-foreground">
          Manage your portfolio content. Changes are saved to Supabase.
        </p>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="cta">CTA</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        {/* Hero Settings */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Configure your landing page introduction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-name">Name</Label>
                  <Input
                    id="hero-name"
                    value={settings.hero.name}
                    onChange={(e) => updateHero({ name: e.target.value })}
                    placeholder="Your Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-title">Title</Label>
                  <Input
                    id="hero-title"
                    value={settings.hero.title}
                    onChange={(e) => updateHero({ title: e.target.value })}
                    placeholder="Full Stack Developer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero-avatar">Avatar URL</Label>
                <Input
                  id="hero-avatar"
                  value={settings.hero.avatar}
                  onChange={(e) => updateHero({ avatar: e.target.value })}
                  placeholder="/assets/avatar.png"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero-description">
                  Description (HTML supported)
                </Label>
                <Textarea
                  id="hero-description"
                  value={settings.hero.description}
                  onChange={(e) => updateHero({ description: e.target.value })}
                  placeholder="I am a <b>Full Stack Developer</b>..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-resume">Resume URL</Label>
                  <Input
                    id="hero-resume"
                    value={settings.hero.resumeUrl}
                    onChange={(e) => updateHero({ resumeUrl: e.target.value })}
                    placeholder="/assets/resume.pdf"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-contact">Contact URL</Label>
                  <Input
                    id="hero-contact"
                    value={settings.hero.contactUrl}
                    onChange={(e) => updateHero({ contactUrl: e.target.value })}
                    placeholder="/contact"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Skills</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addHeroSkill}
                  >
                    <Plus className="mr-1 h-4 w-4" /> Add Skill
                  </Button>
                </div>
                <div className="space-y-2">
                  {settings.hero.skills.map((skill, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={skill.name}
                        onChange={(e) =>
                          updateHeroSkill(index, "name", e.target.value)
                        }
                        placeholder="React"
                        className="flex-1"
                      />
                      <Input
                        value={skill.href}
                        onChange={(e) =>
                          updateHeroSkill(index, "href", e.target.value)
                        }
                        placeholder="https://react.dev"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeHeroSkill(index)}
                      >
                        <Trash2 className="text-destructive h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => saveSection("hero")}
                disabled={saving === "hero"}
              >
                {saving === "hero" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Hero Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Settings */}
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Section</CardTitle>
              <CardDescription>Configure your about me section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about-name">Name</Label>
                <Input
                  id="about-name"
                  value={settings.about.name}
                  onChange={(e) => updateAbout({ name: e.target.value })}
                  placeholder="Your Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about-description">Description</Label>
                <Textarea
                  id="about-description"
                  value={settings.about.description}
                  onChange={(e) => updateAbout({ description: e.target.value })}
                  placeholder="Hey, I'm..."
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about-skills">Skills (comma-separated)</Label>
                <Input
                  id="about-skills"
                  value={settings.about.skills.join(", ")}
                  onChange={(e) =>
                    updateAbout({
                      skills: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="React, TypeScript, Node.js"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {settings.about.skills.map((skill, i) => (
                    <Badge key={i} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => saveSection("about")}
                disabled={saving === "about"}
              >
                {saving === "about" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save About Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>
                Configure your social media links
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSocialLink}
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Link
                </Button>
              </div>

              <div className="space-y-3">
                {settings.socialLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={link.name}
                      onChange={(e) =>
                        updateSocialLink(index, "name", e.target.value)
                      }
                      placeholder="LinkedIn"
                      className="w-32"
                    />
                    <Select
                      value={link.icon}
                      onValueChange={(value) =>
                        updateSocialLink(index, "icon", value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Icon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="github">GitHub</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="twitter">Twitter/X</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="website">Website</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={link.href}
                      onChange={(e) =>
                        updateSocialLink(index, "href", e.target.value)
                      }
                      placeholder="https://..."
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSocialLink(index)}
                    >
                      <Trash2 className="text-destructive h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => saveSection("socialLinks")}
                disabled={saving === "socialLinks"}
              >
                {saving === "socialLinks" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Social Links
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Section</CardTitle>
              <CardDescription>Configure your contact page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-title">Title</Label>
                <Input
                  id="contact-title"
                  value={settings.contact.title}
                  onChange={(e) => updateContact({ title: e.target.value })}
                  placeholder="Contact"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-description">Description</Label>
                <Textarea
                  id="contact-description"
                  value={settings.contact.description}
                  onChange={(e) =>
                    updateContact({ description: e.target.value })
                  }
                  placeholder="Get in touch..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={settings.contact.email}
                  onChange={(e) => updateContact({ email: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>

              <Button
                onClick={() => saveSection("contact")}
                disabled={saving === "contact"}
              >
                {saving === "contact" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Contact Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CTA Settings */}
        <TabsContent value="cta">
          <Card>
            <CardHeader>
              <CardTitle>Call to Action</CardTitle>
              <CardDescription>
                Configure the CTA section at the bottom of your page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cta-image">Profile Image URL</Label>
                <Input
                  id="cta-image"
                  value={settings.cta.profileImage}
                  onChange={(e) => updateCTA({ profileImage: e.target.value })}
                  placeholder="/assets/avatar.png"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cta-pretext">Pre-text Message</Label>
                <Input
                  id="cta-pretext"
                  value={settings.cta.preText}
                  onChange={(e) => updateCTA({ preText: e.target.value })}
                  placeholder="Hey, you scrolled this far..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cta-linktext">Button Text</Label>
                  <Input
                    id="cta-linktext"
                    value={settings.cta.linkText}
                    onChange={(e) => updateCTA({ linkText: e.target.value })}
                    placeholder="Book a Free Call"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta-callink">Cal.com Link</Label>
                  <Input
                    id="cta-callink"
                    value={settings.cta.calLink}
                    onChange={(e) => updateCTA({ calLink: e.target.value })}
                    placeholder="username/meeting"
                  />
                </div>
              </div>

              <Button
                onClick={() => saveSection("cta")}
                disabled={saving === "cta"}
              >
                {saving === "cta" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save CTA Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Footer Settings */}
        <TabsContent value="footer">
          <Card>
            <CardHeader>
              <CardTitle>Footer</CardTitle>
              <CardDescription>Configure your footer content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="footer-developer">Developer Name</Label>
                <Input
                  id="footer-developer"
                  value={settings.footer.developer}
                  onChange={(e) => updateFooter({ developer: e.target.value })}
                  placeholder="Your Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer-text">Footer Text</Label>
                <Input
                  id="footer-text"
                  value={settings.footer.text}
                  onChange={(e) => updateFooter({ text: e.target.value })}
                  placeholder="Design & Developed by"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer-copyright">Copyright Text</Label>
                <Input
                  id="footer-copyright"
                  value={settings.footer.copyright}
                  onChange={(e) => updateFooter({ copyright: e.target.value })}
                  placeholder="All rights reserved."
                />
              </div>

              <Button
                onClick={() => saveSection("footer")}
                disabled={saving === "footer"}
              >
                {saving === "footer" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Footer Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
