import { useState } from 'react'

function CareerRecommendation() {
  const [formData, setFormData] = useState({
    education: '',
    skills: '',
    interests: '',
    goal: '',
  })

  const [result, setResult] = useState(null)
  const [skillGap, setSkillGap] = useState(null)
  const [roadmap, setRoadmap] = useState(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setResult(null)
    setSkillGap(null)
    setRoadmap(null)
    setError('')

    if (
      !formData.education ||
      !formData.skills ||
      !formData.interests ||
      !formData.goal
    ) {
      setError('Please fill in all the fields.')
      return
    }

    try {
      setLoading(true)

      // =================================================
      // 1. CAREER RECOMMENDATION
      // =================================================

      const careerResponse = await fetch(
  'https://ai-career-platform-backend-c2nt.onrender.com/api/career-recommendation',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      )

      if (!careerResponse.ok) {
        throw new Error('Career recommendation failed')
      }

      const careerData = await careerResponse.json()

      setResult(careerData)


      // =================================================
      // 2. SKILL GAP ANALYSIS
      // =================================================

      const skillGapResponse = await fetch(
        'http://127.0.0.1:8000/api/skill-gap',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            career: careerData.career,
            skills: formData.skills,
          }),
        }
      )

      if (!skillGapResponse.ok) {
        throw new Error('Skill gap analysis failed')
      }

      const skillGapData = await skillGapResponse.json()

      setSkillGap(skillGapData)


      // =================================================
      // 3. LEARNING ROADMAP
      // =================================================

      const roadmapResponse = await fetch(
        'http://127.0.0.1:8000/api/learning-roadmap',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            career: careerData.career,
          }),
        }
      )

      if (!roadmapResponse.ok) {
        throw new Error('Learning roadmap failed')
      }

      const roadmapData = await roadmapResponse.json()

      setRoadmap(roadmapData)

    } catch (error) {
      console.error(error)

      setError(
        'Unable to connect to the backend. Please make sure FastAPI is running.'
      )
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="career-page">

      <div className="career-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="career-header">

          <p>🎯 AI Career Guidance</p>

          <h1>Find Your Ideal Career</h1>

          <span>
            Tell us about yourself and discover career paths
            that match your interests and skills.
          </span>

        </div>


        {/* =================================================
            FORM
        ================================================= */}

        <form
          className="career-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label>Education</label>

            <select
              name="education"
              value={formData.education}
              onChange={handleChange}
            >

              <option value="">
                Select your education
              </option>

              <option value="B.Tech">
                B.Tech
              </option>

              <option value="B.Sc">
                B.Sc
              </option>

              <option value="BCA">
                BCA
              </option>

              <option value="MCA">
                MCA
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>


          <div className="form-group">

            <label>Skills</label>

            <input
              type="text"
              name="skills"
              placeholder="Example: Python, SQL, Machine Learning"
              value={formData.skills}
              onChange={handleChange}
            />

          </div>


          <div className="form-group">

            <label>Interests</label>

            <input
              type="text"
              name="interests"
              placeholder="Example: AI, Data Science"
              value={formData.interests}
              onChange={handleChange}
            />

          </div>


          <div className="form-group">

            <label>Career Goal</label>

            <select
              name="goal"
              value={formData.goal}
              onChange={handleChange}
            >

              <option value="">
                Select your career goal
              </option>

              <option value="AI Engineer">
                AI Engineer
              </option>

              <option value="Data Scientist">
                Data Scientist
              </option>

              <option value="Data Analyst">
                Data Analyst
              </option>

              <option value="Full Stack Developer">
                Full Stack Developer
              </option>

              <option value="Software Engineer">
                Software Engineer
              </option>

              <option value="Not Sure">
                Not Sure
              </option>

            </select>

          </div>


          {/* ERROR */}

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}


          {/* BUTTON */}

          <button
            type="submit"
            className="recommend-btn"
            disabled={loading}
          >

            {loading
              ? 'Analyzing Your Profile...'
              : 'Get Career Recommendation →'}

          </button>

        </form>


        {/* =================================================
            CAREER RESULT
        ================================================= */}

        {result && (

          <div className="recommendation-result">

            <div className="result-header">

              <span className="result-icon">
                🎯
              </span>

              <div>

                <h2>
                  {result.career}
                </h2>

                <p>
                  {result.message}
                </p>

              </div>

            </div>


            {/* =================================================
                REQUIRED SKILLS
            ================================================= */}

            <div className="result-section">

              <h3>
                📚 Skills Required
              </h3>

              <div className="skills-list">

                {result.required_skills.map(
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


            {/* =================================================
                SKILL GAP
            ================================================= */}

            {skillGap && (

              <div className="skill-gap-section">

                <h3>
                  📊 Career Match Score
                </h3>


                <div className="score-card">

                  <div className="score-number">
                    {skillGap.score}%
                  </div>

                  <div className="score-text">

                    You currently match{' '}

                    <strong>
                      {skillGap.score}%
                    </strong>{' '}

                    of the required skills for{' '}

                    <strong>
                      {skillGap.career}
                    </strong>.

                  </div>

                </div>


                {/* MATCHED */}

                <div className="gap-group">

                  <h3>
                    🟢 Your Matching Skills
                  </h3>

                  <div className="skills-list">

                    {skillGap.matched_skills.length > 0 ? (

                      skillGap.matched_skills.map(
                        (skill, index) => (

                          <span
                            className="matched-skill"
                            key={index}
                          >
                            ✓ {skill}
                          </span>

                        )
                      )

                    ) : (

                      <p>
                        No matching skills found yet.
                      </p>

                    )}

                  </div>

                </div>


                {/* MISSING */}

                <div className="gap-group">

                  <h3>
                    🔴 Skills You Need to Learn
                  </h3>

                  <div className="skills-list">

                    {skillGap.missing_skills.length > 0 ? (

                      skillGap.missing_skills.map(
                        (skill, index) => (

                          <span
                            className="missing-skill"
                            key={index}
                          >
                            + {skill}
                          </span>

                        )
                      )

                    ) : (

                      <p>
                        🎉 You already have all the required skills!
                      </p>

                    )}

                  </div>

                </div>

              </div>

            )}


            {/* =================================================
                LEARNING ROADMAP
            ================================================= */}

            {roadmap && roadmap.roadmap.length > 0 && (

              <div className="roadmap-section">

                <div className="roadmap-header">

                  <span className="roadmap-icon">
                    🗺️
                  </span>

                  <div>

                    <h2>
                      Your Learning Roadmap
                    </h2>

                    <p>
                      Follow these steps to become a{' '}
                      <strong>
                        {roadmap.career}
                      </strong>
                      .
                    </p>

                  </div>

                </div>


                <div className="roadmap-list">

                  {roadmap.roadmap.map(
                    (item, index) => (

                      <div
                        className="roadmap-item"
                        key={item.step}
                      >

                        <div className="roadmap-number">
                          {item.step}
                        </div>

                        <div className="roadmap-content">

                          <h3>
                            {item.title}
                          </h3>

                          <p>
                            {item.description}
                          </p>

                        </div>

                        {index !== roadmap.roadmap.length - 1 && (

                          <div className="roadmap-line"></div>

                        )}

                      </div>

                    )
                  )}

                </div>

              </div>

            )}


            {/* =================================================
                PROFILE
            ================================================= */}

            <div className="profile-summary">

              <h3>
                👤 Your Profile
              </h3>

              <p>
                <strong>Education:</strong>{' '}
                {result.education}
              </p>

              <p>
                <strong>Skills:</strong>{' '}
                {result.skills}
              </p>

              <p>
                <strong>Interests:</strong>{' '}
                {result.interests}
              </p>

              <p>
                <strong>Career Goal:</strong>{' '}
                {result.goal}
              </p>

            </div>

          </div>

        )}

      </div>

    </div>
  )
}

export default CareerRecommendation