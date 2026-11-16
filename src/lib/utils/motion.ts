/** True when the visitor has asked their system for less motion. Animation code checks this first. */
export const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True on devices with a real mouse; touch screens skip cursor effects. */
export const finePointer = () => typeof matchMedia !== 'undefined' && matchMedia('(hover: hover) and (pointer: fine)').matches;
