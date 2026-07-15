const state = {
  page: 'hotspots',
  hotTab: '聚合热点',
  hotDate: '今天',
  hotPlatform: '全部平台',
  hotQuery: '',
  materialQuery: '',
  selectedMaterials: new Set(),
  creationQuery: '',
  creationStatus: '全部状态',
  distributionQuery: '',
  distributionStatus: '全部状态',
  distributionPlatform: '全部平台',
  currentProjectId: null,
  projectTab: '创作设置',
  platformTab: '微信公众号',
  settingsTab: 'AI 模型',
  logTab: '操作日志',
  logQuery: '',
  statsRange: '最近 7 天',
  theme: 'light',
  hotspots: [
    { id: 1, title: '多地加快推进人工智能产业落地', summary: '政策、产业和企业动态在多个平台持续升温，讨论重点集中在应用落地与就业影响。', heat: 9820, trend: '+24%', sources: ['微博 #3', '今日头条 #2', '知乎 #6'], first: '09:10', updated: '11:42' },
    { id: 2, title: '新能源汽车智能驾驶功能引发热议', summary: '消费者关注功能边界、使用责任和实际体验，多家媒体发布相关解读。', heat: 8640, trend: '+18%', sources: ['百度 #1', '抖音 #5', '今日头条 #8'], first: '08:45', updated: '11:35' },
    { id: 3, title: '年轻人开始流行轻量化旅行', summary: '围绕短途、低预算和目的地体验的讨论快速增长，适合生活方式内容创作。', heat: 7460, trend: '+11%', sources: ['百度 #7', '微博 #12', '抖音 #9'], first: '07:30', updated: '11:18' },
    { id: 4, title: '国产动画新作首周口碑走高', summary: '角色塑造、视觉风格与传统文化表达成为讨论焦点。', heat: 6320, trend: '+7%', sources: ['知乎 #4', '百度 #9'], first: '10:05', updated: '11:20' },
  ],
  materials: [
    { id: 1, title: 'AI 内容创作的三个判断维度', body: '判断一个 AI 创作工具是否有价值，可以从效率、内容一致性和可控性三个维度展开。工具的真正价值不只是生成速度，而是能否形成稳定工作流。', tags: 'AI / 内容创作', created: '2026-07-12', used: '今天 10:20' },
    { id: 2, title: '公众号文章结构参考', body: '开头用具体场景建立代入感，中段拆解冲突和原因，结尾提供明确行动建议。避免空泛总结，尽量让每一段承担单一信息。', tags: '写作结构', created: '2026-07-11', used: '昨天 18:10' },
    { id: 3, title: '智能驾驶用户访谈摘录', body: '用户普遍关心系统在哪些情况下会退出，以及驾驶员需要保持怎样的注意力。实际体验中的信任建立，比功能数量更重要。', tags: '汽车 / 用户研究', created: '2026-07-10', used: '从未使用' },
  ],
  projects: [
    { id: 1, name: 'AI 真正改变内容行业的地方', source: '聚合热点', platforms: ['微信公众号', '小红书'], hotspotIds: [1], materialIds: [1,2], webSearch: true, status: '创作中', updated: '今天 11:32', published: 0, master: 'AI 对内容行业的影响，不只是把写作速度提升几倍。更重要的变化，是选题、资料整理、表达适配和复盘开始形成连续工作流。', settings: { topic: '多地加快推进人工智能产业落地', insight: '重点讨论 AI 如何改变个人创作者的工作方式', audience: '内容创作者', style: '理性分析', length: '中等篇幅', stance: '客观中立', goal: '知识分享' } },
    { id: 2, name: '智能驾驶为什么需要建立正确预期', source: '自定义主题', platforms: ['微信公众号', '抖音', '今日头条'], hotspotIds: [2], materialIds: [3], webSearch: true, status: '待分发', updated: '昨天 20:16', published: 0, master: '智能驾驶的核心问题不只是技术能力，而是用户是否理解系统边界。只有建立正确预期，功能才能真正改善驾驶体验。' },
    { id: 3, name: '周末轻量旅行清单', source: '聚合热点', platforms: ['小红书', '抖音'], hotspotIds: [3], materialIds: [], webSearch: false, status: '分发中', updated: '7月11日 16:40', published: 1, master: '轻量旅行不是减少体验，而是降低准备成本，把注意力重新放回目的地和同行的人。' },
  ],
  platformContent: {
    '微信公众号': { title: 'AI 真正改变内容行业的，不只是写得更快', summary: '从选题到分发，AI 正在把零散工具变成完整创作工作流。', body: '<h2>真正的变化发生在流程里</h2><p>过去我们谈 AI 创作，总会先讨论它能不能写出一篇文章。</p><p>但对个人创作者来说，更重要的问题是：它能不能把热点发现、资料整理、内容生成和平台适配连接起来。</p><h2>速度只是第一层价值</h2><p>当重复工作被自动化，创作者才能把时间留给判断、观点和表达。</p>', tags: 'AI, 内容创作, 自媒体' },
    '小红书': { title: '做内容的人，真正该用 AI 改造的是这 4 步', body: '以前我也以为 AI 的价值就是“写得快”。\n\n真正把它放进工作流之后，才发现最值得改造的是：\n1. 热点筛选\n2. 素材整理\n3. 多平台改写\n4. 分发前检查\n\n工具不是替代判断，而是把判断留给人。', tags: '#AI工具 #自媒体运营 #内容创作' },
    '抖音': { title: 'AI 改变内容行业的真相', description: 'AI 真正改变的不是写作速度，而是整个创作流程。', topics: '#AI #内容创作 #自媒体', script: '很多人理解的 AI 创作，就是输入一句话，得到一篇文章。\n但真正影响内容行业的，是 AI 开始接管选题整理、多平台适配和发布前检查。', storyboard: '镜头1：创作者面对多个平台页面。\n镜头2：热点、素材、稿件被连接成一条流程。\n镜头3：强调“判断留给人，重复交给工具”。' },
    '今日头条': { title: 'AI 正在重构个人创作者的完整工作流', summary: '从热点发现到多平台分发，内容生产方式正在发生结构性变化。', body: '<p>AI 对内容行业的影响，正在从单点写作工具转向完整生产流程。</p><p>个人创作者可以把重复整理交给系统，把精力集中在判断和观点上。</p>', tags: '人工智能, 自媒体, 内容行业' }
  },
  distributions: [
    { project: 'AI 真正改变内容行业的地方', updated: '今天 11:32', tasks: [{ platform: '微信公众号', status: '待分发' }, { platform: '小红书', status: '已复制' }] },
    { project: '智能驾驶为什么需要建立正确预期', updated: '昨天 20:16', tasks: [{ platform: '微信公众号', status: '待分发' }, { platform: '抖音', status: '待分发' }, { platform: '今日头条', status: '待分发' }] },
    { project: '周末轻量旅行清单', updated: '7月11日 16:40', tasks: [{ platform: '小红书', status: '已发布' }, { platform: '抖音', status: '已复制' }] },
  ]
};

const platformTemplates = structuredClone(state.platformContent);
const platformFieldNames = { title:'标题', summary:'摘要', body:'正文', tags:'标签/话题', description:'作品描述', topics:'话题', script:'口播稿', storyboard:'分镜' };
const clone = value => structuredClone(value);

state.projects.forEach((project, index) => {
  project.settings = {topic:project.name,insight:'',audience:'普通读者',style:'理性分析',length:'中等篇幅',stance:'客观中立',goal:'知识分享',...(project.settings||{})};
  project.platformContent = clone(platformTemplates);
  project.materialPriorities = Object.fromEntries((project.materialIds || []).map((id, i) => [id, i === 0 ? '重点' : '普通']));
  project.readBodies = false;
  project.webSearch = false;
  project.readSourceIds = [];
  project.previousVersion = index === 0 ? { savedAt:'昨天 20:10', master:project.master, platforms:clone(project.platformContent),settings:clone(project.settings),images:[] } : null;
  project.currentVersion = index !== 2 ? { savedAt:project.updated, master:project.master, platforms:clone(project.platformContent),settings:clone(project.settings),images:[] } : null;
  project.hasSavedVersion = index !== 2;
  project.images = [];
  project.platformErrors = {};
  project.dirty = false;
});
state.distributions.forEach((distribution, index) => { distribution.projectId = state.projects[index]?.id; });
state.workspacePath = localStorage.getItem('prototype-workspace-path') || 'D:\\SelfMediaWorkbench';
state.aiConfigured = localStorage.getItem('prototype-ai-configured') !== 'false';
state.startupCompleted = localStorage.getItem('prototype-startup-completed') === 'true';
state.appSettings = {
  baseUrl: localStorage.getItem('prototype-base-url') || 'https://api.example.com/v1',
  apiKey: localStorage.getItem('prototype-api-key') || 'sk-demo-key',
  model: localStorage.getItem('prototype-model') || 'mimo-v2-flash',
  contextTokens: +(localStorage.getItem('prototype-context-tokens') || 32000),
  outputTokens: +(localStorage.getItem('prototype-output-tokens') || 8000),
  newsNowUrl: localStorage.getItem('prototype-newsnow-url') || 'https://newsnow.busiyi.world/api/s',
  logDays: +(localStorage.getItem('prototype-log-days') || 30),
  debugMode: localStorage.getItem('prototype-debug-mode') === 'true'
};
state.logData = {
  '操作日志':[['11:42:18','热点','刷新热点','成功','NewsNow：5 个平台成功'],['11:34:09','创作','自动保存','成功','AI 真正改变内容行业的地方'],['10:22:31','素材库','新建素材','成功','AI 内容创作的三个判断维度']],
  '错误日志':[['09:18:20','热点','读取正文','失败','目标页面返回 403，已退回热点摘要'],['昨天 21:05','AI','平台生成','失败','请求超时，已自动重试 2 次']],
  'AI 调用':[['11:31:42','创作','小米 MiMo','成功','耗时 8.4s · 2,840 / 1,162 Token'],['10:20:10','热点聚合','小米 MiMo','成功','耗时 5.1s · 1,926 / 648 Token']]
};
state.tokenUsage = [
  ['07/07',12000,5000],['07/08',18000,8000],['07/09',16000,7000],['07/10',25000,12000],['07/11',31000,14000],['07/12',42000,19000],['07/13',36000,16000]
];
state.hotRefreshNotice = null;
state.backups = [];
state.modalDismissible = true;
state.lastFocusedElement = null;

const navItems = [
  ['hotspots', '⌁', '热点'], ['materials', '▣', '素材库'], ['creation', '✦', '创作'], ['distribution', '⇧', '内容分发'], ['stats', '▥', '统计'], ['logs', '≡', '日志'], ['settings', '⚙', '设置']
];
const pageMeta = {
  hotspots: ['热点', '发现今天值得创作的内容'], materials: ['素材库', '保存并管理创作参考内容'], creation: ['创作', '管理主题项目和多平台内容'], distribution: ['内容分发', '按项目查看并复制各平台发布内容'], stats: ['统计', '了解内容资产和 Token 使用趋势'], logs: ['日志', '查看操作、错误和 AI 调用记录'], settings: ['设置', '配置模型、数据和应用偏好']
};

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const escapeHtml = (s='') => String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

function init() {
  renderNav(); renderPage(); bindGlobal();
  if (!state.startupCompleted) setTimeout(()=>openStartupStep(1), 80);
}

function renderNav() {
  $('#main-nav').innerHTML = navItems.map(([id, icon, label]) => `<button class="nav-item ${state.page===id?'active':''}" data-page="${id}" aria-label="${label}" title="${label}"><span class="nav-icon">${icon}</span><span class="nav-label">${label}</span></button>`).join('');
}

function renderPage() {
  updateAllProjectStatuses();
  const [title, subtitle] = pageMeta[state.page]; $('#page-title').textContent = title; $('#page-subtitle').textContent = subtitle;
  const renders = { hotspots: renderHotspots, materials: renderMaterials, creation: renderCreation, distribution: renderDistribution, stats: renderStats, logs: renderLogs, settings: renderSettings };
  $('#page-content').innerHTML = renders[state.page](); renderNav(); bindPage();
}

function renderHotspots() {
  const tabs = ['聚合热点','平台榜单'];
  const platforms = ['全部平台','今日头条','百度','微博','抖音','知乎'];
  const q=state.hotQuery.trim().toLowerCase();
  const visibleHotspots=state.hotspots.filter(h=>(h.title+h.summary+h.sources.join(' ')).toLowerCase().includes(q));
  let body = '';
  if (state.hotTab === '聚合热点') body = visibleHotspots.length?`<div class="hot-list">${visibleHotspots.map((h,i)=>`<article class="card hot-row"><div class="rank ${i<3?'top':''}">${i+1}</div><div><div class="row-title">${h.title}</div><div class="row-meta">${h.summary}</div><div class="badges"><span class="badge primary">综合热度 ${h.heat.toLocaleString()}</span><span class="badge success">趋势 ${h.trend}</span>${h.sources.map(x=>`<span class="badge">${x}</span>`).join('')}</div></div><div class="row-actions"><button class="mini-btn" data-hot-detail="${h.id}">详情</button><button class="mini-btn" data-hot-material="${h.id}">收藏</button><button class="primary-btn" data-hot-create="${h.id}">创作</button></div></article>`).join('')}</div>`:renderNoResults('没有匹配的热点','清除关键词或切换时间范围后重试');
  if (state.hotTab === '平台榜单') {
    const rows = visibleHotspots.flatMap((h,i)=>h.sources.map((s,j)=>({h,i,j,platform:s.split(' ')[0],rank:s.split(' ')[1]||'#'+(i+j+1)}))).filter(x=>state.hotPlatform==='全部平台'||x.platform===state.hotPlatform);
    body = `<div class="platform-tabs">${platforms.map(p=>`<button class="tab ${state.hotPlatform===p?'active':''}" data-hot-platform="${p}">${p}</button>`).join('')}</div>${rows.length?`<div class="table-wrap"><table><thead><tr><th>排名</th><th>热点标题</th><th>热度</th><th>更新时间</th><th>操作</th></tr></thead><tbody>${rows.map(x=>`<tr><td>${x.rank}</td><td><strong>${x.h.title}</strong></td><td>${Math.round(x.h.heat/(x.j+1)).toLocaleString()}</td><td>${x.h.updated}</td><td><button class="mini-btn" data-hot-detail="${x.h.id}">详情</button></td></tr>`).join('')}</tbody></table></div>`:renderNoResults('当前条件下没有平台榜单','切换平台或清除搜索条件')}`;
  }
  return `<div class="toolbar"><div class="toolbar-group"><div class="tabs">${tabs.map(t=>`<button class="tab ${state.hotTab===t?'active':''}" data-hot-tab="${t}">${t}</button>`).join('')}</div><select id="hot-date" class="select" aria-label="热点时间范围"><option ${state.hotDate==='今天'?'selected':''}>今天</option><option ${state.hotDate==='昨天'?'selected':''}>昨天</option><option ${state.hotDate==='最近 7 天'?'selected':''}>最近 7 天</option><option ${state.hotDate==='最近 30 天'?'selected':''}>最近 30 天</option><option>自定义日期</option></select></div><div class="toolbar-group"><input id="hot-search" class="search" value="${escapeHtml(state.hotQuery)}" placeholder="搜索标题、摘要或来源" aria-label="搜索热点"><button class="secondary-btn" data-action="refresh-hot">↻ 刷新热点</button><button class="ghost-btn" data-action="simulate-hot-failure">演示部分失败</button></div></div>${state.hotRefreshNotice?`<div class="status-banner ${state.hotRefreshNotice.type}"><strong>${state.hotRefreshNotice.title}</strong><span>${state.hotRefreshNotice.text}</span><button class="mini-btn" data-action="dismiss-hot-notice">关闭</button></div>`:''}${body}`;
}

function renderMaterials() {
  const q=state.materialQuery.toLowerCase(); const rows=state.materials.filter(m=>(m.title+m.body+m.tags).toLowerCase().includes(q));
  const allSelected=rows.length&&rows.every(m=>state.selectedMaterials.has(m.id));
  return `<div class="toolbar"><div class="toolbar-group"><input id="material-search" class="search" value="${escapeHtml(state.materialQuery)}" placeholder="搜索标题或正文" aria-label="搜索素材"><span class="muted">${rows.length} 条素材</span></div><div class="toolbar-group"><button class="danger-btn ${state.selectedMaterials.size?'':'hidden'}" data-action="delete-materials">删除已选（${state.selectedMaterials.size}）</button><button class="primary-btn" data-action="new-material">＋ 新建素材</button></div></div>${rows.length?`<div class="table-wrap"><table><thead><tr><th><input class="checkbox" type="checkbox" data-action="select-all-materials" aria-label="全选当前结果" ${allSelected?'checked':''}></th><th>标题</th><th>标签</th><th>创建时间</th><th>最近使用</th><th>操作</th></tr></thead><tbody>${rows.map(m=>`<tr><td><input class="checkbox material-check" type="checkbox" value="${m.id}" aria-label="选择${escapeHtml(m.title)}" ${state.selectedMaterials.has(m.id)?'checked':''}></td><td><strong>${m.title}</strong><div class="muted log-detail">${m.body}</div></td><td>${m.tags||'—'}</td><td>${m.created}</td><td>${m.used}</td><td><button class="mini-btn" data-edit-material="${m.id}">编辑</button></td></tr>`).join('')}</tbody></table></div>`:renderNoResults('没有匹配的素材','清除搜索关键词或新建素材')}`;
}

function renderCreation() {
  if (state.currentProjectId) return renderProjectDetail();
  const q=state.creationQuery.trim().toLowerCase();const rows=state.projects.filter(p=>(p.name+p.source+p.platforms.join(' ')).toLowerCase().includes(q)&&(state.creationStatus==='全部状态'||p.status===state.creationStatus));
  return `<div class="toolbar"><div class="toolbar-group"><input id="creation-search" class="search" value="${escapeHtml(state.creationQuery)}" placeholder="搜索创作项目" aria-label="搜索创作项目"><select id="creation-status" class="select" aria-label="项目状态">${['全部状态','草稿','创作中','待分发','分发中','已完成'].map(x=>`<option ${state.creationStatus===x?'selected':''}>${x}</option>`).join('')}</select></div><button class="primary-btn" data-action="new-project">＋ 新建创作</button></div>${rows.length?`<div class="table-wrap"><table><thead><tr><th>项目名称</th><th>主题来源</th><th>平台</th><th>状态</th><th>更新时间</th><th>操作</th></tr></thead><tbody>${rows.map(p=>`<tr><td><button class="ghost-btn" data-open-project="${p.id}"><strong>${p.name}</strong></button></td><td>${p.source}</td><td>${p.platforms.map(x=>`<span class="badge">${x}</span>`).join(' ')}</td><td><span class="badge ${p.status==='待分发'||p.status==='已完成'?'success':p.status==='分发中'?'warning':'primary'}">${p.status}</span></td><td>${p.updated}</td><td><button class="mini-btn" data-open-project="${p.id}">打开</button> <button class="mini-btn" data-copy-project="${p.id}">复制</button></td></tr>`).join('')}</tbody></table></div>`:renderNoResults('没有匹配的创作项目','清除搜索或状态筛选条件')}`;
}

function renderProjectDetail() {
  const p=state.projects.find(x=>x.id===state.currentProjectId) || state.projects[0];
  const tabs=['创作设置','母稿','平台内容','图片素材'];
  let content='';
  if(state.projectTab==='创作设置') {
    const selectedHotspots=(p.hotspotIds||[]).map(id=>state.hotspots.find(h=>h.id===id)).filter(Boolean);
    const selectedMats=(p.materialIds||[]).map(id=>state.materials.find(m=>m.id===id)).filter(Boolean);
    const canGenerate=state.aiConfigured&&Boolean((p.settings?.topic||'').trim()||selectedHotspots.length);
    const sourceOptions=selectedHotspots.flatMap(h=>h.sources.map((source,index)=>({id:`${h.id}-${index}`,source,title:h.title})));
    content=`<div class="editor-panel"><div class="form-grid">
      <div class="field full"><label for="project-topic">创作话题</label><input class="input" id="project-topic" data-setting="topic" value="${escapeHtml(p.settings?.topic||'')}" placeholder="输入任意自定义话题"></div>
      <div class="field full"><div class="switch-row"><div><strong>AI 联网搜索相关信息 <span class="badge">后续版本</span></strong><div class="field-help">首版不内置搜索服务，请使用热点、素材或手动粘贴资料</div></div><input id="project-web-search" class="switch" type="checkbox" disabled></div></div>
      <div class="field full"><label>关联热点（可选，可多选）</label><div class="selection-box"><div class="selected-items">${selectedHotspots.length?selectedHotspots.map(h=>`<span class="selected-chip">${h.title}</span>`).join(''):'<span class="muted">未关联热点，将使用自定义话题</span>'}</div><button class="secondary-btn" data-action="select-hotspots">选择热点</button></div><span class="field-help">关联热点会以项目快照保存，不受热点历史清理影响</span></div>
      ${selectedHotspots.length?`<div class="field full"><div class="switch-row"><div><strong>读取热点链接正文</strong><div class="field-help">默认关闭；仅在生成母稿前读取所选来源</div></div><input id="project-read-bodies" class="switch" type="checkbox" ${p.readBodies?'checked':''}></div>${p.readBodies?`<div class="source-picker"><div class="toolbar"><span class="muted">选择正文来源</span><button class="mini-btn" data-action="select-top-sources">选择排名最高 3 个</button></div>${sourceOptions.map(x=>`<label class="source-option"><input class="checkbox source-check" type="checkbox" value="${x.id}" ${p.readSourceIds.includes(x.id)?'checked':''}><span><strong>${x.source}</strong><small>${x.title}</small></span></label>`).join('')}</div>`:''}</div>`:''}
      <div class="field full"><label for="project-insight">我的见解</label><textarea class="textarea" id="project-insight" data-setting="insight" placeholder="写下希望内容重点表达的判断">${escapeHtml(p.settings?.insight||'')}</textarea></div>
      ${settingSelect('audience','目标受众',p.settings?.audience||'普通读者',['普通读者','内容创作者','职场人群'])}
      ${settingSelect('style','内容风格',p.settings?.style||'理性分析',['理性分析','轻松分享','故事叙述'])}
      ${settingSelect('length','篇幅',p.settings?.length||'中等篇幅',['精简','中等篇幅','深度长文'])}
      ${settingSelect('stance','表达立场',p.settings?.stance||'客观中立',['客观中立','明确支持','批判反思'])}
      ${settingSelect('goal','营销目的',p.settings?.goal||'知识分享',['知识分享','品牌认知','线索转化','互动讨论'])}
      <div class="field full"><label>目标平台</label><div class="badges">${['微信公众号','小红书','抖音','今日头条'].map(x=>`<label class="badge"><input class="checkbox platform-selector" type="checkbox" value="${x}" ${p.platforms.includes(x)?'checked':''}> ${x}</label>`).join('')}</div><span class="field-help">至少选择一个平台</span></div>
      <div class="field full"><label>参考素材（可选）</label><div class="selection-box"><div class="selected-items">${selectedMats.length?selectedMats.map(m=>`<span class="selected-chip">${m.title} · ${p.materialPriorities?.[m.id]||'普通'}</span>`).join(''):'<span class="muted">尚未选择参考素材</span>'}</div><button class="secondary-btn" data-action="select-materials">选择素材</button></div><span class="field-help">重点素材在上下文超限时优先保留</span></div>
    </div><div class="toolbar" style="margin-top:18px"><span class="muted">${!state.aiConfigured?'请先在设置中配置 AI 模型':canGenerate?'设置将作为本次母稿生成上下文':'请先输入创作话题或关联热点'}</span><button class="primary-btn" data-action="generate-master" ${canGenerate&&p.platforms.length?'':'disabled'}>生成母稿 →</button></div></div>`;
  }
  if(state.projectTab==='母稿') content=p.master?`<div class="editor-panel"><div class="toolbar"><div><strong>母稿</strong><div class="muted">作为各平台内容的统一基础；修改后不会自动覆盖平台稿</div></div><button class="secondary-btn" data-action="refresh-master">↻ 重新生成</button></div><div class="rich-toolbar"><button data-format="bold"><b>B</b></button><button data-format="h2">H2</button><button data-format="quote">引用</button><button data-format="list">列表</button></div><div id="master-editor" class="rich-editor" contenteditable="true">${p.master}</div></div>`:`<div class="empty-state"><div class="empty-icon">文</div><h3>尚未生成母稿</h3><p>先完成创作设置，母稿确认后才能生成平台内容。</p><button class="primary-btn" data-project-tab="创作设置">返回创作设置</button></div>`;
  if(state.projectTab==='平台内容') content=renderPlatformContent(p);
  if(state.projectTab==='图片素材') content=renderImages(p);
  return `<div class="project-shell"><div class="card project-head"><div class="project-title-wrap"><button class="ghost-btn" data-action="back-projects">← 返回</button><input id="project-name" class="project-name-input" value="${escapeHtml(p.name)}" aria-label="项目名称"><div class="save-state">● 已自动保存${p.dirty?' · 尚未保存为版本':''}</div></div><div class="toolbar-group"><button class="secondary-btn" data-action="view-previous" ${p.previousVersion?'':'disabled'}>上一版本</button><button class="primary-btn" data-action="save-version">保存版本</button></div></div><div class="step-tabs">${tabs.map(t=>`<button class="step-tab ${state.projectTab===t?'active':''}" data-project-tab="${t}">${t}</button>`).join('')}</div><div class="card">${content}</div></div>`;
}

function settingSelect(key,label,value,options){return `<div class="field"><label for="setting-${key}">${label}</label><select id="setting-${key}" class="select" data-setting="${key}">${options.map(x=>`<option ${x===value?'selected':''}>${x}</option>`).join('')}</select></div>`;}

function renderPlatformContent(p) {
  const platforms=p.platforms; if(!platforms.includes(state.platformTab)) state.platformTab=platforms[0];
  if(!p.master) return `<div class="empty-state"><div class="empty-icon">1</div><h3>需要先生成母稿</h3><p>平台内容必须基于已确认的母稿生成。</p><button class="primary-btn" disabled>生成全部所选平台</button></div>`;
  const c=p.platformContent?.[state.platformTab];
  const error=p.platformErrors?.[state.platformTab];
  const fields = error?`<div class="error-state"><div class="empty-icon">!</div><h3>${state.platformTab}生成失败</h3><p>${error}</p><button class="primary-btn" data-action="retry-platform">重试当前平台</button></div>`:c?Object.entries(c).map(([k,v])=>{const rich=k==='body'&&['微信公众号','今日头条'].includes(state.platformTab); return `<div class="content-field"><div class="content-field-head"><strong>${platformFieldNames[k]||k}</strong><div><button class="mini-btn" data-copy-field="${k}">复制</button> <button class="mini-btn" data-refresh-field="${k}">↻ 刷新</button></div></div>${rich?`<div class="rich-editor platform-edit" contenteditable="true" data-field="${k}">${v}</div>`:`<textarea class="textarea platform-edit" data-field="${k}">${escapeHtml(v)}</textarea>`}<div class="field-help">已通过平台格式校验</div></div>`}).join(''):`<div class="empty-state compact"><h3>${state.platformTab}尚未生成</h3><p>点击右上角按钮生成全部所选平台，单个平台失败不会影响其他结果。</p></div>`;
  return `<div class="editor-panel"><div class="toolbar"><div class="platform-tabs">${platforms.map(x=>`<button class="tab ${state.platformTab===x?'active':''}" data-platform-tab="${x}">${x}${p.platformErrors?.[x]?' ⚠':''}</button>`).join('')}</div><div class="toolbar-group"><button class="ghost-btn" data-action="simulate-platform-failure">演示失败</button><button class="primary-btn" data-action="generate-platforms">${Object.keys(p.platformContent||{}).length?'生成缺失平台':'生成全部所选平台'}</button></div></div>${fields}</div>`;
}

function renderImages(p) {
  if(!Object.keys(p.platformContent||{}).length) return `<div class="empty-state"><div class="empty-icon">图</div><h3>尚无平台内容</h3><p>生成平台内容后，系统会按平台规格生成封面与配图提示词。</p></div>`;
  ensureProjectImages(p);const cards=p.images.filter(x=>p.platforms.includes(x.platform));
  return `<div class="editor-panel"><div class="toolbar"><div><strong>图片提示词与成品图</strong><div class="muted">图片、顺序和提示词保存在当前项目状态中</div></div><button class="secondary-btn" data-action="add-image-prompt">＋ 新增配图提示词</button></div><div class="image-grid">${cards.map(x=>`<div class="card image-card"><div><strong>${x.platform} · ${x.title}</strong><div class="muted">${x.ratio}${x.multi?' · 可上传多张':' · 仅保留一张'}</div></div><div class="image-placeholder">${x.files.length?x.files.map((file,i)=>`<img src="${file.url}" alt="${escapeHtml(x.title)} ${i+1}">`).join(''):'尚未上传成品图'}</div><textarea class="textarea image-prompt" data-image-id="${x.id}" style="min-height:92px">${escapeHtml(x.prompt)}</textarea><div class="toolbar-group" style="margin-top:8px"><label class="mini-btn">上传图片<input type="file" accept="image/*" data-image-upload="${x.id}" ${x.multi?'multiple':''} hidden></label><button class="mini-btn" data-refresh-image="${x.id}">↻ 提示词</button>${x.multi&&x.files.length>1?`<button class="mini-btn" data-sort-images="${x.id}">反转排序</button>`:''}${x.custom?`<button class="mini-btn danger-text" data-delete-image-prompt="${x.id}">删除提示词</button>`:''}</div></div>`).join('')}</div></div>`;
}

function renderDistribution() {
  const q=state.distributionQuery.trim().toLowerCase();
  const active=state.distributions.map(d=>({...d,visibleTasks:d.tasks.filter(t=>(state.distributionStatus==='全部状态'||t.status===state.distributionStatus)&&(state.distributionPlatform==='全部平台'||t.platform===state.distributionPlatform))})).filter(d=>state.projects.some(p=>p.id===d.projectId)&&d.visibleTasks.length&&(d.project.toLowerCase().includes(q)||d.visibleTasks.some(t=>t.platform.includes(q))));
  return `<div class="toolbar"><div class="toolbar-group"><input id="distribution-search" class="search" value="${escapeHtml(state.distributionQuery)}" placeholder="搜索项目" aria-label="搜索分发项目"><select id="distribution-status" class="select" aria-label="分发状态">${['全部状态','待分发','已复制','已发布'].map(x=>`<option ${state.distributionStatus===x?'selected':''}>${x}</option>`).join('')}</select><select id="distribution-platform" class="select" aria-label="分发平台">${['全部平台','微信公众号','小红书','抖音','今日头条'].map(x=>`<option ${state.distributionPlatform===x?'selected':''}>${x}</option>`).join('')}</select></div></div>${active.length?`<div class="table-wrap"><table><thead><tr><th>项目 / 平台</th><th>状态</th><th>更新时间</th><th>发布时间</th><th>操作</th></tr></thead><tbody>${active.map(d=>{const di=state.distributions.findIndex(x=>x.projectId===d.projectId);return `<tr class="parent-row"><td>⌄ ${d.project}<div class="muted">${d.tasks.filter(t=>t.status==='已发布').length}/${d.tasks.length} 已发布</div></td><td></td><td>${d.updated}</td><td>—</td><td></td></tr>${d.visibleTasks.map(t=>{const ti=d.tasks.findIndex(x=>x.platform===t.platform);return `<tr class="child-row"><td>${t.platform}${t.changedAfterPublish?' <span class="badge warning">发布后有修改</span>':''}</td><td><span class="badge ${t.status==='已发布'?'success':t.status==='已复制'?'warning':'primary'}">${t.status}</span></td><td>${d.updated}</td><td>${t.publishedAt?formatDateTime(t.publishedAt):'—'}</td><td><button class="mini-btn" data-distribution-detail="${di}-${ti}">查看与复制</button></td></tr>`}).join('')}`}).join('')}</tbody></table></div>`:renderNoResults('没有匹配的分发任务','清除搜索或筛选条件')}`;
}

function renderStats() {
  const limit=state.statsRange==='最近 7 天'?7:state.statsRange==='最近 30 天'?30:90;const usage=state.tokenUsage.slice(-limit);const max=Math.max(...usage.map(x=>x[1]+x[2]),1);const published=state.distributions.flatMap(d=>d.tasks).filter(t=>t.status==='已发布').length;const totalTasks=state.distributions.flatMap(d=>d.tasks).length;const creating=state.projects.filter(p=>p.status==='创作中').length;
  return `<div class="toolbar"><div></div><select id="stats-range" class="select" aria-label="统计时间范围">${['最近 7 天','最近 30 天','最近 90 天'].map(x=>`<option ${state.statsRange===x?'selected':''}>${x}</option>`).join('')}</select></div><div class="stat-grid"><div class="card stat-card"><small>热点总数</small><strong>${state.hotspots.length}</strong><span class="muted">当前原型数据</span></div><div class="card stat-card"><small>素材总数</small><strong>${state.materials.length}</strong><span class="muted">实时更新</span></div><div class="card stat-card"><small>创作项目</small><strong>${state.projects.length}</strong><span class="muted">${creating} 个创作中</span></div><div class="card stat-card"><small>已发布平台任务</small><strong>${published}</strong><span class="muted">完成率 ${totalTasks?Math.round(published/totalTasks*100):0}%</span></div></div><div class="card chart-card"><div class="toolbar"><div><strong>Token 使用趋势</strong><div class="muted">输入与输出 Token，单位：千</div></div><div class="badges"><span class="badge primary">输入</span><span class="badge success">输出</span></div></div><div class="chart">${usage.map(([d,input,output])=>`<div class="bar-group"><div class="bar in" style="height:${input/max*90}%"></div><div class="bar out" style="height:${output/max*90}%"></div><span class="bar-label">${d}</span></div>`).join('')}</div></div><div class="table-wrap"><table><thead><tr><th>日期</th><th>输入 Token</th><th>输出 Token</th><th>总 Token</th></tr></thead><tbody>${usage.slice().reverse().map(([d,input,output])=>`<tr><td>${d}</td><td>${input.toLocaleString()}</td><td>${output.toLocaleString()}</td><td><strong>${(input+output).toLocaleString()}</strong></td></tr>`).join('')}</tbody></table></div>`;
}

function renderLogs() {
  const tabs=['操作日志','错误日志','AI 调用'];const q=state.logQuery.trim().toLowerCase();const rows=state.logData[state.logTab].filter(r=>r.join(' ').toLowerCase().includes(q));
  return `<div class="toolbar"><div class="tabs">${tabs.map(t=>`<button class="tab ${state.logTab===t?'active':''}" data-log-tab="${t}">${t}</button>`).join('')}</div><div class="toolbar-group"><input id="log-search" class="search" value="${escapeHtml(state.logQuery)}" placeholder="搜索日志" aria-label="搜索日志"><button class="danger-btn" data-action="clear-logs" ${state.logData[state.logTab].length?'':'disabled'}>清空当前日志</button></div></div>${rows.length?`<div class="table-wrap"><table><thead><tr><th>时间</th><th>模块</th><th>操作/模型</th><th>结果</th><th>摘要</th></tr></thead><tbody>${rows.map(r=>`<tr>${r.map((x,i)=>`<td class="${i===4?'log-detail':''}">${i===3?`<span class="badge ${x==='成功'?'success':'warning'}">${x}</span>`:x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:renderNoResults(state.logData[state.logTab].length?'没有匹配日志':'当前日志为空',state.logData[state.logTab].length?'清除搜索关键词后重试':'后续操作记录会显示在这里')}`;
}

function renderSettings() {
  const tabs=['AI 模型','数据管理','日志与调试','关于']; let panel='';
  if(state.settingsTab==='AI 模型') panel=`<h2 class="section-title">AI 模型</h2><p class="section-desc">配置一套通用 OpenAI 兼容接口</p><div class="form-grid"><div class="field full"><label for="app-base-url">Base URL</label><input id="app-base-url" class="input" data-app-setting="baseUrl" value="${escapeHtml(state.appSettings.baseUrl)}"></div><div class="field full"><label for="app-api-key">API Key</label><input id="app-api-key" class="input" data-app-setting="apiKey" type="password" value="${escapeHtml(state.appSettings.apiKey)}"></div><div class="field full"><label for="app-model">模型名</label><input id="app-model" class="input" data-app-setting="model" value="${escapeHtml(state.appSettings.model)}"></div><div class="field"><label for="app-context">上下文窗口</label><input id="app-context" class="input" data-app-setting="contextTokens" type="number" value="${state.appSettings.contextTokens}"><span class="field-help">Token</span></div><div class="field"><label for="app-output">最大输出</label><input id="app-output" class="input" data-app-setting="outputTokens" type="number" value="${state.appSettings.outputTokens}"><span class="field-help">Token</span></div></div><div class="toolbar" style="margin-top:18px"><span class="muted">修改后自动保存；当前状态：${state.aiConfigured?'已配置':'未配置'}</span><button class="primary-btn" data-action="test-ai">测试连接</button></div>`;
  if(state.settingsTab==='数据管理') panel=`<h2 class="section-title">数据管理</h2><p class="section-desc">管理本地工作区、备份与热点历史</p><div class="field"><label for="workspace-path">数据目录</label><div class="toolbar-group"><input id="workspace-path" class="input" style="flex:1" value="${escapeHtml(state.workspacePath)}" readonly><button class="secondary-btn" data-action="open-folder">打开目录</button></div></div><hr><div class="switch-row"><div><strong>整库备份</strong><div class="field-help">包含数据库、图片和普通配置</div></div><button class="secondary-btn" data-action="backup">立即备份</button></div><div class="switch-row"><div><strong>恢复备份</strong><div class="field-help">恢复前会自动备份当前数据</div></div><button class="secondary-btn" data-action="restore" ${state.backups.length?'':'disabled'}>选择备份</button></div>${state.backups.length?`<div class="backup-list">${state.backups.map(x=>`<div class="backup-item"><strong>${x.name}</strong><span class="muted">${x.time} · 校验通过</span></div>`).join('')}</div>`:''}<div class="switch-row"><div><strong>清理热点历史</strong><div class="field-help">默认清理 30 天前的数据</div></div><button class="danger-btn" data-action="clean-hotspots">开始清理</button></div><div class="field" style="margin-top:16px"><label for="newsnow-url">NewsNow API 地址（高级）</label><input id="newsnow-url" class="input" data-app-setting="newsNowUrl" value="${escapeHtml(state.appSettings.newsNowUrl)}"></div>`;
  if(state.settingsTab==='日志与调试') panel=`<h2 class="section-title">日志与调试</h2><p class="section-desc">日志会在设定天数后自动清理</p><div class="field"><label for="log-days">日志保留天数</label><input id="log-days" class="input" data-app-setting="logDays" type="number" min="1" max="365" value="${state.appSettings.logDays}"></div><div class="switch-row"><div><strong>调试模式</strong><div class="field-help">临时记录完整 AI 请求和响应</div></div><input id="debug-mode" class="switch" data-app-setting="debugMode" type="checkbox" ${state.appSettings.debugMode?'checked':''} aria-label="调试模式"></div><div class="switch-row"><div><strong>清空全部日志</strong><div class="field-help">操作不可恢复</div></div><button class="danger-btn" data-action="clear-all-logs">清空日志</button></div>`;
  if(state.settingsTab==='关于') panel=`<h2 class="section-title">关于</h2><p class="section-desc">自媒体工作台桌面版</p><div class="stat-card card"><small>当前版本</small><strong style="font-size:20px">0.2.0 Prototype</strong><p class="muted">Windows / macOS · Electron</p><div class="toolbar-group"><button class="secondary-btn" data-action="check-update">检查更新</button><button class="secondary-btn" data-action="show-startup">重新查看启动向导</button></div></div>`;
  return `<div class="settings-layout"><div class="settings-nav">${tabs.map(t=>`<button class="${state.settingsTab===t?'active':''}" data-settings-tab="${t}">${t}</button>`).join('')}</div><div class="card settings-panel">${panel}</div></div>`;
}

function bindGlobal() {
  document.addEventListener('click', e=>{
    const page=e.target.closest('[data-page]'); if(page){state.page=page.dataset.page;state.currentProjectId=null;renderPage();}
    const action=e.target.closest('[data-action]')?.dataset.action; if(action) handleAction(action,e.target.closest('[data-action]'));
  });
  document.addEventListener('keydown',e=>{const modalOpen=!$('#modal').classList.contains('hidden');if(e.key==='Escape'){if(modalOpen)closeModal();else if($('#drawer').classList.contains('open'))closeDrawer();}if(e.key==='Tab'&&modalOpen){const focusable=$$('#modal button:not(:disabled), #modal input:not(:disabled), #modal textarea:not(:disabled), #modal select:not(:disabled)');if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
}

function bindPage() {
  $$('[data-hot-tab]').forEach(b=>b.onclick=()=>{state.hotTab=b.dataset.hotTab;renderPage();});
  $$('[data-hot-platform]').forEach(b=>b.onclick=()=>{state.hotPlatform=b.dataset.hotPlatform;renderPage();});
  $('#hot-date')?.addEventListener('change',e=>{state.hotDate=e.target.value;renderPage();toast(`已切换到${state.hotDate}`);});
  $('#hot-search')?.addEventListener('input',e=>{state.hotQuery=e.target.value;rerenderKeepingFocus('hot-search');});
  $$('[data-hot-detail]').forEach(b=>b.onclick=()=>openHotDetail(+b.dataset.hotDetail));
  $$('[data-hot-material]').forEach(b=>b.onclick=()=>saveHotAsMaterial(+b.dataset.hotMaterial));
  $$('[data-hot-create]').forEach(b=>b.onclick=()=>createFromHot(+b.dataset.hotCreate));
  $('#material-search')?.addEventListener('input',e=>{state.materialQuery=e.target.value;rerenderKeepingFocus('material-search');});
  $$('.material-check').forEach(c=>c.onchange=()=>{c.checked?state.selectedMaterials.add(+c.value):state.selectedMaterials.delete(+c.value);renderPage();});
  $$('[data-edit-material]').forEach(b=>b.onclick=()=>openMaterial(+b.dataset.editMaterial));
  $('#creation-search')?.addEventListener('input',e=>{state.creationQuery=e.target.value;rerenderKeepingFocus('creation-search');});
  $('#creation-status')?.addEventListener('change',e=>{state.creationStatus=e.target.value;renderPage();});
  $$('[data-open-project]').forEach(b=>b.onclick=()=>{state.currentProjectId=+b.dataset.openProject;state.projectTab='创作设置';renderPage();});
  $$('[data-copy-project]').forEach(b=>b.onclick=()=>copyProject(+b.dataset.copyProject));
  $$('[data-project-tab]').forEach(b=>b.onclick=()=>{state.projectTab=b.dataset.projectTab;renderPage();});
  $$('[data-platform-tab]').forEach(b=>b.onclick=()=>{state.platformTab=b.dataset.platformTab;renderPage();});
  $$('[data-copy-field]').forEach(b=>b.onclick=()=>copyField(b.dataset.copyField));
  $$('[data-refresh-field]').forEach(b=>b.onclick=()=>refreshField(b.dataset.refreshField));
  $$('[data-setting]').forEach(el=>el.addEventListener(el.tagName==='SELECT'?'change':'input',()=>updateProjectSetting(el.dataset.setting,el.value)));
  $('#project-name')?.addEventListener('input',e=>{const p=currentProject();p.name=e.target.value||'未命名创作项目';p.dirty=true;syncDistribution(p);showSaved();});
  $('#project-web-search')?.addEventListener('change',e=>{const p=currentProject();p.webSearch=e.target.checked;p.dirty=true;showSaved();});
  $('#project-read-bodies')?.addEventListener('change',e=>{const p=currentProject();p.readBodies=e.target.checked;p.dirty=true;if(!p.readBodies)p.readSourceIds=[];renderPage();});
  $$('.source-check').forEach(el=>el.addEventListener('change',()=>{const p=currentProject();p.readSourceIds=$$('.source-check').filter(x=>x.checked).map(x=>x.value);p.dirty=true;showSaved();}));
  $$('.platform-selector').forEach(el=>el.addEventListener('change',()=>{const p=currentProject();p.platforms=$$('.platform-selector').filter(x=>x.checked).map(x=>x.value);p.dirty=true;syncDistribution(p);renderPage();}));
  $('#master-editor')?.addEventListener('input',e=>{const p=currentProject();p.master=e.target.innerHTML;p.dirty=true;markPublishedContentChanged(p);showSaved();});
  $$('.platform-edit').forEach(el=>el.addEventListener('input',()=>{const p=currentProject();const content=p.platformContent[state.platformTab];content[el.dataset.field]=el.isContentEditable?el.innerHTML:el.value;p.dirty=true;markPublishedContentChanged(p,state.platformTab);showSaved();}));
  $$('[data-format]').forEach(el=>el.onclick=()=>{const commands={bold:['bold'],h2:['formatBlock','h2'],quote:['formatBlock','blockquote'],list:['insertUnorderedList']};const [command,value]=commands[el.dataset.format];document.execCommand(command,false,value);showSaved();});
  $$('.image-prompt').forEach(el=>el.addEventListener('input',()=>{const p=currentProject(),item=p.images.find(x=>x.id===el.dataset.imageId);item.prompt=el.value;p.dirty=true;showSaved();}));
  $$('[data-image-upload]').forEach(inp=>inp.onchange=()=>previewImage(inp));
  $$('[data-refresh-image]').forEach(btn=>btn.onclick=()=>refreshImagePrompt(btn.dataset.refreshImage));
  $$('[data-sort-images]').forEach(btn=>btn.onclick=()=>sortProjectImages(btn.dataset.sortImages));
  $$('[data-delete-image-prompt]').forEach(btn=>btn.onclick=()=>deleteImagePrompt(btn.dataset.deleteImagePrompt));
  $$('[data-distribution-detail]').forEach(b=>b.onclick=()=>openDistribution(b.dataset.distributionDetail));
  $('#distribution-search')?.addEventListener('input',e=>{state.distributionQuery=e.target.value;rerenderKeepingFocus('distribution-search');});
  $('#distribution-status')?.addEventListener('change',e=>{state.distributionStatus=e.target.value;renderPage();});
  $('#distribution-platform')?.addEventListener('change',e=>{state.distributionPlatform=e.target.value;renderPage();});
  $$('[data-log-tab]').forEach(b=>b.onclick=()=>{state.logTab=b.dataset.logTab;renderPage();});
  $('#log-search')?.addEventListener('input',e=>{state.logQuery=e.target.value;rerenderKeepingFocus('log-search');});
  $('#stats-range')?.addEventListener('change',e=>{state.statsRange=e.target.value;renderPage();});
  $$('[data-settings-tab]').forEach(b=>b.onclick=()=>{state.settingsTab=b.dataset.settingsTab;renderPage();});
  $$('[data-app-setting]').forEach(el=>el.addEventListener(el.type==='checkbox'?'change':'input',()=>saveAppSetting(el.dataset.appSetting,el.type==='checkbox'?el.checked:el.value)));
}

function handleAction(action, el) {
  const map={
    'toggle-theme':()=>{state.theme=state.theme==='light'?'dark':'light';document.documentElement.dataset.theme=state.theme;},
    'refresh-hot':simulateRefresh,
    'new-material':()=>openMaterial(),
    'delete-materials':confirmDeleteMaterials,
    'select-all-materials':toggleVisibleMaterials,
    'new-project':()=>createBlankProject(),
    'back-projects':()=>{state.currentProjectId=null;renderPage();},
    'generate-master':generateMaster,
    'select-hotspots':openHotspotSelector,
    'select-materials':openMaterialSelector,
    'select-top-sources':selectTopSources,
    'refresh-master':confirmRegenerateMaster,
    'save-version':saveVersion,
    'view-previous':openPreviousVersion,
    'generate-platforms':generatePlatforms,
    'add-image-prompt':addImagePrompt,
    'clear-logs':clearCurrentLogs,
    'clear-all-logs':clearAllLogs,
    'test-ai':testAI,
    'backup':runBackup,
    'restore':openRestoreModal,
    'clean-hotspots':()=>confirmModal('清理热点','预计删除 3,248 条 30 天前的历史记录；当前榜单不会受影响。确认继续？',()=>{state.cleanedHistoryCount=3248;toast('已清理 3,248 条历史热点');}),
    'open-folder':()=>toast('已打开数据目录（原型演示）'),
    'check-update':()=>toast('当前已是最新版本'),
    'simulate-hot-failure':simulateHotFailure,
    'dismiss-hot-notice':()=>{state.hotRefreshNotice=null;renderPage();},
    'simulate-platform-failure':simulatePlatformFailure,
    'retry-platform':retryPlatform,
    'show-startup':()=>openStartupStep(1),
    'close-modal':()=>closeModal(),
    'close-drawer':closeDrawer
  }; map[action]?.(el);
}

function openHotDetail(id) {
  const h=state.hotspots.find(x=>x.id===id); openDrawer(`<div class="drawer-header"><div><h2>${h.title}</h2><div class="badges"><span class="badge primary">综合热度 ${h.heat.toLocaleString()}</span><span class="badge success">${h.trend}</span></div></div><button class="icon-btn" data-action="close-drawer" aria-label="关闭热点详情">×</button></div><div class="drawer-body"><h3>AI 聚合摘要</h3><p>${h.summary}</p><div class="card" style="padding:14px;margin:16px 0"><div class="toolbar"><strong>热度趋势</strong><span class="muted">首次 ${h.first} · 更新 ${h.updated}</span></div><div class="progress"><span style="width:78%"></span></div></div><h3>来源明细</h3>${h.sources.map((s,i)=>`<div class="switch-row"><div><strong>${s}</strong><div class="muted">${h.title}</div></div><button class="mini-btn" onclick="openSourcePreview(${h.id},${i})">查看来源</button></div>`).join('')}</div><div class="drawer-footer"><button class="secondary-btn" onclick="saveHotAsMaterial(${h.id})">收藏为素材</button><button class="primary-btn" onclick="createFromHot(${h.id})">开始创作</button></div>`);
}
function openSourcePreview(id,index){const h=state.hotspots.find(x=>x.id===id),source=h.sources[index];h.manualBodies=h.manualBodies||{};const existing=h.manualBodies[index];$('#modal').innerHTML=`<div class="modal-content"><h2>${source}</h2><p class="muted">${h.title}</p>${existing?`<div class="status-banner success"><strong>正文已保存</strong><span>当前项目可将此正文作为参考。</span></div><div class="card distribution-content">${escapeHtml(existing)}</div>`:index===1?`<div class="status-banner warning"><strong>正文读取失败</strong><span>目标页面返回 403，已退回热点标题和摘要。</span></div><div class="field"><label for="manual-source-body">手动粘贴正文</label><textarea id="manual-source-body" class="textarea" placeholder="粘贴正文内容"></textarea></div><div class="modal-actions"><button class="secondary-btn" onclick="closeModal()">取消</button><button class="primary-btn" onclick="saveManualSource(${id},${index})">保存正文</button></div>`:`<div class="status-banner success"><strong>正文读取成功</strong><span>已提取标题和正文，生成项目时会保存快照。</span></div><div class="card distribution-content">${escapeHtml(h.summary)} 这是从来源页面提取的演示正文内容。</div>`}</div>`;showModal(true);}
function saveManualSource(id,index){const text=$('#manual-source-body').value.trim();if(!text)return toast('请先粘贴正文内容');const h=state.hotspots.find(x=>x.id===id);h.manualBodies=h.manualBodies||{};h.manualBodies[index]=text;closeModal(true);toast('正文已保存');}

function openMaterial(id) {
  const m=state.materials.find(x=>x.id===id)||{title:'',body:'',tags:''}; openDrawer(`<div class="drawer-header"><div><h2>${id?'编辑素材':'新建素材'}</h2><p class="muted">手动粘贴创作参考内容</p></div><button class="icon-btn" data-action="close-drawer" aria-label="关闭素材编辑">×</button></div><div class="drawer-body"><div class="form-grid"><div class="field full"><label for="material-title">标题</label><input id="material-title" class="input" value="${escapeHtml(m.title)}"></div><div class="field full"><label for="material-body">正文</label><textarea id="material-body" class="textarea" style="min-height:300px">${escapeHtml(m.body)}</textarea></div><div class="field full"><label for="material-tags">标签（可选）</label><input id="material-tags" class="input" value="${escapeHtml(m.tags)}" placeholder="自由文本，仅作为参考"></div></div></div><div class="drawer-footer"><button class="secondary-btn" data-action="close-drawer">取消</button><button class="primary-btn" onclick="saveMaterial(${id||0})">保存素材</button></div>`);
}

function saveMaterial(id) { const title=$('#material-title').value.trim(),body=$('#material-body').value.trim(),tags=$('#material-tags').value.trim(); if(!title||!body)return toast('标题和正文不能为空'); if(id){Object.assign(state.materials.find(x=>x.id===id),{title,body,tags});}else state.materials.unshift({id:Date.now(),title,body,tags,created:'今天',used:'从未使用'});closeDrawer();renderPage();toast('素材已保存'); }
function saveHotAsMaterial(id){const h=state.hotspots.find(x=>x.id===id);state.materials.unshift({id:Date.now(),title:h.title,body:h.summary,tags:'热点参考',created:'今天',used:'从未使用'});closeDrawer();toast('已收藏到素材库');}
function makeProject(overrides={}){return {id:Date.now(),name:'未命名创作项目',source:'自定义主题',platforms:['微信公众号'],hotspotIds:[],materialIds:[],materialPriorities:{},webSearch:false,readBodies:false,readSourceIds:[],status:'草稿',updated:'刚刚',published:0,master:'',platformContent:{},previousVersion:null,currentVersion:null,hasSavedVersion:false,images:[],platformErrors:{},dirty:false,settings:{topic:'',insight:'',audience:'普通读者',style:'理性分析',length:'中等篇幅',stance:'客观中立',goal:'知识分享'},...overrides};}
function createFromHot(id){const h=state.hotspots.find(x=>x.id===id);const p=makeProject({name:h.title,source:'聚合热点',platforms:['微信公众号','小红书'],hotspotIds:[id],settings:{topic:h.title,insight:'',audience:'普通读者',style:'理性分析',length:'中等篇幅',stance:'客观中立',goal:'知识分享'}});state.projects.unshift(p);syncDistribution(p);state.currentProjectId=p.id;state.page='creation';state.projectTab='创作设置';closeDrawer();renderPage();toast('已创建创作项目');}
function createBlankProject(){const p=makeProject();state.projects.unshift(p);syncDistribution(p);state.currentProjectId=p.id;state.page='creation';state.projectTab='创作设置';renderPage();}
function copyProject(id){const source=state.projects.find(x=>x.id===id);const p=clone(source);p.id=Date.now();p.name=source.name+'（副本）';p.status=source.status==='已完成'?'待分发':source.status;p.updated='刚刚';p.published=0;p.previousVersion=null;p.hasSavedVersion=false;state.projects.unshift(p);syncDistribution(p,true);renderPage();toast('项目副本已创建');}
function confirmDeleteMaterials(){confirmModal('删除素材',`确认删除已选择的 ${state.selectedMaterials.size} 条素材？`,()=>{state.materials=state.materials.filter(m=>!state.selectedMaterials.has(m.id));state.selectedMaterials.clear();renderPage();toast('素材已删除');});}

function openHotspotSelector(){
  const p=state.projects.find(x=>x.id===state.currentProjectId); const chosen=new Set(p.hotspotIds||[]);
  $('#modal').innerHTML=`<div class="modal-content"><h2>选择关联热点</h2><p class="muted">可关联多个热点，生成母稿时统一作为参考。</p><input id="selector-search" class="search" style="width:100%" placeholder="搜索热点"><div id="selector-list" class="selector-list"></div><div class="modal-actions"><button class="secondary-btn" id="modal-cancel">取消</button><button class="primary-btn" id="selector-save">保存选择</button></div></div>`;
  showModal(true);
  const draw=(q='')=>{$('#selector-list').innerHTML=state.hotspots.filter(h=>(h.title+h.summary).includes(q)).map(h=>`<label class="selector-row"><input class="checkbox hotspot-selector" type="checkbox" value="${h.id}" ${chosen.has(h.id)?'checked':''}><span><strong>${h.title}</strong><small>${h.summary}</small></span></label>`).join('')||'<div class="empty">没有匹配热点</div>';};
  draw(); $('#selector-search').oninput=e=>draw(e.target.value.trim()); $('#modal-cancel').onclick=closeModal;
  $('#selector-save').onclick=()=>{p.hotspotIds=$$('.hotspot-selector',$('#modal')).filter(x=>x.checked).map(x=>+x.value);closeModal();renderPage();toast(`已关联 ${p.hotspotIds.length} 个热点`);};
}

function openMaterialSelector(){
  const p=state.projects.find(x=>x.id===state.currentProjectId); const chosen=new Set(p.materialIds||[]);
  $('#modal').innerHTML=`<div class="modal-content"><h2>选择参考素材</h2><p class="muted">勾选素材，并指定重点或普通参考。</p><input id="selector-search" class="search" style="width:100%" placeholder="搜索素材标题或正文"><div id="selector-list" class="selector-list"></div><div class="modal-actions"><button class="secondary-btn" id="modal-cancel">取消</button><button class="primary-btn" id="selector-save">保存选择</button></div></div>`;
  showModal(true);
  const draw=(q='')=>{$('#selector-list').innerHTML=state.materials.filter(m=>(m.title+m.body).includes(q)).map(m=>`<div class="selector-row material-selector-row"><input class="checkbox material-selector" type="checkbox" value="${m.id}" ${chosen.has(m.id)?'checked':''}><span><strong>${m.title}</strong><small>${m.body}</small></span><select class="select material-priority" data-material-id="${m.id}" aria-label="${m.title}参考级别"><option ${p.materialPriorities?.[m.id]==='重点'?'selected':''}>重点</option><option ${p.materialPriorities?.[m.id]!=='重点'?'selected':''}>普通</option></select></div>`).join('')||'<div class="empty">没有匹配素材</div>';};
  draw(); $('#selector-search').oninput=e=>draw(e.target.value.trim()); $('#modal-cancel').onclick=closeModal;
  $('#selector-save').onclick=()=>{p.materialIds=$$('.material-selector',$('#modal')).filter(x=>x.checked).map(x=>+x.value);p.materialPriorities=Object.fromEntries(p.materialIds.map(id=>[id,$(`.material-priority[data-material-id="${id}"]`,$('#modal'))?.value||'普通']));closeModal();renderPage();toast(`已选择 ${p.materialIds.length} 条参考素材`);};
}

function generateMaster(){const p=currentProject();if(!(p.settings.topic.trim()||p.hotspotIds.length))return toast('请先输入创作话题或选择热点');if(!p.platforms.length)return toast('请至少选择一个目标平台');const btn=$('[data-action="generate-master"]')||$('[data-action="refresh-master"]');if(btn){btn.disabled=true;btn.textContent='正在整理参考资料…';}setTimeout(()=>{p.master=`<h2>${escapeHtml(p.settings.topic||'本次创作主题')}</h2><p>真正值得关注的不是单点工具，而是热点发现、素材整理、内容生成和平台适配开始形成连续流程。</p><p>${escapeHtml(p.settings.insight||'创作者可以把重复工作交给系统，把时间留给判断、观点和表达。')}</p><p class="muted">生成于 ${new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})}</p>`;p.dirty=true;markPublishedContentChanged(p);state.logData['AI 调用'].unshift(['刚刚','创作',state.appSettings.model,'成功','母稿生成 · 1,280 / 620 Token']);const last=state.tokenUsage[state.tokenUsage.length-1];last[1]+=1280;last[2]+=620;state.projectTab='母稿';renderPage();toast('母稿生成完成');},900);}
function confirmRegenerateMaster(){const p=currentProject();if(!p.master)return generateMaster();confirmModal('重新生成母稿','重新生成会覆盖当前母稿，已生成的平台稿保持不变。确认继续？',generateMaster);}
function generatePlatforms(){const p=currentProject();if(!p.master)return toast('请先生成并确认母稿');toast(`已加入生成队列：${p.platforms.length} 个平台`);setTimeout(()=>{p.platforms.forEach(platform=>{if(!p.platformContent[platform])p.platformContent[platform]=clone(platformTemplates[platform]);delete p.platformErrors[platform];});syncDistribution(p);state.logData['AI 调用'].unshift(['刚刚','创作',state.appSettings.model,'成功',`${p.platforms.length} 个平台生成完成 · 1,860 / 940 Token`]);const last=state.tokenUsage[state.tokenUsage.length-1];last[1]+=1860;last[2]+=940;renderPage();toast('所选平台内容生成完成');},900);}
function refreshField(field){const p=currentProject();confirmModal(`刷新${platformFieldNames[field]||field}`,`将覆盖${state.platformTab}的当前${platformFieldNames[field]||field}，确认继续？`,()=>{const content=p.platformContent[state.platformTab];const current=String(content[field]||'');content[field]=field==='body'?`${current}<p>补充观点：内容已根据最新母稿重新整理。</p>`:`${current.replace(/^【已刷新】/,'')}（优化版）`;p.dirty=true;markPublishedContentChanged(p,state.platformTab);renderPage();toast(`${platformFieldNames[field]||field}已更新`);});}
function copyField(field){const p=currentProject(),val=p.platformContent[state.platformTab][field];navigator.clipboard?.writeText(String(val).replace(/<[^>]*>/g,'')).catch(()=>{});markTaskCopied(p.id,state.platformTab);toast(`${platformFieldNames[field]||field}已复制，分发状态更新为“已复制”`);}
function showSaved(){const el=$('.save-state');if(el){el.textContent='● 保存中…';setTimeout(()=>{const p=currentProject();if(el.isConnected)el.textContent=`● 已自动保存${p?.dirty?' · 尚未保存为版本':''}`;},450);}}
function projectSnapshot(p){return {savedAt:'刚刚',master:p.master,platforms:clone(p.platformContent),images:p.images.map(x=>({...x,files:[...x.files]})),settings:clone(p.settings)};}
function saveVersion(){const p=currentProject();if(p.currentVersion)p.previousVersion=clone(p.currentVersion);p.currentVersion=projectSnapshot(p);p.hasSavedVersion=true;p.dirty=false;toast(p.previousVersion?'已保存新版本，原版本移至上一版本':'已保存首个版本');renderPage();}
function openPreviousVersion(){const p=currentProject();if(!p.previousVersion)return toast('当前项目还没有上一版本');openDrawer(`<div class="drawer-header"><div><h2>上一版本</h2><p class="muted">只读 · 保存于${p.previousVersion.savedAt}</p></div><button class="icon-btn" data-action="close-drawer">×</button></div><div class="drawer-body"><h3>母稿</h3><div class="card version-preview">${p.previousVersion.master||'无母稿'}</div><h3>平台</h3><div class="badges">${Object.keys(p.previousVersion.platforms||{}).map(x=>`<span class="badge">${x}</span>`).join('')||'<span class="muted">无平台内容</span>'}</div></div><div class="drawer-footer"><button class="primary-btn" onclick="restorePreviousVersion()">恢复为当前编辑稿</button></div>`);}
function restorePreviousVersion(){const p=currentProject();p.master=p.previousVersion.master;p.platformContent=clone(p.previousVersion.platforms);if(p.previousVersion.settings)p.settings=clone(p.previousVersion.settings);if(p.previousVersion.images)p.images=p.previousVersion.images.map(x=>({...x,files:[...x.files]}));p.dirty=true;markPublishedContentChanged(p);closeDrawer();renderPage();toast('上一版本已恢复到当前编辑稿，尚未建立新版本');}
function previewImage(inp){const p=currentProject(),item=p.images.find(x=>x.id===inp.dataset.imageUpload),files=[...inp.files];if(!item||!files.length)return;const uploaded=files.map(file=>({name:file.name,url:URL.createObjectURL(file)}));item.files=item.multi?[...item.files,...uploaded]:[uploaded[0]];p.dirty=true;renderPage();toast(`已保存 ${uploaded.length} 张图片到当前项目`);}

function openDistribution(key){const [di,ti]=key.split('-').map(Number),d=state.distributions[di],t=d.tasks[ti],p=state.projects.find(x=>x.id===d.projectId)||state.projects.find(x=>x.name===d.project),c=p?.platformContent?.[t.platform];if(!c)return toast('该平台内容尚未生成');openDrawer(`<div class="drawer-header"><div><h2>${t.platform}</h2><p class="muted">${d.project}</p><div class="badges">${!p.hasSavedVersion?'<span class="badge warning">当前编辑稿尚未保存版本</span>':''}${t.changedAfterPublish?'<span class="badge warning">发布后有修改</span>':''}</div></div><button class="icon-btn" data-action="close-drawer">×</button></div><div class="drawer-body">${Object.entries(c).map(([k,v])=>`<div class="content-field"><div class="content-field-head"><strong>${platformFieldNames[k]||k}</strong><button class="mini-btn" onclick="copyDistributionField(${di},${ti},'${k}')">复制</button></div><div class="card distribution-content">${v}</div></div>`).join('')}<div class="publish-panel"><h3>发布记录</h3><div class="form-grid"><div class="field"><label for="published-at">发布时间（可选）</label><input id="published-at" class="input" type="datetime-local" value="${t.publishedAt||''}"></div><div class="field"><label for="published-url">作品链接（可选）</label><input id="published-url" class="input" value="${escapeHtml(t.publishedUrl||'')}" placeholder="https://"></div></div><div class="toolbar" style="margin-top:14px"><span class="muted">当前状态：${t.status}</span><button class="primary-btn" onclick="markPublished(${di},${ti})">${t.status==='已发布'?'更新发布记录':'标记已发布'}</button></div></div></div>`);}
function copyDistributionField(di,ti,field){const d=state.distributions[di],t=d.tasks[ti],p=state.projects.find(x=>x.id===d.projectId),value=p.platformContent[t.platform][field];navigator.clipboard?.writeText(String(value).replace(/<[^>]*>/g,'')).catch(()=>{});t.status=t.status==='已发布'?'已发布':'已复制';t.copiedAt='刚刚';updateProjectStatus(p);openDistribution(`${di}-${ti}`);toast(`${platformFieldNames[field]||field}已复制`);}
function markPublished(di,ti){const d=state.distributions[di],t=d.tasks[ti];t.status='已发布';t.publishedAt=$('#published-at')?.value||new Date().toISOString().slice(0,16);t.publishedUrl=$('#published-url')?.value.trim()||'';t.changedAfterPublish=false;updateProjectStatus(state.projects.find(p=>p.id===d.projectId));closeDrawer();renderPage();toast('发布记录已保存');}

function renderNoResults(title,text){return `<div class="empty-state compact"><div class="empty-icon">?</div><h3>${title}</h3><p>${text}</p></div>`;}
function rerenderKeepingFocus(id){renderPage();const el=$(`#${id}`);if(el){el.focus();const len=el.value.length;el.setSelectionRange?.(len,len);}}
function calculateProjectStatus(project){const generated=project.platforms.filter(x=>project.platformContent?.[x]).length;if(!project.master)return '草稿';if(generated<project.platforms.length)return '创作中';const tasks=state.distributions.find(d=>d.projectId===project.id)?.tasks||[];if(tasks.length&&tasks.every(t=>t.status==='已发布'))return '已完成';if(tasks.some(t=>t.status==='已复制'||t.status==='已发布'))return '分发中';return '待分发';}
function updateProjectStatus(project){if(project)project.status=calculateProjectStatus(project);}
function updateAllProjectStatuses(){state.projects.forEach(updateProjectStatus);state.distributions.forEach(d=>{const p=state.projects.find(x=>x.id===d.projectId);if(p)d.project=p.name;});}
function toggleVisibleMaterials(){const q=state.materialQuery.toLowerCase(),visible=state.materials.filter(m=>(m.title+m.body+m.tags).toLowerCase().includes(q));const allSelected=visible.length&&visible.every(m=>state.selectedMaterials.has(m.id));visible.forEach(m=>allSelected?state.selectedMaterials.delete(m.id):state.selectedMaterials.add(m.id));renderPage();}
function clearCurrentLogs(){confirmModal('清空当前日志',`确认清空${state.logTab}？此操作不可恢复。`,()=>{state.logData[state.logTab]=[];renderPage();toast('当前日志已清空');});}
function clearAllLogs(){confirmModal('清空全部日志','确认清空操作、错误和 AI 调用记录？此操作不可恢复。',()=>{Object.keys(state.logData).forEach(key=>state.logData[key]=[]);renderPage();toast('全部日志已清空');});}
function saveAppSetting(key,value){const numeric=['contextTokens','outputTokens','logDays'].includes(key);state.appSettings[key]=numeric?+value:value;const storageKeys={baseUrl:'prototype-base-url',apiKey:'prototype-api-key',model:'prototype-model',contextTokens:'prototype-context-tokens',outputTokens:'prototype-output-tokens',newsNowUrl:'prototype-newsnow-url',logDays:'prototype-log-days',debugMode:'prototype-debug-mode'};localStorage.setItem(storageKeys[key],String(state.appSettings[key]));if(['baseUrl','apiKey','model'].includes(key)){state.aiConfigured=false;localStorage.setItem('prototype-ai-configured','false');}const panel=$('.settings-panel .section-desc');if(panel)panel.textContent='修改已自动保存';}
function simulateHotFailure(){state.hotRefreshNotice={type:'warning',title:'部分平台刷新失败',text:'微博、知乎请求超时；已保留今日头条、百度和抖音的最新数据。'};state.logData['错误日志'].unshift(['刚刚','热点','刷新热点','部分失败','微博、知乎请求超时，可单独重试']);renderPage();}
function simulatePlatformFailure(){const p=currentProject();p.platformErrors[state.platformTab]='请求超时，已自动重试 2 次，其他平台结果不受影响。';delete p.platformContent[state.platformTab];syncDistribution(p);renderPage();}
function retryPlatform(){const p=currentProject();p.platformContent[state.platformTab]=clone(platformTemplates[state.platformTab]);delete p.platformErrors[state.platformTab];syncDistribution(p);renderPage();toast(`${state.platformTab}重试成功`);}
function projectImageSpecs(){return {'微信公众号':[{title:'封面图',ratio:'21:9',multi:false},{title:'分享图',ratio:'1:1',multi:false},{title:'内容配图',ratio:'跟随正文',multi:true}],'小红书':[{title:'封面图',ratio:'16:9 或 9:16',multi:false},{title:'内容配图',ratio:'跟随正文',multi:true}],'抖音':[{title:'封面图',ratio:'9:16',multi:false}],'今日头条':[{title:'封面图',ratio:'16:9',multi:false},{title:'内容配图',ratio:'跟随正文',multi:true}]};}
function defaultImagePrompt(title){return title==='封面图'?'现代编辑工作台界面，内容创作者正在整理热点和多平台稿件，专业、克制、留有标题空间':'与正文核心观点对应的编辑场景插画，信息清晰，色彩克制';}
function ensureProjectImages(p){const specs=projectImageSpecs();p.images=p.images||[];p.platforms.forEach(platform=>(specs[platform]||[]).forEach(spec=>{const id=`${platform}-${spec.title}`;if(!p.images.some(x=>x.id===id))p.images.push({id,platform,...spec,prompt:defaultImagePrompt(spec.title),files:[],custom:false});}));}
function addImagePrompt(){const p=currentProject();ensureProjectImages(p);const platform=state.platformTab&&p.platforms.includes(state.platformTab)?state.platformTab:p.platforms[0];const id=`custom-${Date.now()}`;p.images.push({id,platform,title:'自定义配图',ratio:'跟随正文',multi:true,prompt:'补充一张与核心观点对应的内容配图',files:[],custom:true});p.dirty=true;renderPage();toast('已新增配图提示词');}
function refreshImagePrompt(id){const p=currentProject(),item=p.images.find(x=>x.id===id);if(!item)return;item.prompt=`${defaultImagePrompt(item.title)}，更新于 ${new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})}`;p.dirty=true;renderPage();toast('图片提示词已重新生成');}
function sortProjectImages(id){const p=currentProject(),item=p.images.find(x=>x.id===id);if(!item)return;item.files.reverse();p.dirty=true;renderPage();toast('图片顺序已更新');}
function deleteImagePrompt(id){const p=currentProject();p.images=p.images.filter(x=>x.id!==id);p.dirty=true;renderPage();toast('提示词已删除');}

function currentProject(){return state.projects.find(x=>x.id===state.currentProjectId);}
function updateProjectSetting(key,value){const p=currentProject();p.settings[key]=value;p.dirty=true;if(key==='topic'){if(p.name==='未命名创作项目'&&value.trim()){p.name=value.trim();syncDistribution(p);const nameInput=$('#project-name');if(nameInput)nameInput.value=p.name;}const generateBtn=$('[data-action="generate-master"]');if(generateBtn)generateBtn.disabled=!(state.aiConfigured&&(value.trim()||p.hotspotIds.length)&&p.platforms.length);}showSaved();}
function selectTopSources(){const p=currentProject();p.readSourceIds=$$('.source-check').slice(0,3).map(x=>x.value);renderPage();toast('已选择排名最高的 3 个来源');}
function syncDistribution(project,reset=false){let d=state.distributions.find(x=>x.projectId===project.id);if(!d){d={projectId:project.id,project:project.name,updated:'刚刚',tasks:[]};state.distributions.unshift(d);}d.project=project.name;d.updated=project.updated||'刚刚';const old=reset?[]:d.tasks;const generated=project.platforms.filter(platform=>project.platformContent?.[platform]);d.tasks=generated.map(platform=>old.find(t=>t.platform===platform)||{platform,status:'待分发',publishedAt:'',publishedUrl:'',changedAfterPublish:false});updateProjectStatus(project);}
function markTaskCopied(projectId,platform){const d=state.distributions.find(x=>x.projectId===projectId);const task=d?.tasks.find(x=>x.platform===platform);if(task&&task.status!=='已发布'){task.status='已复制';task.copiedAt='刚刚';}updateProjectStatus(state.projects.find(p=>p.id===projectId));}
function markPublishedContentChanged(project,platform){const d=state.distributions.find(x=>x.projectId===project.id);d?.tasks.forEach(task=>{if(task.status==='已发布'&&(!platform||task.platform===platform))task.changedAfterPublish=true;});}
function formatDateTime(value){return value?value.replace('T',' '):'—';}

function openStartupStep(step){
  if(step===1){
    $('#modal').innerHTML=`<div class="modal-content onboarding"><div class="onboarding-progress"><span class="active">1 数据目录</span><span>2 AI 配置</span></div><h2>选择业务数据目录</h2><p class="muted">数据库、图片和备份将统一保存在此目录。此步骤必须完成。</p><div class="field"><label for="startup-workspace">数据目录</label><div class="toolbar-group"><input id="startup-workspace" class="input" style="flex:1" value="${escapeHtml(state.workspacePath||'')}" placeholder="选择一个可读写目录"><button class="secondary-btn" onclick="chooseDemoWorkspace()">选择目录</button></div><span class="field-help">原型使用演示目录，不会实际写入文件。</span></div><div class="modal-actions"><button class="primary-btn" onclick="continueStartup()">继续</button></div></div>`;
  }else{
    $('#modal').innerHTML=`<div class="modal-content onboarding"><div class="onboarding-progress"><span>1 数据目录</span><span class="active">2 AI 配置</span></div><h2>配置 AI 模型</h2><p class="muted">可以跳过。未配置时仍能使用热点原始榜单和素材库。</p><div class="form-grid"><div class="field full"><label for="startup-base-url">Base URL</label><input id="startup-base-url" class="input" value="https://api.example.com/v1"></div><div class="field full"><label for="startup-api-key">API Key</label><input id="startup-api-key" class="input" type="password" value="sk-demo-key"></div><div class="field full"><label for="startup-model">模型名</label><input id="startup-model" class="input" value="mimo-v2-flash"></div></div><div class="modal-actions"><button class="secondary-btn" onclick="finishStartup(false)">暂不配置</button><button class="primary-btn" onclick="finishStartup(true)">测试并完成</button></div></div>`;
  }
  showModal(false);
}
function chooseDemoWorkspace(){state.workspacePath='D:\\SelfMediaWorkbench';$('#startup-workspace').value=state.workspacePath;toast('目录验证通过：可读写');}
function continueStartup(){const value=$('#startup-workspace').value.trim();if(!value)return toast('必须先选择数据目录');state.workspacePath=value;localStorage.setItem('prototype-workspace-path',value);openStartupStep(2);}
function finishStartup(configured){if(configured){state.appSettings.baseUrl=$('#startup-base-url').value.trim();state.appSettings.apiKey=$('#startup-api-key').value.trim();state.appSettings.model=$('#startup-model').value.trim();localStorage.setItem('prototype-base-url',state.appSettings.baseUrl);localStorage.setItem('prototype-api-key',state.appSettings.apiKey);localStorage.setItem('prototype-model',state.appSettings.model);}state.aiConfigured=configured;state.startupCompleted=true;localStorage.setItem('prototype-startup-completed','true');localStorage.setItem('prototype-ai-configured',String(configured));closeModal(true);toast(configured?'AI 连接成功，启动配置已完成':'已跳过 AI 配置，可稍后在设置中完成');}

function simulateRefresh(){const btn=$('[data-action="refresh-hot"]');btn.disabled=true;btn.textContent='获取榜单 2/5…';setTimeout(()=>btn.textContent='AI 聚合中…',800);setTimeout(()=>{btn.disabled=false;btn.textContent='↻ 刷新热点';state.hotspots[0].heat+=120;renderPage();toast('热点刷新完成：5 个平台成功');},1700);}
function testAI(){if(!state.appSettings.baseUrl.trim()||!state.appSettings.apiKey.trim()||!state.appSettings.model.trim())return toast('请完整填写 Base URL、API Key 和模型名');const btn=$('[data-action="test-ai"]');btn.disabled=true;btn.textContent='测试中…';setTimeout(()=>{state.aiConfigured=true;localStorage.setItem('prototype-ai-configured','true');state.logData['AI 调用'].unshift(['刚刚','设置',state.appSettings.model,'成功','连接测试 · 1.2s · 12 / 6 Token']);const last=state.tokenUsage[state.tokenUsage.length-1];last[1]+=12;last[2]+=6;btn.disabled=false;btn.textContent='测试连接';toast('连接成功 · 1.2s · 18 Token');},700);}
function runBackup(){toast('正在创建备份…');setTimeout(()=>{const stamp=new Date().toISOString().slice(0,16).replace(/[-:T]/g,'');state.backups.unshift({name:`SelfMediaWorkbench-${stamp}.zip`,time:'刚刚'});renderPage();toast('备份完成并通过完整性校验');},700);}
function openRestoreModal(){if(!state.backups.length)return toast('暂无可恢复备份');$('#modal').innerHTML=`<div class="modal-content"><h2>恢复备份</h2><p class="muted">恢复前将自动备份当前数据，完成后需要重启应用。</p><div class="selector-list">${state.backups.map((x,i)=>`<label class="selector-row"><input type="radio" name="restore-backup" value="${i}" ${i===0?'checked':''}><span><strong>${x.name}</strong><small>${x.time} · 完整性校验通过</small></span></label>`).join('')}</div><div class="modal-actions"><button class="secondary-btn" onclick="closeModal()">取消</button><button class="danger-btn" onclick="restoreBackup()">恢复并重启</button></div></div>`;showModal(true);}
function restoreBackup(){const selected=$('input[name="restore-backup"]:checked');if(!selected)return toast('请选择备份');state.backups.unshift({name:`恢复前自动备份-${Date.now()}.zip`,time:'刚刚'});closeModal(true);toast('恢复完成，原型已模拟重启');renderPage();}

function openDrawer(html){state.lastFocusedElement=document.activeElement;$('#drawer').innerHTML=html;$('#drawer').classList.add('open');$('#drawer-backdrop').classList.remove('hidden');setTimeout(()=>$('#drawer button, #drawer input, #drawer textarea')?.focus(),0);}
function closeDrawer(){$('#drawer').classList.remove('open');$('#drawer-backdrop').classList.add('hidden');state.lastFocusedElement?.focus?.();}
function showModal(dismissible=true){state.modalDismissible=dismissible;state.lastFocusedElement=document.activeElement;$('#modal').classList.remove('hidden');$('#modal-backdrop').classList.remove('hidden');setTimeout(()=>$('#modal input, #modal textarea, #modal select, #modal button')?.focus(),0);}
function confirmModal(title,text,onConfirm){$('#modal').innerHTML=`<div class="modal-content"><h2>${title}</h2><p>${text}</p><div class="modal-actions"><button class="secondary-btn" id="modal-cancel">取消</button><button class="danger-btn" id="modal-confirm">确认</button></div></div>`;showModal(true);$('#modal-cancel').onclick=()=>closeModal();$('#modal-confirm').onclick=()=>{closeModal(true);onConfirm();};}
function closeModal(force=false){if(!force&&!state.modalDismissible)return;$('#modal').classList.add('hidden');$('#modal-backdrop').classList.add('hidden');state.lastFocusedElement?.focus?.();}
function toast(text){const el=document.createElement('div');el.className='toast';el.textContent=text;$('#toast-stack').appendChild(el);setTimeout(()=>el.remove(),2600);}

window.saveMaterial=saveMaterial;window.createFromHot=createFromHot;window.saveHotAsMaterial=saveHotAsMaterial;window.closeDrawer=closeDrawer;window.closeModal=closeModal;window.toast=toast;window.markPublished=markPublished;window.copyDistributionField=copyDistributionField;window.restorePreviousVersion=restorePreviousVersion;window.chooseDemoWorkspace=chooseDemoWorkspace;window.continueStartup=continueStartup;window.finishStartup=finishStartup;window.openSourcePreview=openSourcePreview;window.saveManualSource=saveManualSource;window.restoreBackup=restoreBackup;
window.__prototypeTest={state,renderHotspots,renderMaterials,renderCreation,renderDistribution,renderStats,renderLogs,renderSettings,createBlankProject,updateProjectSetting,generateMaster,generatePlatforms,simulatePlatformFailure,retryPlatform,ensureProjectImages,addImagePrompt,refreshImagePrompt,sortProjectImages,deleteImagePrompt,saveVersion,restorePreviousVersion,syncDistribution,markTaskCopied,calculateProjectStatus,updateAllProjectStatuses,toggleVisibleMaterials,saveAppSetting,simulateHotFailure,clearCurrentLogs,clearAllLogs,projectSnapshot};
init();
