import type { ManseryeokResult } from '@/lib/manseryeok';
import { detectBranchRelations } from '@/lib/manseryeok/compute/relations';
import type { EarthBranch } from '@/lib/manseryeok/constants/ganji';
import { getFlowMonthPillar } from '@/lib/lifestyle/flow-pillar';

const GUAN = new Set(['정관', '편관']);
const CAI = new Set(['정재', '편재']);
const SHISHANG = new Set(['식신', '상관']);

export interface CareerMonthEntry {
  month: number;
  label: string;
  pillar: string;
  stemTenStarKo: string;
  energy: number;
  tags: string[];
  actionItem: string;
}

export interface CareerMonthlyChart {
  year: number;
  months: CareerMonthEntry[];
  peakMonth: number;
  cautionMonth: number | null;
  generatedAt: string;
}

const MONTH_LABELS = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월',
];

function natalBranches(chart: ManseryeokResult): EarthBranch[] {
  const { year, month, day, hour } = chart.pillars;
  return [year.branch, month.branch, day.branch, hour.branch];
}

function branchClash(
  flowBranch: string,
  natal: EarthBranch[],
): boolean {
  const rels = detectBranchRelations([
    ...natal,
    flowBranch as EarthBranch,
  ]);
  return rels.some((r) => r.type === '충' || r.type === '형');
}

function actionForMonth(
  star: string,
  clash: boolean,
  month: number,
): string {
  if (clash && GUAN.has(star)) {
    return '이직·이사·조직 변동은 피하고, 현 자리에서 실적 정리가 우선입니다.';
  }
  if (SHISHANG.has(star)) {
    return '식상(食傷) 기운이 강해 면접·발표에서 말빨이 먹힙니다. 서류·면접은 이번 달 안에 밀어붙이세요.';
  }
  if (GUAN.has(star) && star === '편관') {
    return '편관(偏官)이 들어와 이직하면 야근·압박이 커질 수 있습니다. 무리한 이직보다 존버·내부 이동을 검토하세요.';
  }
  if (GUAN.has(star)) {
    return '관성(官星)이 살아납니다. 승진·이직 제안·면접 타이밍으로 쓰기 좋은 달입니다.';
  }
  if (CAI.has(star)) {
    return '재성(財星)이 들어옵니다. 연봉 협상·성과급·프리랜스 수주에 유리합니다.';
  }
  if (clash) {
    return '원국과 충(沖)이 겹칩니다. 계약·퇴사·중요 결정은 상순보다 하순으로 미루세요.';
  }
  return `${month}월은 커리어 에너지가 평이합니다. 탐구 노트를 쌓으며 다음 달을 준비하세요.`;
}

export function buildCareerMonthlyChart(
  chart: ManseryeokResult,
  year = new Date().getFullYear(),
): CareerMonthlyChart {
  const dm = chart.dayMaster.stem;
  const natal = natalBranches(chart);
  const months: CareerMonthEntry[] = [];

  for (let m = 1; m <= 12; m++) {
    const flow = getFlowMonthPillar(dm, year, m);
    const clash = branchClash(flow.branch, natal);
    const star = flow.stemTenStarKo;

    let energy = 52;
    const tags: string[] = [];

    if (GUAN.has(star)) {
      energy += star === '정관' ? 18 : 8;
      tags.push('관성');
    }
    if (CAI.has(star)) {
      energy += star === '정재' ? 14 : 10;
      tags.push('재성');
    }
    if (SHISHANG.has(star)) {
      energy += 12;
      tags.push('식상');
    }
    if (clash) {
      energy -= 22;
      tags.push('충');
    }
    if (detectBranchRelations([...natal, flow.branch as EarthBranch]).some((r) => r.type === '합')) {
      energy += 8;
      tags.push('합');
    }

    energy = Math.max(0, Math.min(100, energy));

    months.push({
      month: m,
      label: MONTH_LABELS[m - 1],
      pillar: flow.pillar,
      stemTenStarKo: star,
      energy,
      tags,
      actionItem: actionForMonth(star, clash, m),
    });
  }

  const peakMonth = months.reduce((a, b) => (b.energy > a.energy ? b : a)).month;
  const caution = months.filter((x) => x.energy < 40);
  const cautionMonth = caution.length ? caution.reduce((a, b) => (a.energy < b.energy ? a : b)).month : null;

  return {
    year,
    months,
    peakMonth,
    cautionMonth,
    generatedAt: new Date().toISOString(),
  };
}
