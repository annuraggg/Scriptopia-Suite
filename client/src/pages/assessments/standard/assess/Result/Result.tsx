import React, { Key, useState } from 'react'
import { motion } from "framer-motion";
import ResultRight from "./ResultRight";
import ResultLeft from "./ResultLeft";


const Result = () => {

    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full p-10 h-[100%] flex flex-row gap-20 px-[10vw]"
        >
            <ResultLeft />
            <ResultRight />
        </motion.div>
    )
}

export default Result;