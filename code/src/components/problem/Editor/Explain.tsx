import { useEffect, useState } from "react";
import * as monaco from "monaco-editor";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button, Spinner } from "@nextui-org/react";

const Explain = ({
  code,
  explainOpen,
  setExplainOpen,
}: {
  code: string;
  explainOpen: boolean;
  setExplainOpen: (open: boolean) => void;
}) => {
  const [explainationLoading, setExplainationLoading] =
    useState<boolean>(false);
  const [explaination, setExplaination] = useState<string>("");

  useEffect(() => {
    if (explainOpen) {
      setTimeout(() => {
        explainCode();
      }, 100);
    }

    const explainCode = () => {
      setExplainOpen(true);
      setExplainationLoading(true);

      monaco.editor.create(document.getElementById("code-editor-gemini")!, {
        value: code,
        language: "javascript",
        theme: "vs-dark",
        readOnly: true,
        lineNumbers: "off",
        minimap: { enabled: false },
      });

      setTimeout(() => {
        const expl =
          "This is a sample explaination of the code. In this code, we are trying to find the sum of two numbers. The code is written in  JavaScript and uses the + operator to add the two numbers. The result is then stored in a variable called sum. Finally, the sum is printed to the console using the console.log() function.";
          
        setExplaination(expl);
        setExplainationLoading(false);
      }, 3000);
    };
  }, [code, explainOpen, setExplainOpen]);

  return (
    <Drawer
      open={explainOpen}
      onOpenChange={setExplainOpen}
      shouldScaleBackground
    >
      <DrawerContent className="outline-none">
        <DrawerHeader>
          <DrawerTitle>Code Explaination</DrawerTitle>
          <DrawerDescription>Powered by Gemini AI</DrawerDescription>
          <div className="flex gap-10 h-48 mt-5">
            <div
              id="code-editor-gemini"
              className="border h-full w-[48%] z-50 overflow-visible rounded-lg"
            ></div>

            <div className="w-[48%] h-full overflow-y-auto">
              {explainationLoading ? (
                <div className=" flex items-center justify-center h-full">
                  <Spinner size="lg" color="primary" />
                </div>
              ) : (
                <p>{explaination}</p>
              )}
            </div>
          </div>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <div className="flex items-center justify-center w-full">
              <Button className="w-fit" onClick={() => setExplainOpen(false)}>
                Close
              </Button>
            </div>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default Explain;
