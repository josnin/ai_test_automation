import { Component, ChangeDetectionStrategy, viewChild, ElementRef, input, output, AfterViewInit, OnDestroy, effect } from '@angular/core';

// Declare the monaco and require global objects to avoid TypeScript errors
declare const monaco: any;
declare const require: any;

@Component({
  selector: 'app-code-editor',
  template: `<div #editorContainer class="w-full h-full"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class CodeEditorComponent implements AfterViewInit, OnDestroy {
  editorContainer = viewChild.required<ElementRef>('editorContainer');
  initialCode = input.required<string>();
  readonly = input<boolean>(false);
  codeChange = output<string>();

  private editor: any;

  constructor() {
    effect(() => {
      const newCode = this.initialCode();
      if (this.editor && this.editor.getValue() !== newCode) {
        this.editor.setValue(newCode);
      }
    });

    effect(() => {
      if (this.editor) {
        this.editor.updateOptions({ readOnly: this.readonly() });
      }
    })
  }

  ngAfterViewInit(): void {
    if (typeof (window as any).require === 'function') {
      (window as any).require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });
      (window as any).require(['vs/editor/editor.main'], () => {
        this.initMonaco();
      });
    } else {
      console.error('Monaco editor loader is not available. Please check the script tag for "loader.js" in index.html.');
    }
  }

  initMonaco(): void {
    if (!monaco.languages.getLanguages().some((lang: any) => lang.id === 'robotframework')) {
      monaco.languages.register({ id: 'robotframework' });

      monaco.languages.setMonarchTokensProvider('robotframework', {
        tokenizer: {
          root: [
            [/^\*\*\*.+\*\*\*/, 'keyword'],
            [/^#.*$/, 'comment'],
            [/[\$@&]\{[^\}]*\}/, 'variable'],
            [/\[[a-zA-Z ]+\]/, 'tag'],
            [/\b(Open Browser|Input Text|Click Button|Page Should Contain|Title Should Be|Close Browser|Maximize Browser Window|Get Title|Element Should Be Visible)\b/, 'string'],
            [/^[^\s\t#].*$/, 'type.identifier'],
          ],
        },
      });

      monaco.languages.setLanguageConfiguration('robotframework', {
        comments: {
          lineComment: '#',
        },
        autoClosingPairs: [
          { open: '[', close: ']' },
          { open: '{', close: '}' },
          { open: "'", close: "'" },
          { open: '"', close: '"' },
        ],
        surroundingPairs: [
          { open: '[', close: ']' },
          { open: '{', close: '}' },
          { open: "'", close: "'" },
          { open: '"', close: '"' },
        ],
      });
    }

    this.editor = monaco.editor.create(this.editorContainer().nativeElement, {
      value: this.initialCode(),
      language: 'robotframework',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      fontLigatures: true,
      readOnly: this.readonly(),
    });

    this.editor.getModel().onDidChangeContent(() => {
      this.codeChange.emit(this.editor.getValue());
    });
  }

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.dispose();
    }
  }
}