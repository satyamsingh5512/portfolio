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
import { Textarea } from "@/components/ui/textarea";
import { Edit, Plus, Quote, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export interface QuoteData {
  id: string;
  quote: string;
  author: string;
  createdAt: string;
}

interface QuotesTabProps {
  initialQuotes: QuoteData[];
}

export function QuotesTab({ initialQuotes }: QuotesTabProps) {
  const [quotes, setQuotes] = useState<QuoteData[]>(initialQuotes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  const resetForm = () => {
    setQuote("");
    setAuthor("");
    setEditingQuote(null);
  };

  const openEditDialog = (quoteData: QuoteData) => {
    setEditingQuote(quoteData);
    setQuote(quoteData.quote);
    setAuthor(quoteData.author);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const quoteData = {
      quote,
      author,
    };

    try {
      const url = editingQuote
        ? `/api/admin/quotes?id=${editingQuote.id}`
        : "/api/admin/quotes";
      const method = editingQuote ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quoteData),
      });

      if (!res.ok) throw new Error("Failed to save quote");

      const savedQuote = await res.json();

      if (editingQuote) {
        setQuotes(
          quotes.map((q) => (q.id === editingQuote.id ? savedQuote : q)),
        );
        toast.success("Quote updated successfully");
      } else {
        setQuotes([savedQuote, ...quotes]);
        toast.success("Quote added successfully");
      }

      setIsDialogOpen(false);
      resetForm();
    } catch {
      toast.error("Failed to save quote");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quote?")) return;

    try {
      const res = await fetch(`/api/admin/quotes?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");

      setQuotes(quotes.filter((q) => q.id !== id));
      toast.success("Quote deleted successfully");
    } catch {
      toast.error("Failed to delete quote");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Quotes</h2>
          <p className="text-muted-foreground">
            Manage your favorite quotes displayed on the site.
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
              Add Quote
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingQuote ? "Edit Quote" : "Add New Quote"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quote">Quote *</Label>
                <Textarea
                  id="quote"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="The quote text..."
                  required
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author Name"
                  required
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading
                  ? "Saving..."
                  : editingQuote
                    ? "Update Quote"
                    : "Add Quote"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {quotes.map((quoteItem) => (
          <Card key={quoteItem.id}>
            <CardContent className="py-4">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="flex flex-1 items-start gap-4">
                  <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                    <Quote className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-lg italic">
                      &ldquo;{quoteItem.quote}&rdquo;
                    </p>
                    <p className="text-muted-foreground mt-2 text-sm">
                      — {quoteItem.author}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(quoteItem)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(quoteItem.id)}
                  >
                    <Trash2 className="text-destructive h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {quotes.length === 0 && (
          <div className="text-muted-foreground py-10 text-center">
            No quotes found. Add one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
