import { useState } from "react";
import "./App.css";

const BACKEND_URL = "https://ai-career-platform-backend-c2nt.onrender.com";

const careers = [
  "AI Engineer",
  "Data Scientist",
  "Data Analyst",
  "Full Stack Developer",
  "Software Engineer",
];

// =====================================================
// HOME
// =====================================================

function Home({ setPage }) {
  const features = [
    {
      id: "career",
      icon: "🎯",
      title: "Career Recommendation",
      text: "Discover the right career path based on your education, skills and interests.",
    },
    {
      id: "resume",
      icon: "📄",
      title: "Resume Analysis",
      text: "Upload your resume and get AI-powered feedback, skills and career suggestions.",
    },
    {
      id: "skills",
      icon: "📊",
      title: "AI Skill Analysis",
      text: "Find your current skill level and discover the skills you need to learn.",
    },
    {
      id: "roadmap",
      icon: "🗺️",
      title: "Learning Roadmap",
      text: "Get a step-by-step learning roadmap for your target career.",
    },
    {
      id: "interview",
      icon: "🎤",
      title: "Interview Preparation",
      text: "Practice technical and HR interview questions with answers.",
    },
  ];

  return (
    <div className="home-page">

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            🤖 AI Powered Career Guidance
          </div>

          <h1>
            Build Your
            <span> AI Career </span>
            With Confidence
          </h1>

          <p>
            Explore careers, analyze your resume, identify skill gaps,
            create a learning roadmap and prepare for interviews —
            all in one platform.
          </p>

          <button
            className="hero-btn"
            onClick={() => setPage("career")}
          >
            🚀 Get Started
          </button>
        </div>

        <div className="hero-visual">
          <div className="ai-circle">
            🤖
          </div>

          <div className="floating-card card-one">
            🎯 Career
          </div>

          <div className="floating-card card-two">
            📊 Skills
          </div>

          <div className="floating-card card-three">
            🎤 Interview
          </div>
        </div>
      </section>

      <section className="features-section">

        <div className="section-heading">
          <span>✨ FEATURES</span>
          <h2>Everything You Need For Your Career</h2>
          <p>
            Choose a feature below and start building your career path.
          </p>
        </div>

        <div className="feature-grid">

          {features.map((feature) => (
            <div
              className="home-feature-card"
              key={feature.id}
              onClick={() => setPage(feature.id)}
            >
              <div className="home-feature-icon">
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.text}</p>

              <button>
                Explore →
              </button>
            </div>
          ))}

        </div>
      </section>

    </div>
  );
}

// =====================================================
// CAREER RECOMMENDATION
// =====================================================

function CareerRecommendation() {

  const [education, setEducation] = useState("B.Tech");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [goal, setGoal] = useState("AI Engineer");

  const [careerResult, setCareerResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCareerRecommendation = async (e) => {

    e.preventDefault();

    setLoading(true);
    setCareerResult(null);

    const skillsArray = skills
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const interestsArray = interests
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {

      const response = await fetch(
        `${BACKEND_URL}/api/career-recommendation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            education,
            skills: skillsArray,
            interests: interestsArray,
            goal,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail
            ? JSON.stringify(data.detail)
            : "Career recommendation failed"
        );
      }

      setCareerResult(data);

    } catch (error) {

      alert(error.message);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="feature-page">

      {/* HEADER */}
      <div className="feature-header">

        <div className="feature-icon">🎯</div>

        <h1>Career Recommendation</h1>

        <p>
          Tell us about yourself and AI will recommend
          a suitable career path for you.
        </p>

      </div>


      {/* FORM */}
      <form
        className="career-form"
        onSubmit={getCareerRecommendation}
      >

        {/* EDUCATION */}
        <div className="form-group">

          <label>Education</label>

          <input
            value={education}
            onChange={(e) =>
              setEducation(e.target.value)
            }
            placeholder="Example: B.Tech"
          />

        </div>


        {/* SKILLS */}
        <div className="form-group">

          <label>Your Skills</label>

          <input
            value={skills}
            onChange={(e) =>
              setSkills(e.target.value)
            }
            placeholder="Python, SQL, Machine Learning"
          />

          <small className="input-help">
            Enter skills separated by commas.
          </small>

        </div>


        {/* INTERESTS */}
        <div className="form-group">

          <label>Your Interests</label>

          <input
            value={interests}
            onChange={(e) =>
              setInterests(e.target.value)
            }
            placeholder="AI, Data Science, Technology"
          />

          <small className="input-help">
            Enter interests separated by commas.
          </small>

        </div>


        {/* CAREER GOAL */}
        <div className="form-group">

          <label>Career Goal</label>

          <select
            value={goal}
            onChange={(e) =>
              setGoal(e.target.value)
            }
          >

            {careers.map((career) => (

              <option key={career}>
                {career}
              </option>

            ))}

          </select>

        </div>


        {/* BUTTON */}
        <button
          className="primary-btn"
          type="submit"
          disabled={loading}
        >

          {loading
            ? "Analyzing..."
            : "✨ Get Career Recommendation"}

        </button>

      </form>


      {/* RESULT */}
      {careerResult && (

        <div className="career-result">

          {/* MAIN RECOMMENDATION */}
          {careerResult.recommendations?.length > 0 && (

            <div className="result-card career-main">

              <div className="big-result-icon">
                🤖
              </div>

              <h2>
                {careerResult.recommendations[0].career}
              </h2>

              <p>
                {careerResult.recommendations[0].reason}
              </p>

            </div>

          )}


          {/* ALL RECOMMENDATIONS */}
          {careerResult.recommendations?.length > 0 && (

            <div className="result-card">

              <h2>🎯 Recommended Career Paths</h2>

              <div className="career-list">

                {careerResult.recommendations.map(
                  (item, index) => (

                    <div
                      className="career-item"
                      key={index}
                    >

                      <span>💼</span>

                      <div>

                        <strong>
                          {item.career}
                        </strong>

                        <p>
                          {item.reason}
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          )}


          {/* PROFILE */}
          <div className="result-card">

            <h2>👤 Your Profile</h2>

            <p>
              <strong>Education:</strong>{" "}
              {careerResult.education || education}
            </p>

            <p>
              <strong>Skills:</strong>{" "}
              {skills || "Not provided"}
            </p>

            <p>
              <strong>Interests:</strong>{" "}
              {interests || "Not provided"}
            </p>

            <p>
              <strong>Career Goal:</strong>{" "}
              {careerResult.goal || goal}
            </p>

          </div>

        </div>

      )}

    </div>
  );
}
 
// =====================================================
// RESUME ANALYSIS
// =====================================================

function ResumeAnalysis() {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeResult, setResumeResult] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeError, setResumeError] = useState("");

  const analyzeResume = async () => {
    if (!resumeFile) {
      setResumeError("Please select a PDF resume first.");
      return;
    }

    if (!resumeFile.name.toLowerCase().endsWith(".pdf")) {
      setResumeError("Please upload a PDF file only.");
      return;
    }

    setResumeLoading(true);
    setResumeError("");
    setResumeResult(null);

    try {
      const formData = new FormData();
      formData.append("file", resumeFile);

      const response = await fetch(
        `${BACKEND_URL}/api/resume-analysis`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          data.message ||
          "Resume analysis failed"
        );
      }

      setResumeResult(data);

    } catch (error) {
      setResumeError(error.message);
    } finally {
      setResumeLoading(false);
    }
  };

  return (
    <div className="feature-page">

      <div className="feature-header">

        <div className="feature-icon">📄</div>

        <h1>Resume Analysis</h1>

        <p>
          Upload your resume and let AI analyze your
          skills, education, experience and projects.
        </p>

      </div>

      {/* UPLOAD CARD */}

      <div className="upload-card">

        <div className="upload-icon">
          📁
        </div>

        <h2>Upload Your Resume</h2>

        <p>
          Upload your resume in PDF format
        </p>

        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => {
            setResumeFile(e.target.files[0]);
            setResumeResult(null);
            setResumeError("");
          }}
        />

        {resumeFile && (
          <div className="selected-file">
            📄 {resumeFile.name}
          </div>
        )}

        {resumeError && (
          <div className="error-message">
            {resumeError}
          </div>
        )}

        <button
          className="primary-btn"
          onClick={analyzeResume}
          disabled={resumeLoading}
        >
          {resumeLoading
            ? "Analyzing Resume..."
            : "Analyze Resume"}
        </button>

      </div>

      {/* RESULTS */}

      {resumeResult && resumeResult.analysis && (

        <div className="resume-results">

          {/* SUCCESS */}

          <div className="analysis-success">
            ✅ {resumeResult.message}
          </div>

          {/* FILE INFO */}

          <div className="result-card">

            <h2>📄 Resume Information</h2>

            <p>
              <strong>File:</strong>{" "}
              {resumeResult.filename}
            </p>

            <p>
              <strong>File Size:</strong>{" "}
              {Math.round(resumeResult.file_size / 1024)} KB
            </p>

          </div>

          {/* SKILLS */}

          <div className="result-card">

            <h2>🛠️ Detected Skills</h2>

            <div className="skills-list">

              {resumeResult.analysis.skills &&
              resumeResult.analysis.skills.length > 0 ? (

                resumeResult.analysis.skills.map(
                  (skill, index) => (

                    <span
                      className="skill-badge"
                      key={index}
                    >
                      {skill}
                    </span>

                  )
                )

              ) : (

                <p>No skills detected.</p>

              )}

            </div>

          </div>

          {/* EDUCATION */}

          <div className="result-card">

            <h2>🎓 Education</h2>

            {resumeResult.analysis.education &&
            resumeResult.analysis.education.length > 0 ? (

              <ul className="result-list">

                {resumeResult.analysis.education.map(
                  (item, index) => (

                    <li key={index}>
                      {item}
                    </li>

                  )
                )}

              </ul>

            ) : (

              <p>No education details detected.</p>

            )}

          </div>

          {/* EXPERIENCE */}

          <div className="result-card">

            <h2>💼 Experience</h2>

            {resumeResult.analysis.experience &&
            resumeResult.analysis.experience.length > 0 ? (

              <ul className="result-list">

                {resumeResult.analysis.experience.map(
                  (item, index) => (

                    <li key={index}>
                      {item}
                    </li>

                  )
                )}

              </ul>

            ) : (

              <p>No experience details detected.</p>

            )}

          </div>

          {/* PROJECTS */}

          <div className="result-card">

            <h2>🚀 Projects</h2>

            {resumeResult.analysis.projects &&
            resumeResult.analysis.projects.length > 0 ? (

              <ul className="result-list">

                {resumeResult.analysis.projects.map(
                  (item, index) => (

                    <li key={index}>
                      {item}
                    </li>

                  )
                )}

              </ul>

            ) : (

              <p>No projects detected.</p>

            )}

          </div>

          {/* SUGGESTIONS */}

          <div className="result-card">

            <h2>💡 Suggestions</h2>

            {resumeResult.analysis.suggestions &&
            resumeResult.analysis.suggestions.length > 0 ? (

              <ul className="result-list">

                {resumeResult.analysis.suggestions.map(
                  (item, index) => (

                    <li key={index}>
                      {item}
                    </li>

                  )
                )}

              </ul>

            ) : (

              <p>No suggestions available.</p>

            )}

          </div>

        </div>

      )}

    </div>
  );
}
// =====================================================
// SKILL ANALYSIS
// =====================================================

function SkillAnalysis() {

  const [skillCareer, setSkillCareer] =
    useState("AI Engineer");

  const [skillInput, setSkillInput] =
    useState("");

  const [skillResult, setSkillResult] =
    useState(null);

  const [skillLoading, setSkillLoading] =
    useState(false);

  const analyzeSkills = async () => {

    if (!skillInput.trim()) {

      alert("Please enter your skills.");

      return;

    }

    setSkillLoading(true);
    setSkillResult(null);

    const skillsArray = skillInput
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    try {

      const response = await fetch(
        `${BACKEND_URL}/api/skill-gap`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            career: skillCareer,
            skills: skillsArray,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.detail
            ? JSON.stringify(data.detail)
            : "Skill analysis failed"
        );

      }

      setSkillResult(data);

    } catch (error) {

      alert(error.message);

    } finally {

      setSkillLoading(false);

    }
  };

  return (
    <div className="feature-page">

      <div className="feature-header">

        <div className="feature-icon">
          📊
        </div>

        <h1>AI Skill Analysis</h1>

        <p>
          Discover your current skills and identify
          the skills you need to learn for your career.
        </p>

      </div>

      <div className="upload-card">

        <div className="form-group">

          <label>Target Career</label>

          <select
            value={skillCareer}
            onChange={(e) =>
              setSkillCareer(e.target.value)
            }
          >

            {careers.map((career) => (
              <option key={career}>
                {career}
              </option>
            ))}

          </select>

        </div>

        <div className="form-group">

          <label>Your Skills</label>

          <textarea
            value={skillInput}
            onChange={(e) =>
              setSkillInput(e.target.value)
            }
            placeholder="Python, Machine Learning, Generative AI, SQL"
            rows={4}
          />

          <small className="input-help">
            Enter skills separated by commas.
          </small>

        </div>

        <button
          className="primary-btn"
          onClick={analyzeSkills}
          disabled={skillLoading}
        >
          {skillLoading
            ? "Analyzing Skills..."
            : "Analyze My Skills"}
        </button>

      </div>

      {skillResult && (

        <div className="resume-results">

          <div className="resume-score-card">

            <div className="resume-score-circle">
              {skillResult.skill_gap_count}
            </div>

            <div>

              <h2>
                Skill Gap
              </h2>

              <p>
                {skillResult.skill_gap_count} skills
                are missing for{" "}
                <strong>
                  {skillResult.career}
                </strong>.
              </p>

            </div>

          </div>

          <div className="result-card">

            <h2>
              ✅ Your Current Skills
            </h2>

            <div className="skills-list">

              {skillResult.current_skills.map(
                (skill, index) => (

                  <span
                    className="skill-badge"
                    key={index}
                  >
                    {skill}
                  </span>

                )
              )}

            </div>

          </div>

          <div className="result-card">

            <h2>
              📚 Skills You Need To Learn
            </h2>

            <div className="skills-list">

              {skillResult.missing_skills.map(
                (skill, index) => (

                  <span
                    className="missing-skill"
                    key={index}
                  >
                    {skill}
                  </span>

                )
              )}

            </div>

          </div>

          <div className="result-card">

            <h2>
              🎯 Required Skills
            </h2>

            <div className="skills-list">

              {skillResult.required_skills.map(
                (skill, index) => (

                  <span
                    className="skill-badge"
                    key={index}
                  >
                    {skill}
                  </span>

                )
              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

// =====================================================
// LEARNING ROADMAP
// =====================================================

function LearningRoadmap() {

  const [career, setCareer] =
    useState("AI Engineer");

  const [skills, setSkills] =
    useState("");

  const [roadmap, setRoadmap] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const generateRoadmap = async () => {

    if (!skills.trim()) {

      alert("Please enter your current skills.");

      return;

    }

    setLoading(true);
    setRoadmap(null);

    const skillsArray = skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    try {

      const response = await fetch(
        `${BACKEND_URL}/api/learning-roadmap`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            career,
            skills: skillsArray,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.detail
            ? JSON.stringify(data.detail)
            : "Roadmap generation failed"
        );

      }

      setRoadmap(data.roadmap);

    } catch (error) {

      alert(error.message);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="feature-page">

      <div className="feature-header">

        <div className="feature-icon">
          🗺️
        </div>

        <h1>Learning Roadmap</h1>

        <p>
          Get a step-by-step roadmap to prepare yourself
          for your target career.
        </p>

      </div>

      <div className="upload-card">

        <div className="form-group">

          <label>Target Career</label>

          <select
            value={career}
            onChange={(e) =>
              setCareer(e.target.value)
            }
          >

            {careers.map((item) => (
              <option key={item}>
                {item}
              </option>
            ))}

          </select>

        </div>

        <div className="form-group">

          <label>Your Current Skills</label>

          <textarea
            value={skills}
            onChange={(e) =>
              setSkills(e.target.value)
            }
            placeholder="Python, Machine Learning, Generative AI, SQL"
            rows={4}
          />

          <small className="input-help">
            Enter your current skills separated by commas.
          </small>

        </div>

        <button
          className="primary-btn"
          onClick={generateRoadmap}
          disabled={loading}
        >
          {loading
            ? "Generating Roadmap..."
            : "🗺️ Generate Learning Roadmap"}
        </button>

      </div>

      {roadmap && (

        <div className="roadmap-container">

          {roadmap.map((item) => (

            <div
              className="roadmap-step"
              key={item.step}
            >

              <div className="roadmap-number">
                {item.step}
              </div>

              <div className="roadmap-content">

                <h2>
                  {item.title}
                </h2>

                <div className="roadmap-topics">

                  {item.topics.map(
                    (topic, index) => (

                      <span
                        className="skill-badge"
                        key={index}
                      >
                        {topic}
                      </span>

                    )
                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

// =====================================================
// INTERVIEW PREPARATION
// =====================================================

function InterviewPreparation() {

  const [career, setCareer] =
    useState("AI Engineer");

  const [skills, setSkills] =
    useState("");

  const [interviewResult, setInterviewResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [visibleAnswers, setVisibleAnswers] =
    useState({});

  const generateQuestions = async () => {

    if (!skills.trim()) {

      alert("Please enter your skills.");

      return;

    }

    setLoading(true);
    setInterviewResult(null);
    setVisibleAnswers({});

    const skillsArray = skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    try {

      const response = await fetch(
        `${BACKEND_URL}/api/interview-preparation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            career,
            skills: skillsArray,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.detail
            ? JSON.stringify(data.detail)
            : "Interview preparation failed"
        );

      }

      setInterviewResult(data);

    } catch (error) {

      alert(error.message);

    } finally {

      setLoading(false);

    }
  };

  const toggleAnswer = (type, index) => {

    const key = `${type}-${index}`;

    setVisibleAnswers((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));

  };

  const QuestionCard = ({
    item,
    index,
    type,
  }) => {

    const key = `${type}-${index}`;

    const visible = visibleAnswers[key];

    return (

      <div className="question-card">

        <div className="question-number">
          {index + 1}
        </div>

        <div className="question-content">

          <h3>
            {item.question}
          </h3>

          <button
            className="answer-btn"
            onClick={() =>
              toggleAnswer(type, index)
            }
          >
            {visible
              ? "Hide Answer"
              : "Show Answer"}
          </button>

          {visible && (

            <div className="answer-box">

              <strong>
                💡 Answer
              </strong>

              <p>
                {item.answer}
              </p>

            </div>

          )}

        </div>

      </div>

    );
  };

  return (
    <div className="feature-page">

      <div className="feature-header">

        <div className="feature-icon">
          🎤
        </div>

        <h1>Interview Preparation</h1>

        <p>
          Practice technical and HR questions for your
          target career and prepare with confidence.
        </p>

      </div>

      <div className="upload-card">

        <div className="form-group">

          <label>
            Select Target Career
          </label>

          <select
            value={career}
            onChange={(e) =>
              setCareer(e.target.value)
            }
          >

            {careers.map((item) => (
              <option key={item}>
                {item}
              </option>
            ))}

          </select>

        </div>

        <div className="form-group">

          <label>
            Your Skills
          </label>

          <textarea
            value={skills}
            onChange={(e) =>
              setSkills(e.target.value)
            }
            placeholder="Python, Machine Learning, Generative AI, SQL"
            rows={4}
          />

          <small className="input-help">
            Enter your skills separated by commas.
          </small>

        </div>

        <button
          className="primary-btn"
          onClick={generateQuestions}
          disabled={loading}
        >
          {loading
            ? "Generating Questions..."
            : "🎤 Generate Interview Questions"}
        </button>

      </div>

      {interviewResult && (

        <div className="interview-results">

          <div className="interview-title-card">

            <span>🎯</span>

            <div>

              <h2>
                Interview Questions for{" "}
                {interviewResult.career}
              </h2>

              <p>
                Total Questions:{" "}
                {interviewResult.total_questions}
              </p>

            </div>

          </div>

          <section className="question-section">

            <div className="question-section-header">

              <span>💻</span>

              <div>
                <h2>Technical Questions</h2>

                <p>
                  Technical questions for{" "}
                  {interviewResult.career}
                </p>
              </div>

            </div>

            {interviewResult.technical_questions.map(
              (item, index) => (

                <QuestionCard
                  key={index}
                  item={item}
                  index={index}
                  type="technical"
                />

              )
            )}

          </section>

          <section className="question-section">

            <div className="question-section-header">

              <span>👤</span>

              <div>
                <h2>HR Questions</h2>

                <p>
                  Common HR questions for your
                  interview preparation
                </p>
              </div>

            </div>

            {interviewResult.hr_questions.map(
              (item, index) => (

                <QuestionCard
                  key={index}
                  item={item}
                  index={index}
                  type="hr"
                />

              )
            )}

          </section>

        </div>

      )}

    </div>
  );
}

// =====================================================
// MAIN APP
// =====================================================

function App() {

  const [page, setPage] =
    useState("home");

  const navItems = [
    {
      id: "home",
      icon: "🏠",
      label: "Home",
    },
    {
      id: "career",
      icon: "🎯",
      label: "Career",
    },
    {
      id: "resume",
      icon: "📄",
      label: "Resume",
    },
    {
      id: "skills",
      icon: "📊",
      label: "Skills",
    },
    {
      id: "roadmap",
      icon: "🗺️",
      label: "Roadmap",
    },
    {
      id: "interview",
      icon: "🎤",
      label: "Interview",
    },
  ];

  return (
    <div className="app">

      <header className="navbar">

        <div
          className="brand"
          onClick={() =>
            setPage("home")
          }
        >
          <span className="brand-icon">
            🤖
          </span>

          <span>
            AI Career Platform
          </span>
        </div>

        <nav>

          {navItems.map((item) => (

            <button
              key={item.id}
              className={
                page === item.id
                  ? "nav-active"
                  : ""
              }
              onClick={() =>
                setPage(item.id)
              }
            >
              <span>
                {item.icon}
              </span>

              {item.label}

            </button>

          ))}

        </nav>

      </header>

      <main>

        {page === "home" && (
          <Home setPage={setPage} />
        )}

        {page === "career" && (
          <CareerRecommendation />
        )}

        {page === "resume" && (
          <ResumeAnalysis />
        )}

        {page === "skills" && (
          <SkillAnalysis />
        )}

        {page === "roadmap" && (
          <LearningRoadmap />
        )}

        {page === "interview" && (
          <InterviewPreparation />
        )}

      </main>

      <footer>

        <p>
          🤖 AI Career Platform • Career guidance powered by AI
        </p>

      </footer>

    </div>
  );
}

export default App;