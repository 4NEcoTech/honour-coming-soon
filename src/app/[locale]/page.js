import { useTranslations } from 'next-intl';
import Body from '../components/Body';

export default function HomePage() {
  const t = useTranslations('HomePage');
  return (
    <div>
      <Body />
    </div>
  );
}
