import { useState } from "react";
import {
    Card,
    Input,
    Button,
    Select,
    SelectItem,
    CardBody,
    Textarea,
    Chip,
    RadioGroup,
    Radio,
} from "@nextui-org/react";
import { Calendar, Clock, Copy } from "lucide-react";

interface CreateGroupFormProps {
    onClose: () => void;
}

interface Department {
    id: string;
    name: string;
}

interface CreateGroupData {
    name: string;
    startYear: string;
    endYear: string;
    departments: string[];
    purpose: string;
    expiryDate: string;
    expiryTime: string;
    accessType: "public" | "private";
}

const departments: Department[] = [
    { id: "1", name: "Computer Engineering" },
    { id: "2", name: "Information Technology" },
    { id: "3", name: "CSE-AIML" },
    { id: "4", name: "CSE-Data Science" },
    { id: "5", name: "Mechanical Engineering" },
    { id: "6", name: "Civil Engineering" },
];

const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - 2 + i;
    return `${year}`;
});

const CreateGroupForm = ({ onClose }: CreateGroupFormProps) => {
    const [currentStep, setCurrentStep] = useState<1 | 2>(1);
    const [formData, setFormData] = useState<CreateGroupData>({
        name: "",
        startYear: "",
        endYear: "",
        departments: [],
        purpose: "",
        expiryDate: "",
        expiryTime: "",
        accessType: "private",
    });

    const handleDepartmentSelection = (deptId: string) => {
        setFormData((prev) => ({
            ...prev,
            departments: prev.departments.includes(deptId)
                ? prev.departments.filter((id) => id !== deptId)
                : [...prev.departments, deptId],
        }));
    };

    const generateInviteLink = () => {
        return `https://scriptopiacampus.com/groups/${formData.name
            .toLowerCase()
            .replace(/\s+/g, "-")}`;
    };

    const handleSubmit = async () => {
        onClose();
    };

    const handleAccessTypeChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            accessType: value as "public" | "private",
        }));
    };

    return (
        <div className="w-full max-w-3xl mx-auto h-screen flex flex-col ">
            <div className="sticky top-0 bg-background z-10 p-6 shadow-sm">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-500 bg-clip-text text-transparent">
                        Create a New Student Placement Group
                    </h1>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-gray-400">
                            <span
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    currentStep >= 1 
                                    ? "bg-green-600 text-white"
                                    : "bg-green-500 text-white"
                                }`}
                            >
                                1
                            </span>
                            <span className="font-medium">Define Group Details</span>
                            <span className="mx-4 h-px w-16 bg-gradient-to-r from-green-500 to-gray-700" />
                            <span
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    currentStep >= 2 
                                    ? "bg-green-500 text-white" 
                                    : "bg-gray-700"
                                }`}
                            >
                                2
                            </span>
                            <span className="font-medium">Configure Access Settings</span>
                        </div>
                        <span className="text-xl font-bold text-green-500">{currentStep}/2</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
                {currentStep === 1 ? (
                    <Card className="bg-white dark:bg-gray-800 shadow-xl">
                        <CardBody className="p-8 space-y-8">
                            <div>
                                <label className="block text-sm font-medium mb-2">Group Name</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                                    }
                                    placeholder="College Batch 2023-24"
                                    className="shadow-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Academic Year</label>
                                <div className="flex gap-4">
                                    <Select
                                        placeholder="Start Year"
                                        value={formData.startYear}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                startYear: e.target.value,
                                            }))
                                        }
                                        className="shadow-sm"
                                    >
                                        {years.map((year) => (
                                            <SelectItem key={year} value={year}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <Select
                                        placeholder="End Year"
                                        value={formData.endYear}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                endYear: e.target.value,
                                            }))
                                        }
                                        className="shadow-sm"
                                    >
                                        {years.map((year) => (
                                            <SelectItem key={year} value={year}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Department</label>
                                <div className="flex flex-wrap gap-2">
                                    {departments.map((dept) => (
                                        <Chip
                                            key={dept.id}
                                            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                                                formData.departments.includes(dept.id)
                                                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300"
                                                    : "bg-gray-100 dark:bg-gray-800"
                                            }`}
                                            onClick={() => handleDepartmentSelection(dept.id)}
                                        >
                                            {dept.name}
                                        </Chip>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Group Purpose</label>
                                <Textarea
                                    value={formData.purpose}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            purpose: e.target.value,
                                        }))
                                    }
                                    placeholder="Organizing placement activities for final-year students"
                                    minRows={3}
                                    className="shadow-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Group Expiry Date & Time
                                </label>
                                <div className="flex gap-4">
                                    <Input
                                        type="date"
                                        value={formData.expiryDate}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                expiryDate: e.target.value,
                                            }))
                                        }
                                        placeholder="Select Expiry Date"
                                        startContent={<Calendar className="text-gray-400" size={18} />}
                                        className="shadow-sm"
                                    />
                                    <Input
                                        type="time"
                                        value={formData.expiryTime}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                expiryTime: e.target.value,
                                            }))
                                        }
                                        placeholder="Select Expiry Time"
                                        startContent={<Clock className="text-gray-400" size={18} />}
                                        className="shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button 
                                    color="danger" 
                                    variant="light" 
                                    onClick={onClose}
                                    className="hover:bg-red-50"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    variant="solid"
                                    onClick={() => setCurrentStep(2)}
                                    className=""
                                >
                                    Next
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                ) : (
                    <Card className="bg-white dark:bg-gray-800 shadow-xl">
                        <CardBody className="p-8 space-y-8">
                            <div>
                                <label className="block text-sm font-medium mb-2">Invite Link</label>
                                <div className="flex gap-2">
                                    <Input 
                                        value={generateInviteLink()} 
                                        readOnly 
                                        className="shadow-sm"
                                    />
                                    <Button
                                        isIconOnly
                                        variant="solid"
                                        onClick={() =>
                                            navigator.clipboard.writeText(generateInviteLink())
                                        }
                                        className="bg-green-100 hover:bg-green-200 text-green-600"
                                    >
                                        <Copy size={18} />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-medium">Access Type</label>
                                <RadioGroup
                                    value={formData.accessType}
                                    onValueChange={handleAccessTypeChange}
                                    className="space-y-3"
                                >
                                    <Radio 
                                        value="public"
                                        className="data-[selected=true]:text-green-500"
                                        description="Open to all students in this department"
                                    >
                                        Public Access
                                    </Radio>
                                    <Radio 
                                        value="private"
                                        className="data-[selected=true]:text-green-500"
                                        description="Approval required to join the group"
                                    >
                                        Private Access
                                    </Radio>
                                </RadioGroup>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    color="danger"
                                    variant="light"
                                    onClick={() => setCurrentStep(1)}
                                    className="hover:bg-red-50"
                                >
                                    Back
                                </Button>
                                <Button 
                                    color="primary"
                                    variant="solid" 
                                    onClick={handleSubmit}
                                    className=""
                                >
                                    Create Group
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default CreateGroupForm;