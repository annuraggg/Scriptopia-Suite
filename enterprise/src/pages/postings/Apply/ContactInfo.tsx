
import { Input, Select, SelectItem } from '@nextui-org/react';

const ContactInfo = () => {
    return (
        <div className='flex flex-cols-2 items-center justify-between h-full w-full gap-6'>
            <div className='flex flex-col items-start justify-center gap-1 w-full h-full'>
                <div className='flex flex-col items-start justify-center gap-2 w-full h-full'>
                    <label className='text-base'>First Name *</label>
                    <Input placeholder='eg. John' className='w-full rounded-sm' />
                </div>
                <div className='flex flex-col items-start justify-center gap-2 w-full h-full'>
                    <label className='text-base'>Phone Country Code *</label>
                    <Select placeholder='Select Country Code' className='w-full rounded-sm'>
                        <SelectItem key="US">+1 (United States)</SelectItem>
                        <SelectItem key="CA">+1 (Canada)</SelectItem>
                        <SelectItem key="GB">+44 (United Kingdom)</SelectItem>
                        <SelectItem key="AU">+61 (Australia)</SelectItem>
                        <SelectItem key="IN">+91 (India)</SelectItem>
                    </Select>
                </div>
                <div className='flex flex-col items-start justify-center gap-2 w-full h-full'>
                    <label className='text-base'>Email Address *</label>
                    <Input placeholder='eg. John' className='w-full rounded-sm' />
                </div>
            </div>
            <div className='flex flex-col items-center justify-center gap-2 w-full h-full'>
            <div className='flex flex-col items-start justify-center gap-2 w-full h-full'>
                    <label className='text-base'>Last Name *</label>
                    <Input placeholder='eg. Doe' className='w-full rounded-sm' />
                </div>
                <div className='flex flex-col items-start justify-center gap-2 w-full h-full'>
                    <label className='text-base'>Phone No *</label>
                    <Input placeholder='eg. 1234567890' className='w-full rounded-sm' />
                </div>
                <div className='flex flex-col items-start justify-center gap-2 w-full h-full'>
                    <label className='text-base'>Website</label>
                    <Input placeholder='eg. John' className='w-full rounded-sm' />
                </div>
            </div>
        </div>
    );
};

export default ContactInfo;
