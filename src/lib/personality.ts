import type { ManseryeokResult } from '@/lib/manseryeok';
import type { ElementCount } from '@/lib/manseryeok/compute/monthly-command';

const ELEMENT_TRAITS: Record<keyof ElementCount, string> = {
  木: '성장·기획·시작의 에너지가 강합니다. 새 판을 여는 쪽에 가깝습니다.',
  火: '표현·추진·열기가 두드러집니다. 보이는 곳에서 움직일 때 힘이 납니다.',
  土: '안정·중재·운영 감각이 있습니다. 판을 붙잡고 조율하는 타입입니다.',
  金: '분석·결단·기준이 뚜렷합니다. 정리하고 자르는 데 강합니다.',
  水: '통찰·연결·흐름 읽기에 강합니다. 맥락을 먼저 봅니다.',
};

export function dominantElement(ec: ElementCount): keyof ElementCount {
  const entries = (Object.entries(ec) as [keyof ElementCount, number][]).sort(
    (a, b) => b[1] - a[1],
  );
  return entries[0][0];
}

export function buildPersonalitySummary(chart: ManseryeokResult): {
  headline: string;
  body: string;
  tags: string[];
} {
  const dom = dominantElement(chart.elementCount);
  const { dayMaster } = chart;
  const month = chart.monthCommand.dangryeongKo;

  return {
    headline: `${dayMaster.elementKo} 일간 · ${month} 월령`,
    body: `${ELEMENT_TRAITS[dom]} 일간 ${dayMaster.stemKo}(${dayMaster.elementKo})를 중심으로 에너지가 배치되어 있습니다.`,
    tags: [
      `오행 ${dom}↑`,
      chart.pillars.day.stemTenStarKo,
      chart.pillars.month.stemTenStarKo,
    ],
  };
}
