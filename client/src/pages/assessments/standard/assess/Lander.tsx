const Lander = () => {
  return (
    <div className="w-full flex flex-row items-start justify-start pt-5 px-10 pb-16 text-center text-white font-inter">
    <div className="w-[318px] shadow-md rounded-sm bg-grey flex flex-col items-start justify-start pb-6 gap-5 min-w-[318px]">
      <div className="w-full rounded-t-md bg-black flex flex-row items-end justify-start py-3 px-14 gap-4">
        <div className="flex flex-col items-start justify-end">
          <img className="w-14 h-14" loading="lazy" alt="" src="/vector.svg" />
        </div>
        <div className="leading-7 font-semibold">
          <p className="m-0">Time remaining</p>
          <p className="m-0 text-2xl">00:25:54</p>
        </div>
      </div>
      <div className="w-[300px] flex flex-row items-start justify-start px-6 text-left text-xs text-gray">
        <div className="flex-1 flex flex-col items-start justify-start gap-6">
          <div className="w-full text-sm">
            <p className="m-0 font-bold">How the Assessment Works:</p>
            <ul className="m-0 pl-4 text-slategray-100">
              <li>Welcome to our Comprehensive Coding Evaluation! This assessment is designed to evaluate your coding skills through a combination of Multiple-Choice Questions (MCQs) and Coding Challenges.</li>
            </ul>
          </div>
          <img className="w-full h-1" loading="lazy" alt="" src="/line-12.svg" />
          <div className="w-full flex flex-col items-start justify-start gap-5 pb-24">
            <div className="leading-4">
              <p className="m-0 font-medium">1. Choose Your Path</p>
              <ul className="m-0 pl-4 text-slategray-100">
                <li>You have the flexibility to choose where to begin—either with MCQs or Coding Challenges. The choice is yours!</li>
              </ul>
            </div>
            <div className="leading-4">
              <p className="m-0 font-medium">2. Complete Both Sections</p>
              <ul className="m-0 pl-4 text-slategray-100">
                <li>To get a comprehensive evaluation, it's crucial to complete both the MCQ and Coding sections. Your skills in problem-solving and code implementation will be thoroughly assessed.</li>
              </ul>
            </div>
            <div className="leading-4">
              <p className="m-0 font-medium">3. Time Matters</p>
              <ul className="m-0 pl-4 text-slategray-100">
                <li>Keep an eye on the clock! Your overall time taken will be considered as part of the assessment.</li>
              </ul>
            </div>
          </div>
          <div className="w-full flex flex-col items-start gap-4 text-center text-darkslategray-100 border-t border-gray-300">
            <input
              className="w-full bg-gray-200 py-3 px-8 rounded-t-md text-gray"
              placeholder="Your Progress:"
              type="text"
            />
            <div className="w-full flex flex-row items-start justify-start px-8">
              <div className="flex-1 flex flex-col items-start gap-1">
                <div className="relative font-medium">
                  <span>Overall Completion: </span>
                  <span className="text-lightseagreen">30%</span>
                </div>
                <div className="w-full rounded-full bg-gray-300 flex flex-row items-center">
                  <div className="h-1 w-1/3 bg-lightseagreen relative">
                    <div className="absolute top-0 left-0 rounded-full bg-white w-1 h-1"></div>
                    <div className="absolute top-0 left-1/2 rounded-full bg-white w-1 h-1"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-row items-start justify-start px-8">
              <div className="flex-1 flex flex-col items-start gap-1">
                <div className="relative font-medium">
                  <span>MCQ Completion: </span>
                  <span className="text-lightseagreen">40%</span>
                </div>
                <div className="w-full rounded-full bg-gray-300 flex flex-row items-center">
                  <div className="h-1 w-2/5 bg-lightseagreen relative">
                    <div className="absolute top-0 left-0 rounded-full bg-white w-1 h-1"></div>
                    <div className="absolute top-0 left-1/2 rounded-full bg-white w-1 h-1"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-row items-start justify-start px-8">
              <div className="flex-1 flex flex-col items-start gap-1">
                <div className="relative font-medium">
                  <span>Code Completion: </span>
                  <span className="text-lightseagreen">20%</span>
                </div>
                <div className="w-full rounded-full bg-gray-300 flex flex-row items-center">
                  <div className="h-1 w-1/5 bg-lightseagreen relative">
                    <div className="absolute top-0 left-0 rounded-full bg-white w-1 h-1"></div>
                    <div className="absolute top-0 left-1/2 rounded-full bg-white w-1 h-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default Lander;
