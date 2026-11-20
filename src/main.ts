import { Plugin } from 'obsidian';
import '@fluxygram/element';

/**
 * Obsidian's types add show() and detach() to every HTMLElement, which clash with FluxyGram's own
 * private methods. The plugin only needs the `diagram` setter, so it types the element by that.
 */
type DiagramElement = HTMLElement & { diagram: string };

/**
 * Fluxygram for Obsidian: a ```fluxygram code block with the diagram JSON becomes an animated diagram
 * in reading view and live preview. It follows Obsidian's light or dark theme.
 */
export default class FluxygramPlugin extends Plugin {
  async onload() {
    this.registerMarkdownCodeBlockProcessor('fluxygram', (source, el) => {
      const diagram = el.createEl('fluxy-gram' as keyof HTMLElementTagNameMap) as DiagramElement;
      this.applyTheme(diagram);
      // The component shows its own friendly error if the JSON is wrong.
      diagram.diagram = source;
    });
    this.registerEvent(
      this.app.workspace.on('css-change', () => {
        for (const d of document.querySelectorAll<HTMLElement>('fluxy-gram')) this.applyTheme(d);
      }),
    );
  }

  private applyTheme(el: HTMLElement) {
    el.setAttribute('theme', document.body.classList.contains('theme-dark') ? 'dark' : 'light');
  }
}
