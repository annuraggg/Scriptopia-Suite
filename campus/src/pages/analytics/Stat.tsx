import { Card, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";

interface StatProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

export default function Stat({
  title,
  value,
  icon,
  color = "bg-blue-500",
}: StatProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        scale: 1.02,
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
    >
      <Card className="border-none shadow-md overflow-hidden h-full">
        <CardBody className="flex flex-row items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h4 className="text-2xl md:text-3xl font-bold text-gray-800">
              {value}
            </h4>
          </div>
          {icon && (
            <div
              className={`p-3 rounded-lg ${color} text-white flex items-center justify-center shadow-md`}
            >
              {icon}
            </div>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
}
