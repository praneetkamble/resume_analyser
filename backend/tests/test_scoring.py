from ats_engine.scoring import analyze_formatting, evaluate_ats_scores


def _parsed(words: int, **overrides):
    data = {
        "email": "dev@example.com",
        "phone": "+91 98765 43210",
        "links": ["https://github.com/example"],
        "experience": "Software Engineer at Acme",
        "education": "B.E. Computer Engineering",
        "skills": "Python, React",
        "projects": "ResumeIQ",
        "raw_text": " ".join(["word"] * words),
    }
    data.update(overrides)
    return data


def test_optimal_length_is_a_strength():
    score, strengths, weaknesses = analyze_formatting(_parsed(500))
    assert any("Optimal word count" in s for s in strengths)
    assert not any("verbose" in w or "brief" in w for w in weaknesses)


def test_short_resume_is_not_called_verbose():
    # 200-299 words used to fall through to the "over 1000 words" branch.
    _, _, weaknesses = analyze_formatting(_parsed(250))
    assert not any("verbose" in w for w in weaknesses)
    assert any("a little short" in w for w in weaknesses)


def test_very_short_and_very_long_resumes():
    _, _, short_weak = analyze_formatting(_parsed(100))
    _, _, long_weak = analyze_formatting(_parsed(1500))
    assert any("too brief" in w for w in short_weak)
    assert any("verbose" in w for w in long_weak)


def test_missing_sections_and_contact_lower_the_score():
    full, _, _ = analyze_formatting(_parsed(500))
    sparse, _, weaknesses = analyze_formatting(
        _parsed(500, phone="Not Found", projects="", links=[])
    )
    assert sparse < full
    assert any("Projects" in w for w in weaknesses)
    assert 30 <= sparse <= 100


def test_evaluate_ats_scores_shape_and_bounds():
    parsed = _parsed(500, skills_count=10, experience_count=2, projects_count=2,
                     certifications="AWS Cloud Practitioner", summary="Full-stack developer building React and Python apps.")
    keywords = {"detected": ["React", "Python"], "missing": ["Docker", "AWS"]}
    result = evaluate_ats_scores(parsed, keywords, {})
    for key in ("ats_score", "strength_score", "skills_score", "formatting_score", "keyword_score"):
        assert 0 <= result[key] <= 100
    assert [s["subject"] for s in result["section_breakdown"]] == [
        "Summary", "Skills", "Projects", "Experience", "Education"
    ]
    assert len(result["strengths"]) <= 4 and len(result["weaknesses"]) <= 4
