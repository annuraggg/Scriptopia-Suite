
import { motion } from "framer-motion";
import LeftPane from "./LeftPane";
import RightPane from "./RightPane";

const profile = () => {

    
    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full p-10 h-screen flex flex-row gap-20"
        >
            <LeftPane />
            <RightPane />
        </motion.div>
    )
}

export default profile