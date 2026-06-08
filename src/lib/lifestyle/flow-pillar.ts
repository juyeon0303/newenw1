import { HeavenStem, SolarTime } from 'tyme4ts';
import { parsePillar, TEN_STAR_KO, type HeavenStem as HS } from '@/lib/manseryeok/constants/ganji';

export interface FlowPillar {
  pillar: string;
  stemTenStarKo: string;
  branch: string;
}

function stemTenStarKo(dayMaster: HS, pillar: string): string {
  const me = HeavenStem.fromName(dayMaster);
  const { stem } = parsePillar(pillar);
  const hs = HeavenStem.fromName(stem);
  const name = me.getTenStar(hs).getName();
  return TEN_STAR_KO[name] ?? name;
}

/** 해당 연·월의 流月柱 */
export function getFlowMonthPillar(
  dayMaster: HS,
  year: number,
  month: number,
): FlowPillar {
  const st = SolarTime.fromYmdHms(year, month, 15, 12, 0, 0);
  const pillar = st.getLunarHour().getEightChar().getMonth().getName();
  const { branch } = parsePillar(pillar);
  return {
    pillar,
    stemTenStarKo: stemTenStarKo(dayMaster, pillar),
    branch,
  };
}

/** 해당 일의 流日柱 */
export function getFlowDayPillar(
  dayMaster: HS,
  year: number,
  month: number,
  day: number,
): FlowPillar {
  const st = SolarTime.fromYmdHms(year, month, day, 12, 0, 0);
  const pillar = st.getLunarHour().getEightChar().getDay().getName();
  const { branch } = parsePillar(pillar);
  return {
    pillar,
    stemTenStarKo: stemTenStarKo(dayMaster, pillar),
    branch,
  };
}
