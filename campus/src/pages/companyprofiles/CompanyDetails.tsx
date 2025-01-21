import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, Breadcrumbs, BreadcrumbItem } from '@nextui-org/react';
import { ArrowUpRight, ArrowDownRight, Calendar, Users, DollarSign, Briefcase, Target, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface CompanyDetail {
    id: string;
    name: string;
    description?: string;
    lastVisit: string;
    studentsHired: number;
    averagePackage: number;
    highestPackage: number;
}

type StatCardProps = {
    title: string;
    value: string;
    change: string;
    icon: React.ElementType;
    trend: "up" | "down";
}

const StatsCard = ({ stat, index }: { stat: StatCardProps; index: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
    >
        <Card>
            <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-content2">
                        <stat.icon className="h-6 w-6" />
                    </div>
                    <div className={`flex items-center gap-1 text-base ${stat.trend === 'up' ? 'text-success' : 'text-danger'}`}>
                        {stat.change}
                        {stat.trend === "up" ? (
                            <ArrowUpRight className="h-4 w-4" />
                        ) : (
                            <ArrowDownRight className="h-4 w-4" />
                        )}
                    </div>
                </div>
                <h3 className="text-base mb-1">{stat.title}</h3>
                <p className="text-base font-semibold">{stat.value}</p>
            </CardBody>
        </Card>
    </motion.div>
);

export default function CompanyDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState<CompanyDetail | null>(null);

    useEffect(() => {
        setCompany({
            id: '1',
            name: 'OmniCloud Solutions',
            description: 'OmniCloud Solutions is a cloud computing company that provides cloud services to businesses and individuals.',
            lastVisit: '2025',
            studentsHired: 75,
            averagePackage: 11000000,
            highestPackage: 20000000,
        });
    }, [id]);

    if (!company) return <div>Loading...</div>;

    const statsData = [
        {
            title: "Students Hired",
            value: company.studentsHired.toString(),
            change: "+12.5%",
            icon: Users,
            trend: "up" as const,
        },
        {
            title: "Average Package",
            value: `₹${(company.averagePackage / 100000).toFixed(1)}L`,
            change: "+8.2%",
            icon: Briefcase,
            trend: "up" as const,
        },
        {
            title: "Highest Package",
            value: `₹${(company.highestPackage / 100000).toFixed(1)}L`,
            change: "-2.4%",
            icon: Target,
            trend: "down" as const,
        },
        {
            title: "Placement Rate",
            value: "92%",
            change: "+5.1%",
            icon: Activity,
            trend: "up" as const,
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6"
        >
            <div className="mb-6">
                <Breadcrumbs>
                    <BreadcrumbItem onClick={() => navigate('/companyprofiles')} className="cursor-pointer">
                        Company Profiles
                    </BreadcrumbItem>
                    <BreadcrumbItem>{company.name}</BreadcrumbItem>
                </Breadcrumbs>
            </div>

            <div className="flex justify-between items-center pb-5">
                <div>
                    <h1 className="text-2xl font-bold">{company.name}</h1>
                    <p className="text-sm text-default-500 pt-2">{company.description}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsData.map((stat, index) => (
                    <StatsCard key={stat.title} stat={stat} index={index} />
                ))}
            </div>
        </motion.div>
    );
}