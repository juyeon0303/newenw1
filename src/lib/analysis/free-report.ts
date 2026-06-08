import type { ManseryeokResult, PillarDetail, PillarSlot } from '@/lib/manseryeok';
import type { ElementCount } from '@/lib/manseryeok/compute/monthly-command';
import {
  type Element,
  elementControlledBy,
  elementGeneratedBy,
  elementGenerates,
  elementControls,
} from '@/lib/analysis/elements';

const SLOT_ORDER: PillarSlot[] = ['year', 'month', 'day', 'hour'];

export interface TenStarHit {
  tenStarKo: string;
  slotKo: string;
  layer: '천간' | '지지' | '지장간';
  label: string;
}

export interface FreePrincipleReport {
  dayMaster: {
    stemKo: string;
    elementKo: string;
    strength: 'strong' | 'weak' | 'balanced';
    strengthReason: string;
    monthCommandFit: string;
  };
  gyeokguk: {
    name: string;
    basis: string;
    principle: string;
  };
  yongsin: {
    candidates: string[];
    principle: string;
    disclaimer: string;
  };
  monthCommand: {
    saenglingKo: string;
    dangryeongKo: string;
    principle: string;
  };
  elementBalance: {
    counts: ElementCount;
    dominant: Element;
    principle: string;
  };
  tenStars: TenStarHit[];
  tenStarSummary: { name: string; count: number }[];
  branchRelations: { label: string; note: string }[];
  spirits: string[];
  transparencyNote: string;
}

function asElement(ko: string): Element | null {
  if (ko === '목') return '木';
  if (ko === '화') return '火';
  if (ko === '토') return '土';
  if (ko === '금') return '金';
  if (ko === '수') return '水';
  if (['木', '火', '土', '金', '水'].includes(ko)) return ko as Element;
  return null;
}

function collectTenStars(chart: ManseryeokResult): TenStarHit[] {
  const hits: TenStarHit[] = [];
  for (const slot of SLOT_ORDER) {
    const p: PillarDetail = chart.pillars[slot];
    if (p.unknown) continue;
    if (p.stemTenStarKo && p.stemTenStarKo !== '일간') {
      hits.push({
        tenStarKo: p.stemTenStarKo,
        slotKo: p.slotKo,
        layer: '천간',
        label: `${p.slotKo} 천간 · ${p.stemTenStarKo}`,
      });
    }
    if (p.branchTenStarKo) {
      hits.push({
        tenStarKo: p.branchTenStarKo,
        slotKo: p.slotKo,
        layer: '지지',
        label: `${p.slotKo} 지지 · ${p.branchTenStarKo}`,
      });
    }
    for (const h of p.hiddenStems) {
      if (h.tenStarKo) {
        hits.push({
          tenStarKo: h.tenStarKo,
          slotKo: p.slotKo,
          layer: '지장간',
          label: `${p.slotKo} 지장간 · ${h.tenStarKo}`,
        });
      }
    }
  }
  return hits;
}

function summarizeTenStars(hits: TenStarHit[]): { name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const h of hits) {
    map.set(h.tenStarKo, (map.get(h.tenStarKo) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

function assessStrength(
  dm: Element,
  counts: ElementCount,
  monthDangryeong: Element,
): { strength: 'strong' | 'weak' | 'balanced'; reason: string; monthFit: string } {
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const self = counts[dm];
  const resource = counts[elementGeneratedBy(dm)];
  const output = counts[elementGenerates(dm)];
  const wealth = counts[elementControls(dm)];
  const officer = counts[elementControlledBy(dm)];

  const support = self + resource;
  const drain = output + wealth + officer;
  const ratio = support / total;

  let strength: 'strong' | 'weak' | 'balanced' = 'balanced';
  if (ratio >= 0.45) strength = 'strong';
  else if (ratio <= 0.28) strength = 'weak';

  const reason =
    strength === 'strong'
      ? `일간 ${dm}와 생(生)·同(比) 오행이 전체의 ${Math.round(ratio * 100)}% — 뿌리가 두텁게 잡힌 편으로 봅니다.`
      : strength === 'weak'
        ? `일간 ${dm}와 생(生)·同(比) 오행이 전체의 ${Math.round(ratio * 100)}% — 흩어지거나 눌린 편으로 봅니다.`
        : `일간 ${dm} 주변 오행이 균형에 가깝습니다(지지·생 ${Math.round(ratio * 100)}%).`;

  const monthFit =
    monthDangryeong === dm
      ? `월령 당령이 일간과 같아 계절 기운을 직접 받는(得令) 축입니다.`
      : elementGenerates(monthDangryeong) === dm
        ? `월령이 일간을 생(生)하는 계절 — 외부 환경이 밀어주는 힘이 있습니다.`
        : elementControls(monthDangryeong) === dm
          ? `월령이 일간을 극(剋)하는 계절 — 환경 압력이 먼저 느껴질 수 있습니다.`
          : `월령과 일간이 직접 생극하지 않아, 팔자 내부 배치가 상대적으로 더 중요해집니다.`;

  return { strength, reason, monthFit };
}

const GYEOKGUK_PRINCIPLE =
  '격국(成格)은 월령·통근·지지 배합까지 봐야 합니다. 월간 천간 십성 하나만으로 단정하지 않습니다.';

function deriveGyeokguk(chart: ManseryeokResult): { name: string; basis: string; principle: string } {
  const monthStemStar = chart.pillars.month.stemTenStarKo;
  const visible = collectTenStars(chart).filter((h) => h.layer !== '지장간');
  const summary = summarizeTenStars(visible);
  const monthCount = summary.find((s) => s.name === monthStemStar)?.count ?? 0;
  const top = summary[0];

  if (!monthStemStar || monthStemStar === '비견') {
    return {
      name: '잡격·미정',
      basis: '월간 십성만으로는 격명을 붙이기 어렵습니다.',
      principle: GYEOKGUK_PRINCIPLE,
    };
  }

  if (top && top.count >= 2 && top.name === monthStemStar) {
    return {
      name: `${top.name}격 (후보)`,
      basis: `월간 ${monthStemStar}이고, 겉팔자(천간·지지)에 ${top.name}이 ${top.count}회 — 한 십성이 겉을 이끄는 패턴입니다.`,
      principle: GYEOKGUK_PRINCIPLE,
    };
  }

  if (top && top.count >= 2 && top.name !== monthStemStar) {
    return {
      name: `${top.name}격 (후보)`,
      basis: `월간은 ${monthStemStar}(${monthCount}회)이나, 겉팔자 분포상 ${top.name}이 ${top.count}회로 우세해 ${top.name}격을 후보로 둡니다.`,
      principle: GYEOKGUK_PRINCIPLE,
    };
  }

  return {
    name: '잡격·미정',
    basis: `월간 천간 십성 ${monthStemStar}만으로는 ${monthStemStar}격(成格)이라 말하기 어렵습니다. (겉팔자 ${monthStemStar} ${monthCount}회)`,
    principle: GYEOKGUK_PRINCIPLE,
  };
}

function deriveYongsin(
  dm: Element,
  strength: 'strong' | 'weak' | 'balanced',
): { candidates: string[]; principle: string; disclaimer: string } {
  const officer = elementControlledBy(dm);
  const output = elementGenerates(dm);
  const wealth = elementControls(dm);
  const resource = elementGeneratedBy(dm);
  const peer = dm;

  const candidates =
    strength === 'strong'
      ? [
          `${officer}(관) — 과한 기운을 제어`,
          `${output}(식상) — 표현·생산으로 분출`,
          `${wealth}(재) — 결과물로 전환`,
        ]
      : strength === 'weak'
        ? [
            `${resource}(인) — 뿌리 보강`,
            `${peer}(비겁) — 동료·자원 연대`,
          ]
        : [
            `${resource}(인) 또는 ${output}(식상)`,
            `균형형은 대운·세운 흐름에 따라 우선순위가 바뀝니다`,
          ];

  return {
    candidates,
    principle:
      strength === 'strong'
        ? '신강(身强)으로 볼 때 — 극·泄·耗(관·식상·재)으로 균형을 맞추는 축을 후보로 둡니다.'
        : strength === 'weak'
          ? '신약(身弱)으로 볼 때 — 생·扶(인·비겁)으로 뿌리를 보강하는 축을 후보로 둡니다.'
          : '중화에 가깝다면, 계절·대운에서 들어오는 오행을 함께 봐야 합니다.',
    disclaimer:
      '용신은 학파·시대·사건 맥락마다 결론이 갈립니다. 여기서는 알고리즘이 쓰는 단순 희용 규칙만 공개합니다.',
  };
}

const RELATION_NOTES: Partial<Record<string, string>> = {
  충: '방향이 갑자기 바뀌거나 충돌이 드러나기 쉬운 축',
  합: '연결·조율·합의가 유리해지는 축',
  형: '마찰·규칙·책임이 걸리는 축',
  해: '오해·누수·작은 손해에 주의',
  파: '기존 틀이 깨지고 재조립되는 축',
  원진: '가까우면서도 어긋나는 관계 패턴',
};

export function buildFreePrincipleReport(chart: ManseryeokResult): FreePrincipleReport {
  const dm =
    asElement(chart.dayMaster.elementKo) ??
    asElement(chart.dayMaster.element) ??
    '木';
  const monthEl = asElement(chart.monthCommand.dangryeongKo) ?? '土';
  const counts = chart.elementCount;
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const dominant = (Object.entries(counts) as [Element, number][]).sort(
    (a, b) => b[1] - a[1],
  )[0][0];

  const { strength, reason, monthFit } = assessStrength(dm, counts, monthEl);
  const tenStars = collectTenStars(chart);

  return {
    dayMaster: {
      stemKo: chart.dayMaster.stemKo,
      elementKo: chart.dayMaster.elementKo,
      strength,
      strengthReason: reason,
      monthCommandFit: monthFit,
    },
    gyeokguk: deriveGyeokguk(chart),
    yongsin: deriveYongsin(dm, strength),
    monthCommand: {
      saenglingKo: chart.monthCommand.saenglingKo,
      dangryeongKo: chart.monthCommand.dangryeongKo,
      principle: `월지 ${chart.pillars.month.branchKo}의 당령(本气)은 ${chart.monthCommand.dangryeongKo}입니다. 사주 해석에서 월령은 계절의 주인공이라, 일간이 그 계절 안에서 어떻게 버티는지를 먼저 봅니다.`,
    },
    elementBalance: {
      counts,
      dominant,
      principle: chart.meta.timeUnknown
        ? `확정된 삼주(6글자) 중 ${dominant} 오행이 ${Math.round((counts[dominant] / total) * 100)}%로 가장 많습니다. 시주가 빠져 있어 비율은 시간 확인 후 달라질 수 있습니다.`
        : `전체 8글자 중 ${dominant} 오행이 ${Math.round((counts[dominant] / total) * 100)}%로 가장 많습니다. 많다고 무조건 좋거나 나쁜 것이 아니라, "어떤 에너지가 무대를 차지하는가"를 보여줍니다.`,
    },
    tenStars,
    tenStarSummary: summarizeTenStars(tenStars),
    branchRelations: chart.branchRelations.map((r) => ({
      label: r.label,
      note: RELATION_NOTES[r.type] ?? '지지 간 상호작용',
    })),
    spirits: chart.extraSpirits.map((s) => s.name),
    transparencyNote: chart.meta.timeUnknown
      ? '출생 시각 미상 — 년·월·일주(삼주)만 반영했습니다. 시주·시간 의존 항목은 시간 확인 후 다시 산출하세요.'
      : '위 내용은 만세력 좌표에서 기계적으로 도출한 명리 원리 요약입니다. 정답이 아니라 증명 가능한 출발점입니다.',
  };
}
