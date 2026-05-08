import DietaryGuidesView from '@/views/DietaryGuidesPage';

export const metadata = {
    title: 'Dietary Cheat Sheets - Vegan, Keto, GF & More | EaterIQ',
    description: 'Download free printable dietary cheat sheets for Vegan, Keto, Gluten-Free, and Additive safety. Expert-curated food guides for easier healthy eating.',
    keywords: 'vegan cheat sheet, keto food list, gluten free list, additive decoder, e-numbers guide, nutrition printables',
    alternates: {
    canonical: 'https://www.eateriq.com/dietary-guides/',
  },
};

export default function Page() {
    return <DietaryGuidesView />;
}
