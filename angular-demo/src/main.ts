import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { provideZonelessChangeDetection } from '@angular/core';
import { LeaveDemo } from './leave-demo';

// Registers <leave-demo> as a standard custom element so any host page
// (here: a SvelteKit site) can drop it in like a native tag.
createApplication({ providers: [provideZonelessChangeDetection()] })
  .then((app) => {
    if (!customElements.get('leave-demo')) {
      customElements.define('leave-demo', createCustomElement(LeaveDemo, { injector: app.injector }));
    }
  })
  .catch((err) => console.error(err));
