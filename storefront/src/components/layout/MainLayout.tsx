import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from '@/components/common/ScrollToTop';
import { getCategories } from '@/services/api/categories';

interface MainLayoutProps {
    children: ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
    const categories = await getCategories();

    return (
        <>
            <ScrollToTop />
            <Header />
            <main>
                {children}
            </main>
            <Footer categories={categories} />
        </>
    );
}
