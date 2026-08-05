export const messages = {
  'zh-CN': {
    // 导航与全局
    navMap: '地图',
    navList: '列表',
    navAdd: '添加',
    disclaimer: '⚠️ 安全第一：户外活动需家长全程看护，注意水深、山洪、地形等风险，风险自负。地图数据来自 OpenStreetMap 与社区贡献，仅供参考，以实地为准。',
    modeCloud: '🌐 已连接云端：你的标注将全球共享',
    modeLocal: '💾 本地模式：标注仅保存在本机浏览器',
    langZh: '中文',
    langEn: 'EN',

    // 地图页
    searchPlaceholder: '搜索城市或地点，如 Tokyo / 巴黎 / 公园',
    search: '搜索',
    filter: '筛选',
    locate: '定位',
    list: '列表',
    category: '类别',
    preferences: '偏好',
    kidFriendlyOnly: '只看亲子友好',
    filterNote: '安全等级/亲子友好等筛选仅作用于社区补充的地点；OSM 种子点为公开底图数据。',
    loading: '正在加载附近地点…',
    mark: '标记',
    contribute: '补充安全信息',
    locateFail: '定位失败，请检查浏览器位置权限',
    notFound: '未找到该地点',
    searchFail: '搜索失败，请稍后重试',
    safety: '安全须知',
    safetyTitle: '安全须知与免责声明',
    safetyRules: [
      '户外活动安全第一：家长/监护人须全程看护孩子，切勿让孩子单独涉水或离开视线',
      '玩水前请确认水深、流速与天气，警惕山洪、上游泄洪与暗流漩涡',
      '出发前查询当地公告、天气与预警信息，以官方渠道为准；恶劣天气请勿前往',
      '安全等级为高风险的区域，不建议携带幼童前往；野地、陡坡请勿攀爬',
      '注意防晒防暑、防蚊虫叮咬，自备饮用水与必要应急物资'
    ],
    disclaimerTitle: '免责声明',
    safetyDisclaimer: '本平台地点信息来源于 OpenStreetMap 种子数据与社区用户贡献，未经专业机构核验；地图上的安全等级、水深、流速等信息为用户主观标注，仅供参考，不构成任何安全保证或专业建议。使用者应自行核实现场情况并风险自负，平台不对任何户外活动导致的人身或财产损失承担责任。',
    dataAttribution: '地图数据 © OpenStreetMap contributors · 高德地图，按各自许可协议使用',
    safetyModalTitle: '安全须知确认',
    safetyModalIntro: '使用撒欢地图前，请确认你已阅读并了解以下安全须知与免责声明：',
    safetyAgree: '我已阅读并同意',
    safetyBrowseOnly: '本次仅浏览',
    termsTitle: '服务条款',
    privacyTitle: '隐私政策',
    legalUpdated: '更新日期',
    termsBody: `
<h2>1. 服务说明</h2>
<p>撒欢地图（FamilySpots）是一个开源、免费的亲子户外地点信息共享平台。用户可浏览、搜索、标注和分享亲子户外地点（玩水、爬山、公园、乐园等），并为地点补充安全相关信息（如风险等级、水深、流速、设施等）。</p>
<h2>2. 用户贡献内容（UGC）</h2>
<p>2.1 用户对其提交的所有内容（包括但不限于地点名称、坐标、描述、安全信息、评分、图片等）的真实性、准确性、合法性负全部责任。</p>
<p>2.2 禁止提交以下内容：虚假或误导性信息；涉及国家秘密、军事设施、敏感区域的信息；违法、色情、暴力、仇恨或侵犯他人合法权益的内容；广告或商业推广信息。</p>
<p>2.3 用户授予平台及其社区在服务范围内使用、展示、分发其贡献内容的权利，用于提供和改进本服务。</p>
<h2>3. 信息仅供参考</h2>
<p>平台上的地点与安全信息由 OpenStreetMap 公开数据与社区用户提供，未经专业机构核验，仅供参考，不构成任何安全保证或专业建议。用户应自行核实现场情况，并独立判断是否适合前往。</p>
<h2>4. 免责声明</h2>
<p>4.1 户外活动存在固有风险。平台不对因使用本服务或前往地图标注地点而导致的任何人身伤害、财产损失或其他损害承担责任。</p>
<p>4.2 平台不对第三方服务（包括但不限于地图数据提供商、网络基础设施）的可用性、准确性负责。</p>
<h2>5. 账户与安全</h2>
<p>用户应妥善保管账户凭证。如发现账户被未经授权使用，应及时通知平台。</p>
<h2>6. 知识产权</h2>
<p>平台代码以 MIT 许可证开源发布。地图数据版权归各数据提供方（OpenStreetMap、高德等）所有，按其各自许可协议使用。用户贡献的内容版权归贡献者所有。</p>
<h2>7. 条款变更</h2>
<p>平台可能适时修订本条款。重大变更将通过在服务内公示的方式通知用户。继续使用本服务即视为接受修订后的条款。</p>
<h2>8. 联系我们</h2>
<p>如有任何疑问，可通过本项目的 GitHub 仓库（github.com/shuixiande/family-spots）联系我们。</p>`,
    privacyBody: `
<h2>1. 我们收集的信息</h2>
<p>1.1 账户信息：注册时提供的邮箱地址。</p>
<p>1.2 用户贡献内容：您标注的地点信息（名称、坐标、描述、安全信息等）。</p>
<p>1.3 技术信息：为提供服务所必需的基本信息，如设备类型、浏览器、访问日志。</p>
<h2>2. 信息的使用</h2>
<p>我们使用上述信息用于：提供并改进服务；展示您贡献的地点信息；防止滥用和欺诈；在法律允许的范围内处理与安全相关的事项。</p>
<h2>3. 信息的共享</h2>
<p>3.1 您贡献的地点信息将在平台内公开展示（这是本服务的核心功能）。</p>
<p>3.2 除上述情况外，我们不会出售、出租或向无关第三方披露您的个人信息，除非：（a）获得您的明确同意；（b）法律法规要求；（c）为保护平台及用户合法权益所必需。</p>
<h2>4. 第三方服务</h2>
<p>本服务使用以下第三方服务：OpenStreetMap / Overpass / Nominatim（地图与地名数据）、高德地图（中国大陆瓦片）、Supabase（数据存储与认证）。这些服务有其各自的隐私政策。</p>
<h2>5. 未成年人保护</h2>
<p>本服务面向家长和成年人使用，不面向 14 周岁以下未成年人。您在使用本服务时须确认自己是成年人或未成年人的监护人。我们不会故意收集未成年人的个人信息。</p>
<h2>6. 数据保留与删除</h2>
<p>您可以通过登录账户后编辑或删除自己贡献的地点信息。如需删除账户或数据，可通过项目 GitHub 仓库联系我们。</p>
<h2>7. 安全措施</h2>
<p>我们采取合理的技术和管理措施保护您的数据安全，但请注意没有任何互联网传输是完全安全的。</p>
<h2>8. 政策变更</h2>
<p>我们可能适时更新本政策，变更将通过服务内公示通知。</p>`,

    // 添加页
    addTitle: '标记户外地点',
    desc: 'UGC 众包地图 —— 每位家长都是探索者。标注你发现的亲子户外好去处，帮更多家庭找到安全有趣的目的地。',
    basic: '基本信息',
    name: '名称',
    namePh: '如：中央公园',
    category: '类别',
    catWater: '玩水',
    catMountain: '爬山',
    catPark: '公园',
    catPlayground: '乐园',
    address: '详细地址',
    addressPh: '如：Manhattan, New York',
    type: '细分类型',
    typeAny: '请选择',
    freePaid: '免费/收费',
    any: '全部',
    free: '免费',
    paid: '收费',
    safety: '安全评估（重要）',
    safetyLabel: '安全',
    riskLevel: '安全等级',
    riskLow: '低',
    riskMid: '中',
    riskHigh: '高',
    suitableAge: '适合年龄段',
    agePh: '如：3-12岁',
    waterQuality: '水质',
    waterDepth: '水深',
    flowSpeed: '流速',
    tips: '安全提示',
    tipsPh: '如：上游有水库注意泄洪、雨天勿前往、有暗流漩涡等',
    kidFriendly: '亲子友好',
    yes: '是',
    no: '否',
    rating: '评分',
    facilities: '配套设施（多选）',
    coord: '坐标定位（在地图上点击选取）',
    lngPh: '经度（点击地图）',
    latPh: '纬度（点击地图）',
    geoLoading: '🔍 正在识别地址…',
    submit: '提交标记',
    notice: '你贡献的地点将由社区共享。登录云端后，标注会保存到服务器，其他家长也能看到；本地模式则仅存本机。',
    mySpots: '我标记的地点',
    edit: '编辑',
    delete: '删除',
    export: '导出 JSON',
    clear: '清空全部',
    saveSuccess: '标记成功！感谢你的贡献 🎉',
    saveError: '提交失败：',
    needName: '请输入名称',
    needCoord: '请在地图上点击选择坐标',
    confirmDelete: '确定删除这个地点吗？',
    confirmClear: '确定清空所有本地标记的地点吗？此操作不可恢复。',
    riskLowDesc: '成熟景区或人工场所，相对安全，仍需家长看护',
    riskMidDesc: '自然场所，需家长全程盯护，注意环境变化',
    riskHighDesc: '野地/暗流/陡坡区域，需专业防护，不建议幼童前往',

    // 详情页
    back: '返回',
    backHome: '返回首页',
    typeName: '类型',
    fee: '费用',
    navigate: '一键导航',
    notFoundSpot: '未找到该地点',

    // 列表页
    listTitle: '亲子户外地点',
    count: '共 {n} 个',
    empty: '还没有标记地点。去地图上点选「+」添加第一个吧！',
    kid: '亲子友好',

    // 枚举选项（中性 code 存储，展示时翻译）与补充文案
    feeDesc: '费用说明',
    feeDescPh: '如：成人20元，儿童半价',
    invalidRating: '评分需在 1-5 之间',
    confirmClearCloud: '确定清空你标注的所有地点吗？此操作不可恢复。',
    report: '举报', reportPrompt: '请输入举报原因（如：虚假/危险信息/广告）',
    reportThanks: '已收到举报，感谢反馈！', reportFail: '举报失败，请稍后再试',
    moderate: '审核', moderateTitle: '内容审核', noPermission: '仅版主可访问此页面',
    hide: '下架', unhide: '恢复', reason: '原因',
    login: '登录', logout: '退出', loginTitle: '登录 / 注册',
    email: '邮箱', password: '密码', signIn: '登录', signUp: '注册',
    haveAccount: '已有账号？去登录', noAccount: '没有账号？去注册',
    checkEmail: '注册成功，请查收邮箱确认后再登录', loginSuccess: '登录成功',
    loginFail: '登录失败：', authNote: '登录后即可在云端标记/编辑地点，匿名用户仅可浏览。',
    needLogin: '请先登录后再标记地点',
    agreeGuardian: '我已阅读并同意《服务条款》与《隐私政策》，并确认我是 18 周岁以上成年人或未成年人监护人。',
    orUse: '或使用第三方账户',
    subRiver: '河流', subStream: '溪流', subWaterfall: '瀑布', subLake: '湖泊',
    subBeach: '海滩', subPool: '泳池', subForest: '山林', subTrail: '步道',
    subLawn: '草坪', subPlayground: '游乐场', subOther: '其他',
    wqClear: '清澈', wqNormal: '一般', wqMuddy: '较浑',
    wdShallow: '浅（小腿以下）', wdModerate: '适中（膝盖-腰部）', wdDeep: '深（腰部以上）',
    fsSlow: '平缓', fsModerate: '适中', fsFast: '湍急',
    facToilet: '厕所', facParking: '停车场', facLocker: '更衣室',
    facShop: '小卖部', facTrash: '垃圾桶', facRest: '休息区'
  },

  'en': {
    navMap: 'Map',
    navList: 'List',
    navAdd: 'Add',
    disclaimer: '⚠️ Safety first: outdoor activities require adult supervision at all times. Beware of water depth, flash floods and terrain risks. Data is for reference only, sourced from OpenStreetMap and community contributors.',
    modeCloud: '🌐 Connected to cloud: your spots are shared worldwide',
    modeLocal: '💾 Local mode: spots are saved only in this browser',
    langZh: '中文',
    langEn: 'EN',

    searchPlaceholder: 'Search a city or place, e.g. Tokyo / Paris / park',
    search: 'Search',
    filter: 'Filter',
    locate: 'Locate',
    list: 'List',
    category: 'Category',
    preferences: 'Preferences',
    kidFriendlyOnly: 'Kid-friendly only',
    filterNote: 'Safety / kid-friendly filters apply only to community spots; OSM seed points are public basemap data.',
    loading: 'Loading nearby places…',
    mark: 'Mark',
    contribute: 'Add safety info',
    locateFail: 'Location failed. Please check browser location permission.',
    notFound: 'Place not found',
    searchFail: 'Search failed, please retry later',
    safety: 'Safety',
    safetyTitle: 'Safety Rules & Disclaimer',
    safetyRules: [
      'Outdoor activities are risky: parents/guardians must supervise children at all times — never let children near water alone or out of sight',
      'Before entering water, check depth, flow and weather; beware of flash floods, upstream dam releases and hidden currents',
      'Check local notices, weather and warnings before you go; trust official sources only and avoid bad weather',
      'Do not take young children to high-risk areas; do not climb wild terrain or steep slopes',
      'Protect against sun and heat, insect bites; carry drinking water and basic emergency supplies'
    ],
    disclaimerTitle: 'Disclaimer',
    safetyDisclaimer: 'Spot data on this platform comes from OpenStreetMap seed data and community contributions, and has not been verified by professional bodies. Safety ratings, depth, flow and other information are subjective user input, provided for reference only — they are not a safety guarantee or professional advice. Users must verify on-site conditions and assume all risks; the platform is not liable for any personal injury or property loss arising from outdoor activities.',
    dataAttribution: 'Map data © OpenStreetMap contributors · AMap, used under their respective licenses',
    safetyModalTitle: 'Safety Notice',
    safetyModalIntro: 'Before using FamilySpots, please confirm you have read and understood the following safety rules and disclaimer:',
    safetyAgree: 'I have read and agree',
    safetyBrowseOnly: 'Browse only this time',
    termsTitle: 'Terms of Service',
    privacyTitle: 'Privacy Policy',
    legalUpdated: 'Last updated',
    termsBody: `
<h2>1. About the Service</h2>
<p>FamilySpots is an open-source, free platform for sharing family-friendly outdoor places. Users can browse, search, pin and share outdoor spots (water, mountain, park, playground), and add safety-related information (risk level, water depth, flow, facilities, etc.).</p>
<h2>2. User-Generated Content (UGC)</h2>
<p>2.1 Users are solely responsible for the truthfulness, accuracy and legality of all content they submit (including spot name, coordinates, description, safety info, rating, images, etc.).</p>
<p>2.2 The following content is prohibited: false or misleading information; information involving state secrets, military facilities or sensitive areas; illegal, pornographic, violent, hateful or infringing content; advertising or commercial promotion.</p>
<p>2.3 Users grant the platform and its community the right to use, display and distribute their contributions for the purpose of providing and improving the service.</p>
<h2>3. Information Is For Reference Only</h2>
<p>Spot and safety information on the platform comes from OpenStreetMap public data and community contributors, and has not been verified by professional bodies. It is for reference only and does not constitute a safety guarantee or professional advice. Users must verify on-site conditions and decide independently whether a place is suitable.</p>
<h2>4. Disclaimer</h2>
<p>4.1 Outdoor activities involve inherent risks. The platform is not liable for any personal injury, property loss or other damage arising from the use of this service or from visiting places marked on the map.</p>
<p>4.2 The platform is not responsible for the availability or accuracy of third-party services (including map data providers and network infrastructure).</p>
<h2>5. Accounts & Security</h2>
<p>Users must safeguard their account credentials. If unauthorized use is discovered, notify the platform promptly.</p>
<h2>6. Intellectual Property</h2>
<p>The platform code is released under the MIT License. Map data belongs to its respective providers (OpenStreetMap, AMap, etc.) and is used under their licenses. User-contributed content belongs to its contributors.</p>
<h2>7. Changes to These Terms</h2>
<p>We may revise these terms from time to time. Material changes will be announced within the service. Continued use of the service constitutes acceptance of the revised terms.</p>
<h2>8. Contact</h2>
<p>For any questions, contact us via the project repository (github.com/shuixiande/family-spots).</p>`,
    privacyBody: `
<h2>1. Information We Collect</h2>
<p>1.1 Account information: the email address provided at registration.</p>
<p>1.2 User contributions: spot information you pin (name, coordinates, description, safety info, etc.).</p>
<p>1.3 Technical information: basic data required to provide the service, such as device type, browser and access logs.</p>
<h2>2. How We Use Information</h2>
<p>We use the above information to: provide and improve the service; display your contributed spots; prevent abuse and fraud; and handle safety-related matters where permitted by law.</p>
<h2>3. Sharing of Information</h2>
<p>3.1 Spot information you contribute will be displayed publicly on the platform (this is the core function of the service).</p>
<p>3.2 Except as above, we do not sell, rent or disclose your personal information to unrelated third parties unless: (a) we have your explicit consent; (b) required by law; or (c) necessary to protect the legitimate rights of the platform and its users.</p>
<h2>4. Third-Party Services</h2>
<p>This service uses the following third parties: OpenStreetMap / Overpass / Nominatim (map and geocoding data), AMap (map tiles for mainland China), and Supabase (data storage and authentication). These services have their own privacy policies.</p>
<h2>5. Protection of Minors</h2>
<p>This service is intended for parents and adults, not for minors under 14. By using this service you confirm that you are an adult or the guardian of a minor. We do not knowingly collect personal information from minors.</p>
<h2>6. Data Retention & Deletion</h2>
<p>You can edit or delete spots you have contributed after signing in. To delete your account or data, contact us via the project repository.</p>
<h2>7. Security</h2>
<p>We take reasonable technical and administrative measures to protect your data, but no internet transmission is completely secure.</p>
<h2>8. Policy Changes</h2>
<p>We may update this policy from time to time; changes will be announced within the service.</p>`,

    addTitle: 'Add an outdoor spot',
    desc: 'A UGC crowdsourced map — every parent is an explorer. Pin the family-friendly outdoor places you discover to help more families find safe, fun destinations.',
    basic: 'Basic info',
    name: 'Name',
    namePh: 'e.g. Central Park',
    category: 'Category',
    catWater: 'Water',
    catMountain: 'Mountain',
    catPark: 'Park',
    catPlayground: 'Playground',
    address: 'Address',
    addressPh: 'e.g. Manhattan, New York',
    type: 'Subtype',
    typeAny: 'Choose',
    freePaid: 'Free / Paid',
    any: 'All',
    free: 'Free',
    paid: 'Paid',
    safety: 'Safety assessment (important)',
    safetyLabel: 'Safety',
    riskLevel: 'Risk level',
    riskLow: 'Low',
    riskMid: 'Medium',
    riskHigh: 'High',
    suitableAge: 'Suitable age',
    agePh: 'e.g. 3-12 yrs',
    waterQuality: 'Water quality',
    waterDepth: 'Water depth',
    flowSpeed: 'Flow speed',
    tips: 'Safety tips',
    tipsPh: 'e.g. dam upstream may release water, avoid on rainy days, hidden currents',
    kidFriendly: 'Kid-friendly',
    yes: 'Yes',
    no: 'No',
    rating: 'Rating',
    facilities: 'Facilities (multi-select)',
    coord: 'Pick a location (click on the map)',
    lngPh: 'Longitude (click map)',
    latPh: 'Latitude (click map)',
    geoLoading: '🔍 Recognizing address…',
    submit: 'Submit spot',
    notice: 'Your spot will be shared with the community. Signed in to the cloud, it is saved to the server for others to see; in local mode it stays only on this device.',
    mySpots: 'My spots',
    edit: 'Edit',
    delete: 'Delete',
    export: 'Export JSON',
    clear: 'Clear all',
    saveSuccess: 'Spot added! Thanks for contributing 🎉',
    saveError: 'Submit failed: ',
    needName: 'Please enter a name',
    needCoord: 'Please click the map to pick coordinates',
    confirmDelete: 'Delete this spot?',
    confirmClear: 'Clear all locally marked spots? This cannot be undone.',
    riskLowDesc: 'Developed or man-made sites — relatively safe, but supervision still required.',
    riskMidDesc: 'Natural areas — keep children in sight at all times and watch for changing conditions.',
    riskHighDesc: 'Wild / strong-current / steep terrain — requires expertise; not advised for young children.',

    back: 'Back',
    backHome: 'Back home',
    typeName: 'Type',
    fee: 'Fee',
    navigate: 'Navigate',
    notFoundSpot: 'Spot not found',

    listTitle: 'Family outdoor spots',
    count: '{n} spots',
    empty: 'No spots yet. Tap “+” on the map to add the first one!',
    kid: 'Kid-friendly',

    // Enum options (stored as neutral codes, translated for display) & extra copy
    feeDesc: 'Fee detail',
    feeDescPh: 'e.g. Adults 20, children half price',
    invalidRating: 'Rating must be between 1 and 5',
    confirmClearCloud: 'Clear all spots you have added? This cannot be undone.',
    report: 'Report', reportPrompt: 'Reason for reporting (e.g. fake / dangerous / spam)',
    reportThanks: 'Report received, thanks!', reportFail: 'Report failed, please retry',
    moderate: 'Moderate', moderateTitle: 'Content moderation', noPermission: 'Moderators only',
    hide: 'Hide', unhide: 'Unhide', reason: 'Reason',
    login: 'Login', logout: 'Logout', loginTitle: 'Sign in / Sign up',
    email: 'Email', password: 'Password', signIn: 'Sign in', signUp: 'Sign up',
    haveAccount: 'Have an account? Sign in', noAccount: 'No account? Sign up',
    checkEmail: 'Signed up. Check your email to confirm, then sign in.', loginSuccess: 'Signed in',
    loginFail: 'Sign-in failed: ', authNote: 'Sign in to contribute spots; guests can browse only.',
    needLogin: 'Please sign in to add a spot',
    agreeGuardian: 'I have read and agree to the Terms of Service and Privacy Policy, and confirm that I am an adult (18+) or the guardian of a minor.',
    orUse: 'or continue with',
    subRiver: 'River', subStream: 'Stream', subWaterfall: 'Waterfall', subLake: 'Lake',
    subBeach: 'Beach', subPool: 'Pool', subForest: 'Forest', subTrail: 'Trail',
    subLawn: 'Lawn', subPlayground: 'Playground', subOther: 'Other',
    wqClear: 'Clear', wqNormal: 'Average', wqMuddy: 'Muddy',
    wdShallow: 'Shallow (below calf)', wdModerate: 'Moderate (knee-waist)', wdDeep: 'Deep (above waist)',
    fsSlow: 'Gentle', fsModerate: 'Moderate', fsFast: 'Fast',
    facToilet: 'Toilet', facParking: 'Parking', facLocker: 'Locker room',
    facShop: 'Shop', facTrash: 'Trash bin', facRest: 'Rest area'
  }
}
