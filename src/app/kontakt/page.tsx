import React from "react";
import type { Metadata } from "next";
import Sidebar from "@/components/layout/Sidebar";
import SectionHeading from "@/components/ui/SectionHeading";
import { Mail, MessageSquare, MapPin, Send } from "lucide-react";
import { ScrollAnimationWrapper } from "@/components/ui/ScrollAnimationWrapper";
import ContactForm from "@/components/kontakt/ContactForm";
import AmbientGrid3DWrapper from "@/components/ui/AmbientGrid3DWrapper";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Stupite u kontakt s nama. Pošaljite nam upit, povratne informacije ili prijedloge za suradnju.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative">
      <AmbientGrid3DWrapper color="#e11d48" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
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
                    <div className="w-8 h-8 rounded-none bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary shrink-0 shadow-sm">
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
                    <div className="w-8 h-8 rounded-none bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary shrink-0 shadow-sm">
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
                    <div className="w-8 h-8 rounded-none bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary shrink-0 shadow-sm">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Lokacija</p>
                      <p className="font-semibold text-slate-200">Zagreb, Hrvatska</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-carbon relative overflow-hidden rounded-none p-6 text-white border-2 border-primary/25 shadow-[var(--shadow-glow-sm)]">
                <h4 className="font-black text-sm uppercase tracking-widest mb-2 font-display">
                  Ekskluzivne dojave
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4 font-bold">
                  Imate povjerljivu informaciju, fotografiju ili video zapis s borilačkog događaja? Naši novinari jamče potpunu anonimnost izvora.
                </p>
                <a
                  href="mailto:dojave@combatportal.hr"
                  className="inline-flex items-center gap-2 rounded-none bg-primary hover:bg-primary/95 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white border-2 border-primary shadow-[var(--shadow-brutalist)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#ffffff] transition-premium cursor-pointer"
                >
                  Pošalji dojavu
                  <Send size={11} />
                </a>
              </div>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper delay={0.2}>
              <div className="surface-card p-6 rounded-none">
                <h2 className="font-display font-black italic text-lg text-white uppercase border-l-4 border-primary pl-3 mb-4">
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
