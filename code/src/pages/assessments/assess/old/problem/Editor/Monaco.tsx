import {useEffect, useRef} from "react";
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
            minimap: {enabled: false},
            suggestOnTriggerCharacters: securityConfig.allowAutoComplete,
            quickSuggestions: securityConfig.allowAutoComplete,
            suggest: {
                snippetsPreventQuickSuggestions: securityConfig.allowAutoComplete,
            },
        });

        editorRef.current = editor;
        editor.onDidPaste(() => {
            localStorage.getItem("copiedText");
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
            editor.dispose();
        };
    }, [editorUpdateFlag]);

    return (
        <div
            id="code-editor"
            className="border h-full w-full overflow-hidden"
        ></div>
    );
};

export default Monaco;
