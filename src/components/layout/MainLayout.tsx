import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <>
            <Header />
            <main style={{ minHeight: '80vh' }}>
                {children}
            </main>
            <Footer />
        </>
    );
}
