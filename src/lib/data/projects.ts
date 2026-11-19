// Hand-written project data. This file is the source of truth for what the site says about each
// project; GitHub only adds stars, language, last update and latest commit (see services/github.ts).
//
// To add a project: copy an entry, give it a unique `id`, and set `repository` to "owner/name" if it
// is public. Private work: leave `repository` out and keep the description generic.
//
// Case studies: every `caseStudy` field is optional and a section only appears when it has content.
// Nothing here is estimated: statements come from the repositories or from Emmanuel directly.
// `lessons` is deliberately empty everywhere: only you can write those.

import type { Project } from './types.ts';

export const projects: Project[] = [
	{
		id: 'falcon',
		title: 'Falcon',
		description: 'A post-quantum signature scheme, made usable from an ordinary web app.',
		category: 'Cryptography',
		context: 'Personal',
		repository: 'weigle22/post-quantum-sign-FALCON-MVC',
		featured: true,
		year: '2024',
		technologies: ['C', 'C#', 'ASP.NET Core', 'ASP.NET MVC', 'AngularJS', 'SQL Server', 'Python'],
		surface: 'Quantum-resistant signing sounds like a research paper. I wanted it to feel like a form.',
		highlights: [
			'The official FALCON reference implementation in C, adapted to compile into a 32- or 64-bit DLL',
			'An ASP.NET Core Minimal API wrapping that DLL for key generation, signing and verification',
			'An ASP.NET MVC + AngularJS app on top, with SQL Server behind it',
			'Python scripts for signing text, files and memory streams against the same DLL'
		],
		caseStudy: {
			overview:
				'FALCON is a lattice-based signature scheme selected by NIST for post-quantum standardisation. Its reference implementation is C. This project takes that C code and makes it callable from a .NET web application, so that keys, signatures and verification can be handled through ordinary screens and HTTP requests.',
			problem:
				'Post-quantum algorithms exist as C reference code, but business applications are written in C#, JavaScript and Python. The question was how to put a real FALCON implementation behind an API that an MVC app, or anything else, could call, without re-implementing the cryptography.',
			role: 'Personal project, built by me: the DLL build, the C# interop layer, the Minimal API, the MVC application and the Python scripts. The repository is published for demonstration only, as its README states.',
			architecture: {
				caption: 'One native library, three ways in. The MVC app talks to the API over HTTP; the API and the Python scripts both load the same DLL.',
				nodes: [
					{ id: 'mvc', label: 'ASP.NET MVC + AngularJS', detail: 'Sign-in, keys, certificates, signing and verification screens. Calls the API through an HTTP client.', row: 0, kind: 'client' },
					{ id: 'api', label: 'ASP.NET Core Minimal API', detail: 'Exposes key generation, signing and verification. Documented with Swagger UI.', row: 1, kind: 'service' },
					{ id: 'db', label: 'SQL Server', detail: 'Users and application data for the MVC app. A database backup ships with the repository.', row: 1, kind: 'data' },
					{ id: 'wrap', label: 'FalconWrapper (P/Invoke)', detail: 'DllImport declarations with the C calling convention; keys and signatures cross the boundary as hex strings.', row: 2, kind: 'service' },
					{ id: 'py', label: 'Python scripts', detail: 'ctypes bindings for signing and verifying text, files and memory streams.', row: 2, kind: 'client' },
					{ id: 'dll', label: 'falcon_full.dll', detail: 'The FALCON reference implementation in C, modified to export functions, cross-compiled for 32- or 64-bit Windows.', row: 3, kind: 'native' },
				],
				edges: [
					{ from: 'mvc', to: 'api', label: 'HTTP' },
					{ from: 'api', to: 'wrap' },
					{ from: 'wrap', to: 'dll', label: 'P/Invoke' },
					{ from: 'py', to: 'dll', label: 'ctypes' },
					{ from: 'mvc', to: 'db' }
				]
			},
			decisions: [
				{
					title: 'Wrap the reference code instead of porting it',
					text: 'The C implementation is the one the algorithm’s authors publish. Exporting it from a DLL and calling it through P/Invoke keeps the cryptography untouched; the .NET side only moves bytes in and out.'
				},
				{
					title: 'An API between the app and the library',
					text: 'The MVC application never loads the DLL itself. It calls the Minimal API, so any other front end can use the same signing service, and the native dependency lives in one place.'
				},
				{
					title: 'Hex strings across the boundary',
					text: 'Keys and signatures are passed as hex-encoded strings, which keeps the interop signatures simple and makes values easy to store, log and paste into Swagger or Postman.'
				}
			],
			challenges: [
				{
					challenge: 'The reference implementation builds executables, not a library that Windows programs can load.',
					solution: 'Added a DLL source file exporting the needed functions and a Makefile that cross-compiles it with MinGW, with switches for 32- and 64-bit targets.'
				},
				{
					challenge: 'Native and managed code disagree about memory and strings.',
					solution: 'A single static wrapper class declares every export with an explicit calling convention, so the rest of the application only ever sees ordinary C# methods.'
				}
			],
			testing: [
				'API endpoints exercised through Swagger UI and Postman, as described in the repository README.',
				'The same DLL exercised independently through the Python scripts for text, files and memory streams.'
			]
		}
	},
	{
		id: 'leave-workflow',
		title: 'Leave Workflow',
		description: 'A leave request that five people have to agree on before it reaches the ledger.',
		category: 'Business systems',
		context: 'Professional',
		featured: true,
		year: '2026',
		technologies: ['C#', 'ASP.NET Core', 'Clean Architecture', 'MediatR', 'Angular', 'TypeScript', 'SQL Server'],
		surface: 'The employee sees a form. Behind it is a workflow that can be passed on, returned or reverted at every step.',
		highlights: [
			'A legacy ASP.NET MVC system kept running while its replacement is built beside it',
			'A new .NET API in Clean Architecture: request handlers that return typed results instead of throwing',
			'An Angular front end, aligned to that API',
			'A bridge so records saved by the new system still show up correctly in the old one',
			'A habit: void a record, never delete it, so every fix can be seen and undone'
		],
		caseStudy: {
			overview:
				'Part of the rebuild of an organisation’s HR information system. The leave module moves from the legacy ASP.NET MVC application into a new .NET API built in Clean Architecture, with an Angular front end. Details are kept generic: this is a private system with real employee data.',
			problem:
				'A leave application passes through five desks: the employee, a recommending officer, a leave processor, a certifying officer and an approving officer. Any of them can send it back. Once posted, it changes the employee’s leave ledger, and the legacy system’s time records still have to show it correctly while both systems run side by side.',
			role: 'Professional work on a team. I support the legacy system and, with a teammate, the new Clean Architecture rebuild. My part here is the leave-application workflow API, built lane by lane starting with the employee’s.',
			architecture: {
				caption: 'The new API sits beside the legacy system and shares the data, so leave saved by one shows up in the other.',
				nodes: [
					{ id: 'ng', label: 'Angular front end', detail: 'Leave application screens for each role in the workflow.', row: 0, kind: 'client' },
					{ id: 'legacy', label: 'Legacy HRIS (ASP.NET MVC)', detail: 'Still in daily use. Its time records must reflect leave filed in the new system.', row: 0, kind: 'client' },
					{ id: 'api', label: 'API controllers', detail: 'Thin endpoints that turn HTTP requests into commands and queries.', row: 1, kind: 'service' },
					{ id: 'app', label: 'Application layer (MediatR)', detail: 'One handler per request. Handlers return ErrorOr results instead of throwing.', row: 2, kind: 'service' },
					{ id: 'domain', label: 'Domain', detail: 'Leave rules and the status codes each role is allowed to move an application between.', row: 2, kind: 'service' },
					{ id: 'db', label: 'SQL Server', detail: 'Leave applications and the ledger, plus a shared view the legacy system reads.', row: 3, kind: 'data' }
				],
				edges: [
					{ from: 'ng', to: 'api', label: 'HTTP' },
					{ from: 'api', to: 'app' },
					{ from: 'app', to: 'domain' },
					{ from: 'app', to: 'db', label: 'one DbContext' },
					{ from: 'legacy', to: 'db', label: 'shared view' }
				]
			},
			decisions: [
				{ title: 'Typed results, not exceptions', text: 'MediatR handlers return ErrorOr results, so a rejected request is an ordinary value the API can turn into a clear response, not an exception to catch.' },
				{ title: 'One DbContext per database', text: 'A single application DbContext for the HR database; separate contexts only for genuinely different databases.' },
				{ title: 'Bridge, don’t edit', text: 'To show new leave in the legacy time records, a new database function was added alongside the existing one rather than changing it, so the change can be undone.' },
				{ title: 'Void, never delete', text: 'Bad records are voided so they stay visible and reversible. Data fixes are made by hand; scripts are used only to verify them.' }
			],
			beforeAfter: [
				{ aspect: 'Application status', before: 'Integers 0 to 7', after: 'Named codes per role: D1 Draft, E1 Submitted, R1 Recommended, L1 Approved by processor, L4 Posted, C1 Certified, A1 Approved, plus a return code at every level' },
				{ aspect: 'Where rules live', before: 'Inside the MVC application', after: 'In domain and application layers behind an API, testable without the UI' },
				{ aspect: 'Errors', before: 'Exceptions', after: 'ErrorOr results returned by each handler' },
				{ aspect: 'Undoing a posted leave', before: 'Not modelled', after: 'An explicit revert code at the processor level, separate from returns made before posting' }
			]
		}
	},
	{
		id: 'event-attendance',
		title: 'Event Attendance',
		description: 'One live guest list shared by the organiser, the admin, the usher and the person reading names aloud.',
		category: 'Business systems',
		context: 'Professional',
		featured: true,
		year: '2026',
		technologies: ['C#', 'ASP.NET Core', 'Entity Framework Core', 'SQL Server', 'JWT'],
		surface: 'An usher confirms a guest at the door. Seconds later, the person at the microphone knows to recognise them.',
		highlights: [
			'An ASP.NET Core Web API on .NET 10 with Entity Framework Core and SQL Server',
			'JWT sign-in with custom authorization policies, by role and by module',
			'Guests, their representatives, and the order they are recognised in, modelled as separate things',
			'Web apps for the people who plan, mobile apps for the people on the floor'
		],
		caseStudy: {
			overview:
				'A back end for recognising guests at formal events. Four roles work from the same list: an event organiser sets the order of recognition, an administrator routes invitations and confirms attendance, ushers confirm arrivals at the door, and a reader sees who has arrived.',
			problem:
				'Guests send representatives, arrive unannounced, or change names on the day. The person reading names aloud needs an accurate, current list without waiting for paperwork from the door.',
			role: 'API design and implementation: data model, authentication and authorization. Private repository.',
			architecture: {
				caption: 'Every app goes through one API. Authorization is decided per role and per module before a controller runs.',
				nodes: [
					{ id: 'web', label: 'Web apps', detail: 'Organiser and administrator screens.', row: 0, kind: 'client' },
					{ id: 'mobile', label: 'Mobile apps', detail: 'Usher and reader screens, used on the floor.', row: 0, kind: 'client' },
					{ id: 'auth', label: 'JWT + policy provider', detail: 'Bearer tokens. A custom policy provider builds role and module requirements on demand from controller attributes.', row: 1, kind: 'service' },
					{ id: 'api', label: 'ASP.NET Core API (.NET 10)', detail: 'Controllers for events, guests, representatives, recognition order and user roles. OpenAPI and Swagger.', row: 2, kind: 'service' },
					{ id: 'ef', label: 'Entity Framework Core', detail: 'Code-first model with migrations.', row: 3, kind: 'service' },
					{ id: 'db', label: 'SQL Server', detail: 'Events, guests, representatives and attendance.', row: 3, kind: 'data' }
				],
				edges: [
					{ from: 'web', to: 'auth', label: 'HTTPS' },
					{ from: 'mobile', to: 'auth', label: 'HTTPS' },
					{ from: 'auth', to: 'api' },
					{ from: 'api', to: 'ef' },
					{ from: 'ef', to: 'db' }
				]
			},
			decisions: [
				{ title: 'Authorization by role and by module', text: 'Two custom requirements and handlers, one for roles and one for modules, applied through attributes on controllers. A custom policy provider creates the matching policy at runtime, so there is no hand-maintained list of policies.' },
				{ title: 'Representatives as their own entity', text: 'A representative is not just a renamed guest. Modelling them separately keeps the invited guest, the person who came, and the recognition order all accurate.' }
			]
		}
	},
	{
		id: 'spiritwind',
		title: 'Spiritwind',
		description: 'A church website its own volunteers can edit, with no build step, database or server.',
		category: 'Web',
		context: 'Volunteer',
		repository: 'spiritwindfc/spiritwindfc-web',
		featured: true,
		year: '2026',
		technologies: ['JavaScript', 'HTML & CSS', 'Sveltia CMS', 'GitHub Pages', 'Cloudflare Workers'],
		surface: 'Volunteers update events, sermons and photos themselves. I only get called for layout.',
		highlights: [
			'Plain HTML, CSS and JavaScript, on purpose',
			'All content in small JSON files the page loads when it opens',
			'An admin page powered by Sveltia CMS, with labels and help text written for non-developers',
			'Every save is a Git commit; GitHub Pages republishes about a minute later'
		],
		caseStudy: {
			overview: 'The website of Spiritwind Fellowship Church, built so that church volunteers, not a developer, keep it up to date.',
			problem: 'Events, sermons, ministries and photos change every week. A developer-maintained site goes stale; a hosted CMS adds cost and a server to look after.',
			role: 'Volunteer work, built by me: site, content model, admin set-up and the guide for church admins.',
			architecture: {
				caption: 'No server of its own. Content is JSON in the repository; the admin page edits it through GitHub.',
				nodes: [
					{ id: 'visitor', label: 'Visitors', detail: 'Static HTML, CSS and JavaScript. Pages load their content from JSON files.', row: 0, kind: 'client' },
					{ id: 'admin', label: 'Volunteers in /admin', detail: 'Sveltia CMS with forms, labels and help text written for non-developers.', row: 0, kind: 'client' },
					{ id: 'pages', label: 'GitHub Pages', detail: 'Serves the site and republishes after every commit.', row: 1, kind: 'external' },
					{ id: 'worker', label: 'Cloudflare Worker', detail: 'Handles “Sign in with GitHub” for the admin page.', row: 1, kind: 'external' },
					{ id: 'repo', label: 'GitHub repository', detail: 'Eight JSON content files (events, sermons, ministries, gallery, theme and more) and the images.', row: 2, kind: 'data' }
				],
				edges: [
					{ from: 'visitor', to: 'pages' },
					{ from: 'admin', to: 'worker', label: 'sign in' },
					{ from: 'admin', to: 'repo', label: 'commit' },
					{ from: 'repo', to: 'pages', label: 'publish' }
				]
			},
			decisions: [
				{ title: 'No framework, no build step', text: 'Plain files mean the next volunteer developer can understand the site in an afternoon, and nothing needs upgrading to keep it running.' },
				{ title: 'Content as data', text: 'Every editable thing lives in a JSON file, so the CMS can offer a form for it and the layout code never has to change for new content.' },
				{ title: 'Git as the database', text: 'Every save is a commit: there is a full history, any change can be rolled back, and hosting stays free.' }
			],
			results: ['The repository includes an admin guide written for church volunteers, alongside a privacy page, sitemap and robots file.']
		}
	},
	{
		id: 'local-rag',
		title: 'Local RAG',
		description: 'Upload a law’s implementing rules as a PDF and ask it questions, entirely offline.',
		category: 'AI',
		context: 'Personal',
		repository: 'weigle22/rag-webapp',
		featured: true,
		year: '2025',
		technologies: ['Python', 'FastAPI', 'LangChain', 'FAISS', 'Ollama', 'React', 'TypeScript'],
		surface: 'Ask in plain language, get an answer grounded in the text. Nothing leaves the machine.',
		highlights: [
			'PDFs split into overlapping chunks and embedded with a small local model',
			'A FAISS index, cached on disk so the second question is fast',
			'A locally hosted reasoning model answering through LangChain',
			'A FastAPI back end with a React + Vite + Tailwind front end for upload-and-ask',
			'Grew out of AiRA-9184, a first script over the Philippine procurement law'
		],
		caseStudy: {
			overview:
				'A retrieval-augmented question-answering app for legal documents. The sample document is the implementing rules of Republic Act 12009, the Philippine procurement law. Everything, including the language model, runs on the local machine.',
			problem: 'Long regulations are hard to search, and sending them to a cloud AI service is not always acceptable. The goal was answers grounded in the document, with no data leaving the computer.',
			role: 'Personal project, built by me. It started as AiRA-9184, a single script, and became this web app.',
			architecture: {
				caption: 'Upload once, ask many times. The index for each PDF is built on first use and loaded from disk afterwards.',
				nodes: [
					{ id: 'ui', label: 'React + Vite + Tailwind', detail: 'Upload a PDF, pick it, ask a question.', row: 0, kind: 'client' },
					{ id: 'api', label: 'FastAPI', detail: 'Two endpoints: /upload and /ask.', row: 1, kind: 'service' },
					{ id: 'chain', label: 'LangChain RetrievalQA', detail: 'Retrieves the most relevant chunks and passes them to the model with the question.', row: 2, kind: 'service' },
					{ id: 'faiss', label: 'FAISS index (per PDF)', detail: 'Chunks of 1,000 characters with 150 overlapping, embedded with nomic-embed-text and saved to disk.', row: 3, kind: 'data' },
					{ id: 'ollama', label: 'Ollama', detail: 'Runs the embedding model and the deepseek-r1 reasoning model locally.', row: 3, kind: 'external' }
				],
				edges: [
					{ from: 'ui', to: 'api', label: 'HTTP' },
					{ from: 'api', to: 'chain' },
					{ from: 'chain', to: 'faiss', label: 'retrieve' },
					{ from: 'chain', to: 'ollama', label: 'generate' }
				]
			},
			decisions: [
				{ title: 'Everything local', text: 'Ollama serves both the embedding model and the answering model, so documents and questions never leave the machine.' },
				{ title: 'One index per document, cached', text: 'The vector index is built the first time a PDF is asked about and saved to disk; later questions load it instead of re-embedding the whole document.' },
				{ title: 'Overlapping chunks', text: 'Chunks of 1,000 characters overlap by 150, so a rule that falls across a boundary still appears whole in at least one chunk.' }
			]
		}
	},
	{
		id: 'color-stroop',
		title: 'Color Stroop',
		description: 'My 2016 Android game, rebuilt in Flutter without changing how it plays.',
		category: 'Mobile',
		context: 'Personal',
		featured: true,
		year: '2026',
		technologies: ['Flutter', 'Dart', 'Java', 'Clean Architecture'],
		surface: 'Same rules, same scoring, same timing. New engine, friendlier face.',
		highlights: [
			'Original built in Java around 2016; the rebuild is in Flutter',
			'Gameplay, scoring and timing treated as a contract the new code has to honour',
			'A game engine separated from the UI so it can be tested on its own',
			'As few dependencies as the job allows'
		],
		caseStudy: {
			overview: 'Color Stroop is a reaction game built on the Stroop effect: a colour word is shown in a different ink, and the player taps the ink, not the word. I wrote it for Android in Java around 2016 and am rebuilding it in Flutter.',
			problem: 'The original works, but the code and toolchain are from another era. A rewrite risks changing the feel of a game people already know.',
			role: 'Personal project, built by me. Analysis of the original came first, and nothing about the rules, scoring or difficulty changes without a deliberate decision.',
			architecture: {
				caption: 'The rules live in a plain Dart engine; Flutter only draws it.',
				nodes: [
					{ id: 'ui', label: 'Flutter UI', detail: 'Screens, animation and input. Holds no game rules.', row: 0, kind: 'client' },
					{ id: 'engine', label: 'Game engine (Dart)', detail: 'Rounds, scoring and timing, ported from the Java original.', row: 1, kind: 'service' },
					{ id: 'tests', label: 'Engine tests', detail: 'Check the engine against the original game’s behaviour, with no UI involved.', row: 2, kind: 'data' }
				],
				edges: [
					{ from: 'ui', to: 'engine' },
					{ from: 'tests', to: 'engine', label: 'verify' }
				]
			},
			decisions: [
				{ title: 'Behaviour is the contract', text: 'Gameplay, scoring and timing from the original are treated as requirements. The rebuild may look different; it may not play differently.' },
				{ title: 'Pragmatic Clean Architecture', text: 'Enough separation to test the engine on its own, and no more: minimal dependencies, no framework inside the game logic.' }
			]
		}
	},
	{
		id: 'csv-migrator',
		title: 'CSV Migrator',
		description: 'A desktop tool that validates, auto-fixes and loads patient and treatment exports into a database.',
		category: 'Tools',
		context: 'Independent',
		repository: 'weigle22/CorePracticeCsvMigrator',
		featured: false,
		year: '2025',
		technologies: ['C#', 'Windows Forms', 'SQLite', 'Dapper', 'Clean Architecture'],
		surface: 'Pick two CSV files, preview what is wrong with them, fix what can be fixed, load the rest.',
		highlights: [
			'Three layers: domain, infrastructure and a Windows Forms app',
			'A validation pipeline with per-row errors and an auto-fixer for the common ones',
			'An ingestion pipeline writing patients, treatments and invoices to SQLite in one transaction'
		],
		caseStudy: {
			overview: 'A Windows desktop tool that takes patient and treatment exports as CSV, checks them, repairs what it safely can, and loads them into a practice-management SQLite database, creating invoices and invoice lines along the way.',
			problem: 'Exported data arrives with inconsistent names, dates, phone numbers and amounts. Loading it as-is would put bad records in the target system; rejecting whole files would leave the user with nothing.',
			role: 'Built by me. Public repository.',
			architecture: {
				caption: 'Three projects. The rules know nothing about files or databases.',
				nodes: [
					{ id: 'app', label: 'Windows Forms app', detail: 'File pickers, a preview dialog of rows and their problems, and the run button.', row: 0, kind: 'client' },
					{ id: 'val', label: 'Validation pipeline', detail: 'Reads CSV with CsvHelper and runs every row through the validators.', row: 1, kind: 'service' },
					{ id: 'ing', label: 'Ingestion pipeline', detail: 'Maps valid rows to patients, treatments, invoices and invoice lines, and reports what it inserted.', row: 1, kind: 'service' },
					{ id: 'domain', label: 'Domain', detail: 'Entities, CSV record types, validators and the auto-fixer.', row: 2, kind: 'service' },
					{ id: 'db', label: 'SQLite (Dapper)', detail: 'Parameterised inserts inside a single transaction.', row: 3, kind: 'data' }
				],
				edges: [
					{ from: 'app', to: 'val' },
					{ from: 'app', to: 'ing' },
					{ from: 'val', to: 'domain' },
					{ from: 'ing', to: 'domain' },
					{ from: 'ing', to: 'db', label: 'transaction' }
				]
			},
			decisions: [
				{ title: 'Fix, then judge', text: 'An auto-fixer normalises email, phone numbers, name casing, dates, gender values and money before validation, so only genuinely bad rows are reported.' },
				{ title: 'Errors per row and field', text: 'Each validation error carries the source file, row number, field, message and severity, so the preview can show exactly what to correct.' },
				{ title: 'All or nothing', text: 'Ingestion runs in one SQLite transaction and rolls back on failure, so a half-loaded database is never left behind.' }
			],
			testing: [
				'Validation rules for patients include: names present and well-formed, date of birth present, parseable, not in the future and at least 18 years ago, gender from an allowed list, valid email under 254 characters, and valid mobile and home phone formats.'
			]
		}
	},
	{
		id: 'todo-clean-architecture',
		title: 'Todo, Clean Architecture',
		description: 'Three features added to a .NET + Angular app as three pull requests, each with tests.',
		category: 'Web',
		context: 'Technical assessment',
		repository: 'weigle22/fd-recruitment-task',
		featured: false,
		year: '2025',
		technologies: ['C#', 'ASP.NET Core', 'Clean Architecture', 'Angular', 'TypeScript'],
		surface: 'Colour-coded items, tags you can filter by, and deleting that can be undone.',
		highlights: [
			'Item colours, carried from the domain model through commands, DTOs and the UI',
			'Tags with filtering, most-used tags and text search',
			'Soft delete for lists and items',
			'Unit tests for the application and domain layers'
		],
		caseStudy: {
			overview: 'A take-home task for a .NET and Angular developer role: extend an existing Clean Architecture template application with three features.',
			problem: 'Add features to someone else’s codebase without breaking its layering: each change has to travel from the domain model through the application layer and API to the Angular UI.',
			role: 'Built by me as a technical assessment. Each feature was developed on its own branch and merged through its own pull request.',
			architecture: {
				caption: 'The template’s layers, which each feature had to pass through in order.',
				nodes: [
					{ id: 'ng', label: 'Angular UI', detail: 'Colour picker, tag editor and filters, delete actions.', row: 0, kind: 'client' },
					{ id: 'web', label: 'Web API', detail: 'Endpoints for the new commands and queries.', row: 1, kind: 'service' },
					{ id: 'app', label: 'Application', detail: 'Commands, queries and DTOs carrying colour and tags.', row: 2, kind: 'service' },
					{ id: 'domain', label: 'Domain', detail: 'Todo items and lists, with colour, tags and a deleted flag.', row: 3, kind: 'service' },
					{ id: 'infra', label: 'Infrastructure', detail: 'Entity Framework migrations for the new fields.', row: 3, kind: 'data' }
				],
				edges: [
					{ from: 'ng', to: 'web' },
					{ from: 'web', to: 'app' },
					{ from: 'app', to: 'domain' },
					{ from: 'app', to: 'infra' }
				]
			},
			decisions: [
				{ title: 'One feature, one pull request', text: 'Colours, tags and soft delete each went in separately, so each could be reviewed and reverted on its own.' },
				{ title: 'Soft delete', text: 'Lists and items are flagged as deleted instead of removed, so a deletion can be undone.' }
			],
			testing: [
				'Unit tests for the colour feature in the application and domain layers.',
				'Tests updated and added for the tags feature, including query and DTO tests.'
			],
			results: ['Three feature pull requests merged into the repository’s main branch.']
		}
	},
	{
		id: 'business-suite',
		title: 'Business Suite',
		description: 'Payroll, loans and point of sale for a multi-branch business.',
		category: 'Business systems',
		context: 'Independent',
		featured: false,
		year: '',
		technologies: ['C#', 'ASP.NET MVC', 'Entity Framework', 'SQL Server'],
		surface: 'One sign-in for the people who pay staff, lend to them and run the tills.',
		highlights: [
			'Payroll with tax and contribution tables, recomputation and reports',
			'Employee loans and daily time logs feeding the same payroll run',
			'Point-of-sale entries and periodic summaries per branch'
		],
		caseStudy: {
			overview: 'An ASP.NET MVC application covering payroll, employee loans, daily work logs and point of sale for a business with several branches. Private repository; described generically.',
			architecture: {
				caption: 'One MVC application and one database, organised by business area.',
				nodes: [
					{ id: 'ui', label: 'MVC views', detail: 'Screens per business area, behind a session-timeout check.', row: 0, kind: 'client' },
					{ id: 'ctl', label: 'Controllers', detail: 'Company, employees, work logs, loans, payroll and point of sale.', row: 1, kind: 'service' },
					{ id: 'ef', label: 'Entity Framework', detail: 'Database-first data access.', row: 2, kind: 'service' },
					{ id: 'db', label: 'SQL Server', detail: 'Branches, employees, time logs, loans, payroll and sales.', row: 3, kind: 'data' }
				],
				edges: [
					{ from: 'ui', to: 'ctl' },
					{ from: 'ctl', to: 'ef' },
					{ from: 'ef', to: 'db' }
				]
			}
		}
	}
];
