import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.userProgress.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.flashcard.deleteMany({});
  await prisma.timelineEvent.deleteMany({});
  await prisma.election.deleteMany({});
  await prisma.candidate.deleteMany({});
  await prisma.constituency.deleteMany({});
  await prisma.party.deleteMany({});
  await prisma.state.deleteMany({});

  console.log('Seeding States...');
  const up = await prisma.state.create({
    data: {
      name_en: 'Uttar Pradesh',
      name_hi: 'उत्तर प्रदेश',
      constituencies_count: 80,
    },
  });

  const mh = await prisma.state.create({
    data: {
      name_en: 'Maharashtra',
      name_hi: 'महाराष्ट्र',
      constituencies_count: 48,
    },
  });

  console.log('Seeding Parties...');
  const bjp = await prisma.party.create({
    data: {
      name_en: 'Bharatiya Janata Party',
      name_hi: 'भारतीय जनता पार्टी',
      symbol: 'Lotus',
      colors: 'Orange/Green',
      founded_year: 1980,
    },
  });

  const inc = await prisma.party.create({
    data: {
      name_en: 'Indian National Congress',
      name_hi: 'भारतीय राष्ट्रीय कांग्रेस',
      symbol: 'Hand',
      colors: 'Blue/Green/White',
      founded_year: 1885,
    },
  });

  const aap = await prisma.party.create({
    data: {
      name_en: 'Aam Aadmi Party',
      name_hi: 'आम आदमी पार्टी',
      symbol: 'Broom',
      colors: 'Blue/White',
      founded_year: 2012,
    },
  });

  console.log('Seeding Constituencies...');
  const varanasi = await prisma.constituency.create({
    data: {
      state_id: up.id,
      name_en: 'Varanasi',
      name_hi: 'वाराणसी',
      type: 'LS',
    },
  });

  const mumbaiSouth = await prisma.constituency.create({
    data: {
      state_id: mh.id,
      name_en: 'Mumbai South',
      name_hi: 'मुंबई दक्षिण',
      type: 'LS',
    },
  });

  console.log('Seeding Candidates...');
  await prisma.candidate.createMany({
    data: [
      {
        name_en: 'Rahul Sharma',
        name_hi: 'राहुल शर्मा',
        party_id: bjp.id,
        constituency_id: varanasi.id,
        photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop',
        assets: '₹ 5.2 Cr',
        criminal_cases: 0,
      },
      {
        name_en: 'Priya Patel',
        name_hi: 'प्रिया पटेल',
        party_id: inc.id,
        constituency_id: varanasi.id,
        photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop',
        assets: '₹ 2.1 Cr',
        criminal_cases: 1,
      },
      {
        name_en: 'Amit Singh',
        name_hi: 'अमित सिंह',
        party_id: aap.id,
        constituency_id: varanasi.id,
        photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop',
        assets: '₹ 80 Lacs',
        criminal_cases: 0,
      },
      {
        name_en: 'Vikram Seth',
        name_hi: 'विक्रम सेठ',
        party_id: bjp.id,
        constituency_id: mumbaiSouth.id,
        photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
        assets: '₹ 12 Cr',
        criminal_cases: 0,
      },
      {
        name_en: 'Meera Deshmukh',
        name_hi: 'मीरा देशमुख',
        party_id: inc.id,
        constituency_id: mumbaiSouth.id,
        photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop',
        assets: '₹ 8.5 Cr',
        criminal_cases: 2,
      },
    ],
  });

  console.log('Seeding TimelineEvents...');
  // National events (state_id null)
  await prisma.timelineEvent.createMany({
    data: [
      {
        state_id: null,
        title_en: 'Notification of Election',
        title_hi: 'चुनाव की अधिसूचना',
        description_en: 'Official announcement by the Election Commission of India.',
        description_hi: 'भारत निर्वाचन आयोग द्वारा आधिकारिक घोषणा।',
        event_date: new Date('2024-03-16T00:00:00Z'),
        event_type: 'notification',
      },
      {
        state_id: null,
        title_en: 'Last Date for Nominations',
        title_hi: 'नामांकन की अंतिम तिथि',
        description_en: 'Final day for candidates to submit their nomination papers.',
        description_hi: 'उम्मीदवारों के लिए अपने नामांकन पत्र जमा करने का अंतिम दिन।',
        event_date: new Date('2024-03-27T00:00:00Z'),
        event_type: 'nomination',
      },
      {
        state_id: null,
        title_en: 'Counting of Votes',
        title_hi: 'वोटों की गिनती',
        description_en: 'Votes counted and official results declared.',
        description_hi: 'मतों की गिनती की जाती है और आधिकारिक परिणाम घोषित किए जाते हैं।',
        event_date: new Date('2024-06-04T00:00:00Z'),
        event_type: 'counting',
      },
    ],
  });

  // Uttar Pradesh specific events
  await prisma.timelineEvent.createMany({
    data: [
      {
        state_id: up.id,
        title_en: 'Polling Date (UP Phase 1)',
        title_hi: 'मतदान तिथि (यूपी चरण 1)',
        description_en: 'Cast your vote in Western Uttar Pradesh constituencies.',
        description_hi: 'पश्चिमी उत्तर प्रदेश के निर्वाचन क्षेत्रों में अपना वोट डालें।',
        event_date: new Date('2024-04-19T00:00:00Z'),
        event_type: 'polling',
      },
      {
        state_id: up.id,
        title_en: 'Polling Date (UP Phase 2)',
        title_hi: 'मतदान तिथि (यूपी चरण 2)',
        description_en: 'Polling in Central Uttar Pradesh constituencies.',
        description_hi: 'मध्य उत्तर प्रदेश के निर्वाचन क्षेत्रों में मतदान।',
        event_date: new Date('2024-04-26T00:00:00Z'),
        event_type: 'polling',
      },
      {
        state_id: up.id,
        title_en: 'Polling Date (UP Phase 3)',
        title_hi: 'मतदान तिथि (यूपी चरण 3)',
        description_en: 'Polling in Eastern Uttar Pradesh constituencies.',
        description_hi: 'पूर्वी उत्तर प्रदेश के निर्वाचन क्षेत्रों में मतदान।',
        event_date: new Date('2024-05-07T00:00:00Z'),
        event_type: 'polling',
      },
    ],
  });

  // Maharashtra specific events
  await prisma.timelineEvent.createMany({
    data: [
      {
        state_id: mh.id,
        title_en: 'Polling Date (MH Phase 1)',
        title_hi: 'मतदान तिथि (महाराष्ट्र चरण 1)',
        description_en: 'Cast your vote in Vidarbha region.',
        description_hi: 'विदर्भ क्षेत्र में अपना वोट डालें।',
        event_date: new Date('2024-04-19T00:00:00Z'),
        event_type: 'polling',
      },
      {
        state_id: mh.id,
        title_en: 'Polling Date (MH Phase 4)',
        title_hi: 'मतदान तिथि (महाराष्ट्र चरण 4)',
        description_en: 'Polling in Mumbai and surrounding regions.',
        description_hi: 'मुंबई और आसपास के क्षेत्रों में मतदान।',
        event_date: new Date('2024-05-13T00:00:00Z'),
        event_type: 'polling',
      },
      {
        state_id: mh.id,
        title_en: 'Polling Date (MH Phase 5)',
        title_hi: 'मतदान तिथि (महाराष्ट्र चरण 5)',
        description_en: 'Polling in remaining Northern Maharashtra constituencies.',
        description_hi: 'शेष उत्तरी महाराष्ट्र के निर्वाचन क्षेत्रों में मतदान।',
        event_date: new Date('2024-05-20T00:00:00Z'),
        event_type: 'polling',
      },
    ],
  });

  console.log('Seeding 45 Flashcards...');
  const flashcards = [
    { term_en: 'Lok Sabha', term_hi: 'लोकसभा', definition_en: 'The lower house of India\'s Parliament, directly elected by citizens.', definition_hi: 'भारत की संसद का निचला सदन, जिसके सदस्य सीधे नागरिकों द्वारा चुने जाते हैं।', category: 'Election Basics' },
    { term_en: 'Universal Adult Franchise', term_hi: 'सार्वभौमिक वयस्क मताधिकार', definition_en: 'The right of all adult citizens to vote regardless of caste, religion, or gender.', definition_hi: 'जाति, धर्म या लिंग की परवाह किए बिना मतदान करने का सभी वयस्क नागरिकों का अधिकार।', category: 'Election Basics' },
    { term_en: 'NOTA', term_hi: 'नोटा', definition_en: 'None of the Above. An option allowing voters to reject all candidates.', definition_hi: 'उपरोक्त में से कोई नहीं। एक विकल्प जो मतदाताओं को सभी उम्मीदवारों को खारिज करने की अनुमति देता है।', category: 'Election Basics' },
    { term_en: 'EVM', term_hi: 'ईवीएम', definition_en: 'Electronic Voting Machine. Used to record and count votes electronically.', definition_hi: 'इलेक्ट्रॉनिक वोटिंग मशीन। इलेक्ट्रॉनिक रूप से मतों को दर्ज करने और गिनने के लिए उपयोग किया जाता है।', category: 'Voting Tech' },
    { term_en: 'VVPAT', term_hi: 'वीवीपीएटी', definition_en: 'Voter Verified Paper Audit Trail. Provides feedback to voters using a paper slip.', definition_hi: 'वोटर वेरिफाइड पेपर ऑडिट ट्रेल। पेपर स्लिप का उपयोग करके मतदाताओं को प्रतिक्रिया प्रदान करता है।', category: 'Voting Tech' },
    { term_en: 'Model Code of Conduct', term_hi: 'आदर्श आचार संहिता', definition_en: 'Guidelines issued by ECI for conduct of political parties and candidates.', definition_hi: 'राजनीतिक दलों और उम्मीदवारों के आचरण के लिए ईसीआई द्वारा जारी दिशानिर्देश।', category: 'Rules & Regulations' },
    { term_en: 'Rajya Sabha', term_hi: 'राज्यसभा', definition_en: 'The upper house of India\'s bicameral Parliament.', definition_hi: 'भारत की द्विसदनीय संसद का ऊपरी सदन।', category: 'Election Basics' },
    { term_en: 'ECI', term_hi: 'ईसीआई', definition_en: 'Election Commission of India. The body responsible for administering election processes.', definition_hi: 'भारत निर्वाचन आयोग। चुनाव प्रक्रियाओं के संचालन के लिए जिम्मेदार निकाय।', category: 'Election Basics' },
    { term_en: 'EPIC', term_hi: 'इपिक', definition_en: 'Electoral Photo Identity Card. Also known as the voter ID card.', definition_hi: 'निर्वाचक फोटो पहचान पत्र। इसे मतदाता पहचान पत्र के रूप में भी जाना जाता है।', category: 'Election Basics' },
    { term_en: 'Constituency', term_hi: 'निर्वाचन क्षेत्र', definition_en: 'A specific area represented by an elected official.', definition_hi: 'एक निर्वाचित अधिकारी द्वारा प्रतिनिधित्व किया जाने वाला एक विशिष्ट क्षेत्र।', category: 'Election Basics' },
    { term_en: 'General Election', term_hi: 'आम चुनाव', definition_en: 'Elections held to elect members of the Lok Sabha.', definition_hi: 'लोकसभा के सदस्यों को चुनने के लिए आयोजित चुनाव।', category: 'Election Basics' },
    { term_en: 'By-election', term_hi: 'उपचुनाव', definition_en: 'Election held to fill a vacancy caused by death or resignation.', definition_hi: 'मृत्यु या इस्तीफे के कारण खाली हुई सीट को भरने के लिए आयोजित चुनाव।', category: 'Election Basics' },
    { term_en: 'Ballot Paper', term_hi: 'मतपत्र', definition_en: 'A sheet of paper used to cast a secret vote.', definition_hi: 'गुप्त मतदान करने के लिए उपयोग किया जाने वाला कागज का एक पत्र।', category: 'Voting Tech' },
    { term_en: 'Polling Booth', term_hi: 'मतदान केंद्र', definition_en: 'The location where voters cast their ballots.', definition_hi: 'वह स्थान जहाँ मतदाता अपना वोट डालते हैं।', category: 'Election Basics' },
    { term_en: 'Polling Officer', term_hi: 'मतदान अधिकारी', definition_en: 'Official who assists the presiding officer in conducting the poll.', definition_hi: 'वह अधिकारी जो मतदान के संचालन में पीठासीन अधिकारी की सहायता करता है।', category: 'Rules & Regulations' },
    { term_en: 'Electoral Roll', term_hi: 'मतदाता सूची', definition_en: 'The official list of registered voters in a constituency.', definition_hi: 'एक निर्वाचन क्षेत्र में पंजीकृत मतदाताओं की आधिकारिक सूची।', category: 'Election Basics' },
    { term_en: 'Returning Officer', term_hi: 'रिटर्निंग अधिकारी', definition_en: 'Officer in charge of conducting the election in a constituency.', definition_hi: 'एक निर्वाचन क्षेत्र में चुनाव कराने के लिए जिम्मेदार प्रभारी अधिकारी।', category: 'Rules & Regulations' },
    { term_en: 'Presiding Officer', term_hi: 'पीठासीन अधिकारी', definition_en: 'Officer in charge of a specific polling station.', definition_hi: 'एक विशिष्ट मतदान केंद्र का प्रभारी अधिकारी।', category: 'Rules & Regulations' },
    { term_en: 'Franchise', term_hi: 'मताधिकार', definition_en: 'The right or privilege of voting.', definition_hi: 'वोट देने का अधिकार या विशेषाधिकार।', category: 'Election Basics' },
    { term_en: 'Candidate', term_hi: 'उम्मीदवार', definition_en: 'A person who stands for election.', definition_hi: 'एक व्यक्ति जो चुनाव के लिए खड़ा होता है।', category: 'Election Basics' },
    { term_en: 'Nomination', term_hi: 'नामांकन', definition_en: 'The formal proposal of a candidate for election.', definition_hi: 'चुनाव के लिए उम्मीदवार का औपचारिक प्रस्ताव।', category: 'Election Basics' },
    { term_en: 'Scrutiny', term_hi: 'जांच', definition_en: 'The formal examination of nomination papers by the Returning Officer.', definition_hi: 'रिटर्निंग अधिकारी द्वारा नामांकन पत्रों की औपचारिक जांच।', category: 'Rules & Regulations' },
    { term_en: 'Election Manifesto', term_hi: 'चुनाव घोषणापत्र', definition_en: 'A document outlining a party\'s policies and promises.', definition_hi: 'पार्टी की नीतियों और वादों को रेखांकित करने वाला एक दस्तावेज।', category: 'Election Basics' },
    { term_en: 'Secret Ballot', term_hi: 'गुप्त मतदान', definition_en: 'Method of voting where a voter\'s choice remains confidential.', definition_hi: 'मतदान की विधि जिसमें मतदाता की पसंद गोपनीय रहती है।', category: 'Rules & Regulations' },
    { term_en: 'Electoral College', term_hi: 'निर्वाचक मंडल', definition_en: 'A set of electors who select a candidate to a particular office.', definition_hi: 'निर्वाचकों का एक समूह जो किसी विशेष पद के लिए उम्मीदवार का चयन करता है।', category: 'Election Basics' },
    { term_en: 'Delimitation', term_hi: 'परिसीमन', definition_en: 'Redrawing boundaries of constituencies based on population.', definition_hi: 'जनसंख्या के आधार पर निर्वाचन क्षेत्रों की सीमाओं का पुनर्निर्धारण।', category: 'Rules & Regulations' },
    { term_en: 'Simple Majority', term_hi: 'साधारण बहुमत', definition_en: 'Receiving more votes than any other candidate, but not necessarily an absolute majority.', definition_hi: 'किसी भी अन्य उम्मीदवार की तुलना में अधिक वोट प्राप्त करना, लेकिन पूर्ण बहुमत आवश्यक नहीं।', category: 'Election Basics' },
    { term_en: 'Coalition', term_hi: 'गठबंधन', definition_en: 'An alliance of political parties to form a government.', definition_hi: 'सरकार बनाने के लिए राजनीतिक दलों का एक गठबंधन।', category: 'Election Basics' },
    { term_en: 'Absentee Voter', term_hi: 'अनुपस्थित मतदाता', definition_en: 'Voters unable to cast their vote in person at the polling booth.', definition_hi: 'मतदाता जो मतदान केंद्र पर व्यक्तिगत रूप से अपना वोट डालने में असमर्थ हैं।', category: 'Rules & Regulations' },
    { term_en: 'Postal Ballot', term_hi: 'डाक मतपत्र', definition_en: 'Ballot papers sent to and from voters by post.', definition_hi: 'मतदाता को डाक द्वारा भेजे और प्राप्त किए जाने वाले मतपत्र।', category: 'Voting Tech' },
    { term_en: 'Proxy Voting', term_hi: 'परोक्ष मतदान', definition_en: 'Allowing a registered proxy to cast a vote on behalf of a voter.', definition_hi: 'एक पंजीकृत प्रतिनिधि को मतदाता की ओर से वोट डालने की अनुमति देना।', category: 'Rules & Regulations' },
    { term_en: 'Indelible Ink', term_hi: 'अमिट स्याही', definition_en: 'Purple ink applied to a voter\'s finger to prevent double voting.', definition_hi: 'दोहरे मतदान को रोकने के लिए मतदाता की उंगली पर लगाई जाने वाली बैंगनी स्याही।', category: 'Voting Tech' },
    { term_en: 'Vote Share', term_hi: 'वोट प्रतिशत', definition_en: 'The percentage of total votes received by a candidate or party.', definition_hi: 'किसी उम्मीदवार या पार्टी को प्राप्त कुल मतों का प्रतिशत।', category: 'Election Basics' },
    { term_en: 'Counting Center', term_hi: 'मतगणना केंद्र', definition_en: 'Secured location where EVM votes are counted.', definition_hi: 'सुरक्षित स्थान जहाँ ईवीएम वोटों की गिनती की जाती है।', category: 'Voting Tech' },
    { term_en: 'Chief Electoral Officer', term_hi: 'मुख्य निर्वाचन अधिकारी', definition_en: 'Supervises election work in a state/union territory under ECI control.', definition_hi: 'ईसीआई के नियंत्रण में राज्य/केंद्र शासित प्रदेश में चुनाव कार्य की निगरानी करता है।', category: 'Rules & Regulations' },
    { term_en: 'District Election Officer', term_hi: 'जिला निर्वाचन अधिकारी', definition_en: 'Coordinates and supervises election work at the district level.', definition_hi: 'जिला स्तर पर चुनाव कार्य का समन्वय और पर्यवेक्षण करता है।', category: 'Rules & Regulations' },
    { term_en: 'Electoral Registration Officer', term_hi: 'निर्वाचक रजिस्ट्रीकरण अधिकारी', definition_en: 'Responsible for preparation of electoral rolls for a constituency.', definition_hi: 'एक निर्वाचन क्षेत्र के लिए मतदाता सूची तैयार करने के लिए जिम्मेदार।', category: 'Rules & Regulations' },
    { term_en: 'Voter Helpline App', term_hi: 'वोटर हेल्पलाइन ऐप', definition_en: 'Official mobile application by ECI for voter services.', definition_hi: 'मतदाता सेवाओं के लिए ईसीआई का आधिकारिक मोबाइल एप्लिकेशन।', category: 'Voting Tech' },
    { term_en: 'National Voters Day', term_hi: 'राष्ट्रीय मतदाता दिवस', definition_en: 'Celebrated on January 25th to encourage voter enrollment.', definition_hi: 'मतदाता नामांकन को प्रोत्साहित करने के लिए 25 जनवरी को मनाया जाता है।', category: 'Election Basics' },
    { term_en: 'SVEEP', term_hi: 'स्वीप', definition_en: 'Systematic Voters Education and Electoral Participation program.', definition_hi: 'व्यवस्थित मतदाता शिक्षा और चुनावी भागीदारी कार्यक्रम।', category: 'Election Basics' },
    { term_en: 'Anti Defection Law', term_hi: 'दलबदल विरोधी कानून', definition_en: 'Prevents elected members from switching parties after election.', definition_hi: 'निर्वाचित सदस्यों को चुनाव के बाद दल बदलने से रोकता है।', category: 'Rules & Regulations' },
    { term_en: 'Direct Election', term_hi: 'प्रत्यक्ष चुनाव', definition_en: 'Public directly casts votes to choose their representative.', definition_hi: 'जनता सीधे अपना वोट डालकर अपने प्रतिनिधि को चुनती है।', category: 'Election Basics' },
    { term_en: 'Indirect Election', term_hi: 'अप्रत्यक्ष चुनाव', definition_en: 'Representatives are elected by previously elected officials.', definition_hi: 'प्रतिनिधि पहले से निर्वाचित अधिकारियों द्वारा चुने जाते हैं।', category: 'Election Basics' },
    { term_en: 'Ballot Box', term_hi: 'मतपेटी', definition_en: 'A sealed box into which ballot papers are inserted.', definition_hi: 'एक सीलबंद बॉक्स जिसमें मतपत्र डाले जाते हैं।', category: 'Voting Tech' },
    { term_en: 'Security Deposit', term_hi: 'जमानत राशि', definition_en: 'Deposit paid by candidates when filing nomination, forfeited if they fail to secure 1/6th votes.', definition_hi: 'नामांकन दाखिल करते समय उम्मीदवारों द्वारा जमा की जाने वाली राशि, जो 1/6 वोट न मिलने पर जब्त हो जाती है।', category: 'Rules & Regulations' }
  ];

  await prisma.flashcard.createMany({
    data: flashcards,
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
