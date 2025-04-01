import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { getServerSession } from 'next-auth';
import ClarityScript from '../components/ClarityScript';
import Footer from '../components/Footer';
import Header from '../components/Header';
import '../globals.css';
import AuthProvider from '../utils/SessionProvider';
// import { GoogleTagManager } from '@next/third-parties/google'
import { GoogleAnalytics } from '@next/third-parties/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
export const metadata = {
  title: 'Honour Career Junction | Opportunities with U in mind',
  description:
    'HCJ will cater to job seekers, students, employers/companies, and educational institutions focusing on promoting diversity and inclusivity in the workplace',
};

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  // Ensure that the incoming `locale` is valid
  // if (!routing.locales.includes(locale)) {
  //   notFound();
  // }
  const session = await getServerSession();

  const messages = await getMessages();
  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.svg" />
        <ClarityScript clarityId="pu8viyya3u" />
        {/* <GoogleTagManager gtmId="G-WY0986PD4K"/> */}
        <GoogleAnalytics gaId="G-WY0986PD4K" />
        <script src="https://meet.jit.si/external_api.js" async></script>

      </head>
      <body>
        <AuthProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <Header />
            <main>
              <NextIntlClientProvider messages={messages}>
                {children}
              </NextIntlClientProvider>
            </main>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
