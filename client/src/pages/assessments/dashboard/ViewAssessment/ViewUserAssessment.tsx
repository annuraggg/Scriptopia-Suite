import ViewUserAssessmentTop from "./ViewUserAssessmentTop";
import ViewUserAssessmentBottom from "./ViewUserAssessmentBottom";
import { motion } from "framer-motion";

const ViewUserAssessment = () => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full p-10 h-screen flex flex-col"
    >
      <ViewUserAssessmentTop />
      <ViewUserAssessmentBottom />
    </motion.div>
  )
}

export default ViewUserAssessment;
