// The technology constellation is drawn from this list. A technology is linked to another when
// they appear together in a project (see projects.ts), so keep the names identical in both files.

import type { Technology } from './types.ts';

export const technologies: Technology[] = [
	{ name: 'ASP.NET Core', category: 'Backend Development', description: 'My default for APIs: minimal APIs for small services, controllers and handlers for larger ones.' },
	{ name: 'ASP.NET MVC', category: 'Backend Development', description: 'Where I started, and what many systems I maintain still run on.' },
	{ name: 'Entity Framework Core', category: 'Backend Development', description: 'Data access and migrations. I still read the SQL it generates.' },
	{ name: 'Entity Framework', category: 'Backend Development', description: 'The database-first, EDMX-era version, with stored procedures mapped in.' },
	{ name: 'FastAPI', category: 'Backend Development', description: 'A thin Python API in front of the retrieval pipeline.' },
	{ name: 'LangChain', category: 'Backend Development', description: 'Glue between the document loader, the vector index and the local model.' },

	{ name: 'Angular', category: 'Frontend Development', description: 'Modern Angular with signals and standalone components. The constellation you are looking at is one.' },
	{ name: 'AngularJS', category: 'Frontend Development', description: 'The 1.x original. I still maintain it, and know where the digest cycle bites.' },
	{ name: 'React', category: 'Frontend Development', description: 'Used with Vite and Tailwind for the upload-and-ask interface.' },
	{ name: 'Flutter', category: 'Frontend Development', description: 'For rebuilding my Android game with one codebase and a testable engine.' },
	{ name: 'HTML & CSS', category: 'Frontend Development', description: 'No framework when none is needed. The church site ships exactly this.' },

	{ name: 'SQL Server', category: 'Database Management', description: 'Schemas, views, functions and stored procedures. Most of my career has a table behind it.' },
	{ name: 'SQLite', category: 'Database Management', description: 'For tools that should run from a folder with nothing to install.' },
	{ name: 'FAISS', category: 'Database Management', description: 'A vector index on disk, so semantic search works offline.' },

	{ name: 'C#', category: 'Programming Languages', description: 'The language I think in.' },
	{ name: 'TypeScript', category: 'Programming Languages', description: 'For anything in the browser that will live longer than a week.' },
	{ name: 'JavaScript', category: 'Programming Languages', description: 'Plain, when a build step would be the heaviest part of the project.' },
	{ name: 'Python', category: 'Programming Languages', description: 'For AI pipelines and for scripting against native libraries.' },
	{ name: 'C', category: 'Programming Languages', description: 'Enough to adapt a reference implementation and compile it into a DLL.' },
	{ name: 'Dart', category: 'Programming Languages', description: 'Flutter’s language; used for the game engine and its tests.' },
	{ name: 'Java', category: 'Programming Languages', description: 'What the original 2016 Android game was written in.' },

	{ name: 'GitHub Pages', category: 'DevOps and Tools', description: 'Static hosting that redeploys on every commit. This site runs on it.' },
	{ name: 'Sveltia CMS', category: 'DevOps and Tools', description: 'A Git-based CMS: non-developers edit content, every save is a commit.' },
	{ name: 'Ollama', category: 'DevOps and Tools', description: 'Runs embedding and reasoning models locally, so documents never leave the machine.' },

	{ name: 'Clean Architecture', category: 'Software Architecture', description: 'Domain in the middle, frameworks at the edges. Makes the rules testable without a database.' },
	{ name: 'MediatR', category: 'Software Architecture', description: 'One handler per request, returning a typed result instead of throwing.' },
	{ name: 'JWT', category: 'Software Architecture', description: 'Token sign-in, with authorization policies by role and by module.' }
];
