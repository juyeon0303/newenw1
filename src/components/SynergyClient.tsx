'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { calculateManseryeok, type ManseryeokInput, type ManseryeokResult } from '@/lib/manseryeok';
import { buildSynergyReport } from '@/lib/philosophy/synergy';
import { BirthForm, type BirthFormValues } from '@/components/BirthForm';
import {
  buildSynergyShareUrl,
  encodeChartParam,
  parseChartParam,
} from '@/lib/session/chart-share';
import { useLocale } from '@/contexts/LocaleContext';
import { ELEMENT_I18N, t } from '@/lib/i18n/ui-strings';

function inputToForm(input: ManseryeokInput): Partial<BirthFormValues> {
  return {
    year: input.year,
    month: input.month,
    day: input.day,
    hour: input.hour,
    minute: input.minute ?? 0,
    gender: input.gender,
    yajasi: input.yajasi ?? false,
    longitude: input.timeCorrection?.longitude ?? 126.978,
  };
}

function calc(input: ManseryeokInput | null): ManseryeokResult | null {
  if (!input) return null;
  try {
    return calculateManseryeok(input);
  } catch {
    return null;
  }
}

export function SynergyClient() {
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const [inputA, setInputA] = useState<ManseryeokInput | null>(() =>
    parseChartParam(searchParams.get('a')),
  );
  const [inputB, setInputB] = useState<ManseryeokInput | null>(() =>
    parseChartParam(searchParams.get('b')),
  );
  const [copied, setCopied] = useState(false);

  const chartA = useMemo(() => calc(inputA), [inputA]);
  const chartB = useMemo(() => calc(inputB), [inputB]);
  const report = useMemo(
    () => (chartA && chartB ? buildSynergyReport(chartA, chartB, locale) : null),
    [chartA, chartB, locale],
  );

  function handleShare() {
    if (!inputA || !inputB) return;
    const url = buildSynergyShareUrl(inputA, inputB);
    void navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="synergy-page">
      <header className="synergy-page__header">
        <h1>{t('synergy_title', locale)}</h1>
        <p className="synergy-page__lead">{t('synergy_lead', locale)}</p>
      </header>

      <div className="synergy-forms">
        <section>
          <h2>{t('synergy_person_a', locale)}</h2>
          <BirthForm
            onSubmit={setInputA}
            initial={inputA ? inputToForm(inputA) : undefined}
          />
        </section>
        <section>
          <h2>{t('synergy_person_b', locale)}</h2>
          <BirthForm
            onSubmit={setInputB}
            initial={inputB ? inputToForm(inputB) : undefined}
          />
        </section>
      </div>

      {report && chartA && chartB && (
        <section className="synergy-result">
          <div className="synergy-result__toolbar">
            <button type="button" className="btn btn--ghost btn--sm" onClick={handleShare}>
              {copied ? t('synergy_copied', locale) : t('synergy_share', locale)}
            </button>
          </div>

          <div className="synergy-dashboard__bento">
            <article className="synergy-card synergy-card--score">
              <h3>{t('synergy_score', locale)}</h3>
              <p className="synergy-card__score">{report.synergyScore}</p>
              <p className="synergy-card__summary">{report.summaryKo}</p>
            </article>

            <article className="synergy-card synergy-card--wide">
              <h3>{t('synergy_element_gap', locale)}</h3>
              <ul className="synergy-elements">
                {report.elementComplements.map((c) => (
                  <li key={c.element}>
                    <span>{ELEMENT_I18N[c.element][locale]}</span>
                    <div className="synergy-elements__bars">
                      <div
                        className="synergy-elements__bar synergy-elements__bar--a"
                        style={{ width: `${Math.min(100, c.countA * 20)}%` }}
                        title="A"
                      />
                      <div
                        className="synergy-elements__bar synergy-elements__bar--b"
                        style={{ width: `${Math.min(100, c.countB * 20)}%` }}
                        title="B"
                      />
                    </div>
                    <span className="synergy-elements__gap">
                      {c.gap > 0 ? `+${c.gap}` : c.gap}
                    </span>
                  </li>
                ))}
              </ul>
              {report.topCollaborator && (
                <p className="synergy-collaborator">
                  <strong>{t('synergy_collaborator', locale)}</strong>
                  <br />
                  {report.topCollaborator.collaboratorType}
                </p>
              )}
            </article>

            <article className="synergy-card synergy-card--wide">
              <h3>{t('synergy_cross_relations', locale)}</h3>
              {report.crossBranchRelations.length === 0 ? (
                <p className="synergy-muted">—</p>
              ) : (
                <ul className="synergy-relations">
                  {report.crossBranchRelations.map((r, i) => (
                    <li key={`${r.type}-${r.label}-${i}`}>
                      <span className="synergy-relations__type">{r.type}</span>
                      {r.label}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </div>

          <p className="synergy-share-hint">
            {locale === 'ko'
              ? `공유 링크: /synergy?a=${encodeChartParam(inputA!)}&b=${encodeChartParam(inputB!)}`
              : `Share: /synergy?a=…&b=…`}
          </p>
        </section>
      )}
    </div>
  );
}
