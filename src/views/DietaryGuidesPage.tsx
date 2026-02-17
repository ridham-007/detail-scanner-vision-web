"use client";

import React, { useState } from 'react';
import { FileText, Printer, Check, AlertTriangle, X, ChevronRight, Leaf, Database, Wheat, Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

// --- Rich Content Data ---
const cheatSheetData = {
    vegan: {
        title: "Vegan Cheat Sheet",
        description: "The ultimate guide to plant-based eating, hidden ingredients, and easy swaps.",
        icon: <Leaf className="w-8 h-8" />,
        color: "bg-green-100 text-green-700",
        btnColor: "bg-green-600 hover:bg-green-700",
        content: (
            <div className="space-y-6 text-left font-sans">
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                    <h3 className="font-bold text-red-800 text-lg flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-5 h-5" /> Sneaky Non-Vegan Ingredients
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-red-700">
                        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> <strong>Gelatin</strong> (Sweets, Marshmallows)</div>
                        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> <strong>Casein & Whey</strong> (Milk proteins)</div>
                        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> <strong>Isinglass</strong> (Beer/Wine clarifier)</div>
                        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> <strong>L. Cysteine</strong> (Bread additive)</div>
                        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> <strong>Carmine (E120)</strong> (Red food dye)</div>
                        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> <strong>Shellac</strong> (Candy glaze)</div>
                        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> <strong>Vitamin D3</strong> (Often from Lanolin/Wool)</div>
                        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> <strong>Omega-3</strong> (Fish oil, unless algal)</div>
                    </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                    <h3 className="font-bold text-green-800 text-lg flex items-center gap-2 mb-3">
                        <Check className="w-5 h-5" /> Easy Plant-Based Swaps
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-green-200/50 pb-2">
                            <span className="text-red-800 line-through decoration-red-500/50">Cow's Milk</span>
                            <span className="text-muted-foreground"><ChevronRight className="w-4 h-4" /></span>
                            <span className="font-semibold text-green-800">Soy, Oat, Almond, Pea Milk</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-green-200/50 pb-2">
                            <span className="text-red-800 line-through decoration-red-500/50">Eggs (Baking)</span>
                            <span className="text-muted-foreground"><ChevronRight className="w-4 h-4" /></span>
                            <span className="font-semibold text-green-800">Flax egg, Chia seeds, Aquafaba</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-green-200/50 pb-2">
                            <span className="text-red-800 line-through decoration-red-500/50">Honey</span>
                            <span className="text-muted-foreground"><ChevronRight className="w-4 h-4" /></span>
                            <span className="font-semibold text-green-800">Maple Syrup, Agave Nectar</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-red-800 line-through decoration-red-500/50">Gelatin</span>
                            <span className="text-muted-foreground"><ChevronRight className="w-4 h-4" /></span>
                            <span className="font-semibold text-green-800">Agar Agar (Seaweed based)</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    keto: {
        title: "Keto Quick Guide",
        description: "Master the low-carb lifestyle. Know your macros and avoid hidden sugar traps.",
        icon: <Droplet className="w-8 h-8" />,
        color: "bg-blue-100 text-blue-700",
        btnColor: "bg-blue-600 hover:bg-blue-700",
        content: (
            <div className="space-y-6 text-left font-sans">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                        <h4 className="font-bold text-green-700 mb-2">✅ Eat This</h4>
                        <ul className="text-sm text-green-800 space-y-1.5 list-disc pl-4">
                            <li>Meat (Beef, Pork, Lamb)</li>
                            <li>Fatty Fish (Salmon)</li>
                            <li>Eggs (Pastured)</li>
                            <li>Butter & Cream</li>
                            <li>Cheese (Unprocessed)</li>
                            <li>Nuts & Seeds</li>
                            <li>Avocados</li>
                            <li>Low-carb Veggies</li>
                        </ul>
                    </div>
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                        <h4 className="font-bold text-red-700 mb-2">❌ Not This</h4>
                        <ul className="text-sm text-red-800 space-y-1.5 list-disc pl-4">
                            <li>Grains (Wheat, Rice)</li>
                            <li>Sugary Sweets</li>
                            <li>Most Fruits</li>
                            <li>Potatoes / Tubers</li>
                            <li>Beans / Legumes</li>
                            <li>Low-fat Products</li>
                            <li>Sugary Sauces</li>
                            <li>Alc with Sugar</li>
                        </ul>
                    </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <h3 className="font-bold text-blue-800 text-lg mb-2">Hidden Carbs Watchlist</h3>
                    <p className="text-sm text-blue-700 mb-2">Even "savory" foods can knock you out of ketosis.</p>
                    <div className="flex flex-wrap gap-2 text-xs font-bold text-blue-800">
                        <Badge variant="outline" className="border-blue-200 bg-white">Ketchup (5g/tbsp)</Badge>
                        <Badge variant="outline" className="border-blue-200 bg-white">BBQ Sauce (10g/tbsp)</Badge>
                        <Badge variant="outline" className="border-blue-200 bg-white">Balsamic Vinegar</Badge>
                        <Badge variant="outline" className="border-blue-200 bg-white">Cashews (High carb nut)</Badge>
                        <Badge variant="outline" className="border-blue-200 bg-white">Imitation Crab</Badge>
                    </div>
                </div>
            </div>
        )
    },
    glutenFree: {
        title: "Gluten-Free Safe List",
        description: "Navigating grains, labels, and cross-contamination risks.",
        icon: <Wheat className="w-8 h-8" />,
        color: "bg-amber-100 text-amber-700",
        btnColor: "bg-amber-600 hover:bg-amber-700",
        content: (
            <div className="space-y-6 text-left font-sans">
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                    <h3 className="font-bold text-red-800 text-lg flex items-center gap-2 mb-3">
                        <X className="w-5 h-5" /> The "BROW" Rule (Strictly Avoid)
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-white p-2 rounded border border-red-100 font-bold text-red-700">Barley</div>
                        <div className="bg-white p-2 rounded border border-red-100 font-bold text-red-700">Rye</div>
                        <div className="bg-white p-2 rounded border border-red-100 font-bold text-red-700">Oats*</div>
                        <div className="bg-white p-2 rounded border border-red-100 font-bold text-red-700">Wheat</div>
                    </div>
                    <p className="text-xs text-red-600 mt-2 text-center">*Oats are often cross-contaminated unless certified GF.</p>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                    <h3 className="font-bold text-amber-800 text-lg mb-2">Surprising Sources of Gluten</h3>
                    <ul className="space-y-2 text-sm text-amber-900">
                        <li className="flex items-start gap-2">⚠️ <strong>Soy Sauce:</strong> Usually contains wheat. Use Tamari instead.</li>
                        <li className="flex items-start gap-2">⚠️ <strong>Soups/Gravies:</strong> Often thickened with flour roux.</li>
                        <li className="flex items-start gap-2">⚠️ <strong>Processed Meats:</strong> Sausages/burgers may use breadcrumbs as filler.</li>
                        <li className="flex items-start gap-2">⚠️ <strong>Salad Dressings:</strong> Malt vinegar is unsafe (barley).</li>
                        <li className="flex items-start gap-2">⚠️ <strong>Licorice:</strong> Almost always contains wheat flour.</li>
                    </ul>
                </div>
            </div>
        )
    },
    additives: {
        title: "Additive Decoder",
        description: "Translate confusing E-numbers into plain English. Know what's safe.",
        icon: <Database className="w-8 h-8" />,
        color: "bg-purple-100 text-purple-700",
        btnColor: "bg-purple-600 hover:bg-purple-700",
        content: (
            <div className="space-y-6 text-left font-sans">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-muted/50 text-muted-foreground">
                            <th className="text-left p-3 rounded-l-lg">Code</th>
                            <th className="text-left p-3">Common Name</th>
                            <th className="text-left p-3 rounded-r-lg">Risk Level</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        <tr className="group hover:bg-muted/30">
                            <td className="p-3 font-mono font-bold text-red-600">E102</td>
                            <td className="p-3">Tartrazine (Yellow 5)</td>
                            <td className="p-3"><Badge variant="destructive">Avoid</Badge></td>
                        </tr>
                        <tr className="group hover:bg-muted/30">
                            <td className="p-3 font-mono font-bold text-red-600">E250</td>
                            <td className="p-3">Sodium Nitrite</td>
                            <td className="p-3"><Badge variant="destructive">Avoid</Badge></td>
                        </tr>
                        <tr className="group hover:bg-muted/30">
                            <td className="p-3 font-mono font-bold text-yellow-600">E621</td>
                            <td className="p-3">MSG (Monosodium Glutamate)</td>
                            <td className="p-3"><Badge variant="outline" className="border-yellow-500 text-yellow-600">Caution</Badge></td>
                        </tr>
                        <tr className="group hover:bg-muted/30">
                            <td className="p-3 font-mono font-bold text-green-600">E300</td>
                            <td className="p-3">Ascorbic Acid (Vit C)</td>
                            <td className="p-3"><Badge variant="default" className="bg-green-600 hover:bg-green-700">Safe</Badge></td>
                        </tr>
                        <tr className="group hover:bg-muted/30">
                            <td className="p-3 font-mono font-bold text-green-600">E322</td>
                            <td className="p-3">Lecithin (Soy/Sunfl.)</td>
                            <td className="p-3"><Badge variant="default" className="bg-green-600 hover:bg-green-700">Safe</Badge></td>
                        </tr>
                        <tr className="group hover:bg-muted/30">
                            <td className="p-3 font-mono font-bold text-red-600">E951</td>
                            <td className="p-3">Aspartame</td>
                            <td className="p-3"><Badge variant="destructive">Controversial</Badge></td>
                        </tr>
                    </tbody>
                </table>
                <p className="text-xs text-muted-foreground italic text-center">
                    *Risk levels based on latest CSPI and WHO reports. Always consult your doctor for allergies.
                </p>
            </div>
        )
    }
};

export default function DietaryGuidesView() {
    const [selectedSheet, setSelectedSheet] = useState<keyof typeof cheatSheetData | null>(null);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="container mx-auto px-4 py-16 max-w-7xl min-h-screen">
            <div className="text-center mb-16 space-y-6 no-print">
                <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl mb-2 animate-in fade-in zoom-in duration-500">
                    <FileText className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-600">
                    Dietary Cheat Sheets
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Expert-curated, reliable guides for every lifestyle. <br className="hidden md:block" />
                    Click any card to view the full cheat sheet and print it for your fridge.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 no-print">
                {(Object.entries(cheatSheetData) as [keyof typeof cheatSheetData, any][]).map(([key, data]) => (
                    <Card
                        key={key}
                        className="group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 hover:border-transparent cursor-pointer flex flex-col h-full ring-offset-2 hover:ring-2 ring-primary/20"
                        onClick={() => setSelectedSheet(key)}
                    >
                        <div className={`absolute top-0 left-0 w-full h-2 ${data.btnColor}`} />
                        <CardHeader className="text-center pb-4 pt-8">
                            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl mb-4 ${data.color} shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                                {data.icon}
                            </div>
                            <CardTitle className="text-xl font-bold">{data.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 text-center">
                            <p className="text-muted-foreground text-sm leading-relaxed">{data.description}</p>

                            <div className="mt-8 p-6 bg-muted/20 rounded-xl border border-dashed border-muted-foreground/20 group-hover:border-primary/30 transition-colors">
                                <div className="flex flex-col items-center gap-2">
                                    <FileText className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Click to Preview</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0 pb-6">
                            <Button className={`w-full gap-2 shadow-md transition-all ${data.btnColor} text-white border-none`} size="lg">
                                <Printer className="w-4 h-4" /> View & Print
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Print Layout (Hidden on screen) */}
            <div className={`hidden print:block print-only-section ${!selectedSheet ? 'print:hidden' : ''}`}>
                {selectedSheet && (
                    <div className="max-w-[21cm] mx-auto p-10 bg-white min-h-screen">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b-4 border-black pb-6 mb-10">
                            <div className="flex items-center gap-4">
                                <div className="text-5xl">{cheatSheetData[selectedSheet].icon}</div>
                                <div>
                                    <h1 className="text-5xl font-black uppercase tracking-tight leading-none mb-1">
                                        {cheatSheetData[selectedSheet].title}
                                    </h1>
                                    <p className="text-lg font-bold text-gray-600 uppercase tracking-widest">
                                        EaterIQ Official Cheat Sheet
                                    </p>
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <span className="text-3xl font-black text-primary mb-1">🥑 EaterIQ</span>
                                <span className="text-xs font-medium text-gray-400">Scan Smarter • Eat Better</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-10 p-6 bg-gray-50 rounded-2xl border-2 border-gray-100 italic text-2xl text-gray-700 leading-relaxed">
                            "{cheatSheetData[selectedSheet].description}"
                        </div>

                        {/* Content Area */}
                        <div className="print-rich-content">
                            {cheatSheetData[selectedSheet].content}
                        </div>

                        {/* Information Boxes for Print */}
                        {selectedSheet === 'vegan' && (
                            <div className="mt-12 p-6 bg-green-50 border-2 border-green-200 rounded-3xl">
                                <h4 className="font-black text-green-900 text-xl mb-3 uppercase flex items-center gap-2">
                                    <Leaf className="w-6 h-6" /> Pro Tip for your Fridge
                                </h4>
                                <p className="text-green-800 text-lg">
                                    Always check the E-numbers on processed foods. Many additives like E120 (Carmine) and E441 (Gelatin) are derived from animals. Use the EaterIQ app for instant verification!
                                </p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="mt-auto pt-10 border-t-2 border-gray-200 flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <span>&copy; {new Date().getFullYear()} EaterIQ.com</span>
                            <span>Visit EaterIQ.com for more guides</span>
                            <span className="flex items-center gap-1">Trusted by 10,000+ Users <Check className="w-3 h-3" /></span>
                        </div>
                    </div>
                )}
            </div>

            {/* Interactive Modal */}
            <Dialog open={!!selectedSheet} onOpenChange={(open) => !open && setSelectedSheet(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto sm:rounded-3xl p-0 gap-0 overflow-hidden no-print">
                    {selectedSheet && (
                        <>
                            <div className={`p-8 ${cheatSheetData[selectedSheet].color.replace('text-', 'bg-').replace('100', '50')}`}>
                                <DialogHeader>
                                    <div className="flex items-start gap-5">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 bg-white shadow-lg`}>
                                            {cheatSheetData[selectedSheet].icon}
                                        </div>
                                        <div>
                                            <DialogTitle className="text-3xl font-bold mb-2">{cheatSheetData[selectedSheet].title}</DialogTitle>
                                            <DialogDescription className="text-lg text-foreground/80">
                                                {cheatSheetData[selectedSheet].description}
                                            </DialogDescription>
                                        </div>
                                    </div>
                                </DialogHeader>
                            </div>

                            <div className="p-8">
                                {cheatSheetData[selectedSheet].content}
                            </div>

                            <DialogFooter className="p-6 bg-muted/20 border-t flex flex-row items-center justify-between gap-4">
                                <div className="text-xs text-muted-foreground hidden sm:block">
                                    Trusted by 10,000+ users
                                </div>
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <Button variant="outline" onClick={() => setSelectedSheet(null)} className="flex-1 sm:flex-none">Close</Button>
                                    <Button onClick={handlePrint} className={`gap-2 flex-1 sm:flex-none ${cheatSheetData[selectedSheet].btnColor} text-white hover:opacity-90`}>
                                        <Printer className="w-4 h-4" /> Print Guide
                                    </Button>
                                </div>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            <style jsx global>{`
                @media print {
                    @page { 
                        margin: 0 !important; 
                        size: auto; 
                    }
                    
                    /* Hide everything by default */
                    body * {
                        visibility: hidden !important;
                    }

                    /* Reset body styles */
                    body {
                        background: white !important;
                    }

                    /* Show the print area and its children */
                    .print-only-section, 
                    .print-only-section * {
                        visibility: visible !important;
                    }

                    /* Ensure the print area takes up the whole space naturally */
                    .print-only-section {
                        display: block !important;
                        position: relative !important;
                        width: 100% !important;
                        background: white !important;
                        z-index: 9999 !important;
                    }

                    /* Hide specific elements explicitly just in case */
                    .no-print,
                    header,
                    footer,
                    [role="dialog"],
                    .DialogOverlay {
                        display: none !important;
                        visibility: hidden !important;
                    }

                    /* Ensure background colors and images print */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }

                    /* Content specific print tweaks */
                    .print-rich-content {
                        font-size: 1.2rem !important;
                    }
                }
            `}</style>
        </div>
    );
}
