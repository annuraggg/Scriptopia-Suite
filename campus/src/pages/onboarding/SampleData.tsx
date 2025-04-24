import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardBody, Chip } from "@nextui-org/react";
import { IconAssembly, IconTestPipe } from "@tabler/icons-react";

interface SampleDataProps {
  sampleData: boolean;
  setSampleData: React.Dispatch<React.SetStateAction<boolean>>;
}

const SampleData = ({ sampleData, setSampleData }: SampleDataProps) => {
  return (
    <div className="h-full">
      <h3 className="text-xl font-semibold mb-2">One Last Step...</h3>
      <p className="text-gray-600 mb-4">
        Do you want to start with sample data?
      </p>

      <div>
        <ToggleGroup
          type="single"
          value={sampleData ? "sample" : "no-sample"}
          className="mt-5 gap-5 justify-start pl-2"
        >
          <ToggleGroupItem
            value="sample"
            aria-label="Sample Data"
            className="data-[state=on]:ring-2 data-[state=on]:ring-primary p-0 w-full data-[state=on]:bg-primary/20"
            onClick={() => setSampleData(true)}
            asChild
          >
            <Card
              className="w-[250px] h-[250px] bg-white relative"
              isPressable
              shadow={sampleData ? "md" : "sm"}
            >
              <div className="absolute top-2 right-2 z-10">
                <Chip color="primary" size="sm">
                  Recommended
                </Chip>
              </div>
              <CardBody className="flex flex-col items-center justify-center text-center p-6 gap-3">
                <div className="mb-2">
                  <IconTestPipe size={48} className="text-primary" />
                </div>
                <h5 className="text-lg font-medium">Play with Sample Data</h5>
                <p className="text-sm text-gray-600">
                  You will get sample candidates, companies, drives and
                  placement groups to work with
                </p>
              </CardBody>
            </Card>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="no-sample"
            aria-label="No Sample Data"
            className="data-[state=on]:ring-2 data-[state=on]:ring-primary p-0 w-full data-[state=on]:bg-primary/20"
            onClick={() => setSampleData(false)}
            asChild
          >
            <Card
              className="w-[250px] h-[250px] bg-white"
              isPressable
              shadow={!sampleData ? "md" : "sm"}
            >
              <CardBody className="flex flex-col items-center justify-center text-center p-6 gap-3">
                <div className="mb-2">
                  <IconAssembly size={48} className="text-gray-600" />
                </div>
                <h5 className="text-lg font-medium">Start placements now</h5>
                <p className="text-sm text-gray-600">
                  You will not get any sample data. You can add candidates,
                  drives, companies and placement groups later
                </p>
              </CardBody>
            </Card>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default SampleData;
