/* ═══════════════════════════════════════════
   API TESTER — LK-TEAM  |  app.js
   ═══════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   DOM References
───────────────────────────────────────── */
const $ = (() => {
  const cache = new Map();
  return id => {
    if (!cache.has(id)) {
      cache.set(id, document.getElementById(id));
    }
    return cache.get(id);
  };
})();

const themeToggle   = $('themeToggle');
const iconMoon      = $('iconMoon');
const iconSun       = $('iconSun');
const clearAllBtn   = $('clearAll');
const methodSelect  = $('methodSelect');
const methodBadge   = $('methodBadge');
const urlInput      = $('urlInput');
const sendBtn       = $('sendBtn');
const btnLoader     = $('btnLoader');
const tabBtns       = document.querySelectorAll('.tab-btn[data-tab]');
const rTabBtns      = document.querySelectorAll('.tab-btn[data-rtab]');
const headersList   = $('headersList');
const addHeaderBtn  = $('addHeader');
const paramsList    = $('paramsList');
const addParamBtn   = $('addParam');
const authTypeEl    = $('authType');
const authFields    = $('authFields');
const bodyTypeRadios= document.querySelectorAll('input[name="bodyType"]');
const bodyContent   = $('bodyContent');
const emptyState    = $('emptyState');
const responseContent = $('responseContent');
const statusBar     = $('statusBar');
const responseMeta  = $('responseMeta');
const responseBody  = $('responseBody');
const responseCode  = $('responseCode');
const responseHeadersList = $('responseHeadersList');
const copyBodyBtn   = $('copyBody');
const viewPrettyBtn = $('viewPretty');
const viewRawBtn    = $('viewRaw');
const toast         = $('toast');

/* ─────────────────────────────────────────
   State
───────────────────────────────────────── */
let _theme        = localStorage.getItem('lkt-theme') || 'dark';
let _rawResponse  = '';
let _isPretty     = true;
let _isLoading    = false;

/* ─────────────────────────────────────────
   Theme
───────────────────────────────────────── */
function applyTheme(t) {
  _theme = t;
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('lkt-theme', t);
  iconMoon.style.display = t === 'dark'  ? 'block' : 'none';
  iconSun.style.display  = t === 'light' ? 'block' : 'none';
}

applyTheme(_theme);

themeToggle.addEventListener('click', () => {
  applyTheme(_theme === 'dark' ? 'light' : 'dark');
});

/* ─────────────────────────────────────────
   Method Badge color
───────────────────────────────────────── */
const METHOD_CLASSES = {
  GET: 'badge-get', POST: 'badge-post', PUT: 'badge-put',
  PATCH: 'badge-patch', DELETE: 'badge-delete'
};
const METHOD_SELECT_CLASSES = {
  GET: 'method-get', POST: 'method-post', PUT: 'method-put',
  PATCH: 'method-patch', DELETE: 'method-delete'
};

function updateMethodUI(method) {
  // Badge
  methodBadge.className = 'method-badge ' + (METHOD_CLASSES[method] || 'badge-other');
  methodBadge.textContent = method;
  // Select color
  const colorClass = METHOD_SELECT_CLASSES[method] || 'method-other';
  methodSelect.className = 'method-select ' + colorClass;
}

methodSelect.addEventListener('change', () => updateMethodUI(methodSelect.value));
updateMethodUI(methodSelect.value);

/* ─────────────────────────────────────────
   Request Tabs
───────────────────────────────────────── */
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    document.querySelectorAll('.tab-content:not(.rtab-content)').forEach(tc => tc.classList.remove('active'));
    const el = $('tab-content-' + target);
    if (el) el.classList.add('active');
  });
});

/* ─────────────────────────────────────────
   Response Tabs
───────────────────────────────────────── */
rTabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.rtab;
    rTabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    document.querySelectorAll('.rtab-content').forEach(tc => { tc.classList.remove('active'); tc.style.display = 'none'; });
    const el = $('rtab-content-' + target);
    if (el) { el.classList.add('active'); el.style.display = 'block'; }
  });
});

/* ─────────────────────────────────────────
   KV Rows (Headers / Params)
───────────────────────────────────────── */
const kvRowTemplate = `
  <input type="text" class="kv-key" placeholder="Key" spellcheck="false" />
  <input type="text" class="kv-val" placeholder="Value" spellcheck="false" />
  <button class="kv-remove" aria-label="Remove row">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  </button>`;

function makeKvRow() {
  const row = document.createElement('div');
  row.className = 'kv-row';
  row.innerHTML = kvRowTemplate;
  row.querySelector('.kv-remove').addEventListener('click', () => {
    row.style.opacity = '0';
    row.style.transform = 'translateX(12px)';
    row.style.transition = 'all 0.18s ease';
    setTimeout(() => row.remove(), 180);
  });
  return row;
}

addHeaderBtn.addEventListener('click', () => headersList.appendChild(makeKvRow()));
addParamBtn.addEventListener('click',  () => paramsList.appendChild(makeKvRow()));

/* ─────────────────────────────────────────
   Body Types
───────────────────────────────────────── */
function renderBodyEditor(type) {
  bodyContent.innerHTML = '';
  if (type === 'none') return;

  if (type === 'json') {
    const ta = document.createElement('textarea');
    ta.className = 'body-editor';
    ta.id        = 'bodyEditor';
    ta.placeholder = '{\n  "key": "value"\n}';
    ta.spellcheck = false;
    bodyContent.appendChild(ta);
    // Format on blur
    ta.addEventListener('blur', () => {
      try {
        const parsed = JSON.parse(ta.value.trim());
        ta.value = JSON.stringify(parsed, null, 2);
      } catch { /* leave as-is */ }
    });
    return;
  }

  if (type === 'text') {
    const ta = document.createElement('textarea');
    ta.className = 'body-editor';
    ta.id        = 'bodyEditor';
    ta.placeholder = 'Plain text body…';
    ta.spellcheck = false;
    bodyContent.appendChild(ta);
    return;
  }

  if (type === 'form') {
    const wrap = document.createElement('div');
    wrap.className = 'kv-section';
    const list = document.createElement('div');
    list.className = 'kv-list';
    list.id = 'formList';
    list.appendChild(makeKvRow());
    const addBtn = document.createElement('button');
    addBtn.className = 'btn-add-row';
    addBtn.innerHTML = `
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>Add Field`;
    addBtn.addEventListener('click', () => list.appendChild(makeKvRow()));
    wrap.appendChild(list);
    wrap.appendChild(addBtn);
    bodyContent.appendChild(wrap);
  }
}

bodyTypeRadios.forEach(r => {
  r.addEventListener('change', () => renderBodyEditor(r.value));
});
renderBodyEditor('none');

/* ─────────────────────────────────────────
   Auth Fields
───────────────────────────────────────── */
function renderAuthFields(type) {
  authFields.innerHTML = '';
  if (type === 'none') return;

  const make = (label, id, placeholder, isPassword = false) => {
    const g = document.createElement('div');
    g.className = 'field-group';
    g.innerHTML = `
      <label class="field-label" for="${id}">${label}</label>
      <input type="${isPassword ? 'password' : 'text'}" class="field-input" id="${id}" placeholder="${placeholder}" spellcheck="false" autocomplete="off" />`;
    return g;
  };

  if (type === 'bearer') {
    authFields.appendChild(make('Token', 'authToken', 'Enter bearer token…', true));
  }

  if (type === 'basic') {
    authFields.appendChild(make('Username', 'authUser', 'username'));
    authFields.appendChild(make('Password', 'authPass', '••••••••', true));
  }

  if (type === 'apikey') {
    const g = document.createElement('div');
    g.className = 'field-group';
    g.innerHTML = `
      <label class="field-label" for="authKeyName">Add to</label>
      <div class="select-wrap">
        <select class="field-select" id="authKeyLocation">
          <option value="header">Header</option>
          <option value="query">Query Param</option>
        </select>
        <svg class="select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>`;
    authFields.appendChild(g);
    authFields.appendChild(make('Key Name', 'authKeyName', 'X-Api-Key'));
    authFields.appendChild(make('Key Value', 'authKeyValue', 'your-api-key…', true));
  }
}

authTypeEl.addEventListener('change', () => renderAuthFields(authTypeEl.value));

/* ─────────────────────────────────────────
   Collect Request Data
───────────────────────────────────────── */
function getKvPairs(list) {
  const pairs = {};
  list.querySelectorAll('.kv-row').forEach(row => {
    const k = row.querySelector('.kv-key').value.trim();
    const v = row.querySelector('.kv-val').value.trim();
    if (k) pairs[k] = v;
  });
  return pairs;
}

function buildURL() {
  const base = urlInput.value.trim();
  if (!base) return '';
  const params = getKvPairs(paramsList);
  if (!Object.keys(params).length) return base;
  try {
    const url = new URL(base);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    return url.toString();
  } catch {
    const qs = new URLSearchParams(params).toString();
    return base + (base.includes('?') ? '&' : '?') + qs;
  }
}

function buildHeaders() {
  const headers = getKvPairs(headersList);
  const bodyType = document.querySelector('input[name="bodyType"]:checked').value;
  const authType = authTypeEl.value;

  // Content-Type from body type
  if (bodyType === 'json' && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
  if (bodyType === 'form' && !headers['Content-Type']) headers['Content-Type'] = 'application/x-www-form-urlencoded';

  // Auth headers
  if (authType === 'bearer') {
    const token = ($('authToken') || {}).value || '';
    if (token) headers['Authorization'] = 'Bearer ' + token;
  }
  if (authType === 'basic') {
    const user = ($('authUser') || {}).value || '';
    const pass = ($('authPass') || {}).value || '';
    if (user) headers['Authorization'] = 'Basic ' + btoa(user + ':' + pass);
  }
  if (authType === 'apikey') {
    const loc  = ($('authKeyLocation') || {}).value;
    const name = ($('authKeyName') || {}).value || '';
    const val  = ($('authKeyValue') || {}).value || '';
    if (loc === 'header' && name) headers[name] = val;
  }

  return headers;
}

function buildBody() {
  const bodyType = document.querySelector('input[name="bodyType"]:checked').value;
  if (bodyType === 'none') return null;

  if (bodyType === 'json' || bodyType === 'text') {
    const ta = $('bodyEditor');
    return ta ? ta.value.trim() || null : null;
  }

  if (bodyType === 'form') {
    const pairs = getKvPairs($('formList') || document.createElement('div'));
    return new URLSearchParams(pairs).toString() || null;
  }

  return null;
}

/* ─────────────────────────────────────────
   JSON Syntax Highlighting
───────────────────────────────────────── */
const JSON_REGEX = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|[{}[\],:])/g;

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function highlightJSON(raw) {
  try {
    JSON.parse(raw);
  } catch {
    return escapeHtml(raw);
  }

  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(JSON_REGEX, match => {
      if (/^"/.test(match)) {
        if (/:$/.test(match)) return `<span class="json-key">${match}</span>`;
        return `<span class="json-str">${match}</span>`;
      }
      if (/true|false/.test(match)) return `<span class="json-bool">${match}</span>`;
      if (/null/.test(match))       return `<span class="json-null">${match}</span>`;
      if (/[{}[\],:]/.test(match)) return `<span class="json-punct">${match}</span>`;
      return `<span class="json-num">${match}</span>`;
    });
}

function prettyPrint(text, contentType) {
  if (!text) return '';
  const isJson = contentType && contentType.includes('application/json') ||
                 /^\s*[\[{]/.test(text);
  if (isJson) {
    try {
      const parsed = JSON.parse(text);
      return highlightJSON(JSON.stringify(parsed, null, 2));
    } catch { /* fall through */ }
  }
  return escapeHtml(text);
}

/* ─────────────────────────────────────────
   Status Badge
───────────────────────────────────────── */
function statusClass(code) {
  if (code >= 200 && code < 300) return 'status-2xx';
  if (code >= 300 && code < 400) return 'status-3xx';
  if (code >= 400 && code < 500) return 'status-4xx';
  if (code >= 500)               return 'status-5xx';
  return 'status-err';
}

const HTTP_STATUS_TEXT = {
  200:'OK',201:'Created',204:'No Content',
  301:'Moved Permanently',302:'Found',304:'Not Modified',
  400:'Bad Request',401:'Unauthorized',403:'Forbidden',
  404:'Not Found',405:'Method Not Allowed',409:'Conflict',
  422:'Unprocessable Entity',429:'Too Many Requests',
  500:'Internal Server Error',502:'Bad Gateway',503:'Service Unavailable',
  504:'Gateway Timeout'
};

/* ─────────────────────────────────────────
   Render Response
───────────────────────────────────────── */
function renderResponse(status, statusText, headers, body, elapsed) {
  emptyState.style.display  = 'none';
  responseContent.style.display = 'block';

  // Status bar
  const sc = statusClass(status);
  const st = statusText || HTTP_STATUS_TEXT[status] || '';
  statusBar.innerHTML = `
    <span class="status-pill ${sc}">${status} ${st}</span>
    <span class="status-meta"><span class="status-label">Time:&nbsp;</span>${elapsed}ms</span>
    <span class="status-meta"><span class="status-label">Size:&nbsp;</span>${humanBytes(body.length)}</span>`;

  // Response body
  _rawResponse = body;
  const ct = headers['content-type'] || headers['Content-Type'] || '';
  const html = _isPretty ? prettyPrint(body, ct) : escapeHtml(body);
  responseCode.innerHTML = html || '<span style="opacity:.4">— empty body —</span>';

  // Response headers
  responseHeadersList.innerHTML = '';
  Object.entries(headers).forEach(([k, v]) => {
    const row = document.createElement('div');
    row.className = 'resp-header-row';
    row.innerHTML = `<span class="resp-header-key">${escapeHtml(k)}</span><span class="resp-header-val">${escapeHtml(v)}</span>`;
    responseHeadersList.appendChild(row);
  });
}

function renderError(msg) {
  emptyState.style.display  = 'none';
  responseContent.style.display = 'block';
  statusBar.innerHTML = `<span class="status-pill status-err">Error</span> <span class="status-meta">${escapeHtml(msg)}</span>`;
  responseCode.innerHTML = `<span style="opacity:.5">${escapeHtml(msg)}</span>`;
  responseHeadersList.innerHTML = '';
  _rawResponse = '';
}

function humanBytes(n) {
  if (n < 1024) return n + ' B';
  if (n < 1048576) return (n / 1024).toFixed(1) + ' KB';
  return (n / 1048576).toFixed(2) + ' MB';
}

/* ─────────────────────────────────────────
   Send Request
───────────────────────────────────────── */
async function sendRequest() {
  if (_isLoading) return;
  const url = buildURL();
  if (!url) { showToast('⚠ Please enter an endpoint URL.'); return; }

  _isLoading = true;
  sendBtn.classList.add('loading');
  sendBtn.disabled = true;

  const method  = methodSelect.value;
  const headers = buildHeaders();
  const body    = ['GET','HEAD','OPTIONS'].includes(method) ? null : buildBody();

  const t0 = performance.now();
  try {
    const fetchOptions = {
      method,
      headers,
      ...(body !== null ? { body } : {})
    };

    const res = await fetch(url, fetchOptions);
    const elapsed = Math.round(performance.now() - t0);

    // Collate headers
    const resHeaders = {};
    res.headers.forEach((v, k) => { resHeaders[k] = v; });

    const responseText = await res.text();
    renderResponse(res.status, res.statusText, resHeaders, responseText, elapsed);

  } catch (err) {
    const elapsed = Math.round(performance.now() - t0);
    let msg = err.message;
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
      msg = 'Network error — check the URL or CORS policy. ' +
            'Some APIs block browser requests (CORS). Try a CORS proxy or a CORS-enabled endpoint.';
    }
    renderError(msg);
  } finally {
    _isLoading = false;
    sendBtn.classList.remove('loading');
    sendBtn.disabled = false;
  }
}

sendBtn.addEventListener('click', sendRequest);

// Also send on Enter in URL input
urlInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendRequest();
});

/* ─────────────────────────────────────────
   Pretty / Raw Toggle
───────────────────────────────────────── */
function updateView(pretty) {
  _isPretty = pretty;
  viewPrettyBtn.classList.toggle('active', pretty);
  viewRawBtn.classList.toggle('active', !pretty);

  if (!_rawResponse) return;
  const ct = ''; // reuse last content-type if needed
  responseCode.innerHTML = pretty
    ? (prettyPrint(_rawResponse, ct) || '<span style="opacity:.4">— empty —</span>')
    : (escapeHtml(_rawResponse)    || '<span style="opacity:.4">— empty —</span>');
}

viewPrettyBtn.addEventListener('click', () => updateView(true));
viewRawBtn.addEventListener('click',    () => updateView(false));

/* ─────────────────────────────────────────
   Copy Body
───────────────────────────────────────── */
copyBodyBtn.addEventListener('click', async () => {
  if (!_rawResponse) return;
  try {
    await navigator.clipboard.writeText(_rawResponse);
    copyBodyBtn.classList.add('copied');
    copyBodyBtn.querySelector('span').textContent = 'Copied!';
    setTimeout(() => {
      copyBodyBtn.classList.remove('copied');
      copyBodyBtn.querySelector('span').textContent = 'Copy';
    }, 1800);
  } catch {
    showToast('⚠ Could not copy to clipboard.');
  }
});

/* ─────────────────────────────────────────
   Clear All
───────────────────────────────────────── */
clearAllBtn.addEventListener('click', () => {
  urlInput.value = '';
  methodSelect.value = 'GET';
  updateMethodUI('GET');

  headersList.innerHTML = '';
  headersList.appendChild(makeKvRow());

  paramsList.innerHTML = '';
  paramsList.appendChild(makeKvRow());

  document.querySelector('input[name="bodyType"][value="none"]').checked = true;
  renderBodyEditor('none');

  authTypeEl.value = 'none';
  renderAuthFields('none');

  emptyState.style.display = 'flex';
  responseContent.style.display = 'none';
  _rawResponse = '';

  showToast('✓ All fields cleared.');
});

/* ─────────────────────────────────────────
   Toast
───────────────────────────────────────── */
let _toastTimer;
function showToast(msg) {
  clearTimeout(_toastTimer);
  toast.textContent = msg;
  toast.classList.add('show');
  _toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

/* ─────────────────────────────────────────
   Init: setup existing rows
───────────────────────────────────────── */
document.querySelectorAll('.kv-remove').forEach(btn => {
  btn.addEventListener('click', function() {
    const row = this.closest('.kv-row');
    if (!row) return;
    row.style.opacity    = '0';
    row.style.transform  = 'translateX(12px)';
    row.style.transition = 'all 0.18s ease';
    setTimeout(() => row.remove(), 180);
  });
});
