import { Component, ChangeDetectionStrategy, viewChild, ElementRef, input, output, AfterViewInit, OnDestroy, effect } from '@angular/core';

// Declare the monaco global object to avoid TypeScript errors
declare const monaco: any;

@Component({
  selector: 'app-code-editor',
  template: `<div #editorContainer class="w-full h-full"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeEditorComponent implements AfterViewInit, OnDestroy {
  editorContainer = viewChild.required<ElementRef>('editorContainer');
  initialCode = input.required<string>();
  codeChange = output<string>();

  private editor: any;

  constructor() {
    effect(() => {
      const newCode = this.initialCode();
      // Only update the editor's value if it's different, preventing cursor jumps during typing.
      if (this.editor && this.editor.getValue() !== newCode) {
        this.editor.setValue(newCode);
      }
    });
  }

  ngAfterViewInit(): void {
    if (typeof (window as any).monaco !== 'undefined') {
      this.initMonaco();
    } else {
      console.error('Monaco editor is not available. Please check the script tag in index.html.');
    }
  }

  initMonaco(): void {
    // Ensure the language is only registered once.
    if (!monaco.languages.getLanguages().some((lang: any) => lang.id === 'robotframework')) {
      monaco.languages.register({ id: 'robotframework' });

      monaco.languages.setMonarchTokensProvider('robotframework', {
        tokenizer: {
          root: [
            // Sections
            [/^\*\*\*.+\*\*\*/, 'keyword'],
            // Comments
            [/^#.*$/, 'comment'],
            // Variables
            [/[\$@&]\{[^\}]*\}/, 'variable'],
            // Keywords in settings like [Documentation] or [Tags]
            [/\[[a-zA-Z ]+\]/, 'tag'],
            // Common Selenium keywords to give them a distinct color
            [/\b(Open Browser|Input Text|Click Button|Page Should Contain|Title Should Be|Close Browser|Maximize Browser Window|Get Title|Element Should Be Visible)\b/, 'string'],
            // Test case or keyword names (lines that don't start with whitespace)
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
      language: 'robotframework', // Use our custom registered language
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      fontLigatures: true,
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
