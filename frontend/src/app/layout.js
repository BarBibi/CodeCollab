import { AuthProvider } from '../context/AuthContext';

export const metadata = {
    title: 'CodeCollab',
    description: 'A social network for developers',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}