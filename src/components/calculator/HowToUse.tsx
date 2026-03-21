import React from "react";
import {
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";
import "@/prose.css";

interface Step {
  title: string;
  description: string;
}

interface Formula {
  title: string;
  formula: string;
  explanation: string;
}

interface Resource {
  label: string;
  url: string;
}

interface HowToUseProps {
  title: string;
  intro: string;
  steps?: Step[];
  benefits?: string[];
  useCases?: string[];
  whoShouldUse?: string;
  formulas?: Formula[];
  tips?: string[];
  limitations?: string[];
  resources?: Resource[];
  uniqueInsights?: string;
}

const HowToUse: React.FC<HowToUseProps> = ({
  title,
  intro,
  steps,
  benefits,
  useCases,
  whoShouldUse,
  formulas,
  tips,
  limitations,
  resources,
  uniqueInsights,
}) => {
  return (
    <div className="space-y-10 text-foreground">
      {/* Intro Section */}
      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          {title}
        </h2>

        <div className="prose max-w-none whitespace-pre-line leading-relaxed text-muted-foreground">
          {intro}
        </div>
      </div>

      {/* Steps Section */}
      {steps && steps.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            Step-by-Step Guide
          </h3>

          <div className="grid gap-6 md:grid-cols-1">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex gap-4 rounded-[22px] border border-orange-100/70 bg-orange-50/35 p-4 transition-all hover:shadow-[var(--shadow-soft)]"
              >
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary/10 text-primary font-bold rounded-full">
                  {index + 1}
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-foreground">
                    {step.title}
                  </h4>

                  <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Benefits & Use Cases Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {benefits && benefits.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              Benefits
            </h3>

            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {useCases && useCases.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              Common Use Cases
            </h3>

            <ul className="space-y-3">
              {useCases.map((useCase, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Who Should Use */}
      {whoShouldUse && (
        <div className="rounded-[24px] border border-orange-100/80 bg-orange-50/60 p-6">
          <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">
            Who is this for?
          </h3>

          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {whoShouldUse}
          </p>
        </div>
      )}

      {/* Formulas Section */}
      {formulas && formulas.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            Formulas Used
          </h3>

          <div className="grid gap-4">
            {formulas.map((item, index) => (
              <div
                key={index}
                className="overflow-x-auto rounded-[24px] bg-foreground p-6 text-white"
              >
                <div className="font-mono text-sm mb-2 text-green-400">
                  {item.title}
                </div>

                <div className="text-lg font-bold mb-3 font-mono whitespace-pre-line">
                  {item.formula}
                </div>

                <p className="whitespace-pre-line text-xs leading-relaxed text-white/70">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips & Limitations */}
      <div className="grid md:grid-cols-2 gap-8">
        {tips && tips.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Pro Tips
            </h3>

            <ul className="space-y-2">
              {tips.map((tip, index) => (
                <li
                  key={index}
                  className="flex gap-2 text-sm text-muted-foreground"
                >
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {limitations && limitations.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              Limitations
            </h3>

            <ul className="space-y-2">
              {limitations.map((limit, index) => (
                <li
                  key={index}
                  className="flex gap-2 text-sm text-muted-foreground"
                >
                  <span className="w-1.5 h-1.5 bg-primary/80 rounded-full mt-2 flex-shrink-0" />
                  {limit}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Unique Insights */}
      {uniqueInsights && (
        <div className="border-l-4 border-primary py-2 pl-6">
          <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">
            Unique Insight
          </h3>

          <p className="whitespace-pre-line italic text-muted-foreground">
            {uniqueInsights}
          </p>
        </div>
      )}

      {/* Resources */}
      {resources && resources.length > 0 && (
        <div className="border-t border-orange-100/80 pt-6">
          <h3 className="text-xl font-semibold tracking-tight text-foreground mb-4 uppercase">
            Helpful Resources
          </h3>

          <div className="flex flex-wrap gap-4">
            {resources.map((res, index) => (
              <a
                key={index}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  text-primary 
                  hover:text-primary/80 
                  text-sm font-medium 
                  hover:underline 
                  flex items-center gap-1
                "
              >
                {res.label}
                <ChevronRight className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HowToUse;
