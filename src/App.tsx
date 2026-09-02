import {
  useEffect,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from 'react';
import {
  Bot,
  Bug,
  Check,
  ChevronRight,
  CircleDot,
  Clock3,
  Gamepad2,
  Headphones,
  MessageSquareMore,
  Mic2,
  Pause,
  Play,
  RotateCcw,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  Trophy,
  UserPlus,
  Users,
} from 'lucide-react';

type Scene = 'discover' | 'playing' | 'post' | 'social';
type FallbackMode = 'normal' | 'timeout' | 'no-knowledge';

function Button({
  className = '',
  variant: _variant,
  size = 'default',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'icon-sm';
}) {
  return <button className={`ui-button ui-button-${size} ${className}`} {...props} />;
}

function Badge({
  className = '',
  variant: _variant,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'outline' }) {
  return <span className={`ui-badge ${className}`} {...props} />;
}

const demoSteps: Array<{ scene: Scene; label: string }> = [
  { scene: 'discover', label: '理解今晚需求' },
  { scene: 'playing', label: '进入对局' },
  { scene: 'playing', label: '普通事件' },
  { scene: 'playing', label: '首次阵亡' },
  { scene: 'playing', label: '风险累积' },
  { scene: 'playing', label: '关键资源窗口' },
  { scene: 'post', label: 'AI 赛后复盘' },
  { scene: 'social', label: '寻找合适队友' },
];

const sceneIndex: Record<Scene, number> = {
  discover: 0,
  playing: 5,
  post: 6,
  social: 7,
};

const games = [
  {
    name: '星港协作队',
    eyebrow: '今晚首选',
    tags: ['多人合作', '轻松', '单局 25 分钟'],
    reason: '符合你当前的时间和放松需求，2 位好友正在游玩。',
    tone: 'cyan',
  },
  {
    name: '霓光乱斗',
    eyebrow: '快速开局',
    tags: ['短局', '即时战斗', '低压力'],
    reason: '平均 18 分钟一局，适合今晚快速来一把。',
    tone: 'violet',
  },
  {
    name: '远境建造局',
    eyebrow: '换换心情',
    tags: ['沙盒', '建造', '好友联机'],
    reason: '和最近的排位体验差异更大，节奏最轻松。',
    tone: 'amber',
  },
];

const teammates = [
  {
    name: 'Cloud7',
    role: '打野',
    score: 92,
    tags: ['团队', '休闲', '开麦'],
    active: '20:00—23:00',
    reason: '偏好围绕下路和地图资源组织团队行动。',
  },
  {
    name: 'Mori',
    role: '辅助',
    score: 87,
    tags: ['稳健', '不压力', '可开麦'],
    active: '19:30—22:30',
    reason: '沟通节奏与你接近，最近也在寻找固定队友。',
  },
];

function ProductLogo() {
  return (
    <div className="agent-logo" aria-hidden="true">
      <Sparkles className="size-4" />
    </div>
  );
}

function DiscoveryScene({ onStart }: { onStart: () => void }) {
  return (
    <section className="scene-scroll p-5 lg:p-7">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge className="mb-3 border border-cyan-300/20 bg-cyan-300/8 text-cyan-200">找 · DISCOVER</Badge>
            <h1 className="text-3xl font-semibold tracking-[-0.04em]">今晚想玩点什么？</h1>
            <p className="mt-2 text-sm text-slate-500">Agent 已结合你的时间、疲劳度和在线好友完成筛选。</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['只有 40 分钟', '想轻松一点', '和朋友玩'].map((item) => (
              <button key={item} className="filter-chip"><Check className="size-3" />{item}</button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {games.map((game, index) => (
            <article key={game.name} className={`game-card game-card-${game.tone}`}>
              <div className="game-art">
                <div className="game-orbit game-orbit-a" />
                <div className="game-orbit game-orbit-b" />
                <div className="game-core"><Gamepad2 className="size-5" /></div>
                <span>{game.eyebrow}</span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold">{game.name}</h2>
                  {index === 0 && <Badge className="bg-cyan-300 text-[10px] text-slate-950">92% 匹配</Badge>}
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {game.tags.map((tag) => <Badge key={tag} variant="outline" className="border-white/8 bg-white/3 text-[10px] font-normal text-slate-400">{tag}</Badge>)}
                </div>
                <p className="mt-4 min-h-10 text-xs leading-5 text-slate-500">{game.reason}</p>
                <Button onClick={onStart} className={`mt-4 w-full ${index === 0 ? 'bg-cyan-300 text-slate-950 hover:bg-cyan-200' : 'border-white/8 bg-white/4 text-slate-300'}`} variant={index === 0 ? 'default' : 'outline'}>
                  {index === 0 ? '开始演示对局' : '查看详情'} <ChevronRight />
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            ['40 分钟', '本次可用时间', Clock3],
            ['2 位', '好友当前在线', Users],
            ['轻松合作', '当前游戏意图', Headphones],
          ].map(([value, label, Icon]) => {
            const IconComponent = Icon as typeof Clock3;
            return (
              <div key={String(label)} className="context-stat">
                <IconComponent className="size-4 text-cyan-300" />
                <strong>{String(value)}</strong>
                <span>{String(label)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TacticalMap({ stage }: { stage: number }) {
  const state = [
    { time: '00:10', score: '0 : 0', economy: '0', objective: '05:00' },
    { time: '10:30', score: '7 : 8', economy: '-400', objective: '02:45' },
    { time: '11:20', score: '7 : 9', economy: '-900', objective: '01:55' },
    { time: '12:05', score: '8 : 11', economy: '-1,450', objective: '01:10' },
    { time: '12:30', score: '8 : 12', economy: '-1,800', objective: '00:45' },
  ][Math.min(stage, 4)];

  const events = [
    '对局数据接入完成',
    '10:30 下路完成一次正常换血',
    '11:20 玩家在下路单独阵亡',
    '12:05 玩家在河道附近再次阵亡',
    '12:15 敌方打野出现在下半区',
  ].slice(0, Math.max(1, stage + 1)).reverse().slice(0, 3);

  return (
    <section className="min-w-0 bg-[#070b13] p-3 lg:p-4">
      <div className="mb-3 grid grid-cols-4 gap-2">
        {[
          ['时间', state.time],
          ['比分', state.score],
          ['经济差', state.economy],
          ['小龙刷新', state.objective],
        ].map(([label, value], index) => (
          <div key={label} className="stat-card">
            <span>{label}</span>
            <strong className={stage >= 3 && index > 1 ? 'text-amber-300' : ''}>{value}</strong>
          </div>
        ))}
      </div>

      <div className="tactical-map">
        <div className="map-glow map-glow-a" />
        <div className="map-glow map-glow-b" />
        <div className="lane lane-a" />
        <div className="lane lane-b" />
        <div className="lane lane-c" />
        <div className="map-label left-[7%] top-[8%]">上路</div>
        <div className="map-label right-[7%] bottom-[8%]">下路</div>
        <div className="objective-ring left-[45%] top-[40%]">
          <span className="text-[9px] text-slate-500">OBJECTIVE</span>
          <strong>{state.objective}</strong>
          <span className="text-[11px] text-cyan-200">小龙</span>
        </div>
        <div className="team-dot left-[24%] top-[60%]" />
        <div className="team-dot left-[34%] top-[54%]" />
        <div className="team-dot left-[39%] top-[68%]" />
        <div className="enemy-dot right-[24%] top-[55%]" />
        <div className="enemy-dot right-[34%] top-[38%]" />
        {stage >= 2 && <div className="risk-ping right-[18%] bottom-[20%]"><ShieldAlert className="size-4" /></div>}
        <Badge className={`absolute left-4 top-4 border ${stage >= 4 ? 'border-amber-400/25 bg-amber-400/10 text-amber-200' : 'border-cyan-400/20 bg-cyan-400/8 text-cyan-200'}`}>
          <span className={`mr-1 size-1.5 animate-pulse rounded-full ${stage >= 4 ? 'bg-amber-300' : 'bg-cyan-300'}`} />
          {stage >= 4 ? '风险上升' : '状态稳定'}
        </Badge>
        <div className="absolute bottom-4 left-4 z-10 w-[min(340px,calc(100%-32px))] rounded-xl border border-white/8 bg-[#080d17]/90 p-3 backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between text-[11px]">
            <span className="font-medium text-slate-300">最近事件</span>
            <span className="text-slate-600">LIVE CONTEXT</span>
          </div>
          <div className="space-y-2 text-[11px] text-slate-400">
            {events.map((event, index) => <p key={event}><span className="mr-2 font-mono text-cyan-400/70">0{index + 1}</span>{event}</p>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function PostGameScene({ onSocial }: { onSocial: () => void }) {
  return (
    <section className="scene-scroll p-5 lg:p-7">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Badge className="mb-3 border border-violet-300/20 bg-violet-300/8 text-violet-200">赛后复盘 · POST GAME</Badge>
            <h1 className="text-3xl font-semibold tracking-[-0.04em]">这局 Agent 看到了什么</h1>
            <p className="mt-2 text-sm text-slate-500">26:18 · 失败 · 示例 MOBA 排位</p>
          </div>
          <div className="score-ring"><span>本局成长</span><strong>+12</strong></div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
          <article className="review-card">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-300"><Trophy className="size-5" /></div>
              <div><p className="text-xs text-slate-500">做得不错</p><h2 className="font-semibold">中期调整速度很快</h2></div>
            </div>
            <div className="mt-5 space-y-4">
              <div className="review-row"><Check className="size-4 text-emerald-300" /><div><strong>两次资源团均提前到场</strong><p>接受建议后，你没有继续单带。</p></div></div>
              <div className="review-row"><Check className="size-4 text-emerald-300" /><div><strong>视野参与率提升 18%</strong><p>和打野共同完成了下半区视野控制。</p></div></div>
            </div>
          </article>

          <article className="review-card border-amber-300/12">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-300/10 text-amber-300"><ShieldAlert className="size-5" /></div>
              <div><p className="text-xs text-slate-500">下一局重点</p><h2 className="font-semibold">提前关注资源窗口</h2></div>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-400">前 12 分钟有两次无视野深入。下一局从资源刷新前 70 秒开始看地图。</p>
            <div className="mt-5 rounded-lg bg-white/3 p-3 text-xs text-cyan-200">一个目标：别等开团后再集合</div>
          </article>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.025] p-5">
          <div><p className="text-sm font-medium">想继续玩一局？</p><p className="mt-1 text-xs text-slate-500">Agent 可以帮你找一位更适合当前节奏的队友。</p></div>
          <Button onClick={onSocial} className="bg-cyan-300 text-slate-950 hover:bg-cyan-200"><Users />寻找合适队友</Button>
        </div>
      </div>
    </section>
  );
}

function SocialScene() {
  const [invited, setInvited] = useState<string | null>(null);
  return (
    <section className="scene-scroll p-5 lg:p-7">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge className="mb-3 border border-emerald-300/20 bg-emerald-300/8 text-emerald-200">社 · SOCIAL</Badge>
            <h1 className="text-3xl font-semibold tracking-[-0.04em]">找到更合拍的队友</h1>
            <p className="mt-2 text-sm text-slate-500">基于位置、沟通习惯、活跃时间和本局节奏进行匹配。</p>
          </div>
          <div className="flex gap-2 text-xs text-slate-400"><Badge variant="outline" className="border-white/8">需要：打野 / 辅助</Badge><Badge variant="outline" className="border-white/8">休闲开麦</Badge></div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {teammates.map((mate) => (
            <article key={mate.name} className="teammate-card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="avatar-orb">{mate.name.slice(0, 1)}</div>
                  <div><h2 className="font-semibold">{mate.name}</h2><p className="mt-1 text-xs text-slate-500">常玩位置：{mate.role}</p></div>
                </div>
                <div className="text-right"><strong className="text-xl text-cyan-200">{mate.score}%</strong><p className="text-[10px] text-slate-600">匹配度</p></div>
              </div>
              <div className="my-4 flex flex-wrap gap-2">{mate.tags.map((tag) => <Badge key={tag} variant="outline" className="border-white/8 bg-white/3 text-[10px] text-slate-400">{tag}</Badge>)}</div>
              <div className="space-y-2 rounded-xl bg-white/[0.025] p-3 text-xs text-slate-400">
                <p className="flex items-center gap-2"><Clock3 className="size-3.5 text-slate-600" />活跃时间：{mate.active}</p>
                <p className="flex items-start gap-2"><Sparkles className="mt-0.5 size-3.5 shrink-0 text-cyan-300" />{mate.reason}</p>
              </div>
              <Button onClick={() => setInvited(mate.name)} className={`mt-4 w-full ${invited === mate.name ? 'bg-emerald-300 text-emerald-950' : 'bg-cyan-300 text-slate-950 hover:bg-cyan-200'}`}>
                {invited === mate.name ? <><Check />邀请已发送</> : <><UserPlus />邀请组队</>}
              </Button>
            </article>
          ))}
        </div>

        {invited && (
          <div className="mt-4 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.035] p-4">
            <p className="text-xs text-emerald-200">Agent 已生成并发送邀请</p>
            <p className="mt-2 text-sm text-slate-300">“刚才打了一局，想找个偏团队配合的队友。我主玩 ADC，节奏比较休闲，要一起排一局吗？”</p>
          </div>
        )}
      </div>
    </section>
  );
}

function AgentPanel({
  scene,
  playStage,
  fallback,
}: {
  scene: Scene;
  playStage: number;
  fallback: FallbackMode;
}) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [quiet, setQuiet] = useState(false);

  const ask = () => {
    if (!question.trim()) return;
    if (fallback === 'timeout') setAnswer('模型响应超时。已使用规则模板：先保证生存，再围绕下一地图资源行动。');
    else if (fallback === 'no-knowledge') setAnswer('当前知识不足，我只能确认小龙即将刷新和下半区风险较高，不会猜测具体机制。');
    else setAnswer('敌方打野刚在下半区出现，而你已经连续两次单独阵亡。现在继续带线的收益低于再次阵亡和丢失小龙的风险。');
    setQuestion('');
  };

  const status = scene === 'discover' ? '正在理解今晚状态' : scene === 'playing' ? '正在理解当前对局' : scene === 'post' ? '正在生成赛后复盘' : '正在匹配合适队友';

  return (
    <aside className="agent-panel">
      <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300"><Bot className="size-4" /></div>
          <div><h1 className="text-sm font-semibold">Agent</h1><p className="mt-0.5 text-[10px] text-cyan-300/65">{status}</p></div>
        </div>
        <span className="size-2 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_10px_#67e8f9]" />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {fallback !== 'normal' && (
          <div className="mb-3 rounded-lg border border-amber-300/15 bg-amber-300/6 px-3 py-2 text-[10px] text-amber-200">
            {fallback === 'timeout' ? '模型超时 · Harness 已启用规则兜底' : '未检索到可靠知识 · 已限制回答范围'}
          </div>
        )}

        {scene === 'discover' && (
          <div className="agent-content-card">
            <p className="agent-kicker"><Search className="size-3.5" /> 已完成需求理解</p>
            <h2 className="text-lg font-semibold">今晚更适合轻松合作</h2>
            <p className="mt-2 text-xs leading-6 text-slate-400">你只有 40 分钟，而且最近连续进行了 3 局排位。我优先筛选了短局、多人合作和低压力游戏。</p>
            <div className="mt-4 space-y-2">{['40 分钟空闲', '最近排位疲劳度较高', '2 位好友在线'].map((item) => <div key={item} className="evidence-row"><Check className="size-3.5" />{item}</div>)}</div>
          </div>
        )}

        {scene === 'playing' && playStage < 4 && (
          <div className="agent-content-card">
            <p className="agent-kicker"><CircleDot className="size-3.5" /> 实时感知中</p>
            <h2 className="text-lg font-semibold">{playStage < 2 ? '当前无需打扰' : playStage === 2 ? '记录到一次风险事件' : '风险正在累积'}</h2>
            <p className="mt-2 text-xs leading-6 text-slate-400">{playStage < 2 ? '对局状态稳定，Agent 只更新上下文，不弹出建议。' : playStage === 2 ? '一次无视野阵亡不足以触发主动提醒，我会继续观察下一资源窗口。' : '连续失误已达到触发阈值，等待即将到来的地图目标给出行动建议。'}</p>
            <div className="mt-5 flex items-center gap-2 text-[10px] text-slate-600"><span className="size-1.5 rounded-full bg-cyan-300" />HARNESS · 提醒抑制生效</div>
          </div>
        )}

        {scene === 'playing' && playStage >= 4 && !acknowledged && (
          <>
            <div className="advice-card">
              <p className="agent-kicker text-amber-300"><ShieldAlert className="size-3.5" /> 高优先级建议</p>
              <h2 className="text-lg font-semibold tracking-tight">先回城，再和队友集合</h2>
              <p className="mt-2 text-xs leading-6 text-slate-400">别继续单带。回城补给后，和打野一起布置小龙区域视野。</p>
              <div className="my-4 grid grid-cols-3 gap-2">
                {['回城补给', '布置视野', '跟随队友'].map((step, index) => <div key={step} className="action-step"><span>0{index + 1}</span><p>{step}</p></div>)}
              </div>
              <div className="border-t border-white/8 pt-4">
                <p className="mb-2 text-[10px] font-medium tracking-wider text-slate-500">判断依据</p>
                <div className="flex flex-wrap gap-2">{['连续阵亡 2 次', '经济落后 1800', '小龙 45 秒'].map((item) => <Badge key={item} variant="outline" className="border-white/8 bg-white/3 text-[10px] font-normal text-slate-400">{item}</Badge>)}</div>
                <p className="mt-3 text-[10px] text-cyan-400/60">知识依据 · KB-021</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Button onClick={() => setAnswer('敌方打野刚在下半区出现，而你已经连续两次单独阵亡。现在继续带线的收益低于再次阵亡和丢失小龙的风险。')} variant="outline" className="border-white/8 bg-white/3 text-xs text-slate-300">为什么？</Button>
              <Button onClick={() => setAcknowledged(true)} className="bg-cyan-300 text-xs text-slate-950 hover:bg-cyan-200">知道了</Button>
              <Button onClick={() => setQuiet(true)} variant="ghost" className="text-xs text-slate-500">{quiet ? '已减少' : '减少提醒'}</Button>
            </div>
          </>
        )}

        {scene === 'playing' && playStage >= 4 && acknowledged && (
          <div className="agent-content-card text-center"><div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-emerald-300/10 text-emerald-300"><Check className="size-5" /></div><h2 className="font-semibold">建议已记下</h2><p className="mt-2 text-xs text-slate-500">我会继续观察集合状态，不重复打扰。</p></div>
        )}

        {scene === 'post' && (
          <div className="agent-content-card">
            <p className="agent-kicker"><Trophy className="size-3.5" /> 本局总结</p>
            <h2 className="text-lg font-semibold">调整有效，时机还可提前</h2>
            <p className="mt-2 text-xs leading-6 text-slate-400">你接受建议后的两次资源团都提前到场。下一局只需更早识别资源窗口。</p>
            <div className="mt-4 rounded-lg bg-cyan-300/5 p-3 text-xs text-cyan-200">下一局目标：资源刷新前 70 秒开始看地图</div>
          </div>
        )}

        {scene === 'social' && (
          <div className="agent-content-card">
            <p className="agent-kicker"><Users className="size-3.5" /> 队友匹配完成</p>
            <h2 className="text-lg font-semibold">优先找团队型打野</h2>
            <p className="mt-2 text-xs leading-6 text-slate-400">你的 ADC 风格偏稳健，更适合愿意围绕下路资源组织行动、沟通压力较低的队友。</p>
            <div className="mt-4 flex gap-2"><Badge variant="outline" className="border-white/8 text-slate-400"><Mic2 />可开麦</Badge><Badge variant="outline" className="border-white/8 text-slate-400">休闲</Badge></div>
          </div>
        )}

        {answer && <div className="mt-4 rounded-xl border border-cyan-300/12 bg-cyan-300/[0.035] p-3 text-xs leading-5 text-slate-300"><p className="mb-1 text-[10px] text-cyan-300">Agent 回答</p>{answer}</div>}
      </div>

      <form onSubmit={(event) => { event.preventDefault(); ask(); }} className="border-t border-white/8 p-4">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/4 p-1.5 pl-3">
          <MessageSquareMore className="size-4 shrink-0 text-slate-500" />
          <input value={question} onChange={(event) => setQuestion(event.target.value)} className="h-7 min-w-0 flex-1 border-0 bg-transparent px-0 text-xs text-slate-200 outline-none placeholder:text-slate-600" placeholder="问问 Agent…" aria-label="向 Agent 提问" />
          <Button type="submit" size="icon-sm" className="bg-cyan-300 text-slate-950"><Send /></Button>
        </div>
      </form>
    </aside>
  );
}

function DebugSheet({
  open,
  onOpenChange,
  scene,
  fallback,
  onFallbackChange,
  playStage,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scene: Scene;
  fallback: FallbackMode;
  onFallbackChange: (mode: FallbackMode) => void;
  playStage: number;
}) {
  const [tab, setTab] = useState<'context' | 'prompt' | 'knowledge' | 'trace'>('context');
  const contextJson = JSON.stringify({
    scene,
    player: { role: 'ADC', style: ['稳健', '团队'], availableMinutes: 40 },
    match: scene === 'playing' ? { gameTime: '12:30', economy: -1800, recentDeaths: playStage >= 3 ? 2 : playStage >= 2 ? 1 : 0, nextObjective: 'dragon', respawnSeconds: 45 } : null,
  }, null, 2);

  if (!open) return null;

  return (
    <div className="debug-overlay">
      <button type="button" className="debug-backdrop" aria-label="关闭 AI 调试台" onClick={() => onOpenChange(false)} />
      <dialog open className="debug-drawer" aria-labelledby="debug-title">
        <header className="flex items-start justify-between border-b border-white/8 p-5">
          <div>
            <div className="flex items-center gap-2 text-cyan-300"><Bug className="size-4" /><h2 id="debug-title" className="text-sm font-semibold text-slate-100">AI 调试台</h2></div>
            <p className="mt-1 text-xs text-slate-500">查看 Context、Prompt、RAG、工具调用与 Harness 状态</p>
          </div>
          <Button onClick={() => onOpenChange(false)} size="icon-sm" variant="ghost" aria-label="关闭 AI 调试台" className="text-slate-500">×</Button>
        </header>

        <div className="border-b border-white/8 p-4">
          <p className="mb-2 text-[10px] font-medium tracking-widest text-slate-600">运行模式</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              ['normal', '模型正常'],
              ['timeout', '模拟超时'],
              ['no-knowledge', '知识不足'],
            ].map(([mode, label]) => (
              <Button key={mode} onClick={() => onFallbackChange(mode as FallbackMode)} size="sm" variant="outline" className={fallback === mode ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-200' : 'border-white/8 bg-white/3 text-slate-500'}>{label}</Button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-4">
          <div className="flex gap-1 overflow-x-auto border-b border-white/8 pb-2" role="tablist" aria-label="调试信息分类">
            {[
              ['context', '上下文'],
              ['prompt', 'Prompt'],
              ['knowledge', '知识检索'],
              ['trace', '运行链路'],
            ].map(([value, label]) => <button key={value} onClick={() => setTab(value as typeof tab)} role="tab" aria-selected={tab === value} className={`debug-tab ${tab === value ? 'debug-tab-active' : ''}`}>{label}</button>)}
          </div>
          {tab === 'context' && <div className="mt-4"><pre className="debug-code">{contextJson}</pre></div>}
          {tab === 'prompt' && <div className="mt-4"><pre className="debug-code">{`SYSTEM · play-v3\n你是 WeGame Agent。必须基于提供的实时状态回答；不得编造游戏数据。\n\nPOLICY\n1. 生存与直接危险\n2. 即将刷新的地图目标\n3. 团队协同\n4. 发育与装备\n\nOUTPUT\n返回结构化 JSON；对局建议不超过 60 个汉字。`}</pre></div>}
          {tab === 'knowledge' && <div className="mt-4 space-y-3">
            <div className="debug-card"><div className="flex justify-between"><strong>KB-021</strong><span className="text-cyan-300">0.91</span></div><p>经济落后且资源将在 60 秒内刷新时，优先补给、布置视野并避免单人深入。</p><span>版本 Demo Patch 1.0 · official_strategy</span></div>
            <div className="debug-card opacity-60"><div className="flex justify-between"><strong>KB-014</strong><span>0.72</span></div><p>连续两次无视野阵亡应提高下半区风险权重。</p><span>版本 Demo Patch 1.0</span></div>
          </div>}
          {tab === 'trace' && <div className="mt-4">
            <div className="trace-list">
              {[
                ['01', 'Scene Router', scene.toUpperCase(), '12 ms'],
                ['02', 'Context Builder', '5 个关键事件', '18 ms'],
                ['03', 'RAG Retrieval', '命中 KB-021', '34 ms'],
                ['04', 'LLM Decision', fallback === 'timeout' ? 'TIMEOUT' : 'Schema valid', fallback === 'timeout' ? '2000 ms' : '820 ms'],
                ['05', 'Harness', fallback === 'normal' ? '正常输出' : '安全降级', '7 ms'],
              ].map(([index, name, status, time]) => <div key={index} className="trace-row"><span>{index}</span><div><strong>{name}</strong><p>{status}</p></div><time>{time}</time></div>)}
            </div>
          </div>}
        </div>
      </dialog>
    </div>
  );
}

export default function Home() {
  const [demoIndex, setDemoIndex] = useState(0);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const [debugOpen, setDebugOpen] = useState(false);
  const [fallback, setFallback] = useState<FallbackMode>('normal');

  const scene = demoSteps[demoIndex].scene;
  const playStage = scene === 'playing' ? Math.max(0, demoIndex - 1) : 0;
  const progress = (demoIndex / (demoSteps.length - 1)) * 100;

  useEffect(() => {
    if (!autoPlaying) return;
    const timer = window.setInterval(() => {
      setDemoIndex((current) => {
        if (current >= demoSteps.length - 1) {
          setAutoPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 2600);
    return () => window.clearInterval(timer);
  }, [autoPlaying]);

  const activeMode = useMemo(() => scene === 'discover' ? '找游戏' : scene === 'social' ? '找队友' : '陪你玩', [scene]);

  const goScene = (next: Scene) => {
    setDemoIndex(sceneIndex[next]);
    setAutoPlaying(false);
  };

  const next = () => setDemoIndex((current) => Math.min(current + 1, demoSteps.length - 1));
  const reset = () => { setDemoIndex(0); setAutoPlaying(false); setFallback('normal'); };

  return (
    <main className="min-h-screen overflow-hidden bg-[#060a12] text-slate-100">
      <header className="app-header">
        <div className="flex min-w-0 items-center gap-3 lg:min-w-[220px]">
          <ProductLogo />
          <div className="hidden sm:block"><p className="text-[15px] font-semibold tracking-tight">WeGame Agent</p><p className="text-[10px] text-cyan-300/65">AI GAME COMPANION</p></div>
        </div>
        <nav className="mx-auto flex h-full items-center gap-4 text-xs text-slate-500 sm:gap-8 sm:text-sm" aria-label="主导航">
          <button onClick={() => goScene('discover')} className={`top-nav ${scene === 'discover' ? 'top-nav-active' : ''}`}>游戏库</button>
          <button onClick={() => goScene('playing')} className={`top-nav ${scene === 'playing' || scene === 'post' ? 'top-nav-active' : ''}`}>对局助手</button>
          <button onClick={() => goScene('social')} className={`top-nav ${scene === 'social' ? 'top-nav-active' : ''}`}>找队友</button>
        </nav>
        <div className="flex min-w-0 justify-end lg:min-w-[220px]"><div className="player-pill"><span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" /><span className="hidden sm:inline">玩家：</span>NightFox</div></div>
      </header>

      <div className="app-grid">
        <aside className="app-sidebar">
          <p className="mb-3 px-3 text-[10px] font-medium tracking-[0.16em] text-slate-600">AGENT MODE</p>
          <div className="space-y-2">
            {[
              { label: '找游戏', icon: Search, scene: 'discover' as Scene },
              { label: '陪你玩', icon: Gamepad2, scene: 'playing' as Scene },
              { label: '找队友', icon: Users, scene: 'social' as Scene },
            ].map(({ label, icon: Icon, scene: target }) => (
              <button key={label} onClick={() => goScene(target)} className={`side-nav ${activeMode === label ? 'side-nav-active' : ''}`}>
                <Icon className="size-4" /><span>{label}</span>{activeMode === label && <span className="ml-auto size-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#67e8f9]" />}
              </button>
            ))}
          </div>
          <div className="mt-auto rounded-xl border border-cyan-400/10 bg-cyan-400/[0.035] p-3">
            <div className="mb-2 flex items-center gap-2 text-xs text-cyan-200"><CircleDot className="size-3.5" /> 感知已开启</div>
            <p className="text-[11px] leading-5 text-slate-500">仅在关键决策出现时提醒，不打断操作。</p>
          </div>
        </aside>

        {scene === 'discover' && <DiscoveryScene onStart={() => setDemoIndex(1)} />}
        {scene === 'playing' && <TacticalMap stage={playStage} />}
        {scene === 'post' && <PostGameScene onSocial={() => setDemoIndex(7)} />}
        {scene === 'social' && <SocialScene />}

        <AgentPanel key={`${scene}-${playStage}`} scene={scene} playStage={playStage} fallback={fallback} />
      </div>

      <footer className="demo-footer">
        <Button onClick={() => setAutoPlaying((value) => !value)} size="sm" className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">{autoPlaying ? <Pause className="size-3" /> : <Play className="size-3" />}{autoPlaying ? '暂停' : '自动演示'}</Button>
        <button onClick={next} className="footer-action">下一事件</button>
        <button onClick={reset} className="footer-action"><RotateCcw className="size-3" />重置</button>
        <div className="mx-2 hidden h-1 flex-1 overflow-hidden rounded-full bg-white/5 sm:block"><div className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-cyan-300 transition-all duration-500" style={{ width: `${progress}%` }} /></div>
        <span className="hidden text-[10px] text-slate-600 xl:inline">{demoSteps[demoIndex].label}</span>
        <button onClick={() => setDebugOpen(true)} className="footer-debug"><Bot className="size-3.5" />AI 调试台</button>
        <span className="footer-scene">当前：<b>{scene === 'discover' ? '找游戏' : scene === 'playing' ? '对局中' : scene === 'post' ? '赛后复盘' : '找队友'}</b></span>
      </footer>

      <DebugSheet open={debugOpen} onOpenChange={setDebugOpen} scene={scene} fallback={fallback} onFallbackChange={setFallback} playStage={playStage} />
    </main>
  );
}
