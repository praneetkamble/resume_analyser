from parser.resume_parser import segment_resume


def test_bullet_ending_in_section_word_stays_in_its_section():
    # Short lines ending in "skills"/"projects" used to be read as headings,
    # which dropped them and moved the following text into the wrong section.
    text = "\n".join([
        "Jane Doe",
        "EXPERIENCE",
        "Support Engineer, Acme 2022 - Present",
        "Improved team communication skills",
        "Mentored juniors on key projects",
        "EDUCATION",
        "B.E. Computer Engineering",
    ])
    sections = segment_resume(text)
    assert "Improved team communication skills" in sections["experience"]
    assert "Mentored juniors on key projects" in sections["experience"]
    assert sections["skills"] == ""
    assert sections["projects"] == ""
    assert sections["education"] == "B.E. Computer Engineering"


def test_styled_headings_with_extra_words_are_still_detected():
    text = "\n".join([
        "Technical Skills & Tools",
        "Python, React",
        "KEY PROJECTS",
        "ResumeIQ - ATS analyser",
        "Work Experience:",
        "Intern at Acme",
    ])
    sections = segment_resume(text)
    assert sections["skills"] == "Python, React"
    assert sections["projects"] == "ResumeIQ - ATS analyser"
    assert sections["experience"] == "Intern at Acme"
