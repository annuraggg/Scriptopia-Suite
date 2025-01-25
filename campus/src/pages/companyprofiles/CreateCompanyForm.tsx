import { useState } from "react";
import {
    Card,
    Input,
    Button,
    Select,
    SelectItem,
    CardBody,
    Textarea,
    Chip
} from "@nextui-org/react";

const currencies = [
    { key: "usd", label: "USD $" },
    { key: "eur", label: "EUR €" },
    { key: "gbp", label: "GBP £" },
    { key: "inr", label: "INR ₹" },
    { key: "jpy", label: "JPY ¥" },
    { key: "aud", label: "AUD A$" },
    { key: "cad", label: "CAD C$" },
    { key: "chf", label: "CHF Fr" },
    { key: "cny", label: "CNY ¥" },
    { key: "sek", label: "SEK kr" },
    { key: "nzd", label: "NZD $" },
    { key: "mxn", label: "MXN $" },
    { key: "sgd", label: "SGD $" },
    { key: "hkd", label: "HKD $" },
    { key: "nok", label: "NOK kr" },
    { key: "krw", label: "KRW ₩" },
    { key: "try", label: "TRY ₺" },
    { key: "rub", label: "RUB ₽" },
    { key: "brl", label: "BRL R$" },
    { key: "zar", label: "ZAR R" },
];

const countryCode = [
    { key: "+1", label: "USA/Canada (+1)" },
    { key: "+44", label: "UK (+44)" },
    { key: "+49", label: "Germany (+49)" },
    { key: "+61", label: "Australia (+61)" },
    { key: "+81", label: "Japan (+81)" },
    { key: "+82", label: "South Korea (+82)" },
    { key: "+86", label: "China (+86)" },
    { key: "+91", label: "India (+91)" },
    { key: "+92", label: "Pakistan (+92)" },
    { key: "+94", label: "Sri Lanka (+94)" },
    { key: "+95", label: "Myanmar (+95)" },
    { key: "+98", label: "Iran (+98)" },
    { key: "+212", label: "Morocco (+212)" },
    { key: "+234", label: "Nigeria (+234)" },
    { key: "+351", label: "Portugal (+351)" },
    { key: "+852", label: "Hong Kong (+852)" },
    { key: "+855", label: "Cambodia (+855)" },
    { key: "+880", label: "Bangladesh (+880)" },
    { key: "+971", label: "UAE (+971)" },
    { key: "+977", label: "Nepal (+977)" },
];

interface CreateCompanyFormProps {
    onClose: () => void;
}

interface Role {
    id: string;
    name: string;
}

interface Industry {
    id: string;
    name: string;
}

interface CreateCompanyData {
    name: string;
    startYear: string;
    endYear: string;
    industries: string[];
    roles: string[];
    purpose: string;
    expiryDate: string;
    expiryTime: string;
    accessType: "public" | "private";
    studentsHired: number;
    averagePackage: number;
    highestPackage: number;
    currency: string;
    contactName: string;
    contactEmail: string;
    phone: number;
    contactWebsite: string;
}

const industries: Industry[] = [
    { id: "1", name: "Software Engineering" },
    { id: "2", name: "Mechanical Engineering" },
    { id: "3", name: "Electrical Engineering" },
    { id: "5", name: "Manufacturing" },
    { id: "6", name: "Technology" },
    { id: "7", name: "Finance" },
    { id: "10", name: "Operations" },
    { id: "11", name: "Sales" },
    { id: "8", name: "Marketing" },
    { id: "4", name: "Consulting" },
    { id: "9", name: "Human Resources" },
    { id: "12", name: "Others" },
];

const roles: Role[] = [
    { id: "1", name: "Software Engineer" },
    { id: "2", name: "Business Analyst" },
    { id: "3", name: "Consultant" },
    { id: "4", name: "Marketing Executive" },
    { id: "5", name: "HR Executive" },
    { id: "6", name: "Operations Executive" },
    { id: "7", name: "Finance Analyst" },
    { id: "8", name: "Product Manager" },
    { id: "9", name: "Project Manager" },
    { id: "10", name: "Others" },
];

const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - 2 + i;
    return `${year}`;
});

const CreateCompanyForm = ({ onClose }: CreateCompanyFormProps) => {
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
    const [formData, setFormData] = useState<CreateCompanyData>({
        name: "",
        startYear: "",
        endYear: "",
        roles: [],
        industries: [],
        purpose: "",
        expiryDate: "",
        expiryTime: "",
        accessType: "private",
        studentsHired: 0,
        averagePackage: 0,
        highestPackage: 0,
        currency: "inr",
        contactName: "",
        contactEmail: "",
        phone: 0,
        contactWebsite: "",
    });

    const handleIndustrySelection = (induId: string) => {
        setFormData((prev) => ({
            ...prev,
            industries: prev.industries.includes(induId)
                ? prev.industries.filter((id) => id !== induId)
                : [...prev.industries, induId],
        }));
    };

    const handleRoleSelection = (roleId: string) => {
        setFormData((prev) => ({
            ...prev,
            roles: prev.roles.includes(roleId)
                ? prev.roles.filter((id) => id !== roleId)
                : [...prev.roles, roleId],
        }));
    };

    const handleSubmit = async () => {
        onClose();
    };

    return (
        <div className="w-full max-w-4xl mx-auto h-screen flex flex-col ">
            <div className="sticky top-0 bg-background z-10 p-6 pb-3 shadow-sm">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-500 bg-clip-text text-transparent">
                        Create Company Profile
                    </h1>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-gray-400">
                            <span
                                className={`w-10 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep >= 1
                                    ? "bg-green-600 text-white"
                                    : "bg-green-500 text-white"
                                    }`}
                            >
                                1
                            </span>
                            <span className="font-medium">Company Details</span>
                            <span className="mx-4 h-px w-16 bg-gradient-to-r from-green-500 to-gray-700" />
                            <span
                                className={`w-10 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep >= 2
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-700"
                                    }`}
                            >
                                2
                            </span>
                            <span className="font-medium">Visit & Salary Details</span>
                            <span className="mx-4 h-px w-16 bg-gradient-to-r from-green-500 to-gray-700" />
                            <span
                                className={`w-10 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep >= 3
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-700 text-white"
                                    }`}
                            >
                                3
                            </span>
                            <span className="font-medium">Contact Information</span>
                            <span className="mx-4 h-px w-16 bg-gradient-to-r from-green-500 to-gray-700" />
                        </div>
                        <span className="text-xl font-bold text-green-500">{currentStep}/3</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
                {/* step 1 */}
                {currentStep === 1 ? (
                    <Card className="bg-white dark:bg-gray-800 shadow-xl">
                        <CardBody className="p-8 space-y-8">
                            <div>
                                <label className="block text-sm font-medium mb-2">Company Details</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                                    }
                                    placeholder="Enter the company name"
                                    className="shadow-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Industry</label>
                                <div className="flex flex-wrap gap-2">
                                    {industries.map((indu) => (
                                        <Chip
                                        key={indu.id}
                                        variant={formData.industries.includes(indu.id) ? "dot" : "flat"}
                                        classNames={{
                                            base: `cursor-pointer transition-all duration-300 hover:scale-105 ${
                                                formData.industries.includes(indu.id)
                                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300"
                                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
                                            }`,
                                            dot: "bg-green-500"
                                        }}
                                        onClick={() => handleIndustrySelection(indu.id)}
                                    >
                                        {indu.name}
                                    </Chip>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <Textarea
                                    value={formData.purpose}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            purpose: e.target.value,
                                        }))
                                    }
                                    placeholder="Provide a brief description of the company"
                                    minRows={3}
                                    className="shadow-sm"
                                />
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
                )
                    //step 2 
                    : currentStep === 2 ? (
                        <Card className="bg-white dark:bg-gray-800 shadow-xl">
                            <CardBody className="p-8 space-y-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">First Visit Year</label>
                                        <Select
                                            placeholder="Select the first visit year"
                                            value={formData.startYear}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    startYear: e.target.value,
                                                }))
                                            }
                                            className="shadow-sm w-full"
                                        >
                                            {years.map((year) => (
                                                <SelectItem key={year} value={year}>
                                                    {year}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Students Hired</label>
                                        <Input
                                            type="number"
                                            min={0}
                                            value={formData.studentsHired === 0 ? '' : formData.studentsHired}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const value = e.target.value;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    studentsHired: value === '' ? 0 : parseInt(value)
                                                }));
                                            }}
                                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                if (e.key === '-' || e.key === 'e' || e.key === '.') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            placeholder="Enter the number of students hired till now"
                                            className="shadow-sm w-full"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Roles Offered</label>
                                    <div className="flex flex-wrap gap-2">
                                        {roles.map((rol) => (
                                            <Chip
                                                key={rol.id}
                                                variant={formData.roles.includes(rol.id) ? "dot" : "flat"}
                                                classNames={{
                                                    base: `cursor-pointer transition-all duration-300 hover:scale-105 ${
                                                        formData.roles.includes(rol.id)
                                                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300"
                                                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
                                                    }`,
                                                    dot: "bg-green-500"
                                                }}
                                                onClick={() => handleRoleSelection(rol.id)}
                                            >
                                                {rol.name}
                                            </Chip>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Average Package</label>
                                    <div className="flex gap-4">
                                        <Input
                                            type="number"
                                            min={0}
                                            value={formData.averagePackage || ''}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const value = e.target.value;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    averagePackage: value === '' ? 0 : parseInt(value)
                                                }));
                                            }}
                                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                if (e.key === '-' || e.key === 'e' || e.key === '.') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            placeholder="Enter the average salary package"
                                            className="shadow-sm"
                                        />

                                        <Select
                                            placeholder="Select the currency type"
                                            className="shadow-sm"
                                        >
                                            {currencies.map((currencies) => (
                                                <SelectItem key={currencies.key}>{currencies.label}</SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Highest Package</label>
                                    <div className="flex gap-4">

                                        <Input
                                            type="number"
                                            min={0}
                                            value={formData.highestPackage || ''}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const value = e.target.value;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    highestPackage: value === '' ? 0 : parseInt(value)
                                                }));
                                            }}
                                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                if (e.key === '-' || e.key === 'e' || e.key === '.') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            placeholder="Enter the highest salary package"
                                            className="shadow-sm"
                                        />

                                        <Select
                                            placeholder="Select the currency type"
                                            className="shadow-sm"
                                        >
                                            {currencies.map((currencies) => (
                                                <SelectItem key={currencies.key}>{currencies.label}</SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onClick={() => setCurrentStep(1)}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        color="primary"
                                        variant="solid"
                                        onClick={() => setCurrentStep(3)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    )
                        //step 3
                        : (
                            <Card className="bg-white dark:bg-gray-800 shadow-xl">
                                <CardBody className="p-8 space-y-8">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">HR Contact Name</label>
                                        <div className="flex gap-4">
                                            <Input
                                                value={formData.contactName}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, contactName: e.target.value }))
                                                }
                                                placeholder="Enter the HR representative's name"
                                                className="shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">HR Email</label>
                                        <div className="flex gap-4">
                                            <Input
                                                value={formData.contactEmail}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))
                                                }
                                                placeholder="Enter the HR contact email address"
                                                className="shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">HR Phone</label>
                                        <div className="flex gap-4">
                                            <Select
                                                placeholder="Select country code"
                                                className="shadow-sm"
                                            >
                                                {countryCode.map((countryCode) => (
                                                    <SelectItem key={countryCode.key}>{countryCode.label}</SelectItem>
                                                ))}
                                            </Select>
                                            <Input
                                                type="number"
                                                min={0}
                                                maxLength={10}
                                                value={formData.phone || ''}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const value = e.target.value;
                                                    if (value.length <= 10) {
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            phone: value === '' ? 0 : parseInt(value)
                                                        }));
                                                    }
                                                }}
                                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                    if (e.key === '-' || e.key === 'e' || e.key === '.' ||
                                                        (e.target as HTMLInputElement).value.length >= 10 &&
                                                        e.key !== 'Backspace' &&
                                                        e.key !== 'Delete') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                placeholder="Enter the HR contact phone number"
                                                className="shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Website URL</label>
                                        <div className="flex gap-4">
                                            <Input
                                                value={formData.contactWebsite}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, contactWebsite: e.target.value }))
                                                }
                                                onClick={(e) => {
                                                    if (!formData.contactWebsite) {
                                                        setFormData((prev) => ({ ...prev, contactWebsite: 'https://' }))
                                                    }
                                                }}
                                                placeholder="Enter the company's official website URL"
                                                className="shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button
                                            color="danger"
                                            variant="light"
                                            onClick={() => setCurrentStep(2)}
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
                        )
                }
            </div>
        </div>
    );
};

export default CreateCompanyForm;