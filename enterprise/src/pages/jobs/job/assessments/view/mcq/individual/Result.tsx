import React from 'react';
import { ExtendedMCQAssessmentSubmission } from '@shared-types/ExtendedMCQAssessmentSubmission';
import { CheckCircle, XCircle, AlertTriangle, Clock, User, Mail, Eye } from 'lucide-react';

interface AssessmentResultsProps {
  submission: ExtendedMCQAssessmentSubmission;
}

const AssessmentResults: React.FC<AssessmentResultsProps> = ({ submission }) => {
  const { assessmentId, mcqSubmissions, obtainedGrades, name, email, timer, status, offenses, cheatingStatus, isReviewed, createdAt } = submission;
  
  // Calculate summary statistics
  const totalQuestions = assessmentId.sections.reduce(
    (acc, section) => acc + section.questions.length, 
    0
  );
  
  const totalAnswered = mcqSubmissions?.length || 0;
  
  const correctAnswers = obtainedGrades?.mcq?.filter(
    grade => grade.obtainedMarks > 0
  ).length || 0;
  
  const incorrectAnswers = totalAnswered - correctAnswers;
  
  const totalScore = obtainedGrades?.total || 0;
  const maxPossibleScore = assessmentId.obtainableScore;
  const scorePercentage = maxPossibleScore > 0 
    ? Math.round((totalScore / maxPossibleScore) * 100) 
    : 0;
  
  const isPassed = scorePercentage >= assessmentId.passingPercentage;
  
  // Format timer (seconds) to mm:ss
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Find a question by ID
  const findQuestion = (questionId: string) => {
    for (const section of assessmentId.sections) {
      const question = section.questions.find(q => q._id === questionId);
      if (question) return question;
    }
    return null;
  };
  
  // Find section containing a question
  const findSectionForQuestion = (questionId: string) => {
    for (const section of assessmentId.sections) {
      if (section.questions.some(q => q._id === questionId)) {
        return section.name;
      }
    }
    return "Unknown Section";
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">{assessmentId.name} - Results</h1>
          <p className="text-gray-600 mt-1">{assessmentId.description}</p>
        </div>
        
        {/* Candidate Info */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">{name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">{email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">Time taken: {formatTime(timer)}</span>
            </div>
            {cheatingStatus && (
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span className={`${cheatingStatus === "No Copying" ? "text-green-600" : cheatingStatus === "Light Copying" ? "text-amber-600" : "text-red-600"}`}>
                  {cheatingStatus}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">
                {isReviewed ? "Reviewed" : "Not Reviewed"}
              </span>
            </div>
          </div>
        </div>
        
        {/* Score Summary */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="font-medium text-gray-500">Total Score</div>
              <div className="text-3xl font-bold mt-1">
                {totalScore} / {maxPossibleScore}
              </div>
              <div className="text-lg font-semibold mt-1">
                {scorePercentage}%
              </div>
              <div className={`text-sm font-medium mt-2 inline-block px-2 py-1 rounded-full ${isPassed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {isPassed ? "PASSED" : "FAILED"}
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="font-medium text-gray-500">Correct Answers</div>
              <div className="text-3xl font-bold mt-1 text-green-600">{correctAnswers}</div>
              <div className="text-sm text-gray-500 mt-1">
                out of {totalQuestions} questions
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="font-medium text-gray-500">Incorrect Answers</div>
              <div className="text-3xl font-bold mt-1 text-red-600">{incorrectAnswers}</div>
              <div className="text-sm text-gray-500 mt-1">
                out of {totalQuestions} questions
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="font-medium text-gray-500">Passing Percentage</div>
              <div className="text-3xl font-bold mt-1">{assessmentId.passingPercentage}%</div>
              <div className="text-sm text-gray-500 mt-1">
                Required to pass
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Detailed Results */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Question Details</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {mcqSubmissions?.map((submission, index) => {
            const question = findQuestion(submission.mcqId);
            const sectionName = findSectionForQuestion(submission.mcqId);
            const grade = obtainedGrades?.mcq?.find(g => g.mcqId === submission.mcqId);
            const isCorrect = grade && grade.obtainedMarks > 0;
            const maxGrade = question?.grade || 0;
            
            return (
              <div key={submission.mcqId} className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-gray-700 text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-500">{sectionName}</span>
                  </div>
                  <div className="flex items-center">
                    {isCorrect ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">{grade?.obtainedMarks || 0} / {maxGrade}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600">
                        <XCircle className="h-5 w-5" />
                        <span className="font-medium">0 / {maxGrade}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="font-medium text-gray-900 mb-2">
                    {question?.question || "Question not found"}
                  </div>
                  
                  {question?.type === "single-select" || question?.type === "multi-select" ? (
                    <div className="space-y-2 ml-4">
                      {question.options?.map(option => {
                        const isSelected = submission.selectedOptions.includes(option._id || "");
                        const isCorrectOption = option.isCorrect;
                        
                        let optionClass = "flex items-center p-2 rounded-md ";
                        
                        if (isSelected && isCorrectOption) {
                          optionClass += "bg-green-50 border border-green-200";
                        } else if (isSelected && !isCorrectOption) {
                          optionClass += "bg-red-50 border border-red-200";
                        } else if (!isSelected && isCorrectOption) {
                          optionClass += "bg-blue-50 border border-blue-200";
                        } else {
                          optionClass += "bg-gray-50 border border-gray-200";
                        }
                        
                        return (
                          <div key={option._id} className={optionClass}>
                            <div className="flex-1">{option.option}</div>
                            {isSelected && (
                              <div className="ml-2">
                                {isCorrectOption ? (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-600" />
                                )}
                              </div>
                            )}
                            {!isSelected && isCorrectOption && (
                              <div className="ml-2">
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : question?.type === "true-false" ? (
                    <div className="space-y-2 ml-4">
                      {question.options?.map(option => {
                        const isSelected = submission.selectedOptions.includes(option._id || "");
                        const isCorrectOption = option.isCorrect;
                        
                        let optionClass = "flex items-center p-2 rounded-md ";
                        
                        if (isSelected && isCorrectOption) {
                          optionClass += "bg-green-50 border border-green-200";
                        } else if (isSelected && !isCorrectOption) {
                          optionClass += "bg-red-50 border border-red-200";
                        } else if (!isSelected && isCorrectOption) {
                          optionClass += "bg-blue-50 border border-blue-200";
                        } else {
                          optionClass += "bg-gray-50 border border-gray-200";
                        }
                        
                        return (
                          <div key={option._id} className={optionClass}>
                            <div className="flex-1">{option.option}</div>
                            {isSelected && (
                              <div className="ml-2">
                                {isCorrectOption ? (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-600" />
                                )}
                              </div>
                            )}
                            {!isSelected && isCorrectOption && (
                              <div className="ml-2">
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic ml-4">
                      {question?.type} question type - User's answer is available but not shown in detail
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {/* If no submissions */}
          {(!mcqSubmissions || mcqSubmissions.length === 0) && (
            <div className="p-6 text-center text-gray-500">
              No question submissions found
            </div>
          )}
        </div>
      </div>
      
      {/* Offenses Summary (if applicable) */}
      {offenses && (Object.values(offenses).some(val => val && val > 0)) && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Security Violations</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offenses.tabChange && offenses.tabChange > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="font-medium text-amber-800">Tab Changes Detected</div>
                  <div className="text-2xl font-bold text-amber-900 mt-1">{offenses.tabChange}</div>
                  <div className="text-sm text-amber-700 mt-1">
                    Number of times the candidate switched tabs during the assessment
                  </div>
                </div>
              )}
              
              {offenses.copyPaste && offenses.copyPaste > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="font-medium text-amber-800">Copy/Paste Detected</div>
                  <div className="text-2xl font-bold text-amber-900 mt-1">{offenses.copyPaste}</div>
                  <div className="text-sm text-amber-700 mt-1">
                    Number of copy/paste actions detected during the assessment
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentResults;