// Copies the built Angular custom elements into SvelteKit's static folder.
import { copyFileSync, mkdirSync } from 'node:fs';

mkdirSync('static/angular', { recursive: true });
copyFileSync('angular-widgets/dist/angular-widgets/browser/main.js', 'static/angular/widgets.js');
console.log('Angular widgets copied to static/angular/widgets.js');
