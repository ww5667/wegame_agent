import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import {
  Bell,
  Bot,
  Check,
  ChevronRight,
  CircleDot,
  Clock3,
  Gamepad2,
  Heart,
  Image as ImageIcon,
  Keyboard,
  MessageCircle,
  Plus,
  MoreHorizontal,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  Swords,
  Target,
  ThumbsUp,
  UserPlus,
  Users,
  X,
} from 'lucide-react';

type View = 'discover' | 'companion' | 'community';
type CommunityTab = 'recommend' | 'following' | 'latest';
type ChatMessage = { id: number; role: 'agent' | 'user'; text: string };
type Post = {
  id: number;
  user: string;
  time: string;
  content: string;
  kind: 'moment' | 'team';
  tags?: string[];
};

const games = [
  { name: '雾海航线', cover: 'covers/mist-route.webp', reason: '在浓雾航道中探索未知岛链，适合放松体验。', match: 92 },
  { name: '浮岛工坊', cover: 'covers/floating-workshop.webp', reason: '建造与自动化并重，随时可停，节奏舒缓。', match: 88 },
  { name: '热血街场', cover: 'covers/street-arena.webp', reason: '组建你的街头队伍，每局时间短，反馈直接。', match: 85 },
];

const teammates = [
  { name: 'Cloud7', role: '打野', score: 92, tags: ['团队', '可开麦'], active: '20:00—23:00', reason: '习惯围绕团队资源行动，沟通直接但不施压。' },
  { name: 'Mori', role: '辅助', score: 87, tags: ['稳健', '不压力'], active: '19:30—22:30', reason: '活跃时间与你重合，偏好轻松配合和连续组队。' },
];

const initialPosts: Post[] = [
  { id: 1, user: 'Mori', time: '2 小时前', content: '第一次三人协作通关，最后十秒真的太惊险了。', kind: 'moment' },
  { id: 2, user: 'Cloud7', time: '30 分钟前', content: '今晚 20:30 轻松开两局，想找愿意沟通但不压力的队友。', kind: 'team', tags: ['缺 1 人', '可开麦', '不压力'] },
];

function Brand() {
  return <button className="brand" type="button" aria-label="返回主页"><span className="brand-mark">W</span><span>WeGame</span></button>;
}

function Header({ view, onNavigate, agentOpen, onToggleAgent, onUnavailable }: {
  view: View;
  onNavigate: (view: View) => void;
  agentOpen: boolean;
  onToggleAgent: () => void;
  onUnavailable: () => void;
}) {
  const [searchText, setSearchText] = useState('');
  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    if (searchText.trim()) onUnavailable();
  };
  return (
    <header className="app-header">
      <Brand />
      <nav className="top-nav" aria-label="主导航">
        <button className={view !== 'community' ? 'active' : ''} onClick={() => onNavigate('discover')} type="button">主页</button>
        <button className={view === 'community' ? 'active' : ''} onClick={() => onNavigate('community')} type="button">社区</button>
        <button onClick={onUnavailable} type="button">商店</button>
        <button onClick={onUnavailable} type="button">测试区</button>
        <button onClick={onUnavailable} type="button">直播</button>
      </nav>
      <form className="global-search" onSubmit={submitSearch}>
        <Search aria-hidden="true" />
        <input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="搜索游戏、社区、内容" aria-label="全局搜索" />
      </form>
      <div className="header-actions">
        <button className="icon-button desktop-only" onClick={onUnavailable} type="button" aria-label="通知"><Bell /></button>
        <button className={`shortcut-button ${agentOpen ? 'is-active' : ''}`} onClick={onToggleAgent} type="button" aria-label={agentOpen ? '收起 AI 游戏助手' : '打开 AI 游戏助手'}>
          <Bot /><span className="desktop-only">AI 助手</span><kbd>Ctrl Space</kbd>
        </button>
        <button className="profile-button" type="button" aria-label="NightFox 的个人中心">N</button>
      </div>
    </header>
  );
}

function GameCover({ src }: { src: string }) {
  return <span className="game-cover" aria-hidden="true"><img src={`${import.meta.env.BASE_URL}${src}`} alt="" loading="lazy" /></span>;
}

function Sidebar({ view, onNavigate }: { view: View; onNavigate: (view: View) => void }) {
  if (view === 'community') {
    return (
      <aside className="sidebar community-sidebar">
        <h2>社区</h2>
        <nav className="side-navigation" aria-label="社区导航">
          <button className="active" type="button"><Sparkles />推荐</button>
          <button type="button"><Heart />关注</button>
          <button type="button"><UserPlus />找队友</button>
        </nav>
        <div className="side-divider" />
        <p className="side-label">我的圈子</p>
        <div className="circle-list">
          {[
            ['星港协作队', 'starport-keyart.png'],
            ['浮岛工坊', 'covers/floating-workshop.webp'],
            ['热血街场', 'covers/street-arena.webp'],
          ].map(([name, cover]) => <button key={name} type="button"><GameCover src={cover} /><span>{name}</span></button>)}
        </div>
        <button className="sidebar-bottom-action" type="button"><Gamepad2 />圈子管理<ChevronRight /></button>
      </aside>
    );
  }
  return (
    <aside className="sidebar library-sidebar">
      <h2>我的游戏</h2>
      <nav className="side-navigation primary-entry" aria-label="游戏助手入口">
        <button className={view === 'discover' ? 'active' : ''} onClick={() => onNavigate('discover')} type="button"><Sparkles />AI 游戏助手</button>
        <button className={view === 'companion' ? 'active' : ''} onClick={() => onNavigate('companion')} type="button"><Target />对局助手{view === 'companion' && <span className="live-dot" />}</button>
      </nav>
      <p className="side-label">最近游玩</p>
      <div className="recent-games">
        {[
          ['雾海航线', '1 小时前', 'covers/mist-route.webp'],
          ['浮岛工坊', '昨天', 'covers/floating-workshop.webp'],
          ['热血街场', view === 'companion' ? '游戏中' : '3 天前', 'covers/street-arena.webp'],
          ['风语之森', '5 天前', 'covers/whisper-forest.webp'],
          ['机动链路', '7 天前', 'covers/mobile-link.webp'],
        ].map(([name, time, cover]) => {
          return (
            <button key={String(name)} className={name === '热血街场' && view === 'companion' ? 'playing' : ''} type="button">
              <GameCover src={String(cover)} /><span><strong>{String(name)}</strong><small>{String(time)}</small></span>
            </button>
          );
        })}
      </div>
      <button className="sidebar-bottom-action" type="button"><Gamepad2 />游戏管理<ChevronRight /></button>
    </aside>
  );
}

function DiscoverPage({ onStart, onAskWhy }: { onStart: () => void; onAskWhy: () => void }) {
  return (
    <section className="workspace discover-page">
      <div className="page-heading"><div><h1>晚上好，今晚玩什么？</h1><p><Clock3 />约 40 分钟 <span>·</span> 想轻松一点 <span>·</span> <Users />2 位好友在线</p></div></div>
      <article className="recommendation-hero">
        <div className="hero-copy">
          <span className="hero-kicker"><Sparkles />Agent 今晚首选</span>
          <h2>星港协作队</h2>
          <div className="tag-row"><span className="tag tag-accent">多人合作</span><span className="tag">单局约 25 分钟</span></div>
          <p>2 位好友正在游玩，节奏轻松，适合今晚快速开一局。</p>
          <div className="hero-actions"><button className="primary-button large" onClick={onStart} type="button"><Gamepad2 />开始游戏</button><button className="text-button" onClick={onAskWhy} type="button">为什么推荐<ChevronRight /></button></div>
        </div>
      </article>
      <div className="section-heading"><h2>为你推荐</h2><button type="button">查看全部<ChevronRight /></button></div>
      <ul className="recommendation-list">
        {games.map((game) => (
          <li key={game.name}>
            <GameCover src={game.cover} />
            <div className="recommendation-copy"><h3>{game.name}</h3><p>{game.reason}</p><span className="match-score"><ThumbsUp />{game.match}% <small>匹配</small></span></div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TacticalBoard() {
  return (
    <div className="match-card">
      <div className="tactical-board" aria-label="虚构竞技游戏的实时战术地图">
        <span className="lane lane-one" /><span className="lane lane-two" /><span className="lane lane-three" />
        <span className="map-zone zone-a" /><span className="map-zone zone-b" />
        <span className="map-marker ally ally-a" /><span className="map-marker ally ally-b" /><span className="map-marker ally ally-c" />
        <span className="map-marker enemy enemy-a" /><span className="map-marker enemy enemy-b" /><span className="map-marker enemy enemy-c" />
        <span className="risk-label"><ShieldAlert />风险上升</span>
        <div className="objective-timer"><Target /><strong>00:45</strong><span>核心资源</span></div>
      </div>
      <ol className="event-list">
        <li><time>11:20</time><span className="event-icon danger" /><p>下路单独阵亡</p><ChevronRight /></li>
        <li><time>12:05</time><span className="event-icon danger" /><p>河道附近再次阵亡</p><ChevronRight /></li>
        <li><time>12:15</time><span className="event-icon watch" /><p>敌方打野进入下半区</p><ChevronRight /></li>
      </ol>
    </div>
  );
}

function CompanionPage({ onOpenAgent }: { onOpenAgent: () => void }) {
  const stats = [['时间', '12:30', Clock3], ['比分', '8 : 12', Swords], ['经济差', '-1,800', ShieldAlert], ['核心资源', '00:45', Target]];
  return (
    <section className="workspace companion-page">
      <div className="page-heading companion-heading"><div><h1>对局助手</h1><p>热血街场 <span>·</span> 排位赛 <span>·</span> 12:30</p></div><button className="hotkey-hint" onClick={onOpenAgent} type="button"><Keyboard />按 <kbd>Ctrl Space</kbd> 快捷呼出助手</button></div>
      <div className="match-stats">
        {stats.map(([label, value, icon]) => {
          const Icon = icon as typeof Clock3;
          return <div key={String(label)}><span><Icon />{String(label)}</span><strong>{String(value)}</strong></div>;
        })}
      </div>
      <TacticalBoard />
      <div className="trend-section"><h2>本局趋势</h2><div className="trend-card"><div><span>视野参与</span><strong>62%</strong></div><div><span>资源到场率</span><strong>78%</strong></div><div><span>单独行动</span><strong>3 <small>次</small></strong></div></div></div>
    </section>
  );
}

function CommunityPage({ tab, onTabChange, posts, postText, onPostTextChange, onPublish }: {
  tab: CommunityTab;
  onTabChange: (tab: CommunityTab) => void;
  posts: Post[];
  postText: string;
  onPostTextChange: (value: string) => void;
  onPublish: () => void;
}) {
  const shownPosts = tab === 'following' ? posts.filter((post) => post.user === 'Mori') : posts;
  return (
    <section className="workspace community-page">
      <div className="community-title"><h1>社区</h1></div>
      <div className="community-tabs" role="tablist" aria-label="社区动态分类">
        {[['recommend', '推荐'], ['following', '关注'], ['latest', '最新']].map(([value, label]) => <button key={value} className={tab === value ? 'active' : ''} onClick={() => onTabChange(value as CommunityTab)} type="button" role="tab" aria-selected={tab === value}>{label}</button>)}
      </div>
      <div className="post-composer">
        <div className="avatar avatar-user">N</div>
        <textarea value={postText} onChange={(event) => onPostTextChange(event.target.value)} placeholder="分享你的游戏时刻或寻找队友…" aria-label="帖子内容" rows={2} />
        <div className="composer-actions"><div><button type="button"><ImageIcon />图片</button><button type="button"><MessageCircle />话题</button><button type="button"><Users />组队</button></div><button className="primary-button" onClick={onPublish} type="button">发布</button></div>
      </div>
      <div className="feed-list">
        {shownPosts.map((post) => (
          <article key={post.id} className="feed-card">
            <header><div className={`avatar ${post.user === 'Mori' ? 'avatar-mori' : 'avatar-cloud'}`}>{post.user.slice(0, 1)}</div><div><h2>{post.user}{post.kind === 'team' && <span className="post-type">寻找队友</span>}</h2><p>{post.time}{post.kind === 'moment' && ' · 星港协作队'}</p></div><button type="button" aria-label="更多操作"><MoreHorizontal /></button></header>
            <p className="post-copy">{post.content}</p>
            {post.kind === 'moment' && <img className="post-image" src={`${import.meta.env.BASE_URL}starport-keyart.png`} alt="星港协作队的虚构游戏截图" />}
            {post.tags && <div className="tag-row post-tags">{post.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>}
            <footer>{post.kind === 'moment' ? <><button type="button"><ThumbsUp />赞 128</button><button type="button"><MessageCircle />评论 24</button><button type="button"><Send />分享</button></> : <button className="outline-button join-button" type="button">申请加入</button>}</footer>
          </article>
        ))}
      </div>
    </section>
  );
}

function RailHeader({ title, subtitle, onClose }: { title: string; subtitle: string; onClose: () => void }) {
  return <header className="rail-header"><div className="agent-orb"><Bot /></div><div><h2>{title}</h2><p><CircleDot />{subtitle}</p></div><button className="rail-close" onClick={onClose} type="button" aria-label="收起侧栏"><X /></button></header>;
}

function DiscoverAgent({ messages, input, onInput, onSubmit, onQuick, onClose }: {
  messages: ChatMessage[];
  input: string;
  onInput: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  onQuick: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <aside className="assistant-rail">
      <RailHeader title="WeGame Agent" subtitle="正在理解你的需求" onClose={onClose} />
      <div className="rail-scroll discover-agent">
        <div className="conversation">{messages.map((message) => <div key={message.id} className={`message ${message.role}`}>{message.text}</div>)}</div>
        <section className="evidence-section"><h3>推荐依据</h3><div><Users />2 位好友正在游玩同款游戏</div><div><Clock3 />符合你约 40 分钟的空闲时间</div><div><Sparkles />你近期偏好合作、轻松节奏</div></section>
      </div>
      <div className="quick-prompts">{['只有 40 分钟', '想轻松一点', '想和朋友玩'].map((item) => <button key={item} onClick={() => onQuick(item)} type="button">{item}</button>)}</div>
      <form className="rail-input" onSubmit={onSubmit}><input value={input} onChange={(event) => onInput(event.target.value)} placeholder="告诉 Agent 你今晚想怎么玩…" aria-label="告诉 Agent 游戏需求" /><button type="submit" aria-label="发送"><Send /></button></form>
    </aside>
  );
}

function CompanionAgent({ query, answer, onQuery, onSubmit, onQuick, onClose }: {
  query: string;
  answer: string;
  onQuery: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  onQuick: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <aside className="assistant-rail companion-agent">
      <RailHeader title="WeGame Agent" subtitle="实时分析中" onClose={onClose} />
      <div className="rail-scroll">
        <section className="advice-card"><h3><ShieldAlert />关键建议</h3><div className="advice-copy"><strong>先别回下路，提前靠近核心资源区</strong><p>资源将在 45 秒后刷新，敌方下半区人数占优。</p><ol><li><span>01</span>清完当前兵线</li><li><span>02</span>从安全路线靠近河道</li><li><span>03</span>等打野到场再进入</li></ol></div></section>
        <section className="answer-card"><span>Agent 回答</span><p>{answer}</p></section>
      </div>
      <div className="quick-prompts quick-prompts-grid">{['查当前攻略', '下一波怎么打', '装备怎么选'].map((item) => <button key={item} onClick={() => onQuick(item)} type="button">{item}</button>)}</div>
      <form className="rail-input" onSubmit={onSubmit}><input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="即时查攻略或询问技巧…" aria-label="向对局助手提问" /><button type="submit" aria-label="发送"><Send /></button></form>
    </aside>
  );
}

function CommunityAgent({ query, note, invited, onQuery, onSubmit, onInvite, onPublishTeam, onClose }: {
  query: string;
  note: string;
  invited: string | null;
  onQuery: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  onInvite: (name: string) => void;
  onPublishTeam: () => void;
  onClose: () => void;
}) {
  return (
    <aside className="assistant-rail community-agent">
      <RailHeader title="AI 找搭子" subtitle="说出需求，我来匹配" onClose={onClose} />
      <div className="rail-scroll community-agent-scroll">
        <form className="mate-query" onSubmit={onSubmit}><label htmlFor="mate-query">你想找怎样的游戏搭子？</label><div><input id="mate-query" value={query} onChange={(event) => onQuery(event.target.value)} placeholder="例如：今晚两局、可开麦、不压力" /><button type="submit"><Sparkles />匹配</button></div>{note && <p><Check />{note}</p>}</form>
        <div className="rail-section-title"><h3>推荐搭子</h3><button type="button">查看全部</button></div>
        <div className="teammate-list">
          {teammates.map((mate) => (
            <article key={mate.name}>
              <div className={`avatar ${mate.name === 'Cloud7' ? 'avatar-cloud' : 'avatar-mori'}`}>{mate.name.slice(0, 1)}</div>
              <div className="mate-copy"><h4>{mate.name}<span>{mate.role}</span></h4><strong>{mate.score}% 合拍</strong><div className="tag-row">{mate.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div><p><Clock3 />{mate.active}</p><small>{mate.reason}</small></div>
              <button className={invited === mate.name ? 'invite-button invited' : 'invite-button'} onClick={() => onInvite(mate.name)} type="button">{invited === mate.name ? '已邀请' : '邀请'}</button>
            </article>
          ))}
        </div>
        <div className="publish-team-card"><p>没有合适的？让更多玩家看到你的需求。</p><button className="primary-button" onClick={onPublishTeam} type="button"><Plus />发布组队</button></div>
      </div>
    </aside>
  );
}

export default function App() {
  const [view, setView] = useState<View>('discover');
  const [agentOpen, setAgentOpen] = useState(true);
  const [toast, setToast] = useState('');
  const [discoverInput, setDiscoverInput] = useState('');
  const [discoverMessages, setDiscoverMessages] = useState<ChatMessage[]>([
    { id: 1, role: 'agent', text: '晚上好。告诉我你有多少时间、想要什么节奏，我会帮你缩小选择。' },
    { id: 2, role: 'user', text: '大概 40 分钟，想轻松一点，最好能和朋友玩。' },
    { id: 3, role: 'agent', text: '明白。星港协作队最符合：两位好友在线，单局约 25 分钟，合作压力也较低。' },
  ]);
  const [companionQuery, setCompanionQuery] = useState('');
  const [companionAnswer, setCompanionAnswer] = useState('我会结合当前局势回答；不确定的机制不会猜测。');
  const [communityTab, setCommunityTab] = useState<CommunityTab>('recommend');
  const [postText, setPostText] = useState('');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [mateQuery, setMateQuery] = useState('今晚两局，可开麦，不压力');
  const [mateNote, setMateNote] = useState('');
  const [invited, setInvited] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2400);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.code === 'Space') {
        event.preventDefault();
        setAgentOpen((current) => !current);
      }
      if (event.key === 'Escape') setAgentOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => () => { if (toastTimer.current) window.clearTimeout(toastTimer.current); }, []);

  const navigate = (next: View) => { setView(next); setAgentOpen(true); };
  const submitDiscover = (event: FormEvent) => {
    event.preventDefault();
    const query = discoverInput.trim();
    if (!query) return;
    const reply = query.includes('竞技') || query.includes('对战')
      ? '如果更想要竞技反馈，我建议热血街场：平均 18 分钟一局，适合连续开两把。'
      : query.includes('一个人') || query.includes('单人')
        ? '一个人放松的话，浮岛工坊更合适。可以随时暂停，也不会错过进度。'
        : '我会继续优先多人合作、短局和低压力体验。星港协作队仍是当前最合适的选择。';
    setDiscoverMessages((current) => [...current, { id: Date.now(), role: 'user', text: query }, { id: Date.now() + 1, role: 'agent', text: reply }]);
    setDiscoverInput('');
  };
  const quickDiscover = (value: string) => {
    setDiscoverInput(value);
    setDiscoverMessages((current) => [...current, { id: Date.now(), role: 'user', text: value }, { id: Date.now() + 1, role: 'agent', text: '收到，我已经把这个条件加入本次推荐。' }]);
  };
  const answerCompanion = (value: string) => {
    const query = value.trim();
    if (!query) return;
    if (query.includes('装备')) setCompanionAnswer('当前更需要先补生存属性。经济落后时先保证能参加下一波资源团，再补输出。');
    else if (query.includes('攻略')) setCompanionAnswer('当前版本的可靠攻略建议是：资源刷新前 60 秒结束边线行动，并和队友一起进入河道。');
    else setCompanionAnswer('下一波先处理兵线，再从安全路线靠近资源区。不要先手探草，等打野到场后再推进。');
    setCompanionQuery('');
  };
  const submitCompanion = (event: FormEvent) => { event.preventDefault(); answerCompanion(companionQuery); };
  const publishPost = () => {
    const content = postText.trim();
    if (!content) { showToast('先写点内容再发布'); return; }
    const isTeam = content.includes('队友') || content.includes('组队');
    setPosts((current) => [{ id: Date.now(), user: 'NightFox', time: '刚刚', content, kind: isTeam ? 'team' : 'moment', tags: isTeam ? ['等待加入', '轻松游戏'] : undefined }, ...current]);
    setPostText('');
    showToast('动态已发布');
  };
  const submitMate = (event: FormEvent) => { event.preventDefault(); if (mateQuery.trim()) setMateNote('已按时间、沟通方式和游戏节奏重新排序'); };
  const inviteMate = (name: string) => { setInvited(name); showToast(`已向 ${name} 发送组队邀请`); };
  const pageTitle = useMemo(() => view === 'discover' ? 'AI 游戏推荐' : view === 'companion' ? '实时对局助手' : '游戏社区', [view]);

  return (
    <main className={`app-shell ${agentOpen ? 'agent-open' : 'agent-closed'}`}>
      <Header view={view} onNavigate={navigate} agentOpen={agentOpen} onToggleAgent={() => setAgentOpen((current) => !current)} onUnavailable={() => showToast('当前 Demo 聚焦 AI 游戏助手核心旅程')} />
      <div className="app-body">
        <Sidebar view={view} onNavigate={navigate} />
        {view === 'discover' && <DiscoverPage onStart={() => navigate('companion')} onAskWhy={() => setAgentOpen(true)} />}
        {view === 'companion' && <CompanionPage onOpenAgent={() => setAgentOpen(true)} />}
        {view === 'community' && <CommunityPage tab={communityTab} onTabChange={setCommunityTab} posts={posts} postText={postText} onPostTextChange={setPostText} onPublish={publishPost} />}
        {agentOpen && view === 'discover' && <DiscoverAgent messages={discoverMessages} input={discoverInput} onInput={setDiscoverInput} onSubmit={submitDiscover} onQuick={quickDiscover} onClose={() => setAgentOpen(false)} />}
        {agentOpen && view === 'companion' && <CompanionAgent query={companionQuery} answer={companionAnswer} onQuery={setCompanionQuery} onSubmit={submitCompanion} onQuick={answerCompanion} onClose={() => setAgentOpen(false)} />}
        {agentOpen && view === 'community' && (
          <CommunityAgent query={mateQuery} note={mateNote} invited={invited} onQuery={setMateQuery} onSubmit={submitMate} onInvite={inviteMate} onPublishTeam={() => { setPostText('今晚想找一位轻松开麦、不压力的队友一起玩两局。'); setCommunityTab('latest'); setAgentOpen(false); showToast('已为你生成组队帖子草稿'); }} onClose={() => setAgentOpen(false)} />
        )}
      </div>
      {!agentOpen && <button className="floating-agent" onClick={() => setAgentOpen(true)} type="button"><Bot /><span>打开 {pageTitle}</span><kbd>Ctrl Space</kbd></button>}
      {toast && <output className="toast"><Check />{toast}</output>}
    </main>
  );
}
