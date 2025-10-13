declare module "tabulator-tables" {
  // Minimal type declarations to satisfy TypeScript without using `any`
  export class TabulatorFull {
    constructor(element: HTMLElement, options?: unknown);
  }

  export type CellComponent = {
    getValue: () => unknown;
  };
}