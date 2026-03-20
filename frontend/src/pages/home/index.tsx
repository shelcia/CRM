import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FEATURES, HIGHLIGHTS } from "./constants";
import { Badge } from "@/components/ui/badge";

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 py-24 max-w-3xl mx-auto">
        <Badge className="border border-primary/30 bg-primary/10 text-xs font-medium text-primary mb-6 rounded-full px-3 py-1 h-fit">
          Under development · contributions welcome
        </Badge>

        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-5">
          The CRM that <span className="text-primary">actually</span> stays out
          of your way
        </h1>

        <p className="text-muted-foreground text-lg mb-10 max-w-xl">
          Tiny CRM gives your team contacts, tickets, todos and email — nothing
          more, nothing less. Simple, fast, open source.
        </p>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Button
            size="lg"
            onClick={() => navigate("/signup")}
            className="gap-2"
          >
            Get started free <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/login")}
          >
            Sign in
          </Button>
        </div>

        <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {HIGHLIGHTS.map((h) => (
            <li
              key={h}
              className="flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              {h}
            </li>
          ))}
        </ul>
      </section>

      {/* Divider */}
      <div className="border-t" />

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-10">
          Everything you need
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border bg-card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                {f.icon}
              </div>
              <h3 className="font-semibold text-sm">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <div className="border-t">
        <section className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold mb-3">Ready to get organised?</h2>
          <p className="text-muted-foreground mb-8">
            Create your free account in seconds — no credit card required.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/signup")}
            className="gap-2"
          >
            Create free account <ArrowRight className="h-4 w-4" />
          </Button>
        </section>
      </div>
    </div>
  );
};

export default Homepage;
