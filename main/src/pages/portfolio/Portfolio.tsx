import { useEffect, useState } from 'react';
import {
  getAllProjectsWithRatings,
  getAllExperience,
  getAllCredentials,
  getAllSkillsGrouped,
  type ProjectWithRatings,
  type Experience,
  type Credential,
  type SkillCategoryWithSkills,
} from '../../lib/db';

const Portfolio = () => {
  const [projects, setProjects] = useState<ProjectWithRatings[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [skills, setSkills] = useState<SkillCategoryWithSkills[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [projectsData, experienceData, credentialsData, skillsData] =
          await Promise.all([
            getAllProjectsWithRatings(),
            getAllExperience(),
            getAllCredentials(),
            getAllSkillsGrouped(),
          ]);

        setProjects(projectsData);
        setExperience(experienceData);
        setCredentials(credentialsData);
        setSkills(skillsData);
      } catch (err) {
        console.error('Error loading portfolio data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading portfolio...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Portfolio</h1>
          <p className="text-xl opacity-90">
            Showcasing my projects, experience, and skills
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16" id="projects">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
            Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {project.imageUrl && (
                  <div className="h-48 bg-gray-200 dark:bg-gray-700">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  {project.avgRating !== undefined && project.avgRating > 0 && (
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-yellow-500">★</span>
                      <span>
                        {project.avgRating.toFixed(1)} ({project.ratingCount}{' '}
                        {project.ratingCount === 1 ? 'rating' : 'ratings'})
                      </span>
                    </div>
                  )}
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 text-gray-500 text-xs">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="flex gap-4">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        GitHub →
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Live Demo →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 bg-white dark:bg-gray-800" id="experience">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
            Experience
          </h2>
          <div className="space-y-8">
            {experience.map((exp) => (
              <div
                key={exp.id}
                className="border-l-4 border-blue-600 pl-6 pb-8"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {exp.position}
                    </h3>
                    <p className="text-lg text-blue-600">{exp.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 dark:text-gray-400">
                      {exp.startDate} -{' '}
                      {exp.current ? 'Present' : exp.endDate}
                    </p>
                    {exp.location && (
                      <p className="text-gray-500 text-sm">{exp.location}</p>
                    )}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {exp.description}
                  </p>
                )}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Responsibilities:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      {exp.responsibilities.map((resp, index) => (
                        <li key={index}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16" id="skills">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
            Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((category) => (
              <div
                key={category.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
              >
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.skills.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {skill.name}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {skill.level}
                        </span>
                      </div>
                      {skill.yearsOfExperience && (
                        <p className="text-xs text-gray-500">
                          {skill.yearsOfExperience} years
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials Section */}
      <section className="py-16 bg-white dark:bg-gray-800" id="credentials">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
            Certifications & Education
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {credentials.map((cred) => (
              <div
                key={cred.id}
                className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {cred.name}
                </h3>
                <p className="text-blue-600 font-medium mb-2">{cred.issuer}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  Issued: {cred.issueDate}
                  {cred.expiryDate && ` • Expires: ${cred.expiryDate}`}
                </p>
                {cred.description && (
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {cred.description}
                  </p>
                )}
                {cred.credentialUrl && (
                  <a
                    href={cred.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Credential →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
