"use client";

import FadeIn from "@/components/animations/FadeIn";
import Container from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Send, TerminalSquare } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export default function CPPage() {
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !purpose || (purpose === "others" && !customMessage)) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/cp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose, customMessage }),
      });

      if (!res.ok) {
        throw new Error("Failed to send request");
      }

      setStatus("success");
      toast.success("Your request has been sent to my terminal.");
      setEmail("");
      setPurpose("");
      setCustomMessage("");
    } catch (err) {
      console.error(err);
      setStatus("error");
      toast.error("Failed to send request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="flex min-h-[80vh] flex-col justify-center py-10 sm:py-16">
      <FadeIn>
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-3 text-center sm:space-y-4">
            <h1 className="flex items-center justify-center gap-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
              <TerminalSquare className="text-primary h-8 w-8 sm:h-10 sm:w-10" />
              <span>Restricted Access</span>
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg font-medium sm:text-xl">
              "Why do you want to get my coding profile?"
            </p>
          </div>

          <Separator className="mx-auto max-w-2xl" />

          <div className="bg-card/30 shadow-primary/5 mx-auto max-w-lg rounded-2xl border p-6 shadow-xl backdrop-blur-sm sm:p-8">
            {status === "success" ? (
              <FadeIn className="space-y-4 py-8 text-center">
                <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
                <h2 className="text-2xl font-bold">Request Sent!</h2>
                <p className="text-muted-foreground">
                  Your enquiry has been delivered to my personal terminal. I'll
                  get back to you shortly.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setStatus("idle")}
                  className="mt-4"
                >
                  Send another request
                </Button>
              </FadeIn>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">
                    Your Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="hacker@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background/50 h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose" className="text-sm font-semibold">
                    What's your motivation?
                  </Label>
                  <Select value={purpose} onValueChange={setPurpose} required>
                    <SelectTrigger className="bg-background/50 h-12">
                      <SelectValue placeholder="Select a reason..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hiring">👨‍💼 Hiring Purpose</SelectItem>
                      <SelectItem value="collaboration">
                        🤝 Collaboration / Project
                      </SelectItem>
                      <SelectItem value="stalking">👀 Just Stalking</SelectItem>
                      <SelectItem value="others">✨ Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {purpose === "others" && (
                  <FadeIn>
                    <div className="space-y-2">
                      <Label
                        htmlFor="customMessage"
                        className="text-sm font-semibold"
                      >
                        Type your reason
                      </Label>
                      <Textarea
                        id="customMessage"
                        placeholder="Tell me more..."
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        required
                        className="bg-background/50 min-h-[120px]"
                      />
                    </div>
                  </FadeIn>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="text-md h-12 w-full font-bold transition-transform hover:scale-[1.02] active:scale-95"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="border-primary-foreground h-4 w-4 animate-spin rounded-full border-b-2"></span>
                      Transmitting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-5 w-5" />
                      Submit Request
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </FadeIn>
    </Container>
  );
}
