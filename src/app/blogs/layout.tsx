import { Header } from '../../components/ui/header';
import { Footer } from '../../components/ui/footer';

export default function BlogsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
} 