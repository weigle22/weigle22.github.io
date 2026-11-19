// Everything personal lives here. Empty strings and empty lists are simply not shown on the site,
// so fill in what you want public and leave the rest blank.

export const site = {
	name: 'Emmanuel Otacan',
	monogram: 'EO',
	title: 'Full-Stack .NET Developer',
	statement: 'Building the part of software you never see.',
	intro:
		'I’m a full-stack .NET developer specializing in business applications, backend engineering, and database-driven systems. I build applications that translate complex business rules into reliable, maintainable software.',
	stackLine: 'ASP.NET Core · C# · SQL Server · Angular',
	location: 'Tagum City, Davao del Norte, Philippines',
	locationShort: 'Tagum City, PH',
	experienceSince: 2020,
	/** Shown in the hero facts and Contact. Empty = hidden. */
	workPreference: 'Remote',

	githubUsername: 'weigle22',
	url: 'https://weigle22.github.io',

	// TODO(you): fill these in when you want them public. Empty = hidden everywhere.
	/** e.g. 'Open to remote roles'. Shows a green dot in the hero and contact sections. */
	availability: '',
	/** Shown in Contact and used for the main "Email me" button. */
	email: 'emmanuelotacan95@gmail.com',
	/**
	 * Your résumé. Put the PDF in static/ (e.g. static/Emmanuel-Otacan-Resume.pdf) and set
	 * file: '/Emmanuel-Otacan-Resume.pdf' and updated: '2026-11'. The download buttons appear by themselves.
	 */
	resume: { file: '/Emmanuel-Otacan-Resume.pdf', updated: '2025-10' },
	/**
	 * Contact form endpoint from a static-friendly form service (e.g. https://formspree.io/f/xxxxxxx).
	 * Public by nature: never put a secret key here. Empty = no form, links only.
	 */
	contactFormEndpoint: '',

	profileImage: '/images/emmanuel-otacan-graduation.webp',
	profileCaption: 'Master in Information Technology',

	linkedin: 'https://linkedin.com/in/emmanuelotacan',
	links: [{ label: 'Stack Overflow', url: 'https://stackoverflow.com/users/6114688' }]
};

export const about = {
	headline: ['Screens get redesigned.', 'What’s underneath has to last.'],
	blocks: [
		{
			label: 'Background',
			title: 'Government business systems since 2020',
			text: 'I work as a Computer Programmer at the Provincial Government of Davao del Norte, building modules for its property-and-supplies, executive-management and HR systems with ASP.NET, C#, SQL Server and AngularJS or Angular. Systems where a wrong number is somebody’s salary or somebody’s purchase order.'
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

export interface SystemWorkedOn {
	name: string;
	full?: string;
	/** Your own part. Leave empty if you'd rather not say: the system then shows as team work only. */
	contribution?: string;
}

export interface Employment {
	role: string;
	org: string;
	start: string;
	end: string;
	location: string;
	responsibilities: string[];
	systems: SystemWorkedOn[];
}

export const employment: Employment[] = [
	{
		role: 'Computer Programmer',
		org: 'Provincial Government of Davao del Norte',
		start: 'June 2020',
		end: 'Present',
		location: 'Tagum City, Philippines',
		responsibilities: [
			'Develop and maintain business applications.',
			'Design and maintain back-end functionality using ASP.NET MVC, ASP.NET Core and C#.',
			'Develop and maintain SQL Server databases, stored procedures, views and queries.',
			'Maintain AngularJS and Angular application interfaces.',
			'Implement business workflows and data processing.',
			'Support system modernization and application maintenance.'
		],
		systems: [
			{
				name: 'PASIMS',
				full: 'Properties and Supplies Information Management System',
				contribution:
					'I built the Abstract of Quotations, Procurement Monitoring Report (PMR), Purchase Request Status, and PR Recommendations and Approvals modules.'
			},
			{
				name: 'EMIS',
				full: 'Executive Management Information System',
				contribution: 'I built the Local Finance Committee Deliberation module.'
			},
			{
				name: 'HRIS',
				full: 'Human Resource Information System',
				contribution:
					'Support for the legacy ASP.NET MVC system, and, with a teammate, the new Clean Architecture rebuild: I am building the leave-application workflow API.'
			}
		]
	}
];

export interface Credential {
	when: string;
	title: string;
	org: string;
	kind: 'Degree' | 'Eligibility' | 'Certification' | 'Training' | 'Recognition';
	note?: string;
}

/** Most recent first. TODO(you): add certifications, training and awards here. */
export const education: Credential[] = [
	{ when: 'July 2024', title: 'Master in Information Technology', org: 'Davao del Norte State College', kind: 'Degree' },
	{ when: 'December 2018', title: 'Civil Service Examination: Professional Eligibility', org: 'Civil Service Commission', kind: 'Eligibility' },
	{ when: '2017', title: 'Bachelor of Science in Computer Science', org: 'University of Mindanao, Tagum Campus', kind: 'Degree' }
];

export interface Milestone {
	when: string;
	kind: 'Project' | 'Experience' | 'Education' | 'Certification';
	title: string;
	note: string;
}

export const journey: Milestone[] = [
	{ when: '2016', kind: 'Project', title: 'Color Stroop', note: 'A first Android game, written in Java. Where the questions started.' },
	{ when: '2017', kind: 'Education', title: 'BS Computer Science', note: 'University of Mindanao, Tagum Campus.' },
	{ when: '2020', kind: 'Experience', title: 'Computer Programmer', note: 'Provincial Government of Davao del Norte: procurement, management-information and HR systems.' },
	{ when: '2024', kind: 'Education', title: 'Master’s degree', note: 'Master in Information Technology, Davao del Norte State College. The same year, FALCON: post-quantum signatures from a C reference implementation up to a web app.' },
	{ when: '2025', kind: 'Project', title: 'Local AI', note: 'Retrieval-augmented question answering over legal PDFs, fully offline.' },
	{ when: '2026', kind: 'Project', title: 'Rebuilding, properly', note: 'An HR system in Clean Architecture, an event API on .NET 10, a church site with a Git-based CMS, and Color Stroop again, in Flutter.' }
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
	{ id: 'top', say: 'Hi, I’m Bit, this site’s guide. I can show you around in a minute, or you can jump straight to a section.' },
	{ id: 'work', say: 'Nine projects, every picture drawn in code. Filter them, or open one for the full case study.' },
	{ id: 'about', say: 'How Emmanuel thinks: one leave request, four altitudes. Slide down a level.' },
	{ id: 'experience', say: 'His job, his responsibilities, and the systems he works on, with his own part marked.' },
	{ id: 'education', say: 'Degrees and eligibility.' },
	{ id: 'stack', say: 'Every technology, marked by how he has actually used it. This chart is an Angular component inside a Svelte page.' },
	{ id: 'playground', say: 'Four things you can try, including a SQL query you build with clicks.' },
	{ id: 'github', say: 'GitHub activity since 2024, refreshed nightly. Private work counts in the calendar, as numbers only.' },
	{ id: 'contact', say: 'You’ve reached the end. Every way to get in touch is right here.' }
];
