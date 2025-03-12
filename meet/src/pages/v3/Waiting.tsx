import Squares from "@/components/ui/Squares";
import { Spinner, Card, CardBody, Button } from "@nextui-org/react";
import { Phone } from "lucide-react";

interface WaitingProps {
  isRinging: boolean;
  joinInterview: () => void;
}

const Waiting = ({ isRinging, joinInterview }: WaitingProps) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br">
      <div className="absolute inset-0 z-0">
        <Squares
          speed={0.5}
          squareSize={40}
          direction="diagonal"
          borderColor="black"
        />
      </div>
      {isRinging ? (
        <>
          <Card className="max-w-md w-full shadow-lg">
            <CardBody className="flex flex-col items-center gap-6 p-8">
              <div className="flex items-center justify-center w-20 h-20 rounded-full">
                <Phone size={50} className="text-green-500 animate-pulse" />
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">
                  Interviewer is calling you
                </h2>
                <p className="mb-4">Click on Join to Join the Interview</p>

                <Button onPress={joinInterview}>Join Interview</Button>
              </div>
            </CardBody>
          </Card>
        </>
      ) : (
        <>
          {" "}
          <Card className="max-w-md w-full shadow-lg">
            <CardBody className="flex flex-col items-center gap-6 p-8">
              <div className="flex items-center justify-center w-20 h-20 rounded-full">
                <Spinner size="lg" color="primary" />
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Please Wait</h2>
                <p className="mb-4">The host will ring you shortly</p>

                <div className="p-4 rounded-lg text-sm">
                  <p className="font-medium mb-2">⚠️ Having trouble?</p>
                  <ul className="list-disc pl-5 space-y-1 text-start">
                    <li>Try refreshing the page</li>
                    <li>Check your internet connection</li>
                    <li>Ensure your camera and microphone are working</li>
                    <li>Rejoin the call if disconnected</li>
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
};

export default Waiting;
