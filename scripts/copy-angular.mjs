// Copies the built Angular custom element into SvelteKit's static folder.
import { copyFileSync, mkdirSync } from 'node:fs';

mkdirSync('static/angular', { recursive: true });
copyFileSync('angular-demo/dist/angular-demo/browser/main.js', 'static/angular/leave-demo.js');
console.log('Angular demo copied to static/angular/leave-demo.js');
