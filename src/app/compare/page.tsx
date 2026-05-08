import ProductComparisonPage from '@/views/ProductComparisonPage';

export const metadata = {
    title: 'Food Battle - Compare Products',
    description: 'Compare two products side-by-side to find the healthier option.',
    alternates: {
    canonical: 'https://www.eateriq.com/compare/',
  },
};

export default function Page() {
    return <ProductComparisonPage />;
}
