'use client';

import { useMemo, useState } from 'react';
import type { ManseryeokResult } from '@/lib/manseryeok';
import { EXPLORE_AXES, buildExplorePrompts } from '@/lib/philosophy/content';
import {
  buildExploreBundle,
  sortedHiddenTenStarKeys,
  sortedRelationKeys,
  sortedSpiritKeys,
  sortedTenStarKeys,
  TEN_STAR_TEMPLATES,
  SPIRIT_TEMPLATES,
  relationHint,
  tierLabel,
  type ExploreTier,
} from '@/lib/philosophy/build-explore';

interface Props {
  chart: ManseryeokResult;
}

type MainTab = 'relation' | 'tenstar' | 'spirit' | 'axis';

function TierBadge({ tier }: { tier: ExploreTier }) {
  return <span className={`explore__tier explore__tier--${tier}`}>{tierLabel(tier)}</span>;
}

export function ExplorePanel({ chart }: Props) {
  const bundle = useMemo(() => buildExploreBundle(chart), [chart]);

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

  return (
    <div className="explore">
      <p className="explore__intro">
        답할 필요 없음. 읽다가 떠오른 사람·장면·순간만 골라도 됩니다.
      </p>

      {bundle.overview.length > 0 && (
        <div className="explore__overview">
          <h4>탐구 우선순위</h4>
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

                  <ol className="explore__question-list">
                    {relationEntry.questions.map((q) => (
                      <li
                        key={q.id}
                        className={q.tag === 'mirror' ? 'explore__q--mirror' : ''}
                      >
                        {q.text}
                      </li>
                    ))}
                  </ol>
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

                  <ol className="explore__question-list">
                    {tenStarEntry.questions.map((q) => (
                      <li
                        key={q.id}
                        className={q.tag === 'mirror' ? 'explore__q--mirror' : ''}
                      >
                        {q.text}
                      </li>
                    ))}
                  </ol>
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

                  <ol className="explore__question-list">
                    {hiddenEntry.questions.map((q) => (
                      <li
                        key={q.id}
                        className={q.tag === 'mirror' ? 'explore__q--mirror' : ''}
                      >
                        {q.text}
                      </li>
                    ))}
                  </ol>
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

                  <ol className="explore__question-list">
                    {spiritEntry.questions.map((q) => (
                      <li
                        key={q.id}
                        className={q.tag === 'mirror' ? 'explore__q--mirror' : ''}
                      >
                        {q.text}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </>
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
            <ol className="explore__question-list">
              {axis.prompts.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ol>
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
