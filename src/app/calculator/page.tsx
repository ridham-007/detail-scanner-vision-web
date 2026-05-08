import Calculator from '@/views/Calculator';

export const metadata = {
    title: 'Calculator - EaterIQ',
    description: 'Use our free online calculators for accurate, instant results.',
    keywords: 'Health calculators, calculators, nutrition calculator, BMI calculator, BMI calculator online, BMI calculator free, BMI calculator app',
    alternates: {
    canonical: 'https://www.eateriq.com/calculator/',
  },
};

export default function Page() {
    return <Calculator />;
}
