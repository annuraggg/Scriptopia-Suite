import React from 'react';
import {
    Card,
    CardBody,
    Input,
    Select,
    SelectItem,
    Checkbox,
} from '@nextui-org/react';
import { ArrowDownWideNarrow } from 'lucide-react';

interface FilterProps {
    workScheduleFilter: string[];
    setWorkScheduleFilter: React.Dispatch<React.SetStateAction<string[]>>;
    departmentFilter: string;
    setDepartmentFilter: React.Dispatch<React.SetStateAction<string>>;
    dateRange: { start: string; end: string };
    setDateRange: React.Dispatch<React.SetStateAction<{ start: string; end: string }>>;
}

const Filter: React.FC<FilterProps> = ({
    workScheduleFilter,
    setWorkScheduleFilter,
    departmentFilter,
    setDepartmentFilter,
    dateRange,
    setDateRange
}) => {
    const handleWorkScheduleChange = (value: string) => {
        if (workScheduleFilter.includes(value)) {
            setWorkScheduleFilter(workScheduleFilter.filter(item => item !== value));
        } else {
            setWorkScheduleFilter([...workScheduleFilter, value]);
        }
    };

    return (
        <div className='w-full h-full flex flex-col items-center justify-start mt-1'>
            <div className='flex items-center justify-between w-full rounded-lg radius-md'>
                <div className='flex items-center gap-1 w-full'>
                    <ArrowDownWideNarrow size={24} />
                    <p className='text-neutral-400 text-sm'>Sort by</p>
                </div>
                <Select size='sm' placeholder='Select' className='max-w-xs'>
                    <SelectItem key='text'>Text</SelectItem>
                </Select>
            </div>
            <Card className='w-full h-full mt-7'>
                <CardBody className='flex flex-col items-start justify-start gap-3 w-full p-4'>
                    <p className='text-lg font-semibold'>Filters</p>
                    <hr className='w-full h-[1px] bg-gray-200 rounded-lg'></hr>
                    <p className='text-neutral-400 text-base mt-2'>Work Schedule</p>
                    <div className='flex flex-col items-start justify-start gap-4 w-full text-sm mt-2'>
                        <Checkbox
                            size='sm'
                            isSelected={workScheduleFilter.includes('Full Time')}
                            onValueChange={() => handleWorkScheduleChange('Full Time')}
                        >
                            Full Time
                        </Checkbox>
                        <Checkbox
                            size='sm'
                            isSelected={workScheduleFilter.includes('Part Time')}
                            onValueChange={() => handleWorkScheduleChange('Part Time')}
                        >
                            Part Time
                        </Checkbox>
                        <Checkbox
                            size='sm'
                            isSelected={workScheduleFilter.includes('Internship')}
                            onValueChange={() => handleWorkScheduleChange('Internship')}
                        >
                            Internship
                        </Checkbox>
                    </div>
                    <hr className='w-full h-[1px] bg-gray-200 rounded-lg mt-2'></hr>
                    <p className='text-neutral-400 text-base mt-2'>Department</p>
                    <div className='flex flex-col items-start justify-start gap-4 w-full text-sm mt-2'>
                        <Select
                            size='sm'
                            placeholder='Select Department'
                            className='w-full'
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                        >
                            <SelectItem key='it' value='IT'>IT</SelectItem>
                            <SelectItem key='operations' value='Operations'>Operations</SelectItem>
                        </Select>
                    </div>
                    <hr className='w-full h-[1px] bg-gray-200 rounded-lg mt-2'></hr>
                    <p className='text-neutral-400 text-base mt-2'>Date Range</p>
                    <div className='flex flex-col items-start justify-start gap-4 w-full text-sm mt-2'>
                        <Input
                            type="date"
                            label="Start Date"
                            placeholder="Select start date"
                            className='w-full'
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        />
                        <Input
                            type="date"
                            label="End Date"
                            placeholder="Select end date"
                            className='w-full'
                            value={dateRange.end}
                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        />
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default Filter;