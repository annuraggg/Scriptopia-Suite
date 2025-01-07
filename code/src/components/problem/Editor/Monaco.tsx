import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-provider";
import { useMonaco } from "@monaco-editor/react";

const Monaco = ({
  code,
  setCode,
  loading = false,
  language,
  editorUpdateFlag = false,
  readOnly = false,
  allowHighlighting = true,
  onExternalPaste,
}: {
  code: string;
  setCode: (code: string) => void;
  loading?: boolean;
  language: string;
  editorUpdateFlag?: boolean;
  readOnly?: boolean;
  allowHighlighting?: boolean;
  onExternalPaste?: (pastedText: string) => void;
}) => {
  const { theme } = useTheme();
  const monaco = useMonaco();
  const editorRef = useRef<any>(null);
  const modelRef = useRef<any>(null);

  useEffect(() => {
    if (!monaco) return;

    // Clean up existing editor and model
    if (editorRef.current) {
      editorRef.current.dispose();
    }
    if (modelRef.current) {
      modelRef.current.dispose();
    }

    // Create new model
    modelRef.current = monaco.editor.createModel(
      code,
      allowHighlighting ? language : "plaintext"
    );

    // Create editor with the model
    const editorInstance = monaco.editor.create(
      document.getElementById("monaco-container") as HTMLElement,
      {
        model: modelRef.current,
        readOnly: loading || readOnly,
        theme: theme === "dark" ? "vs-dark" : "vs-light",
        automaticLayout: true,
      }
    );

    editorRef.current = editorInstance;

    // Add change handler for code updates
    const changeDisposable = modelRef.current.onDidChangeContent((e: any) => {
      const value = modelRef.current.getValue();
      if (value !== undefined) {
        setCode(value);
      }

      // Check for paste events
      if (e.changes.length > 0) {
        const change = e.changes[0];
        if (change.text) {
          // Get the current editor content excluding the pasted texts
          const startPosition = modelRef.current.getPositionAt(change.rangeOffset);
          const endPosition = modelRef.current.getPositionAt(change.rangeOffset + change.text.length);
          
          // Get the content before and after the pasted text
          const contentBeforePaste = modelRef.current.getValueInRange({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: startPosition.lineNumber,
            endColumn: startPosition.column
          });
          
          const contentAfterPaste = modelRef.current.getValueInRange({
            startLineNumber: endPosition.lineNumber,
            startColumn: endPosition.column,
            endLineNumber: modelRef.current.getLineCount(),
            endColumn: modelRef.current.getLineMaxColumn(modelRef.current.getLineCount())
          });

          // Check if the pasted text exists in the content before or after
          const existsInEditor = contentBeforePaste.includes(change.text) || 
                                contentAfterPaste.includes(change.text);

          // If the text doesn't exist anywhere else in the editor, it's an external paste
          if (!existsInEditor && change.text.length > 1) {
            onExternalPaste?.(change.text);
          }
        }
      }
    });

    return () => {
      changeDisposable?.dispose();
      if (editorRef.current) {
        editorRef.current.dispose();
      }
      if (modelRef.current) {
        modelRef.current.dispose();
      }
    };
  }, [monaco, language, theme, loading, readOnly, allowHighlighting]);

  // Update model content when code prop changes
  useEffect(() => {
    if (modelRef.current && code !== modelRef.current.getValue()) {
      modelRef.current.setValue(code);
    }
  }, [code, editorUpdateFlag]);

  return (
    <div
      id="monaco-container"
      className="border h-full w-full z-50 overflow-visible"
    ></div>
  );
};

export default Monaco;