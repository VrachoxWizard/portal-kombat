import React from "react";
import type { Metadata } from "next";
import Sidebar from "@/components/layout/Sidebar";
import SectionHeading from "@/components/ui/SectionHeading";
import { Mail, MessageSquare, MapPin, Send } from "lucide-react";
import { ScrollAnimationWrapper } from "@/components/ui/ScrollAnimationWrapper";
import ContactForm from "@/components/kontakt/ContactForm";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Stupite u kontakt s nama. Pošaljite nam upit, povratne informacije ili prijedloge za suradnju.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ScrollAnimationWrapper>
            <SectionHeading
              title="Kontaktirajte Nas"
              description="Imate pitanje, ponudu za suradnju ili vijest iz borilačkog svijeta? Javite nam se!"
              icon={Mail}
              as="h1"
            />
          </ScrollAnimationWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <ScrollAnimationWrapper delay={0.1} className="space-y-6">
              <div className="surface-card p-6 space-y-4">
                <h2 className="font-display font-bold text-lg text-white uppercase border-l-4 border-primary pl-3">
                  Informacije
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  CombatPortal HR je vodeći regionalni nezavisni borilački medij. Naš tim nastoji osigurati najbrže i najtočnije informacije iz svijeta MMA-a, boksa i kickboksa.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <Mail size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">E-mail adresa</p>
                      <a href="mailto:info@combatportal.hr" className="hover:text-primary transition-premium font-semibold">
                        info@combatportal.hr
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <MessageSquare size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Suradnja & Marketing</p>
                      <a href="mailto:marketing@combatportal.hr" className="hover:text-primary transition-premium font-semibold">
                        marketing@combatportal.hr
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Lokacija</p>
                      <p className="font-semibold text-slate-200">Zagreb, Hrvatska</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-carbon relative overflow-hidden rounded-[var(--radius-card)] p-6 text-white border border-primary/15 shadow-[var(--shadow-glow-sm)]">
                <h4 className="font-extrabold text-sm uppercase tracking-wider mb-2 font-display">
                  Ekskluzivne dojave
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Imate povjerljivu informaciju, fotografiju ili video zapis s borilačkog događaja? Naši novinari jamče potpunu anonimnost izvora.
                </p>
                <a
                  href="mailto:dojave@combatportal.hr"
                  className="inline-flex items-center gap-2 rounded bg-primary/95 hover:bg-primary px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-white transition-premium"
                >
                  Pošalji dojavu
                  <Send size={11} />
                </a>
              </div>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper delay={0.2}>
              <div className="surface-card p-6">
                <h2 className="font-display font-bold text-lg text-white uppercase border-l-4 border-primary pl-3 mb-4">
                  Pošaljite poruku
                </h2>
                <ContactForm />
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>

        <ScrollAnimationWrapper direction="right" delay={0.2} className="lg:col-span-1">
          <Sidebar />
        </ScrollAnimationWrapper>
      </div>
    </div>
  );
}
