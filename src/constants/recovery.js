import {
  Heart,
  Users,
  Brain,
  Leaf,
  Sparkles,
  Shield,
  Pill,
  XCircle,
  HelpCircle,
} from 'lucide-react';

export const RECOVERY_PATHS = [
  { id: 'aa', label: 'Alcoholics Anonymous (AA)', icon: Users, color: 'bg-blue-500' },
  { id: 'na', label: 'Narcotics Anonymous (NA)', icon: Heart, color: 'bg-purple-500' },
  { id: 'mat', label: 'Medicated Assisted Treatment (MAT)', icon: Pill, color: 'bg-indigo-500' },
  { id: 'celebrate', label: 'Celebrate Recovery', icon: Heart, color: 'bg-red-500' },
  { id: 'smart', label: 'SMART Recovery', icon: Brain, color: 'bg-orange-500' },
  { id: 'cali-sober', label: 'Cali Sober', icon: Leaf, color: 'bg-green-500' },
  { id: 'psychedelic', label: 'Psychedelic Assisted', icon: Sparkles, color: 'bg-pink-500' },
  { id: 'harm-reduction', label: 'Harm Reduction', icon: Shield, color: 'bg-yellow-500' },
  { id: 'abstinence', label: 'Abstinence Only', icon: XCircle, color: 'bg-gray-500' },
  { id: 'not-sure', label: 'Not sure yet', icon: HelpCircle, color: 'bg-gray-400' },
];

export const RECOVERY_LABELS = RECOVERY_PATHS.reduce((acc, path) => {
  acc[path.id] = path.label;
  return acc;
}, {});

export const STEP_PROMPTS = {
  aa: [
    { step: 1, title: 'Step 1', prompt: 'We admitted we were powerless over alcohol—that our lives had become unmanageable.' },
    { step: 2, title: 'Step 2', prompt: 'Came to believe that a Power greater than ourselves could restore us to sanity.' },
    { step: 3, title: 'Step 3', prompt: 'Made a decision to turn our will and our lives over to the care of God as we understood Him.' },
    { step: 4, title: 'Step 4', prompt: 'Made a searching and fearless moral inventory of ourselves.' },
    { step: 5, title: 'Step 5', prompt: 'Admitted to God, to ourselves, and to another human being the exact nature of our wrongs.' },
    { step: 6, title: 'Step 6', prompt: 'Were entirely ready to have God remove all these defects of character.' },
    { step: 7, title: 'Step 7', prompt: 'Humbly asked Him to remove our shortcomings.' },
    { step: 8, title: 'Step 8', prompt: 'Made a list of persons harmed, and became willing to make amends.' },
    { step: 9, title: 'Step 9', prompt: 'Made direct amends wherever possible, except when doing so would injure them or others.' },
    { step: 10, title: 'Step 10', prompt: 'Continued personal inventory and admitted mistakes promptly.' },
    { step: 11, title: 'Step 11', prompt: 'Sought through prayer and meditation to improve conscious contact with God.' },
    { step: 12, title: 'Step 12', prompt: 'Having had a spiritual awakening, we carry the message to others.' }
  ],

  na: [
    { step: 1, title: 'Step 1', prompt: 'We admitted that we were powerless over our addiction, that our lives had become unmanageable.' },
    { step: 2, title: 'Step 2', prompt: 'We came to believe that a Power greater than ourselves could restore us to sanity.' },
    { step: 3, title: 'Step 3', prompt: 'We made a decision to turn our will and our lives over to the care of God as we understood Him.' },
    { step: 4, title: 'Step 4', prompt: 'We made a searching and fearless moral inventory of ourselves.' },
    { step: 5, title: 'Step 5', prompt: 'We admitted to God, to ourselves, and to another human being the exact nature of our wrongs.' },
    { step: 6, title: 'Step 6', prompt: 'We were entirely ready to have God remove all these defects of character.' },
    { step: 7, title: 'Step 7', prompt: 'We humbly asked Him to remove our shortcomings.' },
    { step: 8, title: 'Step 8', prompt: 'We made a list of all persons we had harmed and became willing to make amends to them all.' },
    { step: 9, title: 'Step 9', prompt: 'We made direct amends wherever possible, except when to do so would injure them or others.' },
    { step: 10, title: 'Step 10', prompt: 'We continued to take personal inventory, and when we were wrong promptly admitted it.' },
    { step: 11, title: 'Step 11', prompt: 'We sought through prayer and meditation to improve our conscious contact with God.' },
    { step: 12, title: 'Step 12', prompt: 'Having had a spiritual awakening as a result of these steps, we tried to carry this message to addicts and practice these principles in all our affairs.' }
  ],

  celebrate: [
    { step: 1, title: 'Step 1', prompt: 'Realize I am not God. I admit I am powerless to control my tendency to do the wrong thing.' },
    { step: 2, title: 'Step 2', prompt: 'Earnestly believe God exists, that I matter to Him, and that He has the power to help me recover.' },
    { step: 3, title: 'Step 3', prompt: "Consciously choose to commit all my life and will to Christ's care and control." },
    { step: 4, title: 'Step 4', prompt: 'Openly examine and confess my faults to myself, to God, and to someone I trust.' },
    { step: 5, title: 'Step 5', prompt: 'Submit to every change God wants to make in my life.' },
    { step: 6, title: 'Step 6', prompt: 'Evaluate all my relationships; offer forgiveness; make amends when appropriate.' },
    { step: 7, title: 'Step 7', prompt: 'Reserve time daily with God for self-examination, Bible reading, and prayer.' },
    { step: 8, title: 'Step 8', prompt: 'Yield myself to God to bring the Good News to others.' }
  ],

  smart: [
    { step: 1, title: 'Building Motivation', prompt: 'What motivates you to change? List your reasons for wanting sobriety.' },
    { step: 2, title: 'Coping with Urges', prompt: 'Which strategies can you use when cravings show up?' },
    { step: 3, title: 'Managing Thoughts & Feelings', prompt: 'How do your thoughts impact your behaviors? Give examples.' },
    { step: 4, title: 'Living a Balanced Life', prompt: 'What does balance look like for you? What needs work?' }
  ],

  mat: [
    { step: 1, title: 'Understanding Medication', prompt: 'How does your medication support your recovery?' },
    { step: 2, title: 'Triggers & Safety Plan', prompt: 'Identify triggers and create an action plan.' },
    { step: 3, title: 'Stability & Routine', prompt: 'What daily routines help you stay stable?' },
    { step: 4, title: 'Long-Term Recovery Goals', prompt: 'Where do you want to be in 6–12 months?' }
  ],

  'cali-sober': [
    { step: 1, title: 'Define Your Boundaries', prompt: 'What substances are you abstaining from, and why?' },
    { step: 2, title: 'Mindful Use Rules', prompt: 'How do you ensure cannabis/psychedelic use does not slip into avoidance?' },
    { step: 3, title: 'Harm Reduction Agreements', prompt: 'What hard boundaries keep you safe?' },
    { step: 4, title: 'Growth Plan', prompt: 'What does progress look like in this lifestyle?' }
  ],

  psychedelic: [
    { step: 1, title: 'Intention Setting', prompt: 'What do you want healing or clarity around?' },
    { step: 2, title: 'Integration Work', prompt: 'Reflect on insights from psychedelic experiences.' },
    { step: 3, title: 'Behavioral Change', prompt: 'Which habits or patterns do you want to shift?' }
  ],

  'harm-reduction': [
    { step: 1, title: 'Risk Mapping', prompt: 'What are the highest-risk behaviors in your substance use?' },
    { step: 2, title: 'Safer Use Plan', prompt: 'How can you reduce danger while working toward improvement?' },
    { step: 3, title: 'Coping Strategies', prompt: 'What non-substance coping tools can you practice?' },
    { step: 4, title: 'Long-Term Goals', prompt: 'What does a healthier future look like for you, even if abstinence is not the goal?' }
  ],

  abstinence: [
    { step: 1, title: 'Commitment to Abstinence', prompt: 'Why do you want full abstinence?' },
    { step: 2, title: 'Craving Management', prompt: 'What will you do when urges come?' },
    { step: 3, title: 'Emotional Regulation', prompt: 'How do you handle stress without substances?' },
    { step: 4, title: 'Building a Sober Life', prompt: 'What pillars support your sober lifestyle?' }
  ],

  'not-sure': [
    { step: 1, title: 'Exploration', prompt: 'What feels confusing or uncertain about choosing a recovery path?' },
    { step: 2, title: 'Values Inventory', prompt: 'What matters most to you in recovery?' },
    { step: 3, title: 'Experiment & Learn', prompt: 'List recovery methods you are open to trying.' }
  ]
};

