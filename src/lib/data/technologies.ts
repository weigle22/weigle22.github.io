// The technology constellation is drawn from this list. A technology is linked to another when
// they appear together in a project (see projects.ts), so keep the names identical in both files.
//
// `use` keeps the claims honest:
//   Production  = built new things with it at work
//   Maintenance = keeps existing work systems running with it
//   Independent = personal, volunteer or assessment projects outside the job

import type { Technology } from './types.ts';

export const technologies: Technology[] = [
	{ name: 'ASP.NET Core', category: 'Backend Development', description: 'My default for APIs: minimal APIs for small services, controllers and handlers for larger ones.', use: ['Production', 'Independent'] },
	{ name: 'ASP.NET MVC', category: 'Backend Development', description: 'Where I started, and what many systems I maintain still run on.', use: ['Production', 'Maintenance', 'Independent'] },
	{ name: 'Entity Framework Core', category: 'Backend Development', description: 'Data access and migrations. I still read the SQL it generates.', use: ['Production'] },
	{ name: 'Entity Framework', category: 'Backend Development', description: 'The database-first, EDMX-era version, with stored procedures mapped in.', use: ['Independent'] },
	{ name: 'Windows Forms', category: 'Frontend Development', description: 'Desktop tools for people who just need a window, a file picker and a button.', use: ['Independent'] },
	{ name: 'FastAPI', category: 'Backend Development', description: 'A thin Python API in front of the retrieval pipeline.', use: ['Independent'] },
	{ name: 'LangChain', category: 'Backend Development', description: 'Glue between the document loader, the vector index and the local model.', use: ['Independent'] },

	{ name: 'Angular', category: 'Frontend Development', description: 'Modern Angular with signals and standalone components. At work on HR system front ends; the constellation you are looking at is one too.', use: ['Production', 'Maintenance', 'Independent'] },
	{ name: 'AngularJS', category: 'Frontend Development', description: 'The 1.x original. I maintain AngularJS interfaces at work and used it for the FALCON demo app.', use: ['Maintenance', 'Independent'] },
	{ name: 'React', category: 'Frontend Development', description: 'Used with Vite and Tailwind for the upload-and-ask interface.', use: ['Independent'] },
	{ name: 'Flutter', category: 'Frontend Development', description: 'For rebuilding my Android game with one codebase and a testable engine.', use: ['Independent'] },
	{ name: 'HTML & CSS', category: 'Frontend Development', description: 'No framework when none is needed. The church site ships exactly this.', use: ['Production', 'Independent'] },

	{ name: 'SQL Server', category: 'Database Management', description: 'Schemas, views, functions and stored procedures for the systems I work on every day.', use: ['Production', 'Maintenance', 'Independent'] },
	{ name: 'Dapper', category: 'Database Management', description: 'Thin, explicit SQL with parameters, when an ORM would hide too much.', use: ['Independent'] },
	{ name: 'SQLite', category: 'Database Management', description: 'For tools that should run from a folder with nothing to install.', use: ['Independent'] },
	{ name: 'FAISS', category: 'Database Management', description: 'A vector index on disk, so semantic search works offline.', use: ['Independent'] },

	{ name: 'C#', category: 'Programming Languages', description: 'The language I think in.', use: ['Production', 'Maintenance', 'Independent'] },
	{ name: 'TypeScript', category: 'Programming Languages', description: 'For anything in the browser that will live longer than a week.', use: ['Production', 'Independent'] },
	{ name: 'JavaScript', category: 'Programming Languages', description: 'Plain, when a build step would be the heaviest part of the project.', use: ['Production', 'Maintenance', 'Independent'] },
	{ name: 'Python', category: 'Programming Languages', description: 'For AI pipelines and for scripting against native libraries.', use: ['Independent'] },
	{ name: 'C', category: 'Programming Languages', description: 'Enough to adapt a reference implementation and compile it into a DLL.', use: ['Independent'] },
	{ name: 'Dart', category: 'Programming Languages', description: 'Flutter’s language; used for the game engine and its tests.', use: ['Independent'] },
	{ name: 'Java', category: 'Programming Languages', description: 'What the original 2016 Android game was written in.', use: ['Independent'] },

	{ name: 'GitHub Pages', category: 'DevOps and Tools', description: 'Static hosting that redeploys on every commit. This site runs on it.', use: ['Independent'] },
	{ name: 'Sveltia CMS', category: 'DevOps and Tools', description: 'A Git-based CMS: non-developers edit content, every save is a commit.', use: ['Independent'] },
	{ name: 'Cloudflare Workers', category: 'DevOps and Tools', description: 'A tiny sign-in helper so a static site’s CMS can log in with GitHub.', use: ['Independent'] },
	{ name: 'Ollama', category: 'DevOps and Tools', description: 'Runs embedding and reasoning models locally, so documents never leave the machine.', use: ['Independent'] },

	{ name: 'Clean Architecture', category: 'Software Architecture', description: 'Domain in the middle, frameworks at the edges. Makes the rules testable without a database.', use: ['Production', 'Independent'] },
	{ name: 'MediatR', category: 'Software Architecture', description: 'One handler per request, returning a typed result instead of throwing.', use: ['Production'] },
	{ name: 'JWT', category: 'Software Architecture', description: 'Token sign-in, with authorization policies by role and by module.', use: ['Production'] }
];
