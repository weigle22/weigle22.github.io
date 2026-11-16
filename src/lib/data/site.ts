// Everything personal lives here. Empty strings and empty lists are simply not shown on the site,
// so fill in what you want public and leave the rest blank.

export const site = {
	name: 'Emmanuel Otacan',
	monogram: 'EO',
	title: 'Full-stack developer',
	statement: 'Building the part of software you never see.',
	intro: 'I design the rules, the data and the hand-offs behind business systems, then build the screens that sit on top.',
	stackLine: '.NET · Angular · SQL Server',

	githubUsername: 'weigle22',
	url: 'https://weigle22.github.io',

	// TODO(you): fill these in if you want them public. Empty = hidden.
	location: '',
	availability: '',
	email: '',
	profileImage: '/images/emmanuel-otacan-graduation.webp',
	profileCaption: 'Master’s in Information Technology Education',

	linkedin: 'https://linkedin.com/in/emmanuelotacan',
	links: [{ label: 'Stack Overflow', url: 'https://stackoverflow.com/users/6114688' }]
};

export const about = {
	headline: ['Screens get redesigned.', 'What’s underneath has to last.'],
	blocks: [
		{
			label: 'Background',
			title: 'Seven-plus years inside business systems',
			text: 'Most of my work has been full-stack ASP.NET: C#, SQL Server, and AngularJS then Angular on top. HR, payroll, attendance and leave: systems where a wrong number is somebody’s salary.'
		},
		{
			label: 'Philosophy',
			title: 'The rule lives in the domain, not in the form',
			text: 'A screen is the last mile. I put the decision where it can be tested and reused: in the domain, behind an API that gives one honest answer. Then the screen can change as often as it likes.'
		},
		{
			label: 'Approach',
			title: 'Void it, never delete it',
			text: 'I rebuild old systems beside the running one, with a bridge so both agree until the switch. Fixes are reversible by default. If I can’t undo it, I haven’t finished designing it.'
		},
		{
			label: 'Interests',
			title: 'Post-quantum signatures and AI that stays on your machine',
			text: 'Outside the day job I wrap lattice-based cryptography so web apps can use it, and build question-answering over legal documents that never leaves the laptop.'
		}
	]
};

export interface Milestone {
	when: string;
	kind: 'Project' | 'Experience' | 'Education' | 'Certification';
	title: string;
	note: string;
}

export const journey: Milestone[] = [
	{ when: '2016', kind: 'Project', title: 'Color Stroop', note: 'A first Android game, written in Java. Where the questions started.' },
	{ when: '7+ yrs', kind: 'Experience', title: 'Full-stack ASP.NET development', note: 'C#, MS SQL, AngularJS and TypeScript, shipping systems people use at work every day.' },
	// TODO(you): add the school and year to this entry.
	{ when: 'M.I.T.Ed.', kind: 'Education', title: 'Master’s in Information Technology Education', note: '' },
	{ when: '2024', kind: 'Project', title: 'Post-quantum signatures', note: 'FALCON, from a C reference implementation up to a working web app.' },
	{ when: '2025', kind: 'Project', title: 'Local AI', note: 'Retrieval-augmented question answering over legal PDFs, fully offline.' },
	{ when: '2026', kind: 'Project', title: 'Rebuilding, properly', note: 'An HR system in Clean Architecture, an event API on .NET 10, a church site with a Git-based CMS, and Color Stroop again, in Flutter.' }

	// TODO(you): add employers, education and certifications here, for example:
	// { when: '2018 – 2021', kind: 'Experience', title: 'Role, Company', note: 'What you were responsible for.' },
	// { when: '2017', kind: 'Education', title: 'Degree, School', note: '' },
];

/** The same leave request, seen at four altitudes of one system. Illustrative, not production code. */
export const layers = [
	{ id: 'ui', label: 'screen', caption: 'What the employee sees: three fields and a button.', code: '' },
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
	{ id: 'data', label: 'data', caption: 'What is left when every screen has been redesigned twice.', code: '' }
];

/** What the guide says as each section comes into view, and the order of the tour. */
export const tour = [
	{ id: 'top', say: 'Hi, I’m Bit. Move your cursor: the light follows you. Take the tour, or just scroll.' },
	{ id: 'work', say: 'Every picture here is drawn in code. Filter them, search them, or open one to see what’s underneath.' },
	{ id: 'about', say: 'How I think: one leave request, four altitudes. Slide down a level.' },
	{ id: 'experience', say: 'The short version of ten years.' },
	{ id: 'stack', say: 'This constellation is an Angular component living inside a Svelte page. Pick a star.' },
	{ id: 'playground', say: 'Three things you can actually use.' },
	{ id: 'github', say: 'Real numbers, fetched from GitHub when this page was last built.' },
	{ id: 'contact', say: 'That’s the tour. Say hello.' }
];
