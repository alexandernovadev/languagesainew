/**
 * Grammar guide content: structure (how to use) + examples for each English topic.
 */
export interface GrammarGuideEntry {
  structure: string;
  examples: string[];
}

export const grammarGuideContent: Record<string, GrammarGuideEntry> = {
  "word-order": {
    structure: `<p class="mb-3"><span class="font-bold text-emerald-600 dark:text-emerald-400">Subject</span> <span class="text-muted-foreground">+</span> <span class="font-bold text-blue-600 dark:text-blue-400">Verb</span> <span class="text-muted-foreground">+</span> <span class="font-bold text-amber-600 dark:text-amber-400">Object</span> <span class="text-muted-foreground">(SVO)</span></p><ul class="list-disc ml-4 space-y-1.5 text-sm"><li>I <span class="text-emerald-600/80">(S)</span> eat <span class="text-blue-600/80">(V)</span> breakfast <span class="text-amber-600/80">(O)</span>.</li><li><span class="font-semibold text-emerald-600 dark:text-emerald-400">Adverbs</span>: usually after the verb, or at start/end of sentence.</li></ul>`,
    examples: [
      "She always drinks coffee in the morning.",
      "The children play in the park.",
      "Yesterday, I met an old friend.",
    ],
  },
  questions: {
    structure: `<p class="mb-2"><span class="font-semibold text-emerald-600 dark:text-emerald-400">Yes/No</span>: <span class="font-bold text-blue-600 dark:text-blue-400">Auxiliary</span> + Subject + Verb</p><ul class="list-disc ml-4 space-y-1 text-sm mb-2"><li><code class="bg-blue-500/15 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs">Do/Does/Did</code> + Subject + base verb?</li></ul><p><span class="font-semibold text-amber-600 dark:text-amber-400">Wh-</span>: Wh-word + Auxiliary + Subject + Verb</p>`,
    examples: [
      "Do you speak English?",
      "Where does she live?",
      "What did you do yesterday?",
    ],
  },
  negation: {
    structure: `<p class="mb-2">Subject + <code class="bg-blue-500/15 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs">do/does/did</code> + <span class="font-bold text-rose-600 dark:text-rose-400">not</span> + base verb</p><ul class="list-disc ml-4 space-y-1 text-sm"><li>I don't like it. / She doesn't know. / They didn't go.</li></ul>`,
    examples: [
      "I don't understand.",
      "He doesn't eat meat.",
      "We didn't see the movie.",
    ],
  },
  "countable-uncountable": {
    structure: `<p class="mb-2"><span class="font-semibold text-emerald-600 dark:text-emerald-400">Countable</span>: <code class="bg-blue-500/15 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs">a/an</code> + singular, or plural (books)</p><p><span class="font-semibold text-amber-600 dark:text-amber-400">Uncountable</span>: no article or <code class="bg-blue-500/15 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs">some/much</code> (water, advice)</p>`,
    examples: [
      "I need a book. / I have three books.",
      "Can I have some water?",
      "She gave me good advice.",
    ],
  },
  articles: {
    structure: `<p class="mb-2"><code class="bg-blue-500/15 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs">a/an</code>: indefinite, singular countable</p><ul class="list-disc ml-4 space-y-1 text-sm mb-2"><li><span class="font-semibold">a</span> + consonant sound, <span class="font-semibold">an</span> + vowel sound</li></ul><p><code class="bg-amber-500/15 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded text-xs">the</code>: definite, specific reference</p>`,
    examples: [
      "A cat crossed the road.",
      "An hour ago, I saw the same man.",
      "The book you lent me is interesting.",
    ],
  },
  pronouns: {
    structure: `<p class="mb-2"><span class="font-semibold text-emerald-600 dark:text-emerald-400">Subject</span>: <code class="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded text-xs">I, you, he, she, it, we, they</code></p><p><span class="font-semibold text-blue-600 dark:text-blue-400">Object</span>: <code class="bg-blue-500/15 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs">me, you, him, her, it, us, them</code></p>`,
    examples: [
      "She gave him the keys.",
      "They invited us to the party.",
      "Can you help me with this?",
    ],
  },
  possessives: {
    structure: `<p class="mb-2"><code class="bg-blue-500/15 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs">my, your, his, her, its, our, their</code> + noun</p><ul class="list-disc ml-4 space-y-1 text-sm"><li><span class="font-semibold text-emerald-600 dark:text-emerald-400">'s</span> for people: John's car</li><li><span class="font-semibold text-amber-600 dark:text-amber-400">of</span> for things: the roof of the house</li></ul>`,
    examples: [
      "This is my laptop.",
      "Sarah's brother is a doctor.",
      "The name of the book is...",
    ],
  },
  adjectives: {
    structure: `<p class="mb-2">Before noun: <span class="italic text-emerald-600 dark:text-emerald-400">a beautiful day</span></p><p><span class="font-semibold text-blue-600 dark:text-blue-400">Order</span>: Opinion → Size → Age → Shape → Color → Origin → Material</p>`,
    examples: [
      "She has long brown hair.",
      "It's a small old wooden house.",
      "He's a talented young musician.",
    ],
  },
  "comparatives-superlatives": {
    structure: `<p class="mb-2"><span class="font-semibold text-emerald-600 dark:text-emerald-400">Comparative</span>: adj + <code class="bg-blue-500/15 px-1 rounded text-xs">-er</code> / <code class="bg-blue-500/15 px-1 rounded text-xs">more</code> + adj (than)</p><p><span class="font-semibold text-amber-600 dark:text-amber-400">Superlative</span>: the + adj + <code class="bg-amber-500/15 px-1 rounded text-xs">-est</code> / the most + adj</p>`,
    examples: [
      "She is taller than her sister.",
      "This is the most difficult exam.",
      "It's better to arrive early.",
    ],
  },
  adverbs: {
    structure: `<p class="mb-2"><span class="font-semibold text-emerald-600 dark:text-emerald-400">Manner</span>: verb + <code class="bg-blue-500/15 px-1 rounded text-xs">-ly</code> (quickly)</p><p class="mb-2"><span class="font-semibold text-blue-600 dark:text-blue-400">Frequency</span>: before main verb (always, often)</p><p><span class="font-semibold text-amber-600 dark:text-amber-400">Place/Time</span>: usually at end</p>`,
    examples: [
      "She speaks slowly and clearly.",
      "I always have coffee in the morning.",
      "They went there yesterday.",
    ],
  },
  intensifiers: {
    structure: `<p class="mb-2"><code class="bg-blue-500/15 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs">very, really, extremely, quite</code> + adjective</p><ul class="list-disc ml-4 space-y-1 text-sm"><li><span class="text-emerald-600">very good</span>, <span class="text-blue-600">really tired</span>, <span class="text-amber-600">extremely hot</span></li></ul>`,
    examples: [
      "The movie was really interesting.",
      "It's extremely important.",
      "She's quite tired today.",
    ],
  },
  "verb-tenses": {
    structure: `<ul class="space-y-1.5 text-sm"><li><span class="font-semibold text-emerald-600 dark:text-emerald-400">Present</span>: habits, facts</li><li><span class="font-semibold text-blue-600 dark:text-blue-400">Past</span>: completed actions</li><li><span class="font-semibold text-amber-600 dark:text-amber-400">Future</span>: plans, predictions</li><li><span class="font-semibold text-rose-600 dark:text-rose-400">Perfect</span>: before another time</li></ul>`,
    examples: [
      "I work here. (Present Simple)",
      "I was working when she called. (Past Continuous)",
      "I will have finished by noon. (Future Perfect)",
    ],
  },
  "present-simple": {
    structure: `<p class="mb-2"><span class="font-bold text-emerald-600 dark:text-emerald-400">Subject</span> + base verb <span class="text-muted-foreground">(+ s for 3rd person)</span></p><p class="text-sm"><code class="bg-emerald-500/15 px-1.5 py-0.5 rounded text-xs">I/You/We/They work</code> <span class="text-muted-foreground">|</span> <code class="bg-blue-500/15 px-1.5 py-0.5 rounded text-xs">He/She/It works</code></p>`,
    examples: [
      "She works in a bank.",
      "Water boils at 100°C.",
      "We usually have lunch at 1pm.",
    ],
  },
  "present-continuous": {
    structure: `<p class="mb-2"><code class="bg-blue-500/15 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs font-semibold">am/is/are</code> <span class="text-muted-foreground">+</span> <span class="font-bold text-amber-600 dark:text-amber-400">verb-ing</span></p><p class="text-sm italic text-muted-foreground">For actions happening now or temporary situations</p>`,
    examples: [
      "I'm studying for my exam.",
      "She's living in Paris this year.",
      "They're having dinner right now.",
    ],
  },
  "past-simple": {
    structure: `<p class="mb-2"><span class="font-bold text-emerald-600 dark:text-emerald-400">Subject</span> + <code class="bg-blue-500/15 px-1.5 py-0.5 rounded text-xs">verb-ed</code> (regular) or irregular past</p><p class="text-sm"><span class="text-emerald-600">I worked</span> / <span class="text-blue-600">I went</span></p>`,
    examples: [
      "She visited London last year.",
      "We saw a great film yesterday.",
      "He bought a new car.",
    ],
  },
  "past-continuous": {
    structure: "was/were + verb-ing\n• For actions in progress at a past moment",
    examples: [
      "I was cooking when the phone rang.",
      "They were living in Rome in 2019.",
      "What were you doing at 8pm?",
    ],
  },
  "present-perfect": {
    structure: `<p class="mb-2"><code class="bg-blue-500/15 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs font-semibold">have/has</code> + <span class="font-bold text-amber-600 dark:text-amber-400">past participle</span></p><p class="text-sm italic text-muted-foreground">For past actions with present relevance</p>`,
    examples: [
      "I have finished my homework.",
      "She has been to Japan twice.",
      "We have known each other for years.",
    ],
  },
  "past-perfect": {
    structure: `<p class="mb-2"><code class="bg-blue-500/15 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs font-semibold">had</code> + <span class="font-bold text-amber-600 dark:text-amber-400">past participle</span></p><p class="text-sm italic text-muted-foreground">For actions before another past action</p>`,
    examples: [
      "When I arrived, she had already left.",
      "I had never seen such a beautiful sunset.",
      "They had finished dinner before we came.",
    ],
  },
  "future-forms": {
    structure: `<p class="mb-2"><code class="bg-emerald-500/15 px-1.5 py-0.5 rounded text-xs">will</code> + base verb: predictions, decisions</p><p class="mb-2"><code class="bg-blue-500/15 px-1.5 py-0.5 rounded text-xs">be going to</code>: plans, evidence</p><p><code class="bg-amber-500/15 px-1.5 py-0.5 rounded text-xs">Present Continuous</code>: arrangements</p>`,
    examples: [
      "I'll help you with that.",
      "She's going to study medicine.",
      "We're meeting at 6pm.",
    ],
  },
  "future-continuous": {
    structure: `<p class="mb-2"><code class="bg-blue-500/15 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs font-semibold">will be</code> + <span class="font-bold text-amber-600 dark:text-amber-400">verb-ing</span></p><p class="text-sm italic text-muted-foreground">For actions in progress at a future time</p>`,
    examples: [
      "This time tomorrow I'll be flying to Paris.",
      "At 8pm we'll be having dinner.",
      "She'll be working when you arrive.",
    ],
  },
  "future-perfect": {
    structure: `<p class="mb-2"><code class="bg-blue-500/15 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs font-semibold">will have</code> + <span class="font-bold text-amber-600 dark:text-amber-400">past participle</span></p><p class="text-sm italic text-muted-foreground">For actions completed before a future time</p>`,
    examples: [
      "By 2025, I will have graduated.",
      "She'll have finished by the time we get there.",
      "We will have been married 10 years next month.",
    ],
  },
  "modal-verbs": {
    structure: `<p class="mb-2"><code class="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded text-xs">can, could, may, might, must, shall, should, will, would</code> + base verb</p><ul class="list-disc ml-4 space-y-1 text-sm"><li>No <code class="bg-rose-500/15 px-1 rounded text-xs">-s</code> for 3rd person, no infinitive</li></ul>`,
    examples: [
      "You must wear a seatbelt.",
      "She can speak three languages.",
      "We should leave early.",
    ],
  },
  "past-modals": {
    structure: `<p class="mb-2"><code class="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded text-xs">could have</code>, <code class="bg-blue-500/15 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs">would have</code>, <code class="bg-amber-500/15 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded text-xs">should have</code>, <code class="bg-rose-500/15 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 rounded text-xs">must have</code>, <code class="bg-violet-500/15 text-violet-700 dark:text-violet-300 px-1.5 py-0.5 rounded text-xs">might have</code> + past participle</p><ul class="list-disc ml-4 space-y-1 text-sm"><li>Express possibility, obligation, or advice about the past</li></ul>`,
    examples: [
      "She could have been at home.",
      "You should have told me earlier.",
      "He must have left already.",
    ],
  },
  "auxiliary-verbs": {
    structure: `<p class="mb-2"><code class="bg-emerald-500/15 px-1.5 py-0.5 rounded text-xs">do/does/did</code>: questions, negation, emphasis</p><p class="mb-2"><code class="bg-blue-500/15 px-1.5 py-0.5 rounded text-xs">be</code>: passive, continuous</p><p><code class="bg-amber-500/15 px-1.5 py-0.5 rounded text-xs">have</code>: perfect tenses</p>`,
    examples: [
      "Do you like coffee?",
      "I don't know.",
      "She has been waiting for an hour.",
    ],
  },
  "phrasal-verbs": {
    structure: `<p class="mb-2"><span class="font-bold text-emerald-600 dark:text-emerald-400">verb</span> + <span class="font-bold text-blue-600 dark:text-blue-400">particle</span> <span class="text-muted-foreground">(up, down, out, in, on...)</span></p><p class="text-sm italic text-muted-foreground">Meanings often idiomatic: <code class="bg-amber-500/15 px-1 rounded text-xs">give up</code> = stop trying</p>`,
    examples: [
      "We need to find out the truth.",
      "She gave up smoking last year.",
      "Can you look after my bag?",
    ],
  },
  conditionals: {
    structure: `<p class="mb-2"><span class="font-semibold text-emerald-600 dark:text-emerald-400">Type 1</span>: If + present, <code class="bg-blue-500/15 px-1 rounded text-xs">will</code> + base</p><p class="mb-2"><span class="font-semibold text-blue-600 dark:text-blue-400">Type 2</span>: If + past, <code class="bg-amber-500/15 px-1 rounded text-xs">would</code> + base</p><p><span class="font-semibold text-amber-600">Type 3</span>: If + past perfect, <code class="bg-rose-500/15 px-1 rounded text-xs">would have</code> + pp</p>`,
    examples: [
      "If it rains, I'll stay home.",
      "If I had money, I'd buy a car.",
      "If you had told me, I would have helped.",
    ],
  },
  "passive-voice": {
    structure: `<p class="mb-2"><code class="bg-blue-500/15 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs font-semibold">be</code> + <span class="font-bold text-amber-600 dark:text-amber-400">past participle</span></p><p class="text-sm"><span class="font-semibold text-emerald-600">Object</span> becomes <span class="font-semibold text-blue-600">subject</span>: <span class="italic">The letter was written by John.</span></p>`,
    examples: [
      "The house was built in 1900.",
      "English is spoken here.",
      "The project will be completed next week.",
    ],
  },
  "reported-speech": {
    structure: `<p class="mb-2"><span class="font-semibold text-emerald-600 dark:text-emerald-400">Reporting verb</span> + that + clause <span class="text-muted-foreground">(tense often shifts back)</span></p><p class="text-sm"><span class="italic">'I am tired'</span> <span class="text-muted-foreground">→</span> She said (that) she was tired.</p>`,
    examples: [
      "He told me he would call later.",
      "She said she had finished the report.",
      "They asked if we were coming.",
    ],
  },
  clauses: {
    structure: `<p class="mb-2"><span class="font-semibold text-emerald-600 dark:text-emerald-400">Independent</span>: can stand alone</p><p class="mb-2"><span class="font-semibold text-blue-600 dark:text-blue-400">Dependent</span>: needs main clause</p><p class="text-sm">I left <span class="text-emerald-600/80">(main)</span> when it started raining <span class="text-blue-600/80">(dependent)</span>.</p>`,
    examples: [
      "Although it was late, we continued.",
      "I'll call you when I arrive.",
      "The book that I bought is interesting.",
    ],
  },
  "relative-clauses": {
    structure: `<p class="mb-2"><span class="font-semibold text-emerald-600 dark:text-emerald-400">Defining</span>: who/which/that <span class="text-muted-foreground">(no comma)</span></p><p><span class="font-semibold text-amber-600 dark:text-amber-400">Non-defining</span>: who/which <span class="text-muted-foreground">(with comma)</span></p>`,
    examples: [
      "The man who lives next door is a doctor.",
      "Paris, which I visited last year, is beautiful.",
      "This is the book that I recommended.",
    ],
  },
  "if-clauses": {
    structure: `<p class="mb-2">If + condition, result</p><ul class="list-disc ml-4 space-y-1 text-sm"><li><span class="font-semibold text-emerald-600 dark:text-emerald-400">Zero</span>: If you heat ice, it melts.</li><li><span class="font-semibold text-blue-600">First</span>: If it rains, we'll stay.</li></ul>`,
    examples: [
      "If you mix red and blue, you get purple.",
      "If I see him, I'll tell him.",
      "If I were you, I'd apologize.",
    ],
  },
  conjunctions: {
    structure: "Coordinating: and, but, or, so, yet\nSubordinating: because, although, when, if",
    examples: [
      "I was tired, so I went to bed.",
      "She's smart but sometimes lazy.",
      "We left because it was late.",
    ],
  },
  prepositions: {
    structure: `<p class="mb-2"><span class="font-semibold text-emerald-600 dark:text-emerald-400">Place</span>: in, on, at</p><p class="mb-2"><span class="font-semibold text-blue-600 dark:text-blue-400">Time</span>: at 5pm, on Monday, in June</p><p class="text-sm text-muted-foreground">in the box, on the table, at the station</p>`,
    examples: [
      "The keys are on the table.",
      "I'll see you at 3pm.",
      "She's interested in music.",
    ],
  },
  "prepositions-of-time": {
    structure: `<p class="mb-2"><code class="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded text-xs">at</code>: clock times, points (at 5pm, at noon)</p><p class="mb-2"><code class="bg-blue-500/15 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs">on</code>: days, dates (on Monday, on 15th)</p><p><code class="bg-amber-500/15 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded text-xs">in</code>: months, years, seasons (in June, in 2024)</p>`,
    examples: [
      "I wake up at 7am every day.",
      "The meeting is on Tuesday.",
      "We met in the summer of 2023.",
    ],
  },
  "gerunds-infinitives": {
    structure: `<p class="mb-2"><span class="font-semibold text-emerald-600 dark:text-emerald-400">Gerund</span> <code class="bg-blue-500/15 px-1 rounded text-xs">(-ing)</code>: after enjoy, avoid, consider</p><p class="mb-2"><span class="font-semibold text-amber-600">Infinitive</span> <code class="bg-amber-500/15 px-1 rounded text-xs">(to)</code>: after want, decide, hope</p><p class="text-sm italic text-muted-foreground">Some verbs take both with different meaning</p>`,
    examples: [
      "I enjoy swimming.",
      "She wants to learn French.",
      "I stopped smoking. / I stopped to smoke.",
    ],
  },
  "wish-clauses": {
    structure: `<p class="mb-2"><code class="bg-blue-500/15 px-1.5 py-0.5 rounded text-xs">wish</code> + past: <span class="font-semibold text-emerald-600 dark:text-emerald-400">present regret</span></p><p class="mb-2"><code class="bg-blue-500/15 px-1.5 py-0.5 rounded text-xs">wish</code> + past perfect: <span class="font-semibold text-amber-600 dark:text-amber-400">past regret</span></p><p class="text-sm italic">I wish I had more time.</p>`,
    examples: [
      "I wish I could speak Japanese.",
      "She wishes she had studied harder.",
      "We wish you were here.",
    ],
  },
  "relative-pronouns": {
    structure: `<ul class="space-y-1 text-sm"><li><code class="bg-emerald-500/15 px-1 rounded text-xs">who</code>: people (subject)</li><li><code class="bg-blue-500/15 px-1 rounded text-xs">whom</code>: people (object)</li><li><code class="bg-amber-500/15 px-1 rounded text-xs">which</code>: things</li><li><code class="bg-rose-500/15 px-1 rounded text-xs">that</code>: people or things</li></ul>`,
    examples: [
      "The person who called left a message.",
      "The book which I lent you is on the table.",
      "Everything that he said was true.",
    ],
  },
  inversion: {
    structure: `<p class="mb-2"><span class="font-bold text-emerald-600 dark:text-emerald-400">Auxiliary</span> + Subject + Verb <span class="text-muted-foreground">(for emphasis)</span></p><ul class="list-disc ml-4 space-y-1 text-sm"><li>Never have I seen...</li><li>Only when... did I understand.</li></ul>`,
    examples: [
      "Never have I been so surprised.",
      "Not only did she win, but she broke the record.",
      "Only then did I realize my mistake.",
    ],
  },
  subjunctive: {
    structure: `<p class="mb-2"><span class="font-bold text-amber-600 dark:text-amber-400">Base form</span> after suggest, recommend, demand</p><ul class="list-disc ml-4 space-y-1 text-sm"><li>I suggest (that) he <span class="font-semibold text-emerald-600">go</span> early.</li><li>It's important that she <span class="font-semibold text-emerald-600">be</span> informed.</li></ul>`,
    examples: [
      "I suggest that he see a doctor.",
      "It's essential that you be on time.",
      "She demanded that they leave immediately.",
    ],
  },
  "cleft-sentences": {
    structure: `<p class="mb-2"><code class="bg-blue-500/15 px-1.5 py-0.5 rounded text-xs">It</code> + <code class="bg-emerald-500/15 px-1 rounded text-xs">be</code> + <span class="font-bold text-amber-600 dark:text-amber-400">emphasized part</span> + that/who clause</p><p class="text-sm italic">It was John who broke the window.</p>`,
    examples: [
      "It was in Paris that we met.",
      "It's the price that worries me.",
      "It was she who suggested the idea.",
    ],
  },
  "emphasis-structures": {
    structure: `<p class="mb-2"><code class="bg-emerald-500/15 px-1.5 py-0.5 rounded text-xs">What</code> + clause + <code class="bg-blue-500/15 px-1 rounded text-xs">be</code> + complement</p><p class="text-sm italic">What I need is a break.</p>`,
    examples: [
      "What matters most is your health.",
      "What we need now is more time.",
      "What surprised me was his reaction.",
    ],
  },
  fronting: {
    structure: `<p class="mb-2">Move element to front for emphasis</p><p class="text-sm italic text-emerald-600 dark:text-emerald-400">Beautifully written was the book.</p>`,
    examples: [
      "Never will I forget that day.",
      "Such a mess we found!",
      "Into the room walked the teacher.",
    ],
  },
  "narrative-tenses": {
    structure: `<ul class="space-y-1.5 text-sm"><li><span class="font-semibold text-emerald-600 dark:text-emerald-400">Past Simple</span>: main events</li><li><span class="font-semibold text-blue-600 dark:text-blue-400">Past Continuous</span>: background</li><li><span class="font-semibold text-amber-600 dark:text-amber-400">Past Perfect</span>: earlier events</li></ul>`,
    examples: [
      "I was walking when I saw her. She had just arrived.",
      "While we were eating, the phone rang.",
      "He had left before I got there.",
    ],
  },
  "future-in-the-past": {
    structure: `<p class="mb-2"><code class="bg-blue-500/15 px-1.5 py-0.5 rounded text-xs">was/were going to</code> + base verb</p><p class="mb-2"><code class="bg-amber-500/15 px-1.5 py-0.5 rounded text-xs">would</code> + base verb</p><p class="text-sm italic text-muted-foreground">For plans/predictions from a past perspective</p>`,
    examples: [
      "I was going to call you yesterday.",
      "She said she would help us.",
      "We knew it was going to rain.",
    ],
  },
  "mixed-conditionals": {
    structure: `<p class="mb-2">If + past perfect, would + base</p><p class="mb-2 text-sm italic text-muted-foreground">Past condition, present result</p><p class="text-sm">If I had studied, I would have a better job.</p>`,
    examples: [
      "If she had taken the job, she would be rich now.",
      "If I had known, I would tell you.",
      "If you had listened, you wouldn't be confused.",
    ],
  },
  "formal-passives": {
    structure: `<p class="mb-2"><code class="bg-blue-500/15 px-1.5 py-0.5 rounded text-xs">It</code> + be + past participle + that clause</p><p class="text-sm italic">It is said that... / He is believed to...</p>`,
    examples: [
      "It is believed that the building dates from 1700.",
      "She is thought to be the best candidate.",
      "It was reported that the minister had resigned.",
    ],
  },
  "discourse-markers": {
    structure: `<p class="mb-2">Link ideas: <code class="bg-emerald-500/15 px-1 rounded text-xs">however, moreover, nevertheless, therefore, so</code></p><ul class="list-disc ml-4 space-y-1 text-sm"><li><span class="font-semibold text-emerald-600 dark:text-emerald-400">However</span> = contrast</li><li><span class="font-semibold text-blue-600">Moreover</span> = add</li><li><span class="font-semibold text-amber-600 dark:text-amber-400">So</span> = result</li></ul>`,
    examples: [
      "It was expensive. However, it was worth it.",
      "She's talented. Moreover, she works hard.",
      "I was tired, so I went to bed early.",
    ],
  },
  hedging: {
    structure: `<p class="mb-2"><span class="font-semibold text-emerald-600 dark:text-emerald-400">Softening</span>: <code class="bg-blue-500/15 px-1 rounded text-xs">sort of, kind of, perhaps, maybe, arguably</code></p><p class="text-sm italic text-muted-foreground">To express uncertainty or politeness</p>`,
    examples: [
      "It's sort of difficult to explain.",
      "Perhaps we could try again.",
      "Arguably, this is the best solution.",
    ],
  },
  nominalization: {
    structure: `<p class="mb-2">Verb/Adj <span class="text-muted-foreground">→</span> Noun: <span class="text-emerald-600">decide</span> <span class="text-muted-foreground">→</span> <span class="text-blue-600">decision</span>, <span class="text-emerald-600">analyze</span> <span class="text-muted-foreground">→</span> <span class="text-blue-600">analysis</span></p><p class="text-sm italic text-muted-foreground">Common in academic/formal writing</p>`,
    examples: [
      "The decision was made quickly.",
      "An analysis of the data revealed...",
      "The implementation of the plan took six months.",
    ],
  },
  "academic-style": {
    structure: `<ul class="space-y-1.5 text-sm"><li><span class="font-semibold text-emerald-600 dark:text-emerald-400">Formal vocabulary</span></li><li><span class="font-semibold text-blue-600 dark:text-blue-400">Passive voice</span></li><li><span class="font-semibold text-amber-600 dark:text-amber-400">Nominalization</span></li></ul><p class="mt-2 text-sm italic text-muted-foreground">Avoid contractions, use precise terms</p>`,
    examples: [
      "The experiment was conducted under controlled conditions.",
      "It has been demonstrated that...",
      "Further research is required to establish...",
    ],
  },
};
