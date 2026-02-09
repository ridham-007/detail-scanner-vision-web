import React from "react";
import { CheckCircle2, ChevronRight, BookOpen, Lightbulb, AlertTriangle } from "lucide-react";

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
        <div className="space-y-10 text-gray-700">

            {/* Intro Section */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-primary" />
                    {title}
                </h2>
                <div className="prose prose-green max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                    {intro}
                </div>
            </div>

            {/* Steps Section */}
            {steps && steps.length > 0 && (
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Step-by-Step Guide</h3>
                    <div className="grid gap-6 md:grid-cols-1">
                        {steps.map((step, index) => (
                            <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 transition-all hover:shadow-md">
                                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary/10 text-primary font-bold rounded-full">
                                    {index + 1}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-gray-900">{step.title}</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{step.description}</p>
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
                        <h3 className="text-xl font-semibold text-gray-900">Benefits</h3>
                        <ul className="space-y-3">
                            {benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {useCases && useCases.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Common Use Cases</h3>
                        <ul className="space-y-3">
                            {useCases.map((useCase, index) => (
                                <li key={index} className="flex items-start gap-3 text-sm text-gray-600">
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
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Who is this for?</h3>
                    <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-line">{whoShouldUse}</p>
                </div>
            )}

            {/* Formulas Section */}
            {formulas && formulas.length > 0 && (
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Formulas Used</h3>
                    <div className="grid gap-4">
                        {formulas.map((item, index) => (
                            <div key={index} className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto">
                                <div className="font-mono text-sm mb-2 text-green-400">{item.title}</div>
                                <div className="text-lg font-bold mb-3 font-mono whitespace-pre-line">{item.formula}</div>
                                <p className="text-gray-400 text-xs leading-relaxed whitespace-pre-line">{item.explanation}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tips & Limitations Grid */}
            <div className="grid md:grid-cols-2 gap-8">
                {tips && tips.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-yellow-500" />
                            Pro Tips
                        </h3>
                        <ul className="space-y-2">
                            {tips.map((tip, index) => (
                                <li key={index} className="text-sm text-gray-600 flex gap-2">
                                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {limitations && limitations.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                            Limitations
                        </h3>
                        <ul className="space-y-2">
                            {limitations.map((limit, index) => (
                                <li key={index} className="text-sm text-gray-600 flex gap-2">
                                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                                    {limit}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Unique Insights */}
            {uniqueInsights && (
                <div className="border-l-4 border-primary pl-6 py-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Unique Insight</h3>
                    <p className="text-gray-600 italic whitespace-pre-line">{uniqueInsights}</p>
                </div>
            )}

            {/* Resources */}
            {resources && resources.length > 0 && (
                <div className="pt-6 border-t">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Helpful Resources</h3>
                    <div className="flex flex-wrap gap-4">
                        {resources.map((res, index) => (
                            <a
                                key={index}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 text-sm font-medium hover:underline flex items-center gap-1"
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
