import { useEffect } from "react";
import * as monaco from "monaco-editor";

const Monaco = ({
  code,
  setCode,
  loading,
}: {
  code: string;
  setCode: (code: string) => void;
  loading: boolean;
}) => {
  useEffect(() => {
    monaco.editor.create(document.getElementById("code-editor")!, {
      value: code,
      language: "javascript",
      theme: "vs-dark",
      readOnly: loading,
    });

    monaco.editor.getModels()[0].onDidChangeContent(() => {
      setCode(monaco.editor.getModels()[0].getValue());
    });

    return () => {
      monaco.editor.getModels().forEach((model) => model.dispose());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      id="code-editor"
      className="border h-full w-full z-50 overflow-visible"
    ></div>
  );
};

export default Monaco;
