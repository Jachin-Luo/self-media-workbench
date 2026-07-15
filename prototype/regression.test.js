const assert = require('node:assert/strict');

const storage = new Map([
  ['prototype-startup-completed', 'true'],
  ['prototype-ai-configured', 'true'],
]);

function element(overrides = {}) {
  return {
    innerHTML: '', textContent: '', value: '', checked: false, disabled: false,
    isConnected: true, dataset: {}, style: {}, files: [],
    classList: { add() {}, remove() {}, contains() { return true; } },
    addEventListener() {}, focus() {}, setSelectionRange() {}, appendChild() {}, remove() {},
    querySelector() { return element(); }, querySelectorAll() { return []; },
    ...overrides,
  };
}

const elements = new Map();
const getElement = selector => {
  if (!elements.has(selector)) elements.set(selector, element());
  return elements.get(selector);
};

global.localStorage = {
  getItem(key) { return storage.has(key) ? storage.get(key) : null; },
  setItem(key, value) { storage.set(key, String(value)); },
};
global.document = {
  documentElement: { dataset: {} }, activeElement: element(),
  querySelector: getElement, querySelectorAll() { return []; },
  createElement() { return element(); }, addEventListener() {}, execCommand() {},
};
global.window = {};
global.navigator = { clipboard: { writeText() { return Promise.resolve(); } } };
global.URL = { createObjectURL(file) { return `blob:${file?.name || 'image'}`; } };

require('./app.js');
const api = window.__prototypeTest;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
  const { state } = api;

  state.hotQuery = '智能驾驶';
  assert.match(api.renderHotspots(), /新能源汽车智能驾驶/);
  assert.doesNotMatch(api.renderHotspots(), /国产动画/);
  state.hotQuery = '';

  state.materialQuery = '访谈';
  assert.match(api.renderMaterials(), /智能驾驶用户访谈/);
  api.toggleVisibleMaterials();
  assert.equal(state.selectedMaterials.has(3), true);
  api.toggleVisibleMaterials();
  assert.equal(state.selectedMaterials.has(3), false);
  state.materialQuery = '';

  api.createBlankProject();
  const project = state.projects[0];
  assert.equal(api.calculateProjectStatus(project), '草稿');
  api.updateProjectSetting('topic', '自动化回归测试主题');
  api.generateMaster();
  await wait(1000);
  assert.match(project.master, /自动化回归测试主题/);
  assert.equal(api.calculateProjectStatus(project), '创作中');

  api.generatePlatforms();
  await wait(1000);
  assert.ok(project.platformContent['微信公众号']);
  assert.equal(api.calculateProjectStatus(project), '待分发');

  api.simulatePlatformFailure();
  assert.ok(project.platformErrors['微信公众号']);
  assert.equal(project.platformContent['微信公众号'], undefined);
  api.retryPlatform();
  assert.ok(project.platformContent['微信公众号']);
  assert.equal(project.platformErrors['微信公众号'], undefined);

  api.ensureProjectImages(project);
  const baseImageCount = project.images.length;
  api.addImagePrompt();
  assert.equal(project.images.length, baseImageCount + 1);
  const custom = project.images.at(-1);
  api.refreshImagePrompt(custom.id);
  assert.match(custom.prompt, /更新于/);
  custom.files = [{ name: '1.png', url: 'blob:1' }, { name: '2.png', url: 'blob:2' }];
  api.sortProjectImages(custom.id);
  assert.equal(custom.files[0].name, '2.png');
  api.deleteImagePrompt(custom.id);
  assert.equal(project.images.some(x => x.id === custom.id), false);

  api.saveVersion();
  assert.ok(project.currentVersion);
  const firstVersionMaster = project.currentVersion.master;
  project.master = '<p>第二版母稿</p>';
  project.dirty = true;
  api.saveVersion();
  assert.equal(project.previousVersion.master, firstVersionMaster);
  api.restorePreviousVersion();
  assert.equal(project.master, firstVersionMaster);

  api.syncDistribution(project);
  api.markTaskCopied(project.id, '微信公众号');
  assert.equal(api.calculateProjectStatus(project), '分发中');
  const distribution = state.distributions.find(x => x.projectId === project.id);
  distribution.tasks.forEach(task => { task.status = '已发布'; });
  api.updateAllProjectStatuses();
  assert.equal(project.status, '已完成');

  state.currentProjectId = null;
  state.creationQuery = '不存在的项目';
  assert.match(api.renderCreation(), /没有匹配的创作项目/);
  state.creationQuery = '';
  state.distributionStatus = '已发布';
  assert.match(api.renderDistribution(), /已发布/);

  api.saveAppSetting('model', 'test-model');
  assert.equal(state.appSettings.model, 'test-model');
  assert.equal(storage.get('prototype-model'), 'test-model');

  api.simulateHotFailure();
  assert.equal(state.hotRefreshNotice.type, 'warning');
  assert.match(api.renderHotspots(), /部分平台刷新失败/);

  const beforePublished = state.distributions.flatMap(x => x.tasks).filter(x => x.status === '已发布').length;
  assert.match(api.renderStats(), new RegExp(`>${beforePublished}<`));

  state.logQuery = '请求超时';
  assert.match(api.renderLogs(), /请求超时/);
  state.logQuery = '';

  console.log('REGRESSION_OK');
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
