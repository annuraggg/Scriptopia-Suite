import { useEffect } from "react";
import * as monaco from "monaco-editor";
import { useTheme } from "@/components/theme-provider";

const Monaco = ({
  code,
  setCode,
  loading = false,
  language,
  editorUpdateFlag = false,
  readOnly = false,
}: {
  code: string;
  setCode: (code: string) => void;
  loading?: boolean;
  language: string;
  editorUpdateFlag?: boolean;
  readOnly?: boolean;
}) => {
  const { theme } = useTheme();
  useEffect(() => {
    const editorContainer = document.getElementById("code-editor");
    if (!editorContainer) return;

    // Dispose of any existing models to avoid memory leaks
    monaco.editor.getModels().forEach((model) => model.dispose());

    // Create the editor if it doesn't already exist
    const editor = monaco.editor.create(editorContainer, {
      value: code,
      language: language,
      theme: theme === "dark" ? "vs-dark" : "vs",
      readOnly: loading || readOnly,
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
  }, [editorUpdateFlag, theme]);
  return (
    <div
      id="code-editor"
      className="border h-full w-full z-50 overflow-visible"
    ></div>
  );
};

export default Monaco;
