import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card,
    CardBody,
    CardHeader,
    Chip,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
    Select,
    SelectItem,
    Input,
    Tabs,
    Tab
} from '@nextui-org/react';
import {
    Users,
    Briefcase,
    Target,
    Activity,
    MoreVertical,
    Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import Filter from './Filter';

import { CompanyTable } from './CompanyTable';

const SORT_OPTIONS = {
    NEWEST: 'newest',
    OLDEST: 'oldest',
} as const;

// Utility Functions
const formatCurrency = (amount: number) => `₹${(amount / 100000).toFixed(1)}L`;

// Types
interface CompanyDetail {
    id: string;
    name: string;
    description?: string;
    generalInfo: {
        industry: string[];
        yearVisit: string[];
        studentsHired: number;
        averagePackage: number;
        highestPackage: number;
        rolesOffered: string[];
    };
    stats: {
        title: string;
        value: string;
        change: string;
        icon: any;
        trend: "up" | "down";
    }[];
    hrContacts: {
        name: string;
        phone: string;
        email: string;
        website: string;
    };
}

interface Student {
    id: string;
    name: string;
    department: string;
    year: string;
    status: 'placed' | 'pending' | 'rejected';
    package?: number;
    email?: string;
    phone?: string;
}

// Custom Hooks
const useCompanyData = (id: string) => {
    const [company, setCompany] = useState<CompanyDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                setCompany({
                    id: '1',
                    name: 'OmniCloud Solutions',
                    description: 'OmniCloud Solutions is a cloud computing company...',
                    generalInfo: {
                        industry: ['IT', 'Analytics', 'Consulting'],
                        yearVisit: ['2023', '2024', '2025'],
                        studentsHired: 75,
                        averagePackage: 11000000,
                        highestPackage: 20000000,
                        rolesOffered: ['Software Engineer', 'Data Analyst', 'Marketing']
                    },
                    stats: [
                        {
                            title: "Students Hired",
                            value: "75",
                            change: "+12.5%",
                            icon: Users,
                            trend: "up",
                        },
                        {
                            title: "Average Package",
                            value: "₹11.0L",
                            change: "+8.2%",
                            icon: Briefcase,
                            trend: "up",
                        },
                        {
                            title: "Highest Package",
                            value: "₹20.0L",
                            change: "-2.4%",
                            icon: Target,
                            trend: "down",
                        },
                        {
                            title: "Placement Rate",
                            value: "92%",
                            change: "+5.1%",
                            icon: Activity,
                            trend: "up",
                        }
                    ],
                    hrContacts: {
                        name: 'John Doe',
                        phone: '+91 9876543210',
                        email: 'hr@omnicloud.com',
                        website: 'www.omnicloud.com'
                    }
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchCompany();
    }, [id]);

    return { company, loading, error };
};

const useStudentData = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setStudents([
                    {
                        id: '1',
                        name: 'John Doe',
                        department: 'Computer Science',
                        year: '2024',
                        status: 'placed',
                        package: 1100000
                    },
                ]);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    return { students, loading, error };
};

const useFilteredStudents = (
    students: Student[],
    searchTerm: string,
    filter: 'all' | 'placed' | 'pending',
    activeFilters: { year: string; departments: string[] },
    sort: string
) => {
    return useMemo(() => {
        return students
            .filter((student) => {
                const matchesSearch = !searchTerm ||
                    student.name.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesFilter = filter === 'all' || student.status === filter;
                const matchesYear = !activeFilters.year ||
                    student.year === activeFilters.year;
                const matchesDepartment = !activeFilters.departments.length ||
                    activeFilters.departments.includes(student.department);

                return matchesSearch && matchesFilter && matchesYear && matchesDepartment;
            })
            .sort((a, b) =>
                sort === SORT_OPTIONS.NEWEST
                    ? b.year.localeCompare(a.year)
                    : a.year.localeCompare(b.year)
            );
    }, [students, searchTerm, filter, activeFilters, sort]);
};

// Main Component
export default function CompanyDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { company, loading: companyLoading, error: companyError } = useCompanyData(id!);
    const { students, loading: studentsLoading, error: studentsError } = useStudentData();

    const [selected, setSelected] = useState("details");
    const [searchTerm, setSearchTerm] = useState('');
    const [filter] = useState<'all' | 'placed' | 'pending'>('all');
    const [sort, setSort] = useState<typeof SORT_OPTIONS.NEWEST | typeof SORT_OPTIONS.OLDEST>(SORT_OPTIONS.NEWEST);
    const [activeFilters, setActiveFilters] = useState({
        year: "",
        departments: [] as string[],
    });

    const filteredStudents = useFilteredStudents(
        students,
        searchTerm,
        filter,
        activeFilters,
        sort
    );

    const handleFilterChange = (newFilters: { year: string; departments: string[] }) => {
        setActiveFilters(newFilters);
    };

    const handleClearFilters = () => {
        setActiveFilters({ year: "", departments: [] });
    };

    if (companyLoading || studentsLoading) return <div>Loading...</div>;
    if (companyError || studentsError) return <div>Error loading data</div>;
    if (!company) return <div>Company not found</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6"
        >
            {/* Company Header */}
            <div className="flex items-center justify-between p-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {company.name}
                </h1>
                <Dropdown>
                    <DropdownTrigger>
                        <Button isIconOnly variant="light" className="text-neutral-400">
                            <MoreVertical size={20} />
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                        <DropdownItem onClick={() => navigate(`/company/${company.id}/edit`)}>
                            Edit Details
                        </DropdownItem>
                        <DropdownItem className="text-danger">Delete Company</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>

            {/* Tabs */}
            <Tabs
                selectedKey={selected}
                onSelectionChange={setSelected as any}
                variant="underlined"
                color='primary'
                className="mt-6"
            >
                {/* Company Details Tab */}
                <Tab key="details" title="Company Details">
                    <div className="space-y-6 mt-5">
                        {/* About Section */}
                        <Card className="bg-default-50 p-2">
                            <CardBody>
                                <h3 className="text-xl font-semibold mb-4">About</h3>
                                <p className="text-default-500 leading-relaxed mx-2">
                                    {company.description}
                                </p>
                            </CardBody>
                        </Card>

                        {/* General Information */}
                        <Card className="bg-default-50 p-2">
                            <CardBody>
                                <h3 className="text-xl font-semibold mb-4">General Information</h3>
                                <div className="space-y-6">
                                    {/* Industry */}
                                    <div className='mx-2'>
                                        <p className="text-sm text-default-500 mb-3">Industry</p>
                                        <div className="flex flex-wrap gap-2">
                                            {company.generalInfo.industry.map((industry) => (
                                                <Chip
                                                    key={industry}
                                                    variant="dot"
                                                    color="success"
                                                    classNames={{
                                                        base: "text-green-default dark:text-default"
                                                    }}
                                                >
                                                    {industry}
                                                </Chip>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Other Info Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className='mx-2'>
                                            <p className="text-sm text-default-500 mb-1">Year(s) of Visit</p>
                                            <p className="text-lg font-semibold">
                                                {company.generalInfo.yearVisit.join(', ')}
                                            </p>
                                        </div>
                                        <div className='mx-2'>
                                            <p className="text-sm text-default-500 mb-1">Total Students Hired</p>
                                            <p className="text-lg font-semibold">
                                                {company.generalInfo.studentsHired}
                                            </p>
                                        </div>
                                        <div className='mx-2'>
                                            <p className="text-sm text-default-500 mb-1">Average Package</p>
                                            <p className="text-lg font-semibold">
                                                {formatCurrency(company.generalInfo.averagePackage)}
                                            </p>
                                        </div>
                                        <div className='mx-2'>
                                            <p className="text-sm text-default-500 mb-1">Highest Package</p>
                                            <p className="text-lg font-semibold">
                                                {formatCurrency(company.generalInfo.highestPackage)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Roles Offered */}
                                    <div className='mx-2'>
                                        <p className="text-sm text-default-500 mb-3">Roles Offered</p>
                                        <div className="flex flex-wrap gap-2">
                                            {company.generalInfo.rolesOffered?.map((role) => (
                                                <Chip
                                                    key={role}
                                                    variant="dot"
                                                    color="success"
                                                    classNames={{
                                                        base: "text-green-default dark:text-default"
                                                    }}
                                                >
                                                    {role}
                                                </Chip>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* HR Contacts */}
                        <Card className="bg-default-50 p-2">
                            <CardBody>
                                <h3 className="text-xl font-semibold mb-4">HR Contacts</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className='mx-2'>
                                        <p className="text-sm text-default-500 mb-1">Name</p>
                                        <p className="text-lg font-semibold">{company.hrContacts.name}</p>
                                    </div>
                                    <div className='mx-2'>
                                        <p className="text-sm text-default-500 mb-1">Phone</p>
                                        <p className="text-lg font-semibold">{company.hrContacts.phone}</p>
                                    </div>
                                    <div className='mx-2'>
                                        <p className="text-sm text-default-500 mb-1">Email</p>
                                        <p className="text-lg font-semibold">{company.hrContacts.email}</p>
                                    </div>
                                    <div className='mx-2'>
                                        <p className="text-sm text-default-500 mb-1">Website</p>
                                        <a
                                            href={`https://${company.hrContacts.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-lg font-semibold text-primary hover:underline"
                                        >
                                            {company.hrContacts.website}
                                        </a>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </Tab>

                {/* Students Tab */}
                <Tab key="students" title="Student Details">
                    <div className="flex gap-8 mt-5">
                        <div className="w-1/4">
                            <Filter
                                onFilterChange={handleFilterChange}
                                onClearFilters={handleClearFilters}
                            />
                        </div>
                        <div className="w-3/4">
                            <div className="flex items-center gap-4 mb-6">
                                <Input
                                    className="w-full"
                                    placeholder="Search Students"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    startContent={<Search className="text-default-400" size={20} />}
                                />
                            </div>
                            <CompanyTable data={filteredStudents} />
                        </div>
                    </div>
                </Tab>
            </Tabs>
        </motion.div>
    );
}