/* Rule-based, offline search. No external service or generated movie tags. */
(function (root) {
  'use strict';
  const CHAR_PAIRS = ['轻輕','松鬆','剧劇','爱愛','恋戀','惊驚','悚悚','悬懸','烧燒','脑腦','动動','画畫','温溫','疗療','愈癒','压壓','难難','过過','战戰','争爭','历歷','史史','纪紀','录錄','乐樂','亲親','谊誼','职職','场場','复復','仇仇','险險','幻幻','忧憂','郁鬱','气氣','氛氛','围圍','宁寧','静靜','泪淚','伤傷','释釋','怀懷','旧舊','纯純','谜謎','团團','枪槍','杀殺','恶惡','灵靈','异異','尸屍','诅詛','咒咒','励勵','传傳','记記','实實','视視','觉覺','学學','园園','运運','灾災','报報','逃逃','紧緊','张張','乐樂','无無','厘厘','头頭','间間','谍諜','间間','谐諧','乐樂','个個','这這','么麼','欢歡','压壓','厌厭','别別','开開','儿兒','与與','适適','睡睡','前前','后後','点點','结結','局局','转轉','侦偵','查查','戏戲','国國','韩韓','侣侶','乡鄉','闹鬧','绝絕','望望','阴陰','阳陽'];
  const chars = new Map(CHAR_PAIRS.map(pair => [pair[0], pair[1]]));
  function normalize(value) {
    return String(value == null ? '' : value).normalize('NFKC').toLowerCase()
      .replace(/[\u3400-\u9fff]/g, c => chars.get(c) || c)
      .replace(/[_\-—–・·,，、|/／;；:：()（）\[\]【】「」『』!！?？。．.]+/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }
  const compact = text => normalize(text).replace(/\s+/g, '');
  const rules = (root.MoodlumaSearchRules || []).map(rule => ({
    ...rule, triggers: [...new Set(rule.triggers.map(normalize))],
    terms: [...new Set(rule.terms.map(normalize))],
    excludeTerms: [...new Set((rule.excludeTerms || rule.terms).map(normalize))]
  }));
  const triggerMap = new Map();
  for (const rule of rules) for (const term of rule.triggers) if (!triggerMap.has(term)) triggerMap.set(term, rule);
  const triggers = [...triggerMap.keys()].sort((a,b) => b.length - a.length || a.localeCompare(b));
  const NEG = ['不想再看','不喜歡看','不想看','不喜歡','不要看','不要有','不想要','不愛看','排除掉','不要','別看','別有','不愛','排除','避開','不看','沒有','不會','除了','無','不'];
  const POS = ['但是','不過','可是','然而','但','想要看','想看','要看','喜歡','偏好','想要'];
  const FILLERS = /^(?:(?:請問|請|幫我|麻煩|我今天|今天很累|工作很累|有點累|下班後|下班了|下班|今天|我現在|現在|我|有什麼好看的|有沒有|有什麼|有甚麼|有啥|能不能|可以|推薦|找|找個|找一部|給我|想|要|看|一部|一些|幾部|部|點|這種|那種|有點|有|太多|很多|多一點|太|很|比較|一點|一下|電影|影片|片子|的|片|適合|一起|和|跟|以及|而且|或是|或者|還是|或|與|也|又|但|是|什麼|甚麼|啊|吧|嗎|呢|呀)\s*)+/;
  function trimFiller(text) {
    let s = text.trim(), previous;
    do {
      previous = s;
      s = s.replace(FILLERS, '').replace(/(?:的電影|的影片|電影|影片|片子|一點的|一點|一下|一部|的|片|啊|吧|嗎|呢|呀)+$/g, '').trim();
    } while (s !== previous);
    return s;
  }
  function atWord(text, position, word) {
    if (!text.startsWith(word, position)) return false;
    if (/^[a-z0-9]/.test(word) && /[a-z0-9]/.test(text[position - 1] || '')) return false;
    if (/[a-z0-9]$/.test(word) && /[a-z0-9]/.test(text[position + word.length] || '')) return false;
    return true;
  }
  function parse(input) {
    const original = String(input || '').trim().slice(0, 240);
    const text = normalize(original);
    const mask = text.split('');
    const tokens = [];
    let negative = false;
    const mark = (start, length) => { for (let k = start; k < start + length; k++) mask[k] = ' '; };
    for (let i = 0; i < text.length;) {
      const trigger = triggers.find(word => atWord(text, i, word));
      if (trigger) {
        tokens.push({ rule: triggerMap.get(trigger), negative, start: i, end: i + trigger.length });
        mark(i, trigger.length); i += trigger.length; continue;
      }
      const neutral = ['有沒有','能不能','可不可以','會不會'].find(word => text.startsWith(word, i));
      if (neutral) { mark(i, neutral.length); i += neutral.length; continue; }
      if (negative && text[i] === '的' && tokens.length && tokens[tokens.length - 1].negative) { negative = false; mark(i,1); i++; continue; }
      const neg = NEG.find(word => text.startsWith(word, i));
      if (neg && (!['不','無'].includes(neg) || triggers.some(word => text.startsWith(word, i + neg.length)))) { negative = true; mark(i, neg.length); i += neg.length; continue; }
      const pos = POS.find(word => text.startsWith(word, i));
      if (pos) { negative = false; mark(i, pos.length); i += pos.length; continue; }
      i++;
    }
    const include = [], exclude = [], seen = new Set();
    let lastPositive = null;
    for (const token of tokens) {
      const key = (token.negative ? '-' : '+') + token.rule.id;
      if (seen.has(key)) continue;
      seen.add(key);
      if (token.negative) { exclude.push(token.rule); lastPositive = null; }
      else {
        const gap = lastPositive ? text.slice(lastPositive.end, token.start) : '';
        if (lastPositive && /或|還是|\bor\b/.test(gap)) include[include.length - 1].push(token.rule);
        else include.push([token.rule]);
        lastPositive = token;
      }
    }
    // Residual names and unknown tags remain requirements; they are never silently discarded.
    const leftover = mask.join('');
    const literals = leftover.split(/\s{2,}|\s+(?:and|or)\s+|以及|而且|或者|或是|還是|和|與|但|或|又/)
      .map(trimFiller).map(s => s.trim()).filter(Boolean);
    const literalGroups = literals.map(value => ({ value, negative: false }));
    // Unknown exclusions such as "不要校車" must remain exclusions too.
    for (const item of literalGroups) {
      const start = text.indexOf(item.value);
      let prefix = start >= 0 ? text.slice(0, start).replace(/有沒有|能不能|可不可以|會不會/g, '') : '';
      const lastNeg = Math.max(...NEG.map(word => prefix.lastIndexOf(word)));
      const lastPos = Math.max(-1, ...POS.map(word => prefix.lastIndexOf(word)));
      if (lastNeg > lastPos) item.negative = true;
    }
    return { original, normalized: text, include, exclude, literals: literalGroups,
      active: Boolean(text), empty: Boolean(text) && !include.length && !exclude.length && !literalGroups.length,
      labels: { include: include.map(group => group.map(r => r.label).join(' 或 ')), exclude: exclude.map(r => r.label) } };
  }
  function values(value) {
    if (Array.isArray(value)) return value.flatMap(values);
    if (value && typeof value === 'object') return Object.values(value).flatMap(values);
    return String(value == null ? '' : value).split(/[,，、|/／\n;；]+/).map(s => s.trim()).filter(Boolean);
  }
  const KEYS = {
    genre: ['genres','genre','movieGenres','movieGenre','movie_genres','movie_genre','categories','category','types','type','電影類型','類型','分類'],
    mood: ['emotions','emotion','emotionKeywords','emotion_keywords','moodKeywords','mood_keywords','moods','mood','feel','feeling','情感','情緒'],
    atmosphere: ['atmospheres','atmosphere','atmosphereKeywords','atmosphere_keywords','vibes','vibe','ambience','ambiance','情感／氛圍','情感/氛圍','氛圍'],
    mainScene: ['scenesMain','sceneMain','mainScenes','mainScene','primaryScene','scenes_main','scene_main','main_scenes','main_scene','scenes','主要場景','主場景','場景'],
    subScene: ['scenesSub','sceneSub','subScenes','subScene','secondaryScene','scenes_sub','scene_sub','sub_scenes','sub_scene','次要場景','副場景'],
    keywords: ['keywords','keyword','tags','tag','關鍵字','標籤','電影關鍵字','genreKeywords','genre_keywords','類型關鍵字'],
    actors: ['actors','actor','cast','casts','演員','演員名單','主演','卡司'],
    director: ['director','directors','directorName','director_name','導演','導演名單']
  };
  const keyOf = text => String(text).toLowerCase().replace(/[\s_\-/／：:]/g, '');
  const cache = new WeakMap();
  function features(movie) {
    if (cache.has(movie)) return cache.get(movie);
    const raw = movie.raw || {};
    const rawEntries = Object.entries(raw);
    const result = {};
    for (const [field, aliases] of Object.entries(KEYS)) {
      const keySet = new Set(aliases.map(keyOf));
      const fromRaw = rawEntries.filter(([key]) => keySet.has(keyOf(key))).flatMap(([,value]) => values(value));
      result[field] = [...new Set((fromRaw.length ? fromRaw : values(movie[field])).map(normalize).filter(Boolean))];
    }
    result.title = [normalize(movie.title)];
    result.desc = [normalize(movie.desc)];
    result.year = values(movie.year || raw.year || raw.releaseYear || raw['年份']).map(normalize);
    cache.set(movie, result);
    return result;
  }
  function contains(haystack, needle) {
    if (!needle || !haystack) return false;
    if (/^[a-z0-9 ]+$/.test(needle)) {
      let pos = haystack.indexOf(needle);
      while (pos >= 0) {
        if (!/[a-z0-9]/.test(haystack[pos - 1] || '') && !/[a-z0-9]/.test(haystack[pos + needle.length] || '')) return true;
        pos = haystack.indexOf(needle, pos + 1);
      }
      return false;
    }
    return haystack.replace(/\s+/g, '').includes(needle.replace(/\s+/g, ''));
  }
  function affirmed(value, term) {
    if (!contains(value, term)) return false;
    const text = value.replace(/\s+/g, ''), needle = term.replace(/\s+/g, '');
    let i = text.indexOf(needle);
    while (i >= 0) {
      if (!/(?:沒有|無|非|不|不含|不帶|沒有任何)$/.test(text.slice(Math.max(0,i-5),i))) return true;
      i = text.indexOf(needle, i + 1);
    }
    return false;
  }
  const FIELDS = [['genre',96],['mood',94],['atmosphere',92],['keywords',90],['mainScene',84],['subScene',82]];
  function ruleMatch(feature, rule, exclusion = false) {
    let best = 0, matchedTag = '';
    const terms = exclusion ? rule.excludeTerms : rule.terms;
    for (const [field, weight] of FIELDS) for (const value of feature[field]) for (const term of terms) {
      if (affirmed(value,term)) {
        const score = compact(value) === compact(term) ? weight : weight - 5;
        if (score > best) { best = score; matchedTag = value; }
      }
    }
    // Titles/descriptions may supplement a positive query, never trigger an exclusion.
    if (!exclusion && !best) for (const field of ['title','desc']) for (const value of feature[field]) for (const term of terms) {
      if (affirmed(value,term)) { best = field === 'title' ? 72 : 58; matchedTag = rule.label; }
    }
    return { score: best, tag: matchedTag };
  }
  function literalMatch(feature, term, exclusion) {
    let best = 0;
    const fields = exclusion ? FIELDS : [['title',100],['actors',93],['director',93],...FIELDS,['desc',60],['year',65]];
    for (const [field,weight] of fields) for (const value of feature[field]) if (contains(value,term)) best = Math.max(best, weight);
    return best;
  }
  function match(movie, plan) {
    if (typeof plan === 'string') plan = parse(plan);
    const feature = features(movie);
    if (plan.empty) return { matched: false, score: 0, tags: [] };
    if (plan.exclude.some(rule => ruleMatch(feature,rule,true).score > 0)) return { matched:false,score:0,tags:[] };
    if (plan.literals.some(item => item.negative && literalMatch(feature,item.value,true))) return { matched:false,score:0,tags:[] };
    // Preserve direct film-title lookup, including titles containing everyday words.
    const exactTitle = compact(plan.original) && compact(movie.title) === compact(plan.original);
    const tags = [], scores = [];
    if (!exactTitle) {
      for (const group of plan.include) {
        const best = group.map(rule => ruleMatch(feature,rule)).sort((a,b)=>b.score-a.score)[0];
        if (!best || !best.score) return { matched:false,score:0,tags:[] };
        scores.push(best.score); if (best.tag) tags.push(best.tag);
      }
      for (const item of plan.literals.filter(item => !item.negative)) {
        const score = literalMatch(feature,item.value,false);
        if (!score) return { matched:false,score:0,tags:[] };
        scores.push(score); tags.push(item.value);
      }
    }
    const score = exactTitle ? 100 : scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 50;
    return { matched:true, score, tags:[...new Set(tags)] };
  }
  function stableCompare(a,b) {
    const left = [compact(a.title),String(a.year || ''),String(a.id || '')].join('|');
    const right = [compact(b.title),String(b.year || ''),String(b.id || '')].join('|');
    return left < right ? -1 : left > right ? 1 : 0;
  }
  function search(movies,input) {
    const plan = typeof input === 'string' ? parse(input) : input;
    const hits = movies.map(movie => ({movie,...match(movie,plan)})).filter(hit=>hit.matched);
    hits.sort((a,b)=>b.score-a.score || stableCompare(a.movie,b.movie));
    return { plan, hits };
  }
  function describe(plan) {
    const parts = [];
    if (plan.labels.include.length) parts.push('想看：' + plan.labels.include.join('、'));
    if (plan.labels.exclude.length) parts.push('排除：' + plan.labels.exclude.join('、'));
    const positive = plan.literals.filter(item=>!item.negative).map(item=>item.value);
    const negative = plan.literals.filter(item=>item.negative).map(item=>item.value);
    if (positive.length) parts.push('關鍵字：' + positive.join('、'));
    if (negative.length) parts.push('排除關鍵字：' + negative.join('、'));
    if (plan.empty) parts.push('請輸入片名、演員、標籤或想看的內容，例如「想看好笑的」。');
    if (plan.include.some(group=>group.some(rule=>rule.id==='親子'))) parts.push('親子結果依標籤搜尋，觀看前請確認電影分級。');
    return parts.join(' ｜ ');
  }
  function tagStrength(movie,tag) {
    const key = normalize(tag);
    const rule = rules.find(rule=>rule.triggers.includes(key) || rule.terms.includes(key));
    if (rule) return ruleMatch(features(movie),rule).score / 100;
    return literalMatch(features(movie),key,false) / 100;
  }
  root.MoodlumaSearch = Object.freeze({ parse, match, search, describe, normalize, stableCompare, tagStrength });
})(typeof globalThis !== 'undefined' ? globalThis : window);
