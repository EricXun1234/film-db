// Run: node tests/search.test.cjs. All film data here are synthetic fixtures.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root, 'search-rules.js'), 'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(root, 'search-engine.js'), 'utf8'), context);
const engine = context.MoodlumaSearch;
const movies = [
  {
    "desc": "",
    "actors": "周星馳",
    "mood": [
      "幽默",
      "歡樂"
    ],
    "genre": [
      "喜劇"
    ],
    "atmosphere": [
      "輕鬆"
    ],
    "mainScene": [],
    "subScene": [],
    "keywords": [
      "搞笑"
    ],
    "id": "comedy",
    "title": "開心旅店",
    "year": "2000"
  },
  {
    "desc": "",
    "actors": "",
    "mood": [
      "甜蜜"
    ],
    "genre": [
      "愛情",
      "浪漫喜劇"
    ],
    "atmosphere": [
      "溫馨"
    ],
    "mainScene": [],
    "subScene": [],
    "keywords": [
      "初戀"
    ],
    "id": "romcom",
    "title": "甜蜜午後",
    "year": "2020"
  },
  {
    "desc": "",
    "actors": "",
    "mood": [
      "悲傷",
      "心碎"
    ],
    "genre": [
      "愛情",
      "悲劇"
    ],
    "atmosphere": [],
    "mainScene": [],
    "subScene": [],
    "keywords": [
      "催淚"
    ],
    "id": "tragic",
    "title": "最後一封信",
    "year": "2021"
  },
  {
    "desc": "",
    "actors": "",
    "mood": [
      "驚嚇",
      "幽默"
    ],
    "genre": [
      "恐怖",
      "喜劇"
    ],
    "atmosphere": [],
    "mainScene": [],
    "subScene": [],
    "keywords": [
      "靈異"
    ],
    "id": "horrorcomedy",
    "title": "鬼屋派對",
    "year": "2022"
  },
  {
    "desc": "",
    "actors": "",
    "mood": [
      "緊張"
    ],
    "genre": [
      "驚悚",
      "懸疑"
    ],
    "atmosphere": [],
    "mainScene": [],
    "subScene": [],
    "keywords": [
      "反轉"
    ],
    "id": "thriller",
    "title": "密室倒數",
    "year": "2023"
  },
  {
    "desc": "",
    "actors": "",
    "mood": [],
    "genre": [
      "懸疑"
    ],
    "atmosphere": [],
    "mainScene": [],
    "subScene": [],
    "keywords": [
      "推理",
      "反轉"
    ],
    "id": "mystery",
    "title": "最後的線索",
    "year": "2020"
  },
  {
    "desc": "",
    "actors": "",
    "mood": [
      "熱血"
    ],
    "genre": [
      "動作",
      "冒險"
    ],
    "atmosphere": [],
    "mainScene": [],
    "subScene": [],
    "keywords": [],
    "id": "action",
    "title": "極速救援",
    "year": "2020"
  },
  {
    "desc": "",
    "actors": "",
    "mood": [],
    "genre": [
      "恐怖"
    ],
    "atmosphere": [],
    "mainScene": [],
    "subScene": [],
    "keywords": [
      "血腥",
      "獵奇"
    ],
    "id": "gore",
    "title": "血色迷宮",
    "year": "2019"
  },
  {
    "desc": "",
    "actors": "",
    "mood": [
      "溫暖"
    ],
    "genre": [
      "家庭",
      "動畫"
    ],
    "atmosphere": [],
    "mainScene": [],
    "subScene": [],
    "keywords": [
      "親子",
      "兒童"
    ],
    "id": "family",
    "title": "小熊回家",
    "year": "2018"
  },
  {
    "desc": "",
    "actors": "",
    "mood": [
      "希望"
    ],
    "genre": [
      "劇情"
    ],
    "atmosphere": [
      "安靜",
      "雨夜",
      "療癒"
    ],
    "mainScene": [],
    "subScene": [],
    "keywords": [],
    "id": "drama",
    "title": "雨中的家",
    "year": "2017"
  },
  {
    "desc": "",
    "actors": "",
    "mood": [
      "感動"
    ],
    "genre": [
      "動畫",
      "愛情"
    ],
    "atmosphere": [],
    "mainScene": [],
    "subScene": [],
    "keywords": [],
    "id": "title",
    "title": "你的名字",
    "year": "2016"
  },
  {
    "desc": "",
    "actors": "",
    "mood": [],
    "genre": [
      "動作"
    ],
    "atmosphere": [],
    "mainScene": [],
    "subScene": [],
    "keywords": [],
    "id": "mission",
    "title": "不可能的任務",
    "year": "1996"
  },
  {
    "desc": "",
    "actors": "",
    "mood": [],
    "genre": [
      "科幻"
    ],
    "atmosphere": [],
    "mainScene": [],
    "subScene": [],
    "keywords": [],
    "id": "english",
    "title": "Star Wars",
    "year": "1977"
  },
  {
    "desc": "這不是恐怖電影",
    "actors": "",
    "mood": [],
    "genre": [
      "劇情"
    ],
    "atmosphere": [
      "不恐怖",
      "輕鬆"
    ],
    "mainScene": [],
    "subScene": [],
    "keywords": [],
    "id": "nonhorror",
    "title": "溫柔夜晚",
    "year": "2019"
  },
  {
    "desc": "",
    "actors": "其他演員",
    "mood": [
      "幽默"
    ],
    "genre": [
      "喜劇"
    ],
    "atmosphere": [],
    "mainScene": [],
    "subScene": [],
    "keywords": [],
    "id": "otheractor",
    "title": "另一間旅店",
    "year": "2024"
  },
  {
    "desc": "",
    "actors": "",
    "mood": [],
    "genre": [
      "科幻"
    ],
    "atmosphere": [],
    "mainScene": [],
    "subScene": [],
    "keywords": [],
    "id": "director",
    "title": "夢中的城市",
    "raw": {
      "genres": [
        "科幻"
      ],
      "directors": [
        "諾蘭"
      ],
      "atmospheres": [
        "神秘"
      ]
    },
    "year": "2010"
  }
];
const cases = [
  [
    "想看好笑的",
    [
      "comedy",
      "romcom",
      "horrorcomedy",
      "otheractor"
    ],
    []
  ],
  [
    "有沒有搞笑電影",
    [
      "comedy",
      "romcom",
      "horrorcomedy",
      "otheractor"
    ],
    []
  ],
  [
    "想笑一下",
    [
      "comedy"
    ],
    [
      "tragic"
    ]
  ],
  [
    "想放鬆一下",
    [
      "comedy",
      "drama"
    ],
    [
      "gore"
    ]
  ],
  [
    "今天不想動腦",
    [
      "comedy"
    ],
    [
      "gore"
    ]
  ],
  [
    "今天很累想看輕鬆一點的",
    [
      "comedy"
    ],
    [
      "gore"
    ]
  ],
  [
    "想看點輕鬆的",
    [
      "comedy"
    ],
    []
  ],
  [
    "不要恐怖的",
    [
      "comedy",
      "nonhorror"
    ],
    [
      "gore",
      "horrorcomedy"
    ]
  ],
  [
    "不恐怖的懸疑片",
    [
      "mystery",
      "thriller"
    ],
    [
      "gore"
    ]
  ],
  [
    "想看愛情但不要太悲傷",
    [
      "romcom",
      "title"
    ],
    [
      "tragic"
    ]
  ],
  [
    "不要恐怖和悲劇",
    [
      "comedy"
    ],
    [
      "gore",
      "horrorcomedy",
      "tragic"
    ]
  ],
  [
    "想看喜劇不要血腥",
    [
      "comedy"
    ],
    [
      "gore"
    ]
  ],
  [
    "想看愛情或喜劇",
    [
      "comedy",
      "romcom",
      "tragic"
    ],
    [
      "action"
    ]
  ],
  [
    "愛情和喜劇",
    [
      "romcom"
    ],
    [
      "comedy",
      "tragic"
    ]
  ],
  [
    "周星馳的喜劇",
    [
      "comedy"
    ],
    [
      "otheractor"
    ]
  ],
  [
    "想看會哭的電影",
    [
      "tragic"
    ],
    [
      "gore"
    ]
  ],
  [
    "有沒有反轉很多的",
    [
      "thriller",
      "mystery"
    ],
    [
      "family"
    ]
  ],
  [
    "想看甜甜的戀愛",
    [
      "romcom"
    ],
    [
      "gore"
    ]
  ],
  [
    "跟朋友一起看",
    [
      "comedy",
      "action"
    ],
    [
      "gore"
    ]
  ],
  [
    "適合跟小朋友看的",
    [
      "family"
    ],
    [
      "gore"
    ]
  ],
  [
    "適合睡前看",
    [
      "drama"
    ],
    [
      "gore"
    ]
  ],
  [
    "適合下雨天",
    [
      "drama"
    ],
    [
      "action"
    ]
  ],
  [
    "諾蘭的科幻片",
    [
      "director"
    ],
    [
      "english"
    ]
  ],
  [
    "你的名字",
    [
      "title"
    ],
    [
      "action"
    ]
  ],
  [
    "想看你的名字",
    [
      "title"
    ],
    [
      "action"
    ]
  ],
  [
    "不可能的任務",
    [
      "mission"
    ],
    [
      "action"
    ]
  ],
  [
    "star wars",
    [
      "english"
    ],
    [
      "action"
    ]
  ],
  [
    "war",
    [],
    [
      "english"
    ]
  ],
  [
    "喜劇 不要 外星人",
    [
      "comedy"
    ],
    []
  ],
  [
    "輕鬆xyz",
    [],
    [
      "comedy"
    ]
  ],
  [
    "轻松一点的",
    [
      "comedy"
    ],
    [
      "gore"
    ]
  ],
  [
    "喜劇不要恐怖和血腥",
    [
      "comedy"
    ],
    [
      "gore",
      "horrorcomedy"
    ]
  ],
  [
    "想看開心一點的",
    [
      "comedy"
    ],
    [
      "gore"
    ]
  ],
  [
    "有沒有輕鬆又不要恐怖的",
    [
      "comedy",
      "nonhorror"
    ],
    [
      "horrorcomedy",
      "gore"
    ]
  ]
];
let passed = 0;
for (const [query, wanted, unwanted] of cases) {
  const ids = Array.from(engine.search(movies, query).hits, hit => hit.movie.id);
  for (const id of wanted) assert(ids.includes(id), query + ': missing ' + id);
  for (const id of unwanted) assert(!ids.includes(id), query + ': unexpected ' + id);
  passed++;
}
const ids = (items, query) => Array.from(engine.search(items,query).hits,hit=>hit.movie.id);
assert.deepEqual(ids(movies,'想看好笑的'), ids(movies,'有沒有搞笑電影')); passed++;
assert.deepEqual(ids(movies,'喜劇'),ids([...movies].reverse(),'喜劇')); passed++;
assert.equal(engine.search(movies,'找不到的標籤xyz').hits.length,0); passed++;
assert.equal(engine.parse('有沒有好笑的').exclude.length,0); passed++;
assert.equal(engine.parse('今天不想動腦').exclude.length,0); passed++;
assert(engine.describe(engine.parse('跟小朋友一起看')).includes('分級')); passed++;
// HTML input is text, not executable markup.
assert.equal(engine.search(movies,'<img src=x onerror=alert(1)>').hits.length,0); passed++;
console.log(passed + ' search checks passed.');
