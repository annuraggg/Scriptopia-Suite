import { useState } from "react";
import { EditIcon } from "lucide-react";
import {
    Textarea,
    Checkbox,
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@nextui-org/react";

interface ReviewProps {
    onEdit: (section: string) => void;
}

const Review: React.FC<ReviewProps> = ({ onEdit }) => {
    const [isSelected, setIsSelected] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleSubmit = () => {
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    return (
        <div className="flex flex-col items-start justify-start h-[10]0 w-full gap-6 overflow-hidden px-10">
            <div className="flex flex-col items-start justify-start gap-6 w-full h-[40%] flex-reverse">
                <div className="flex flex-row items-center justify-start w-full">
                    <p className="text-2xl">Contact Information</p>
                    <div 
                        className="flex flex-row gap-1 items-center justify-start text-green-500 cursor-pointer"
                        onClick={() => onEdit("contact")}
                    >
                        <EditIcon size={14} />
                        <p className="text-sm mt-1">Edit</p>
                    </div>
                </div>
                <div className="flex flex-col-2 w-[50%] h-full gap-5 text-base">
                    <div className="space-y-3 text-default-500">
                        <p>Name:</p>
                        <p>Phone No:</p>
                        <p>Email Address:</p>
                    </div>
                    <div className="space-y-3">
                        <p>John doe</p>
                        <p>+91 9876543210</p>
                        <p>johndoe@gmail.com</p>
                    </div>
                </div>
            </div>
            <div className="w-full h-[0.5px] bg-slate-500 justify-start rounded-full"></div>
            <div className="flex flex-col items-start justify-start gap-6 w-full h-[40%] flex-reverse">
                <div className="flex flex-row items-center justify-start w-full">
                    <p className="text-2xl">Resume</p>
                    <div 
                        className="flex flex-row gap-1 items-center justify-start text-green-500 cursor-pointer"
                        onClick={() => onEdit("resume")}
                    >
                        <EditIcon size={14} />
                        <p className="text-sm mt-1">Edit</p>
                    </div>
                </div>
                <div className="flex flex-col-2 w-[50%] h-full gap-5 text-base"></div>
            </div>
            <div className="w-full h-[0.5px] bg-slate-500 justify-start rounded-full"></div>
            <div className="flex flex-col items-start justify-start gap-6 w-full h-full flex-reverse">
                <div className="flex flex-row items-center justify-start w-full">
                    <p className="text-2xl">Additional Questions</p>
                    <div 
                        className="flex flex-row gap-1 items-center justify-start text-green-500 cursor-pointer"
                        onClick={() => onEdit("additional")}
                    >
                        <EditIcon size={14} />
                        <p className="text-sm mt-1">Edit</p>
                    </div>
                </div>
                <div className="flex flex-col-2 w-[50%] h-full gap-5 text-base">
                    <div className="space-y-3 text-default-500">
                        <p>Question 1:</p>
                        <p>Question 2:</p>
                        <p>Question 3:</p>
                    </div>
                    <div className="space-y-3">
                        <p>Answer 1</p>
                        <p>Answer 2</p>
                        <p>Answer 3</p>
                    </div>
                </div>
                <div className="flex flex-col items-start justify-start w-full h-full gap-2">
                    <p className="text-base text-default-500">
                        Do You Have Any Questions ?
                    </p>
                    <Textarea
                        isDisabled
                        labelPlacement="outside"
                        placeholder="Enter your description"
                        defaultValue="NextUI is a React UI library that provides a set of accessible, reusable, and beautiful components. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin et malesuada quam. Proin non arcu ac tortor varius maximus at eget ligula. Curabitur gravida consectetur odio eu ultrices. Vestibulum in tincidunt dolor. Fusce posuere urna a ex ornare mollis. Aliquam eu condimentum ex. Suspendisse nec massa ollis, ullamcorper ligula eget, posuere neque. Sed nec faucibus libero, nec tristique lacus. In bibendum egestas lacinia. Cras volutpat nunc quis risus blandit, vitae vestibulum purus maximus. Phasellus orci ex, laoreet sit amet dolor vulputate, tincidunt ultricies diam. Ut nec leo enim. Vivamus convallis consequat augue eu cursus. Nullam accumsan libero sit amet sagittis maximus"
                        className="max-w-full h-full rounded-none text-base"
                    />
                </div>
            </div>
            <div className="w-full h-[0.5px] bg-slate-500 justify-start rounded-full"></div>
            <div className="flex flex-col items-start justify-start gap-6 w-full h-[40%]">
                <div className="flex flex-row items-center justify-start w-full gap-2">
                    <Checkbox radius="sm" isSelected={isSelected} onValueChange={setIsSelected}></Checkbox>
                    <p className="text-sm mt-2 w-[90%]">I confirm that the details I am submitting are accurate and valid. I understand that providing incorrect
                        information may result in disqualification and further action.
                    </p>
                    {isSelected && (
                        <Button
                            onPress={handleSubmit}
                            className=" bottom-2 bg-green-500 text-base"
                        >
                            Submit
                        </Button>
                    )}
                </div>
            </div>
            <Modal
                isOpen={isModalVisible}
                onClose={closeModal}
            >
                <ModalContent>
                    <ModalHeader>
                        <h1>Congratulations!</h1>
                    </ModalHeader>
                    <ModalBody>
                        <p>Your application has been submitted successfully.</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={closeModal}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default Review;