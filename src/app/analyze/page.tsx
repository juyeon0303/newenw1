import { AnalyzeClient } from '@/components/AnalyzeClient';

export const metadata = {
  title: '8CODE 분석',
  description: '만세력 좌표와 벤토 리포트.',
};

export default function AnalyzePage() {
  return (
    <div className="analyze-route">
      <AnalyzeClient />
    </div>
  );
}
