'use client';

import { useEffect, useState } from 'react';
import type { ManseryeokResult } from '@/lib/manseryeok';
import { EXPLORE_AXES, buildExplorePrompts } from '@/lib/philosophy/content';
import {
  sortedHiddenTenStarKeys,
  sortedRelationKeys,
  sortedSpiritKeys,
  sortedTenStarKeys,
  TEN_STAR_TEMPLATES,
  SPIRIT_TEMPLATES,
  relationHint,
  tierLabel,
  PRIORITY_CRITERIA,
  type ExploreTier,
  type ExploreBundle,
} from '@/lib/philosophy/build-explore';
import {
  getRelationCommentary,
  getSpiritCommentary,
  getTenStarCommentary,
  buildDaewoonCommentary,
  buildDaewoonMetaNote,
  buildMonthCommandCommentary,
  MONTH_COMMAND_QUESTIONS,
} from '@/lib/philosophy/commentary';
import { buildDaewoonQuestions } from '@/lib/philosophy/templates/daewoon';
import { CommentaryBlock } from '@/components/CommentaryBlock';
import type { ExploreSessionApi } from '@/hooks/useExploreSession';
import type { DailyPrompt } from '@/lib/session/daily-prompt';
import {
  hiddenItemKey,
  relationItemKey,
  spiritItemKey,
  tenStarItemKey,
  daewoonItemKey,
  monthCommandItemKey,
} from '@/lib/session/item-keys';
import { TodayExploreCard } from '@/components/TodayExploreCard';
import { ExploreProgressBar } from '@/components/ExploreProgressBar';
import { ExploreNotePad } from '@/components/ExploreNotePad';
import type { ExploreNavigateTarget } from '@/components/ExploreClient';

interface ProgressProps {
  visited: number;
  total: number;
  notes: number;
  memories: number;
  canContinue: boolean;
  onContinue: () => void;
}

interface Props {
  chart: ManseryeokResult;
  bundle: ExploreBundle;
  session: ExploreSessionApi;
  dailyPrompt: DailyPrompt | null;
  progress: ProgressProps;
  navigateTo: ExploreNavigateTarget | null;
  onNavigateConsumed: () => void;
}

type MainTab = 'relation' | 'tenstar' | 'spirit' | 'daewoon' | 'axis';

function TierBadge({ tier }: { tier: ExploreTier }) {
  return <span className={`explore__tier explore__tier--${tier}`}>{tierLabel(tier)}</span>;
}

interface QuestionRow {
  id: string;
  text: string;
  tag?: string;
}

function ExploreQuestions({
  questions,
  itemLabel,
  session,
}: {
  questions: QuestionRow[];
  itemLabel: string;
  session: ExploreSessionApi;
}) {
  return (
    <ol className="explore__question-list">
      {questions.map((q) => (
        <li
          key={q.id}
          className={q.tag === 'mirror' ? 'explore__q--mirror' : ''}
        >
          <div className="explore__q-row">
            <span>{q.text}</span>
            <button
              type="button"
              className={`explore__bookmark ${session.isBookmarked(q.id) ? 'explore__bookmark--on' : ''}`}
              aria-label={session.isBookmarked(q.id) ? '북마크 해제' : '북마크'}
              onClick={() =>
                session.toggleBookmark({
                  id: q.id,
                  text: q.text,
                  itemLabel,
                  savedAt: Date.now(),
                })
              }
            >
              {session.isBookmarked(q.id) ? '★' : '☆'}
            </button>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ExplorePanel({
  chart,
  bundle,
  session,
  dailyPrompt,
  progress,
  navigateTo,
  onNavigateConsumed,
}: Props) {

  const relationKeys = sortedRelationKeys(bundle);
  const tenStarKeys = sortedTenStarKeys(bundle);
  const hiddenTenStarKeys = sortedHiddenTenStarKeys(bundle);
  const spiritKeys = sortedSpiritKeys(bundle);

  const defaultTab: MainTab =
    relationKeys.length > 0 ? 'relation' : tenStarKeys.length > 0 ? 'tenstar' : 'spirit';

  const [mainTab, setMainTab] = useState<MainTab>(defaultTab);
  const [axisId, setAxisId] = useState(EXPLORE_AXES[0].id);
  const [selectedRelation, setSelectedRelation] = useState<string | null>(null);
  const [selectedTenStar, setSelectedTenStar] = useState<string | null>(null);
  const [selectedHidden, setSelectedHidden] = useState<string | null>(null);
  const [selectedSpirit, setSelectedSpirit] = useState<string | null>(null);
  const [showHidden, setShowHidden] = useState(false);

  const currentDaewoonIdx = chart.luckMeta.currentDaewoonIndex;
  const [selectedDaewoonAge, setSelectedDaewoonAge] = useState<number | null>(null);

  const activeDaewoonAge =
    selectedDaewoonAge ?? chart.daewoon[currentDaewoonIdx]?.startAge ?? chart.daewoon[0]?.startAge ?? null;
  const activeDaewoon =
    activeDaewoonAge != null
      ? chart.daewoon.find((d) => d.startAge === activeDaewoonAge) ?? null
      : null;
  const activeDaewoonIdx =
    activeDaewoon != null
      ? chart.daewoon.findIndex((d) => d.startAge === activeDaewoon.startAge)
      : -1;

  const axis = EXPLORE_AXES.find((a) => a.id === axisId) ?? EXPLORE_AXES[0];
  const generalPrompts = buildExplorePrompts(chart.dayMaster.stemKo);

  const activeRelation = selectedRelation ?? relationKeys[0] ?? null;
  const activeTenStar = selectedTenStar ?? tenStarKeys[0] ?? null;
  const activeHidden = selectedHidden ?? hiddenTenStarKeys[0] ?? null;
  const activeSpirit = selectedSpirit ?? spiritKeys[0] ?? null;

  const relationEntry = activeRelation ? bundle.relationByKey.get(activeRelation) : null;
  const relationHit = relationEntry?.hits[0] ?? null;
  const tenStarEntry = activeTenStar ? bundle.tenStarByName.get(activeTenStar) : null;
  const tenStarDef = activeTenStar ? TEN_STAR_TEMPLATES[activeTenStar] : null;
  const hiddenEntry = activeHidden ? bundle.hiddenTenStarByName.get(activeHidden) : null;
  const hiddenDef = activeHidden ? TEN_STAR_TEMPLATES[activeHidden] : null;
  const spiritEntry = activeSpirit ? bundle.spiritByName.get(activeSpirit) : null;
  const spiritDef = activeSpirit ? SPIRIT_TEMPLATES[activeSpirit] : null;

  function jumpToOverview(item: (typeof bundle.overview)[0]) {
    if (item.category === 'relation') {
      setMainTab('relation');
      setSelectedRelation(item.key);
    } else if (item.category === 'tenstar') {
      setMainTab('tenstar');
      setSelectedTenStar(item.key);
      setShowHidden(false);
    } else if (item.category === 'hidden') {
      setMainTab('tenstar');
      setShowHidden(true);
      setSelectedHidden(item.key);
    } else {
      setMainTab('spirit');
      setSelectedSpirit(item.key);
    }
  }

  function getActiveItemKey(): string | null {
    if (mainTab === 'relation' && activeRelation) return relationItemKey(activeRelation);
    if (mainTab === 'tenstar' && showHidden && activeHidden) return hiddenItemKey(activeHidden);
    if (mainTab === 'tenstar' && activeTenStar) return tenStarItemKey(activeTenStar);
    if (mainTab === 'spirit' && activeSpirit) return spiritItemKey(activeSpirit);
    if (mainTab === 'daewoon' && activeDaewoonAge != null) return daewoonItemKey(activeDaewoonAge);
    if (mainTab === 'axis' && axisId === 'season') return monthCommandItemKey();
    return null;
  }

  function jumpToCategory(category: string, key: string) {
    if (category === 'relation') {
      setMainTab('relation');
      setSelectedRelation(key);
    } else if (category === 'tenstar') {
      setMainTab('tenstar');
      setSelectedTenStar(key);
      setShowHidden(false);
    } else if (category === 'hidden') {
      setMainTab('tenstar');
      setShowHidden(true);
      setSelectedHidden(key);
    } else if (category === 'spirit') {
      setMainTab('spirit');
      setSelectedSpirit(key);
    } else if (category === 'daewoon') {
      setMainTab('daewoon');
      setSelectedDaewoonAge(Number(key));
    } else if (category === 'month-command') {
      setMainTab('axis');
      setAxisId('season');
    }
  }

  useEffect(() => {
    if (!navigateTo) return;
    jumpToCategory(navigateTo.category, navigateTo.key);
    onNavigateConsumed();
  }, [navigateTo]);

  useEffect(() => {
    const key = getActiveItemKey();
    if (key) session.markVisited(key);
  }, [mainTab, activeRelation, activeTenStar, activeHidden, activeSpirit, showHidden, activeDaewoonAge, axisId]);

  const activeItemKey = getActiveItemKey();

  return (
    <div className="explore">
      <p className="explore__intro">
        꼭 답하지 않아도 됩니다. 떠오른 장면·사람·순간만 골라도 됩니다.
      </p>

      {dailyPrompt && (
        <TodayExploreCard
          prompt={dailyPrompt}
          onSuggest={
            dailyPrompt.suggestKey && dailyPrompt.suggestCategory
              ? () =>
                  jumpToOverview({
                    category: dailyPrompt.suggestCategory!,
                    key: dailyPrompt.suggestKey!,
                    label: '',
                    tier: 'reference',
                    priority: 0,
                  })
              : undefined
          }
        />
      )}

      <ExploreProgressBar {...progress} />

      {bundle.overview.length > 0 && (
        <div className="explore__overview">
          <h4>탐구 우선순위</h4>
          <details className="explore__criteria">
            <summary>중요도 기준</summary>
            <dl className="explore__criteria-dl">
              <dt>핵심</dt>
              <dd>{PRIORITY_CRITERIA.tiers.core.rule}</dd>
              <dt>중요</dt>
              <dd>{PRIORITY_CRITERIA.tiers.important.rule}</dd>
              <dt>참고</dt>
              <dd>{PRIORITY_CRITERIA.tiers.reference.rule}</dd>
            </dl>
            <p className="explore__criteria-note">
              기둥: {Object.values(PRIORITY_CRITERIA.pillars).join(' · ')}
            </p>
            <p className="explore__criteria-note">
              형충: {PRIORITY_CRITERIA.relations.order}
            </p>
          </details>
          <ol className="explore__overview-list">
            {bundle.overview.slice(0, 8).map((item) => (
              <li key={`${item.category}-${item.key}`}>
                <button type="button" className="explore__overview-btn" onClick={() => jumpToOverview(item)}>
                  <TierBadge tier={item.tier} />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="explore__main-tabs">
        <button
          type="button"
          className={mainTab === 'relation' ? 'active' : ''}
          onClick={() => setMainTab('relation')}
        >
          형충 ({relationKeys.length})
        </button>
        <button
          type="button"
          className={mainTab === 'tenstar' ? 'active' : ''}
          onClick={() => setMainTab('tenstar')}
        >
          십성 ({tenStarKeys.length})
        </button>
        <button
          type="button"
          className={mainTab === 'daewoon' ? 'active' : ''}
          onClick={() => setMainTab('daewoon')}
        >
          대운 ({chart.daewoon.length})
        </button>
        <button
          type="button"
          className={mainTab === 'spirit' ? 'active' : ''}
          onClick={() => setMainTab('spirit')}
        >
          신살 ({spiritKeys.length})
        </button>
        <button
          type="button"
          className={mainTab === 'axis' ? 'active' : ''}
          onClick={() => setMainTab('axis')}
        >
          기본 축
        </button>
      </div>

      {mainTab === 'relation' && (
        <div className="explore__template-view">
          {relationKeys.length === 0 ? (
            <p className="explore__empty">원국에 두드러진 형·충·합·해가 없습니다.</p>
          ) : (
            <>
              <div className="explore__chips">
                {relationKeys.map((key) => {
                  const entry = bundle.relationByKey.get(key)!;
                  const hit = entry.hits[0];
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`explore__chip ${key === activeRelation ? 'explore__chip--active' : ''}`}
                      onClick={() => setSelectedRelation(key)}
                    >
                      <TierBadge tier={entry.tier} />
                      {hit.displayLabel}
                    </button>
                  );
                })}
              </div>

              {relationHit && relationEntry && (
                <div className="explore__template-panel">
                  <header className="explore__template-header">
                    <h3>
                      {relationHit.displayLabel}
                      <span className="explore__badge">
                        {relationHit.kind === 'stem' ? '천간' : '지지'}
                      </span>
                    </h3>
                    <p className="explore__domain">{relationHint(relationHit.type)}</p>
                    <p className="explore__hits">
                      {relationHit.slots.map((s) => `${s.slotKo}${s.part}`).join(' · ')}
                    </p>
                  </header>

                  {(() => {
                    const c = getRelationCommentary(
                      relationHit.type,
                      relationHit.kind,
                      relationHit.label,
                      relationHit.slots,
                    );
                    return c ? <CommentaryBlock note={c} /> : null;
                  })()}

                  <h4 className="explore__questions-heading">탐구 질문</h4>
                  <ExploreQuestions
                    questions={relationEntry.questions}
                    itemLabel={relationHit.displayLabel}
                    session={session}
                  />
                  {activeItemKey && (
                    <ExploreNotePad
                      itemKey={activeItemKey}
                      itemLabel={relationHit.displayLabel}
                      value={session.getNote(activeItemKey)}
                      onSave={(text) => session.saveNote(activeItemKey, text)}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {mainTab === 'tenstar' && (
        <div className="explore__template-view">
          {tenStarKeys.length === 0 && hiddenTenStarKeys.length === 0 ? (
            <p className="explore__empty">표시할 십성이 없습니다.</p>
          ) : (
            <>
              {tenStarKeys.length > 0 && (
                <>
                  <p className="explore__section-label">천간·지지</p>
                  <div className="explore__chips">
                    {tenStarKeys.map((name) => {
                      const entry = bundle.tenStarByName.get(name)!;
                      return (
                        <button
                          key={name}
                          type="button"
                          className={`explore__chip ${!showHidden && name === activeTenStar ? 'explore__chip--active' : ''}`}
                          onClick={() => {
                            setShowHidden(false);
                            setSelectedTenStar(name);
                          }}
                        >
                          <TierBadge tier={entry.tier} />
                          {name}
                          <span className="explore__chip-count">{entry.hits.length}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {hiddenTenStarKeys.length > 0 && (
                <>
                  <button
                    type="button"
                    className="explore__hidden-toggle"
                    onClick={() => setShowHidden((v) => !v)}
                  >
                    지장간 ({hiddenTenStarKeys.length}) {showHidden ? '▲' : '▼'}
                  </button>
                  <p className="explore__hidden-note">
                    겉팔자(천간·지지)에는 없고 지장간에만 있는 십성입니다.
                  </p>
                  {showHidden && (
                    <div className="explore__chips explore__chips--secondary">
                      {hiddenTenStarKeys.map((name) => {
                        const entry = bundle.hiddenTenStarByName.get(name)!;
                        return (
                          <button
                            key={name}
                            type="button"
                            className={`explore__chip ${name === activeHidden ? 'explore__chip--active' : ''}`}
                            onClick={() => {
                              setShowHidden(true);
                              setSelectedHidden(name);
                            }}
                          >
                            <TierBadge tier={entry.tier} />
                            {name}
                            <span className="explore__chip-count">{entry.hits.length}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {!showHidden && tenStarDef && tenStarEntry && (
                <div className="explore__template-panel">
                  <header className="explore__template-header">
                    <h3>
                      {tenStarDef.ko}
                      <span className="explore__hanja">{tenStarDef.hanja}</span>
                      <TierBadge tier={tenStarEntry.tier} />
                    </h3>
                    <p className="explore__domain">{tenStarDef.hint}</p>
                    <p className="explore__hits">
                      {tenStarEntry.hits.map((h) => `${h.slotKo} ${h.layerKo}`).join(' · ')}
                    </p>
                  </header>

                  {(() => {
                    const c = getTenStarCommentary(activeTenStar);
                    const hit = tenStarEntry.hits[0];
                    return c ? (
                      <CommentaryBlock note={c} slot={hit?.slot} layer={hit?.layer} />
                    ) : null;
                  })()}

                  <h4 className="explore__questions-heading">탐구 질문</h4>
                  <ExploreQuestions
                    questions={tenStarEntry!.questions}
                    itemLabel={tenStarDef.ko}
                    session={session}
                  />
                  {activeItemKey && (
                    <ExploreNotePad
                      itemKey={activeItemKey}
                      itemLabel={tenStarDef.ko}
                      value={session.getNote(activeItemKey)}
                      onSave={(text) => session.saveNote(activeItemKey, text)}
                    />
                  )}
                </div>
              )}

              {showHidden && hiddenDef && hiddenEntry && (
                <div className="explore__template-panel explore__template-panel--secondary">
                  <header className="explore__template-header">
                    <h3>
                      {hiddenDef.ko}
                      <span className="explore__hanja">{hiddenDef.hanja}</span>
                      <span className="explore__badge">지장간</span>
                    </h3>
                    <p className="explore__domain">{hiddenDef.hint}</p>
                    <p className="explore__hits">
                      {hiddenEntry.hits.map((h) => `${h.slotKo} ${h.layerKo}`).join(' · ')}
                    </p>
                  </header>

                  {(() => {
                    const c = getTenStarCommentary(activeHidden!);
                    const hit = hiddenEntry.hits[0];
                    return c ? (
                      <CommentaryBlock note={c} slot={hit?.slot} layer="hidden" />
                    ) : null;
                  })()}

                  <h4 className="explore__questions-heading">탐구 질문</h4>
                  <ExploreQuestions
                    questions={hiddenEntry.questions}
                    itemLabel={`${hiddenDef.ko} (지장간)`}
                    session={session}
                  />
                  {activeItemKey && (
                    <ExploreNotePad
                      itemKey={activeItemKey}
                      itemLabel={`${hiddenDef.ko} (지장간)`}
                      value={session.getNote(activeItemKey)}
                      onSave={(text) => session.saveNote(activeItemKey, text)}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {mainTab === 'spirit' && (
        <div className="explore__template-view">
          {spiritKeys.length === 0 ? (
            <p className="explore__empty">표시할 신살이 없습니다.</p>
          ) : (
            <>
              <div className="explore__chips">
                {spiritKeys.map((name) => {
                  const entry = bundle.spiritByName.get(name)!;
                  return (
                    <button
                      key={name}
                      type="button"
                      className={`explore__chip ${name === activeSpirit ? 'explore__chip--active' : ''}`}
                      onClick={() => setSelectedSpirit(name)}
                    >
                      <TierBadge tier={entry.tier} />
                      {name}
                      <span className="explore__chip-count">{entry.hits.length}</span>
                    </button>
                  );
                })}
              </div>

              {spiritDef && spiritEntry && (
                <div className="explore__template-panel">
                  <header className="explore__template-header">
                    <h3>
                      {spiritDef.name}
                      <span className="explore__badge">{spiritDef.category}</span>
                      <TierBadge tier={spiritEntry.tier} />
                    </h3>
                    <p className="explore__domain">{spiritDef.hint}</p>
                    <p className="explore__hits">
                      {spiritEntry.hits
                        .map((h) => `${h.slot}${h.basis ? ` ${h.basis}` : ''}`)
                        .join(' · ')}
                    </p>
                  </header>

                  <CommentaryBlock
                    note={getSpiritCommentary(
                      activeSpirit!,
                      spiritEntry.hits[0]?.basis,
                    )}
                  />

                  <h4 className="explore__questions-heading">탐구 질문</h4>
                  <ExploreQuestions
                    questions={spiritEntry.questions}
                    itemLabel={spiritDef.name}
                    session={session}
                  />
                  {activeItemKey && (
                    <ExploreNotePad
                      itemKey={activeItemKey}
                      itemLabel={spiritDef.name}
                      value={session.getNote(activeItemKey)}
                      onSave={(text) => session.saveNote(activeItemKey, text)}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {mainTab === 'daewoon' && (
        <div className="explore__template-view">
          <CommentaryBlock note={buildDaewoonMetaNote(chart)} />

          <div className="explore__chips explore__chips--daewoon">
            {chart.daewoon.map((d, idx) => (
              <button
                key={d.startAge}
                type="button"
                className={`explore__chip ${d.startAge === activeDaewoonAge ? 'explore__chip--active' : ''} ${idx === currentDaewoonIdx ? 'explore__chip--current' : ''}`}
                onClick={() => setSelectedDaewoonAge(d.startAge)}
              >
                {idx === currentDaewoonIdx && (
                  <span className="explore__badge explore__badge--now">現在</span>
                )}
                {d.startAge}세
                <span className="explore__chip-sub">{d.pillar}</span>
              </button>
            ))}
          </div>

          {activeDaewoon && activeDaewoonIdx >= 0 && (
            <div className="explore__template-panel">
              <header className="explore__template-header">
                <h3>
                  {activeDaewoon.pillar}
                  <span className="explore__hanja">{activeDaewoon.startAge}~{activeDaewoon.endAge}세</span>
                  {activeDaewoonIdx === currentDaewoonIdx && (
                    <span className="explore__badge">현재</span>
                  )}
                </h3>
                <p className="explore__domain">
                  {activeDaewoon.stemTenStarKo} · {activeDaewoon.stageBongKo}
                </p>
                <p className="explore__hits">
                  {activeDaewoon.startYear}~{activeDaewoon.endYear}년
                </p>
              </header>

              <CommentaryBlock
                note={buildDaewoonCommentary(activeDaewoon, chart, {
                  isCurrent: activeDaewoonIdx === currentDaewoonIdx,
                  index: activeDaewoonIdx,
                })}
              />

              <h4 className="explore__questions-heading">탐구 질문</h4>
              <ExploreQuestions
                questions={buildDaewoonQuestions(
                  activeDaewoon,
                  activeDaewoonIdx === currentDaewoonIdx,
                )}
                itemLabel={`${activeDaewoon.pillar} (${activeDaewoon.startAge}세~)`}
                session={session}
              />
              {activeItemKey && (
                <ExploreNotePad
                  itemKey={activeItemKey}
                  itemLabel={`대운 ${activeDaewoon.pillar}`}
                  value={session.getNote(activeItemKey)}
                  onSave={(text) => session.saveNote(activeItemKey, text)}
                />
              )}
            </div>
          )}
        </div>
      )}

      {mainTab === 'axis' && (
        <>
          <div className="explore__tabs">
            {EXPLORE_AXES.map((a) => (
              <button
                key={a.id}
                type="button"
                className={`explore__tab ${a.id === axisId ? 'explore__tab--active' : ''}`}
                onClick={() => setAxisId(a.id)}
              >
                {a.title}
              </button>
            ))}
          </div>

          <div className="explore__panel">
            <p className="explore__opener">{axis.opener}</p>

            {axisId === 'season' && (
              <>
                <CommentaryBlock note={buildMonthCommandCommentary(chart)} />
                <h4 className="explore__questions-heading">월령·계절 탐구</h4>
                <ol className="explore__question-list">
                  {MONTH_COMMAND_QUESTIONS.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ol>
                {activeItemKey && (
                  <ExploreNotePad
                    itemKey={activeItemKey}
                    itemLabel="월령·계절"
                    value={session.getNote(activeItemKey)}
                    onSave={(text) => session.saveNote(activeItemKey, text)}
                  />
                )}
              </>
            )}

            {axisId !== 'season' && (
              <ol className="explore__question-list">
                {axis.prompts.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ol>
            )}
          </div>

          <div className="explore__prompts">
            <h4>공통</h4>
            <ol>
              {generalPrompts.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ol>
          </div>
        </>
      )}

      <div className="explore__chart-hint">
        <h4>팔자 데이터</h4>
        <dl>
          <dt>일간</dt>
          <dd>{chart.dayMaster.stemKo} ({chart.dayMaster.elementKo})</dd>
          <dt>월령</dt>
          <dd>{chart.monthCommand.saenglingKo} · {chart.monthCommand.dangryeongKo}</dd>
          <dt>천간 관계</dt>
          <dd>
            {chart.stemRelations.length > 0
              ? chart.stemRelations.map((r) => r.label).join(', ')
              : '—'}
          </dd>
          <dt>지지 관계</dt>
          <dd>
            {chart.branchRelations.length > 0
              ? [...new Set(chart.branchRelations.map((r) => r.label))].join(', ')
              : '—'}
          </dd>
          <dt>오행</dt>
          <dd>
            목{chart.elementCount.木} 화{chart.elementCount.火} 토{chart.elementCount.土}{' '}
            금{chart.elementCount.金} 수{chart.elementCount.水}
          </dd>
        </dl>
      </div>
    </div>
  );
}
