// Narrative & Imagery 模块作品数据配置

// 艺术媒介分类映射
export const MEDIA_CATEGORIES = {
  '板绘': ['灰蓝横', '灰蓝竖', '蓝绿横', '蓝绿竖', '高级灰横', '高级灰竖', '黑'],
  '综合材料': ['纹理', '线条', '色彩']
};

// 反向映射：从细分类别获取主媒介
export const getCategoryMedia = (category) => {
  for (const [media, categories] of Object.entries(MEDIA_CATEGORIES)) {
    if (categories.includes(category)) {
      return media;
    }
  }
  return '其他';
};

// 获取所有媒介类型
export const getAllMediaTypes = () => {
  return Object.keys(MEDIA_CATEGORIES);
};

// 判断图片比例类型
export const getAspectType = (width, height) => {
  const ratio = height / width;
  if (ratio > 1.1) return 'portrait'; // 长图
  if (ratio < 0.9) return 'landscape'; // 宽图
  return 'square'; // 正方形
};

// 筛选作品
export const filterWorks = (works, mediaTypes, aspectType) => {
  return works.filter(work => {
    const mediaMatch = mediaTypes.includes(work.media);
    const aspectMatch = work.aspectType === aspectType;
    return mediaMatch && aspectMatch;
  });
};

// 作品数据配置
export const narrativeImageryWorks = [
  // 灰蓝横 (2张)
  {
    id: 1,
    title: '灰蓝·01',
    category: '灰蓝横',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/灰蓝横/page_091_img_002 1.png',
    aspectType: 'landscape'
  },
  {
    id: 2,
    title: '灰蓝·02',
    category: '灰蓝横',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/灰蓝横/page_092_img_002 1.png',
    aspectType: 'landscape'
  },

  // 灰蓝竖 (3张)
  {
    id: 3,
    title: '灰蓝·03',
    category: '灰蓝竖',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/灰蓝竖/4d8ba3b18fda6dd866d9b419635df6e9 1.png',
    aspectType: 'portrait'
  },
  {
    id: 4,
    title: '灰蓝·04',
    category: '灰蓝竖',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/灰蓝竖/page_091_img_001 1.png',
    aspectType: 'portrait'
  },
  {
    id: 5,
    title: '灰蓝·05',
    category: '灰蓝竖',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/灰蓝竖/page_091_img_003 1.png',
    aspectType: 'portrait'
  },

  // 纹理 (5张)
  {
    id: 6,
    title: '纹理·01',
    category: '纹理',
    media: '综合材料',
    year: '2023',
    image: '/gallery/narrative-imagery/纹理/8d9290578c447b92ddd1a8a461940e28 1.png',
    aspectType: 'square'
  },
  {
    id: 7,
    title: '纹理·02',
    category: '纹理',
    media: '综合材料',
    year: '2023',
    image: '/gallery/narrative-imagery/纹理/40e1ba7d35f24669b3f50957bd2dd532 1.png',
    aspectType: 'square'
  },
  {
    id: 8,
    title: '纹理·03',
    category: '纹理',
    media: '综合材料',
    year: '2023',
    image: '/gallery/narrative-imagery/纹理/82d1b4d7bcc5fbcb7c07957373333237 1.png',
    aspectType: 'square'
  },
  {
    id: 9,
    title: '纹理·04',
    category: '纹理',
    media: '综合材料',
    year: '2023',
    image: '/gallery/narrative-imagery/纹理/e4dc0ce4d7e302f17c3559dc64a5e680 1.png',
    aspectType: 'square'
  },
  {
    id: 10,
    title: '纹理·05',
    category: '纹理',
    media: '综合材料',
    year: '2023',
    image: '/gallery/narrative-imagery/纹理/ea5494f4e4ac283b341d13a90bf6bb39 1.png',
    aspectType: 'square'
  },

  // 线条 (4张)
  {
    id: 11,
    title: '线条·01',
    category: '线条',
    media: '综合材料',
    year: '2023',
    image: '/gallery/narrative-imagery/线条/837084e9e39b3212ff285eaeace4cb94 1.png',
    aspectType: 'landscape'
  },
  {
    id: 12,
    title: '线条·02',
    category: '线条',
    media: '综合材料',
    year: '2023',
    image: '/gallery/narrative-imagery/线条/d2bed9d6e1624cf442c98ce4037f7088 1.png',
    aspectType: 'landscape'
  },
  {
    id: 13,
    title: '线条·03',
    category: '线条',
    media: '综合材料',
    year: '2023',
    image: '/gallery/narrative-imagery/线条/d326a8369d25dc74655e85a326b61978 1.png',
    aspectType: 'landscape'
  },
  {
    id: 14,
    title: '线条·04',
    category: '线条',
    media: '综合材料',
    year: '2023',
    image: '/gallery/narrative-imagery/线条/page_088_img_001 1.png',
    aspectType: 'landscape'
  },

  // 色彩 (7张)
  {
    id: 15,
    title: '色彩·01',
    category: '色彩',
    media: '综合材料',
    year: '2023',
    image: '/gallery/narrative-imagery/色彩/Group 2.png',
    aspectType: 'portrait'
  },
  {
    id: 16,
    title: '色彩·02',
    category: '色彩',
    media: '综合材料',
    year: '2023',
    image: '/gallery/narrative-imagery/色彩/Group 3.png',
    aspectType: 'portrait'
  },
  {
    id: 17,
    title: '色彩·03',
    category: '色彩',
    media: '综合材料',
    year: '2023',
    image: '/gallery/narrative-imagery/色彩/Group 4.png',
    aspectType: 'portrait'
  },
  {
    id: 18,
    title: '色彩·04',
    category: '色彩',
    media: '综合材料',
    year: '2023',
    image: '/gallery/narrative-imagery/色彩/Group 5.png',
    aspectType: 'portrait'
  },
  {
    id: 19,
    title: '色彩·05',
    category: '色彩',
    media: '综合材料',
    year: '2023',
    image: '/gallery/narrative-imagery/色彩/Group 6.png',
    aspectType: 'portrait'
  },
  {
    id: 20,
    title: '色彩·06',
    category: '色彩',
    media: '综合材料',
    year: '2023',
    image: '/gallery/narrative-imagery/色彩/Group 7.png',
    aspectType: 'portrait'
  },
  {
    id: 21,
    title: '色彩·07',
    category: '色彩',
    media: '综合材料',
    year: '2023',
    image: '/gallery/narrative-imagery/色彩/Group 8.png',
    aspectType: 'portrait'
  },

  // 蓝绿横 (3张)
  {
    id: 22,
    title: '蓝绿·01',
    category: '蓝绿横',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/蓝绿横/dbf27e041b776b9eec3e9945278b2d53 1.png',
    aspectType: 'landscape'
  },
  {
    id: 23,
    title: '蓝绿·02',
    category: '蓝绿横',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/蓝绿横/page_089_img_001 1.png',
    aspectType: 'landscape'
  },
  {
    id: 24,
    title: '蓝绿·03',
    category: '蓝绿横',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/蓝绿横/page_090_img_001 1.png',
    aspectType: 'landscape'
  },

  // 蓝绿竖 (6张)
  {
    id: 25,
    title: '蓝绿·04',
    category: '蓝绿竖',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/蓝绿竖/1a06538b4a7e350518ad94f7a1657378 1.png',
    aspectType: 'portrait'
  },
  {
    id: 26,
    title: '蓝绿·05',
    category: '蓝绿竖',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/蓝绿竖/64256d6904b99361fa24cbbda21c7d31 1.png',
    aspectType: 'portrait'
  },
  {
    id: 27,
    title: '蓝绿·06',
    category: '蓝绿竖',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/蓝绿竖/260572fabc39f12680ffa386f2cea254 1.png',
    aspectType: 'portrait'
  },
  {
    id: 28,
    title: '蓝绿·07',
    category: '蓝绿竖',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/蓝绿竖/e171649b0969efb54d1e1425ffa2b4fb 1.png',
    aspectType: 'portrait'
  },
  {
    id: 29,
    title: '蓝绿·08',
    category: '蓝绿竖',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/蓝绿竖/fc4ed6d6d28b35d39ac13d3ae7bd951d 1.png',
    aspectType: 'portrait'
  },
  {
    id: 30,
    title: '蓝绿·09',
    category: '蓝绿竖',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/蓝绿竖/page_092_img_003 1.png',
    aspectType: 'portrait'
  },

  // 高级灰横 (4张)
  {
    id: 31,
    title: '高级灰·01',
    category: '高级灰横',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/高级灰横/4e89aa03acbbb26b6bb2241d3b19d9a7 1.png',
    aspectType: 'landscape'
  },
  {
    id: 32,
    title: '高级灰·02',
    category: '高级灰横',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/高级灰横/322c0b7a8eece515317583b298b55287 1.png',
    aspectType: 'landscape'
  },
  {
    id: 33,
    title: '高级灰·03',
    category: '高级灰横',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/高级灰横/ec5120eb4801d9dde60e73c69b0ea1ef 1.png',
    aspectType: 'landscape'
  },
  {
    id: 34,
    title: '高级灰·04',
    category: '高级灰横',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/高级灰横/fafacf20bc0d04709d9fb465dd687610 1.png',
    aspectType: 'landscape'
  },

  // 高级灰竖 (7张)
  {
    id: 35,
    title: '高级灰·05',
    category: '高级灰竖',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/高级灰竖/194a5b1f7929d75ebb3bd6f43858c809 1.png',
    aspectType: 'portrait'
  },
  {
    id: 36,
    title: '高级灰·06',
    category: '高级灰竖',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/高级灰竖/22e991058e37eb48416d78e949c87fce 1.png',
    aspectType: 'portrait'
  },
  {
    id: 37,
    title: '高级灰·07',
    category: '高级灰竖',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/高级灰竖/2b43e047459a848dd8e6e1f029b00a12 1.png',
    aspectType: 'portrait'
  },
  {
    id: 38,
    title: '高级灰·08',
    category: '高级灰竖',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/高级灰竖/4054d16d79efe651e88656998873f0c5 1.png',
    aspectType: 'portrait'
  },
  {
    id: 39,
    title: '高级灰·09',
    category: '高级灰竖',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/高级灰竖/583effb6f06f81b3e73b2ac03bfdb913 1.png',
    aspectType: 'portrait'
  },
  {
    id: 40,
    title: '高级灰·10',
    category: '高级灰竖',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/高级灰竖/6ede8c77b9a5dac1bc8b0bca550a1efc 1.png',
    aspectType: 'portrait'
  },
  {
    id: 41,
    title: '高级灰·11',
    category: '高级灰竖',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/高级灰竖/d01634897fc1651df7a6350cc3a61fb5 1.png',
    aspectType: 'portrait'
  },

  // 黑 (5张)
  {
    id: 42,
    title: '黑·01',
    category: '黑',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/黑/7e7c9315871aa7ae5ad85be711105e8a 1.png',
    aspectType: 'portrait'
  },
  {
    id: 43,
    title: '黑·02',
    category: '黑',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/黑/ae59613f65ed00c5f155909f2a539db6 1.png',
    aspectType: 'portrait'
  },
  {
    id: 44,
    title: '黑·03',
    category: '黑',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/黑/page_092_img_001 1.png',
    aspectType: 'portrait'
  },
  {
    id: 45,
    title: '黑·04',
    category: '黑',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/黑/page_093_img_001 1.png',
    aspectType: 'portrait'
  },
  {
    id: 46,
    title: '黑·05',
    category: '黑',
    media: '板绘',
    year: '2023',
    image: '/gallery/narrative-imagery/黑/page_093_img_002 1.png',
    aspectType: 'portrait'
  }
];
