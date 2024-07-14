import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import secureLocalStorage from "react-secure-storage";

const Monaco = ({
  code,
  setCode,
  loading,
  language,
  editorUpdateFlag,
}: {
  code: string;
  setCode: (code: string) => void;
  loading: boolean;
  language: string;
  editorUpdateFlag: boolean;
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    const editorContainer = document.getElementById("code-editor");
    if (!editorContainer) return;

    const securityConfig = secureLocalStorage.getItem("securityConfig") as {
      languages: string[];
      codePlayback: boolean;
      codeExecution: boolean;
      tabChangeDetection: boolean;
      copyPasteDetection: boolean;
      allowAutoComplete: boolean;
      syntaxHighlighting: boolean;
    };

    // Dispose of any existing models to avoid memory leaks
    monaco.editor.getModels().forEach((model) => model.dispose());

    // Create the editor if it doesn't already exist
    const editor = monaco.editor.create(editorContainer, {
      value: code,
      language: securityConfig.syntaxHighlighting ? language : "plaintext",
      theme: "vs-dark",
      readOnly: loading,
      minimap: { enabled: false },
      suggestOnTriggerCharacters: securityConfig.allowAutoComplete,
      quickSuggestions: securityConfig.allowAutoComplete,
      suggest: {
        snippetsPreventQuickSuggestions: securityConfig.allowAutoComplete,
      },
    });

    editorRef.current = editor;
    editor.onDidPaste((e) => {
      localStorage.getItem("copiedText");
      console.log(e.clipboardEvent?.clipboardData?.getData("text"));
    });

    const model = editor.getModel();
    if (model) {
      // Set up the onChange event listener
      const onChangeSubscription = model.onDidChangeContent(() => {
        setCode(model.getValue());
      });

      return () => {
        // Clean up the editor and the onChange event listener
        onChangeSubscription.dispose();
        editor.dispose();
      };
    }

    return () => {
      // Clean up the editor on unmount
      editor.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorUpdateFlag]);

  useEffect(() => {

    // ! TODO: COMPLETE THIS
    const handleCopy = () => {
      if (editorRef.current) {
        const editor = editorRef.current;
        const selection = editor
          .getModel() // @ts-expect-error - Monaco types are not up-to-date
          ?.getValueInRange(editor.getSelection());
        if (selection) {
          localStorage.setItem("copiedText", selection);
        }
      }
    };

    const handlePaste = (event: ClipboardEvent) => {
      if (editorRef.current) {
        const editor = editorRef.current;
        const clipboardData =
          event.clipboardData || (window as any).clipboardData;
        const pastedText = clipboardData.getData("text");

        // Log the pasted text to console or do something else with it
        console.log("Pasted text:", pastedText);

        // Optionally, insert the pasted text into the editor at the current cursor position
        const currentPosition = editor.getPosition();
        if (currentPosition) {
          editor.executeEdits("paste", [
            {
              range: new monaco.Range(
                currentPosition.lineNumber,
                currentPosition.column,
                currentPosition.lineNumber,
                currentPosition.column
              ),
              text: pastedText,
              forceMoveMarkers: true,
            },
          ]);
        }
      }

      event.preventDefault(); // Prevent default paste behavior
    };

    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <div
      id="code-editor"
      className="border h-full w-full overflow-hidden"
    ></div>
  );
};

export default Monaco;
