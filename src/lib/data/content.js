// Curated content. Live GitHub numbers are fetched separately at build time
// (see src/routes/+page.server.js). Edit this file to change what the site says.

export const person = {
	name: 'Emmanuel Otacan',
	handle: 'weigle22',
	links: [
		{ label: 'GitHub', url: 'https://github.com/weigle22' },
		{ label: 'LinkedIn', url: 'https://linkedin.com/in/emmanuelotacan' },
		{ label: 'Stack Overflow', url: 'https://stackoverflow.com/users/6114688' }
	]
};

/** The same leave request, seen at four altitudes of one system. Illustrative, not production code. */
export const layers = [
	{
		id: 'ui',
		label: 'screen',
		caption: 'What the employee sees: three fields and a button.'
	},
	{
		id: 'api',
		label: 'api',
		caption: 'What the button sends. One request, one honest answer.',
		code: `POST /api/leave
{ "type": "Vacation", "days": 3 }

201 Created
{ "id": 4821, "status": "Draft" }`
	},
	{
		id: 'domain',
		label: 'rules',
		caption: 'What decides the answer. The rule lives here, not in the form.',
		code: `if (request.Days > balance.Available)
    return Error.Validation(
        "Leave.InsufficientBalance");

application.MoveTo(Status.Submitted);`
	},
	{
		id: 'data',
		label: 'data',
		caption: 'What is left when every screen has been redesigned twice.'
	}
];

/**
 * Case files. `front` is what people see; `back` is what was underneath.
 * Private work is described generically on purpose: no organisation names,
 * no real data, no code links.
 */
export const cases = [
	{
		id: 'falcon',
		tags: ['post-quantum', 'cryptography', 'open source'],
		title: 'FALCON signatures, made usable from the web',
		figure: '4 layers',
		figureNote: 'between a lattice-based signature scheme written in C and a button that says “Sign”.',
		front: 'Quantum-resistant signing sounds like a research paper. I wanted it to feel like a form.',
		back: [
			'The official FALCON reference implementation in C, adapted to compile into a 32- or 64-bit DLL',
			'An ASP.NET Core Minimal API wrapping that DLL for key generation, signing and verification',
			'An ASP.NET MVC + AngularJS app on top, with SQL Server behind it',
			'Python scripts for signing text, files and memory streams against the same DLL'
		],
		stack: ['C', 'ASP.NET Core', 'ASP.NET MVC', 'AngularJS', 'SQL Server', 'Python'],
		link: { label: 'View the code', url: 'https://github.com/weigle22/post-quantum-sign-FALCON-MVC' },
		tone: 'ink'
	},
	{
		id: 'hris',
		tags: ['hr system', 'clean architecture', 'private'],
		title: 'A leave request that five people have to agree on',
		figure: '5 roles',
		figureNote: 'sign off on one leave application before it reaches the ledger.',
		front: 'The employee sees a form. Behind it is a workflow that can be passed on, returned or reverted at every step.',
		back: [
			'A legacy ASP.NET MVC system kept running while its replacement is built beside it',
			'A new .NET API in Clean Architecture: request handlers that return typed results instead of throwing',
			'An Angular front end, aligned to that API',
			'A bridge so records saved by the new system still show up correctly in the old one',
			'A habit: void a record, never delete it, so every fix can be seen and undone'
		],
		stack: ['.NET', 'Clean Architecture', 'Angular', 'SQL Server'],
		tone: 'paper'
	},
	{
		id: 'events',
		tags: ['events', 'api design', 'private'],
		title: 'Knowing who actually arrived',
		figure: '4 roles',
		figureNote: 'share one live guest list: organiser, admin, usher and the person reading names aloud.',
		front: 'An usher confirms a guest at the door. Seconds later, the person at the microphone knows to recognise them.',
		back: [
			'An ASP.NET Core Web API on .NET 10 with Entity Framework Core and SQL Server',
			'JWT sign-in with custom authorization policies, by role and by module',
			'Guests, their representatives, and the order they are recognised in, modelled as separate things',
			'Web apps for the people who plan, mobile apps for the people on the floor'
		],
		stack: ['.NET 10', 'EF Core', 'SQL Server', 'JWT'],
		tone: 'accent'
	},
	{
		id: 'church',
		tags: ['website', 'git-based cms', 'live'],
		title: 'A church website its own admins can edit',
		figure: '0 build steps',
		figureNote: 'no database, no server. A save in the admin page is a Git commit.',
		front: 'Volunteers update events, sermons and photos themselves. I only get called for layout.',
		back: [
			'Plain HTML, CSS and JavaScript, on purpose',
			'All content in small JSON files the page loads when it opens',
			'An admin page powered by Sveltia CMS, with field labels and help text written for non-developers',
			'GitHub Pages republishes about a minute after each save'
		],
		stack: ['HTML', 'CSS', 'JavaScript', 'Sveltia CMS', 'GitHub Pages'],
		link: { label: 'View the code', url: 'https://github.com/spiritwindfc/spiritwindfc-web' },
		tone: 'paper'
	},
	{
		id: 'rag',
		tags: ['local ai', 'rag', 'open source'],
		title: 'Asking a law a question, offline',
		figure: '0 cloud calls',
		figureNote: 'the documents, the embeddings and the model all stay on the machine.',
		front: 'Upload a PDF of implementing rules, ask in plain language, get an answer grounded in the text.',
		back: [
			'PDFs split into overlapping chunks and embedded with a small local model',
			'A FAISS index, cached on disk so the second question is fast',
			'A locally hosted reasoning model answering through LangChain, streamed as it thinks',
			'A FastAPI back end with a React + Vite + Tailwind front end for upload-and-ask'
		],
		stack: ['Python', 'LangChain', 'FAISS', 'Ollama', 'FastAPI', 'React'],
		link: { label: 'View the code', url: 'https://github.com/weigle22/rag-webapp' },
		tone: 'ink'
	},
	{
		id: 'stroop',
		tags: ['mobile game', 'flutter', 'rebuild'],
		title: 'Rebuilding my 2016 game without changing how it plays',
		figure: '2016 → 2026',
		figureNote: 'a Java Android game, reborn in Flutter.',
		front: 'Same rules, same scoring, same timing. New engine, friendlier face.',
		back: [
			'Original built in Java around 2016; the rebuild is in Flutter',
			'Gameplay, scoring and timing treated as a contract the new code has to honour',
			'A game engine separated from the UI so it can be tested on its own',
			'As few dependencies as the job allows'
		],
		stack: ['Flutter', 'Dart', 'Java (original)'],
		link: { label: 'Play a tiny version below', url: '#demos' },
		tone: 'accent'
	}
];

export const archive = [
	{
		title: 'CSV migrator',
		note: 'A desktop tool that validates, auto-fixes and loads patient and treatment CSV exports into SQLite, in three clean layers.',
		url: 'https://github.com/weigle22/CorePracticeCsvMigrator'
	},
	{
		title: 'Clean Architecture take-home',
		note: 'Colours, tags and soft delete added to a .NET + Angular app as three pull requests, each with tests.',
		url: 'https://github.com/weigle22/fd-recruitment-task'
	},
	{
		title: 'AiRA-9184',
		note: 'The first local question-answering script, over the Philippine procurement law’s implementing rules.',
		url: 'https://github.com/weigle22/AiRA-9184'
	},
	{
		title: 'Business suite',
		note: 'Payroll, loans and point of sale for a multi-branch business, in ASP.NET MVC. Private.'
	}
];

export const path = [
	{ when: '2016', what: 'Color Stroop', note: 'A first Android game, written in Java. Where the questions started.' },
	{ when: 'Since', what: 'Full-stack ASP.NET', note: 'Seven-plus years of C#, MS SQL, AngularJS and TypeScript, shipping systems people use at work.' },
	{ when: '2024', what: 'Post-quantum signatures', note: 'FALCON, from a C reference implementation up to a web app.' },
	{ when: '2025', what: 'Local AI', note: 'Retrieval-augmented question answering over legal PDFs, fully offline.' },
	{ when: '2026', what: 'Rebuilding, properly', note: 'An HR system in Clean Architecture, an event API on .NET 10, a church site with a Git-based CMS, and Color Stroop again, in Flutter.' }
];

/** What the guide says as each section comes into view, and the order of the tour. */
export const tour = [
	{ id: 'top', say: 'Hi, I’m Bit. I live in the corner. Take the tour, or just scroll.' },
	{ id: 'layers', say: 'One leave request, four altitudes. Slide down to see what the screen is hiding.' },
	{ id: 'work', say: 'Six case files. The front is what people see. Flip one for what’s underneath.' },
	{ id: 'demos', say: 'Three things you can actually use. One of them is Angular, running inside Svelte.' },
	{ id: 'path', say: 'The short version of ten years.' },
	{ id: 'numbers', say: 'These numbers came from GitHub when this page was last built.' },
	{ id: 'contact', say: 'That’s the tour. Say hello.' }
];
