import { useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import MonacoEditor, { OnChange } from "@monaco-editor/react";

const Monaco = ({
  code,
  setCode,
  loading = false,
  language,
  editorUpdateFlag = false,
  readOnly = false,
  allowHighlighting = true,
}: {
  code: string;
  setCode: (code: string) => void;
  loading?: boolean;
  language: string;
  editorUpdateFlag?: boolean;
  readOnly?: boolean;
  allowHighlighting?: boolean;
}) => {
  const { theme } = useTheme();

  // Handle changes in the editor content
  const handleEditorChange: OnChange = (value) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  useEffect(() => {
    // Additional logic could be placed here to handle editorUpdateFlag changes, if needed.
  }, [editorUpdateFlag]);

  return (
    <div className="border h-full w-full z-50 overflow-visible">
      <MonacoEditor
        height="100%"
        defaultLanguage={allowHighlighting ? language : "plaintext"}
        value={code}
        onChange={handleEditorChange}
        options={{
          readOnly: loading || readOnly,
        }}
        theme={theme === "dark" ? "vs-dark" : "vs-light"}
      />
    </div>
  );
};

export default Monaco;
