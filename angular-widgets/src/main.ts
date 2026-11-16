import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { provideZonelessChangeDetection, Type } from '@angular/core';
import { LeaveDemo } from './leave-demo';
import { TechConstellation } from './tech-constellation';

// Each Angular component is published as a standard custom element, so the SvelteKit page
// uses it like a native tag. There is no Angular router or app shell: Svelte owns the page.
const widgets: Record<string, Type<unknown>> = {
  'leave-demo': LeaveDemo,
  'tech-constellation': TechConstellation,
};

createApplication({ providers: [provideZonelessChangeDetection()] })
  .then((app) => {
    for (const [tag, component] of Object.entries(widgets)) {
      if (!customElements.get(tag)) customElements.define(tag, createCustomElement(component, { injector: app.injector }));
    }
  })
  .catch((err) => console.error(err));
