"use client";

import LandingNavbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import Wrapper from "@/components/landing/global/wrapper";
import AnimationContainer from "@/components/landing/global/animation-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone, Instagram } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to send message");
      }

      toast.success("Message sent! We'll get back to you soon.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again or email info@moodify.site");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-background">
      <LandingNavbar />

      <section className="pt-28 pb-16">
        <Wrapper>
          <AnimationContainer animation="fadeUp" delay={0.1}>
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Get in touch</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
              Contact us
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl">
              Have a question about tokenized real estate, partnerships, or investing? Send us a message and we&apos;ll get back to you.
            </p>
          </AnimationContainer>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_400px]">
            <AnimationContainer animation="fadeUp" delay={0.2}>
              <form onSubmit={handleSubmit} className="rounded-2xl border border-border/60 bg-card/40 p-6 md:p-8 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-background/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background/50"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="How can we help?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message"
                    placeholder="Tell us more..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    required
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send message"}
                </Button>
              </form>
            </AnimationContainer>

            <AnimationContainer animation="fadeUp" delay={0.3}>
              <div className="rounded-2xl border border-border/60 bg-card/40 p-6 md:p-8 space-y-6 lg:sticky lg:top-28">
                <h2 className="text-lg font-semibold">Contact information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <a
                        href="mailto:info@moodify.site"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        info@moodify.site
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <a
                        href="tel:+233532818725"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        +233 532-818-725
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Office</p>
                      <p className="text-sm text-muted-foreground">
                        East Legon, Accra, Ghana
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Instagram className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Instagram</p>
                      <Link
                        href="https://www.instagram.com/moodifyliving/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        @moodifyliving
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </AnimationContainer>
          </div>
        </Wrapper>
      </section>

      <Footer />
    </main>
  );
}
