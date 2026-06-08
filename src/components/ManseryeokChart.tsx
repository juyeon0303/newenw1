'use client';

import type { ManseryeokResult, PillarDetail } from '@/lib/manseryeok';
import { useLocale } from '@/contexts/LocaleContext';
import { formatTenStarDisplay } from '@/lib/i18n/ten-star-labels';
import type { Locale } from '@/lib/i18n/locale';

const ELEMENT_CLASS: Record<string, string> = {
  木: 'el-wood',
  火: 'el-fire',
  土: 'el-earth',
  金: 'el-metal',
  水: 'el-water',
};

function stemElement(stem: string): string {
  const map: Record<string, string> = {
    甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土',
    庚: '金', 辛: '金', 壬: '水', 癸: '水',
  };
  return map[stem] ?? '土';
}

function branchElement(branch: string): string {
  const map: Record<string, string> = {
    寅: '木', 卯: '木', 巳: '火', 午: '火', 辰: '土', 戌: '土', 丑: '土', 未: '土',
    申: '金', 酉: '金', 子: '水', 亥: '水',
  };
  return map[branch] ?? '土';
}

function PillarColumn({
  p,
  isDay,
  locale,
}: {
  p: PillarDetail;
  isDay?: boolean;
  locale: Locale;
}) {
  const psych = locale !== 'ko';
  const stemTen = isDay
    ? '일간(나)'
    : psych
      ? formatTenStarDisplay(p.stemTenStarKo, locale)
      : p.stemTenStarKo;
  const branchTen = psych
    ? formatTenStarDisplay(p.branchTenStarKo, locale)
    : p.branchTenStarKo;

  if (p.unknown) {
    return (
      <div className="pillar-col pillar-col--unknown">
        <div className="pillar-col__label">{p.slotKo}</div>
        <div className="pillar-col__unknown-label">시간모름</div>
        <p className="pillar-col__unknown-note">시주 미산출</p>
      </div>
    );
  }

  return (
    <div className="pillar-col">
      <div className="pillar-col__label">{p.slotKo}</div>
      <div className="pillar-col__ten">{stemTen}</div>
      <div className={`pillar-col__stem ${ELEMENT_CLASS[stemElement(p.stem)]}`}>
        {p.stemKo}
        <span className="pillar-col__hanja">{p.stem}</span>
      </div>
      <div className={`pillar-col__branch ${ELEMENT_CLASS[branchElement(p.branch)]}`}>
        {p.branchKo}
        <span className="pillar-col__hanja">{p.branch}</span>
      </div>
      <div className="pillar-col__ten">{branchTen}</div>
      <div className="pillar-col__meta">
        {p.hiddenStems.map((h) => (
          <span key={`${h.stem}-${h.tenStarKo}`} className="pillar-col__hidden">
            {h.stemKo}·{psych ? formatTenStarDisplay(h.tenStarKo, locale) : h.tenStarKo}
          </span>
        ))}
      </div>
      <div className="pillar-col__stage">
        <span>{p.stageBongKo}</span>
        <span className="muted">({p.stageGeoKo})</span>
      </div>
      <div className="pillar-col__naphae">{p.naphae}</div>
      {isDay && <div className="pillar-col__daymark">일간</div>}
      {(p.voidByDay || p.voidByYear) && (
        <div className="pillar-col__void">
          {p.voidByDay && '공망(日) '}
          {p.voidByYear && '공망(年)'}
        </div>
      )}
    </div>
  );
}

interface Props {
  chart: ManseryeokResult;
}

export function ManseryeokChart({ chart }: Props) {
  const { locale } = useLocale();
  const { year, month, day, hour } = chart.pillars;
  const ec = chart.elementCount;

  return (
    <div className="chart">
      <div className="chart__meta">
        <span>{chart.meta.lunarDate}</span>
        {chart.meta.timeUnknown ? (
          <span className="chart__time-unknown">시간모름 · 삼주 기준</span>
        ) : (
          <span>
            보정 {chart.meta.correctedTime.totalCorrectionMinutes > 0 ? '+' : ''}
            {Math.round(chart.meta.correctedTime.totalCorrectionMinutes)}분
          </span>
        )}
        <span>월령 {chart.monthCommand.saenglingKo}({chart.monthCommand.dangryeongKo})</span>
      </div>

      <div className="chart__pillars">
        <PillarColumn p={hour} locale={locale} />
        <PillarColumn p={day} isDay locale={locale} />
        <PillarColumn p={month} locale={locale} />
        <PillarColumn p={year} locale={locale} />
      </div>

      <div className="chart__summary">
        <div>
          <strong>오행</strong>{' '}
          목{ec.木} 화{ec.火} 토{ec.土} 금{ec.金} 수{ec.水}
        </div>
        <div>
          <strong>공망</strong> 년 {chart.void.byYear.join('')} · 일 {chart.void.byDay.join('')}
        </div>
        {chart.extraSpirits.length > 0 && (
          <div>
            <strong>신살</strong>{' '}
            {chart.extraSpirits.map((s) => s.name).join(', ')}
          </div>
        )}
        {chart.branchRelations.length > 0 && (
          <div>
            <strong>지지 관계</strong>{' '}
            {chart.branchRelations.map((r) => r.label).join(' · ')}
          </div>
        )}
      </div>

      <details className="chart__luck">
        <summary>
          대운 · 세운 ({chart.luckMeta.daewoonSu}세起, {chart.luckMeta.isReverse ? '역행' : '順行'})
          {chart.luckMeta.provisional ? ' · 잠정' : ''}
        </summary>
        {chart.luckMeta.provisional && (
          <p className="chart__provisional-note">
            출생 시각 미상 — 대운·세운은 정오(12:00) 기준 잠정값입니다. 시간 확인 후 다시 산출하세요.
          </p>
        )}
        <div className="luck-grid">
          {chart.daewoon.map((d) => (
            <div key={d.startAge} className="luck-cell">
              <div className="luck-cell__age">{d.startAge}세</div>
              <div className="luck-cell__pillar">{d.pillar}</div>
              <div className="luck-cell__sub">{d.stemTenStarKo} · {d.stageBongKo}</div>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
