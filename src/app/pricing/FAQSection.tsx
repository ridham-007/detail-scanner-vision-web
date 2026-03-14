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

export default function FAQSection() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setActiveIdx(prev => (prev === idx ? null : idx));
  };

  return (
    <section className="max-w-5xl mx-auto mb-16 px-4 ">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-block text-xs font-medium tracking-widest uppercase text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-3">
          Got questions?
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          We&apos;ve got{' '}
          <em className="not-italic text-primary">answers</em>
        </h2>
      </div>

      {/* 2-column card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {faqs.map((faq, idx) => {
          const isActive = activeIdx === idx;
          return (
            <div
              key={idx}
              onClick={() => toggle(idx)}
              className={`
                rounded-2xl border cursor-pointer transition-all duration-200 overflow-hidden
                ${isActive
                  ? 'border-primary shadow-[0_4px_24px_rgba(16,185,129,0.12)]'
                  : 'border-gray-100 hover:border-primary hover:shadow-[0_4px_20px_rgba(16,185,129,0.08)]'
                }
                bg-white
              `}
            >
              {/* Question row */}
              <div className="flex items-start gap-3 p-4">
                <span
                  className={`
                    w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-medium flex-shrink-0 mt-0.5 transition-colors duration-200
                    ${isActive ? 'bg-primary text-primary-foreground' : 'bg-slate-100 text-gray-500'}
                  `}
                >
                  {faq.num}
                </span>
                <span className="flex-1 text-mg font-medium text-gray-900 leading-snug">
                  {faq.q}
                </span>
                <span
                  className={`
                    text-xs flex-shrink-0 mt-0.5 ml-1 transition-all duration-200
                    ${isActive ? 'rotate-45 text-primary' : 'text-gray-400'}
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
                <div className="px-4 pb-4 pl-[3.25rem] border-t border-gray-50">
                  <p className="pt-3 text-sm text-gray-500 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Support CTA */}
      <div className="flex items-center justify-between gap-4 bg-primary/10 border border-primary/20 rounded-2xl px-6 py-4">
        <div>
          <p className="font-medium text-primary text-md">Still have questions?</p>
          <p className="text-sm text-primary/70 mt-0.5">Our support team usually replies within a few hours.</p>
        </div>
        <Link
                  href="/support/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                >
        <button className="bg-primary hover:bg-primary/90 transition-colors text-primary-foreground text-sm font-medium px-5 py-2 rounded-full whitespace-nowrap">
          Contact support →
        </button>
        </Link>
      </div>
    </section>
  );
}