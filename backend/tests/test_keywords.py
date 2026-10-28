from keyword_engine.extractor import DOMAINS, get_detected_and_missing_keywords


def test_no_skills_returns_no_detected_keywords():
    # Used to pad with sample keywords like "React" and "Python".
    result = get_detected_and_missing_keywords(set())
    assert result["detected"] == []
    assert result["missing"]


def test_full_domain_coverage_reports_nothing_missing():
    # Used to claim Docker, AWS, etc. were missing even when listed.
    result = get_detected_and_missing_keywords(set(DOMAINS["DevOps"]), "DevOps")
    assert result["missing"] == []
    assert "DOCKER" not in result["missing"]


def test_detected_and_missing_do_not_overlap():
    skills = {"react", "typescript", "docker"}
    result = get_detected_and_missing_keywords(skills, "Frontend")
    assert {"React", "Typescript"} <= set(result["detected"])
    assert not set(result["detected"]) & set(result["missing"])
