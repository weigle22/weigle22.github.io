// Hand-written project data. This file is the source of truth for what the site says about each
// project; GitHub only adds stars, language, last update and latest commit (see services/github.ts).
//
// To add a project: copy an entry, give it a unique `id`, and set `repository` to "owner/name" if it
// is public. Private work: leave `repository` out and keep the description generic.

import type { Project } from './types.ts';

export const projects: Project[] = [
	{
		id: 'falcon',
		title: 'Falcon',
		description: 'A post-quantum signature scheme, made usable from an ordinary web app.',
		category: 'Cryptography',
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
		]
	},
	{
		id: 'leave-workflow',
		title: 'Leave Workflow',
		description: 'A leave request that five people have to agree on before it reaches the ledger.',
		category: 'Business systems',
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
		]
	},
	{
		id: 'event-attendance',
		title: 'Event Attendance',
		description: 'One live guest list shared by the organiser, the admin, the usher and the person reading names aloud.',
		category: 'Business systems',
		featured: true,
		year: '2026',
		technologies: ['C#', 'ASP.NET Core', 'Entity Framework Core', 'SQL Server', 'JWT'],
		surface: 'An usher confirms a guest at the door. Seconds later, the person at the microphone knows to recognise them.',
		highlights: [
			'An ASP.NET Core Web API on .NET 10 with Entity Framework Core and SQL Server',
			'JWT sign-in with custom authorization policies, by role and by module',
			'Guests, their representatives, and the order they are recognised in, modelled as separate things',
			'Web apps for the people who plan, mobile apps for the people on the floor'
		]
	},
	{
		id: 'spiritwind',
		title: 'Spiritwind',
		description: 'A church website its own volunteers can edit, with no build step, database or server.',
		category: 'Web',
		repository: 'spiritwindfc/spiritwindfc-web',
		featured: true,
		year: '2026',
		technologies: ['JavaScript', 'HTML & CSS', 'Sveltia CMS', 'GitHub Pages'],
		surface: 'Volunteers update events, sermons and photos themselves. I only get called for layout.',
		highlights: [
			'Plain HTML, CSS and JavaScript, on purpose',
			'All content in small JSON files the page loads when it opens',
			'An admin page powered by Sveltia CMS, with labels and help text written for non-developers',
			'Every save is a Git commit; GitHub Pages republishes about a minute later'
		]
	},
	{
		id: 'local-rag',
		title: 'Local RAG',
		description: 'Upload a law’s implementing rules as a PDF and ask it questions, entirely offline.',
		category: 'AI',
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
		]
	},
	{
		id: 'color-stroop',
		title: 'Color Stroop',
		description: 'My 2016 Android game, rebuilt in Flutter without changing how it plays.',
		category: 'Mobile',
		featured: true,
		year: '2026',
		technologies: ['Flutter', 'Dart', 'Java', 'Clean Architecture'],
		surface: 'Same rules, same scoring, same timing. New engine, friendlier face.',
		highlights: [
			'Original built in Java around 2016; the rebuild is in Flutter',
			'Gameplay, scoring and timing treated as a contract the new code has to honour',
			'A game engine separated from the UI so it can be tested on its own',
			'As few dependencies as the job allows'
		]
	},
	{
		id: 'csv-migrator',
		title: 'CSV Migrator',
		description: 'A desktop tool that validates, auto-fixes and loads patient and treatment exports into a database.',
		category: 'Tools',
		repository: 'weigle22/CorePracticeCsvMigrator',
		featured: false,
		year: '2025',
		technologies: ['C#', 'SQLite', 'Clean Architecture'],
		surface: 'Pick two CSV files, preview what is wrong with them, fix what can be fixed, load the rest.',
		highlights: [
			'Three layers: domain, infrastructure and a Windows Forms app',
			'A validation pipeline with per-row errors and an auto-fixer for the common ones',
			'An ingestion pipeline writing patients, treatments and invoices to SQLite'
		]
	},
	{
		id: 'todo-clean-architecture',
		title: 'Todo, Clean Architecture',
		description: 'Three features added to a .NET + Angular app as three pull requests, each with tests.',
		category: 'Web',
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
		]
	},
	{
		id: 'business-suite',
		title: 'Business Suite',
		description: 'Payroll, loans and point of sale for a multi-branch business.',
		category: 'Business systems',
		featured: false,
		year: '',
		technologies: ['C#', 'ASP.NET MVC', 'Entity Framework', 'SQL Server'],
		surface: 'One sign-in for the people who pay staff, lend to them and run the tills.',
		highlights: [
			'Payroll with tax and contribution tables, recomputation and reports',
			'Employee loans and daily time logs feeding the same payroll run',
			'Point-of-sale entries and periodic summaries per branch'
		]
	}
];
