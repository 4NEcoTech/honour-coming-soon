import { useTranslations } from 'next-intl';
import Body from '../components/Body';

export default function HomePage() {
  const t = useTranslations('HomePage');
  return (
    <div>
      {/* <h1>{t('About')}</h1>
      <Link href="/about">{t('Other')}</Link> */}
      <Body />
    </div>
  );
}
