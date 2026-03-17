'use client';

import { useState } from 'react';
import Link from "next/link";

const faqs = [
  {
    num: '01',
    q: 'Can I cancel anytime?',
    a: 'Yes! Cancel anytime — your access continues until the end of your billing period. No questions asked, no hidden fees.',
  },
  {
    num: '02',
    q: 'What happens to my data if I downgrade?',
    a: "Your scan history is preserved, but you'll only see the most recent 7 days on the free plan. Upgrade again to restore full access.",
  },
  {
    num: '03',
    q: 'Do you offer refunds?',
    a: 'We offer a 7-day money-back guarantee for new subscribers. Contact support within 7 days for a full refund — no hassle.',
  },
  {
    num: '04',
    q: 'How do family accounts work?',
    a: 'Premium subscribers can invite up to 5 family members. Each member gets their own profile with personalized insights and dietary alerts.',
  },
  {
    num: '05',
    q: 'What payment methods do you accept?',
    a: 'All major credit/debit cards (Visa, Mastercard, Amex) and UPI payments. All transactions are fully encrypted and secure.',
  },
  {
    num: '06',
    q: 'Is there a free trial?',
    a: 'Our Free plan is an unlimited trial — 5 scans/day forever, no credit card needed. Upgrade anytime when you\'re ready for more.',
  },
  {
    num: '07',
    q: 'Can I switch plans later?',
    a: 'Absolutely. Upgrade instantly for immediate access. Downgrades take effect at your next billing cycle, so you always get what you paid for.',
  },
];

function FAQCard({ faq, idx, isActive, onToggle }: {
  faq: typeof faqs[0];
  idx: number;
  isActive: boolean;
  onToggle: (idx: number) => void;
}) {
  return (
    <div
      onClick={() => onToggle(idx)}
      className={`
        overflow-hidden rounded-[12px] border cursor-pointer transition-all duration-200
        ${isActive
          ? 'border-orange-200/80 bg-white shadow-[var(--shadow-warm)]'
          : 'border-white/70 bg-white/90 hover:border-orange-200/80 hover:shadow-[var(--shadow-soft)]'
        }
      `}
    >
      {/* Question row */}
      <div className="flex items-center gap-3 p-4">
        <span
          className={`
            w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-medium flex-shrink-0 mt-0.5 transition-colors duration-200
            ${isActive ? 'bg-primary text-primary-foreground' : 'bg-orange-100 text-orange-700'}
          `}
        >
          {faq.num}
        </span>
        <span className="flex-1 text-mg font-medium text-foreground leading-snug">
          {faq.q}
        </span>
        <span
          className={`
            text-xl flex-shrink-0 mt-0.5 ml-1 transition-all duration-200
            ${isActive ? 'rotate-45 text-primary' : 'text-orange-300'}
          `}
        >
          +
        </span>
      </div>

      {/* Answer */}
      <div
        className={`
          transition-all duration-300 ease-in-out overflow-hidden
          ${isActive ? 'max-h-40' : 'max-h-0'}
        `}
      >
        <div className="border-t border-orange-100/70 px-4 pb-4 pl-[3.25rem]">
          <p className="pt-3 text-sm leading-relaxed text-muted-foreground">
            {faq.a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setActiveIdx(prev => (prev === idx ? null : idx));
  };

  // Split FAQs into two columns
  const leftCol = faqs.filter((_, i) => i % 2 === 0);
  const rightCol = faqs.filter((_, i) => i % 2 !== 0);

  // Map column-local index back to global index
  const leftIndices = faqs.map((_, i) => i).filter(i => i % 2 === 0);
  const rightIndices = faqs.map((_, i) => i).filter(i => i % 2 !== 0);

  return (
    <section className="max-w-5xl mx-auto mb-16 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="mb-3 inline-block rounded-full border border-orange-200/70 bg-orange-50 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-orange-800">
          Got questions?
        </span>
        <h2 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
          We&apos;ve got{' '}
          <em className="not-italic text-primary">answers</em>
        </h2>
      </div>

      {/* Two independent flex columns */}
      <div className="hidden sm:flex gap-3 mb-6 items-start">
        {/* Left column */}
        <div className="flex flex-col gap-3 flex-1">
          {leftCol.map((faq, colIdx) => {
            const globalIdx = leftIndices[colIdx];
            return (
              <FAQCard
                key={globalIdx}
                faq={faq}
                idx={globalIdx}
                isActive={activeIdx === globalIdx}
                onToggle={toggle}
              />
            );
          })}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-3 flex-1">
          {rightCol.map((faq, colIdx) => {
            const globalIdx = rightIndices[colIdx];
            return (
              <FAQCard
                key={globalIdx}
                faq={faq}
                idx={globalIdx}
                isActive={activeIdx === globalIdx}
                onToggle={toggle}
              />
            );
          })}
        </div>
      </div>

      {/* Single column on mobile */}
      <div className="flex flex-col gap-3 mb-6 sm:hidden">
        {faqs.map((faq, idx) => (
          <FAQCard
            key={idx}
            faq={faq}
            idx={idx}
            isActive={activeIdx === idx}
            onToggle={toggle}
          />
        ))}
      </div>

      {/* Support CTA */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-[28px] border border-orange-200/80 bg-[linear-gradient(180deg,rgba(255,250,244,0.9),rgba(255,237,213,0.4))] px-5 py-4 shadow-product sm:flex-row sm:items-center sm:px-6">
        <div>
          <p className="text-md font-medium text-foreground">Still have questions?</p>
          <p className="mt-0.5 text-sm text-muted-foreground">Our support team usually replies within a few hours.</p>
        </div>
        <Link
          href="/support/"
          className="inline-flex w-full items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary sm:w-auto"
        >
          <button className="w-full whitespace-nowrap rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-warm)] transition-colors hover:bg-primary/90 sm:w-auto">
            Contact support →
          </button>
        </Link>
      </div>
    </section>
  );
}