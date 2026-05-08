import UserGuide from '@/views/UserGuide';

export const metadata = {
    title: 'User Guide - EaterIQ',
    description: 'Step-by-step playbooks to scan smarter, compare foods, and turn every grocery trip into healthier choices.',
    keywords: 'food scanner, nutrition analysis, health score, food insights, ingredient checker, calorie scanner, food label scanner',
    alternates: {
    canonical: 'https://www.eateriq.com/user-guide/',
  },
};

export default function Page() {
    return <UserGuide />;
}
