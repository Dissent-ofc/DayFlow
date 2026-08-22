const PROFILE_DATA = {
  "Product Designer": {
    skills: ["User research planning and participant interviewing", "Interaction design and information architecture", "Visual design systems and accessible interface patterns", "Usability testing and evidence-based iteration", "Cross-functional product discovery facilitation"],
    certifications: ["Professional User Experience Design Certificate", "Human-Centered Design Professional Certificate", "Accessibility for Digital Products Certificate"],
    resumeSummary: "Product designer focused on turning customer research into clear, accessible, and useful digital experiences.", interests: ["Inclusive design", "Design research", "Creative workshops"],
  },
  "Software Engineer": {
    skills: ["Object-oriented software architecture", "Application programming interface design", "Database modeling and query optimization", "Automated testing and quality engineering", "Code review and technical documentation"],
    certifications: ["Professional Software Engineering Certificate", "Secure Application Development Certificate", "Relational Database Design Certificate"],
    resumeSummary: "Software engineer who builds dependable services with thoughtful architecture, strong testing practices, and maintainable code.", interests: ["Open source software", "Systems design", "Technical learning"],
  },
  "Talent Partner": {
    skills: ["Strategic talent sourcing and workforce planning", "Structured interviewing and candidate assessment", "Employee engagement program development", "Recruitment process improvement and reporting", "Stakeholder communication and relationship management"],
    certifications: ["Professional Human Resources Management Certificate", "Strategic Workforce Planning Certificate", "Behavioral Interviewing Professional Certificate"],
    resumeSummary: "Talent partner who connects people strategy with thoughtful hiring, candidate care, and long-term workforce development.", interests: ["Career coaching", "Workplace culture", "Community mentoring"],
  },
  "Quality Analyst Lead": {
    skills: ["Quality assurance strategy and test planning", "Risk-based software testing", "Defect lifecycle management and root-cause analysis", "Test automation planning and maintenance", "Release readiness assessment"],
    certifications: ["Certified Software Testing Professional", "Quality Management Systems Certificate", "Advanced Test Automation Certificate"],
    resumeSummary: "Quality leader who creates practical testing strategies that protect customer trust and improve release confidence.", interests: ["Quality improvement", "Process design", "Technology education"],
  },
  "DevOps Engineer": {
    skills: ["Continuous integration and continuous delivery pipelines", "Cloud infrastructure automation", "Container orchestration and service reliability", "Infrastructure monitoring and incident response", "Security controls for deployment workflows"],
    certifications: ["Professional Cloud Infrastructure Certificate", "Site Reliability Engineering Certificate", "Secure Deployment Operations Certificate"],
    resumeSummary: "Infrastructure specialist focused on reliable delivery systems, resilient platforms, and calm incident response.", interests: ["Infrastructure automation", "Reliability research", "Outdoor exploration"],
  },
  "Product Manager": {
    skills: ["Product strategy and roadmap development", "Customer discovery and market research", "Outcome-based prioritization and planning", "Product analytics and experiment design", "Executive communication and stakeholder alignment"],
    certifications: ["Professional Product Management Certificate", "Digital Product Strategy Certificate", "Customer Discovery Research Certificate"],
    resumeSummary: "Product manager who turns customer insight and measurable outcomes into focused roadmaps and useful products.", interests: ["Customer discovery", "Product strategy", "Learning communities"],
  },
  "Backend Engineer": {
    skills: ["Scalable service and data architecture", "Application programming interface development", "Transaction processing and data consistency", "Performance profiling and capacity planning", "Secure authentication and authorization design"],
    certifications: ["Professional Backend Engineering Certificate", "Distributed Systems Design Certificate", "Secure Web Services Certificate"],
    resumeSummary: "Backend engineer specializing in secure services, data consistency, and systems that remain dependable as they grow.", interests: ["Distributed systems", "Database technology", "Technical writing"],
  },
  "Frontend Engineer": {
    skills: ["Responsive interface engineering", "Component architecture and design systems", "Web performance optimization", "Semantic markup and accessibility engineering", "Browser compatibility and interface testing"],
    certifications: ["Professional Frontend Engineering Certificate", "Accessible Web Development Certificate", "Responsive Interface Architecture Certificate"],
    resumeSummary: "Frontend engineer creating fast, inclusive interfaces with strong component architecture and careful attention to detail.", interests: ["Interface craft", "Accessibility", "Creative coding"],
  },
  "Operations Specialist": {
    skills: ["Business process mapping and improvement", "Operational reporting and performance analysis", "Vendor coordination and service management", "Risk controls and compliance documentation", "Cross-team workflow coordination"],
    certifications: ["Professional Operations Management Certificate", "Business Process Improvement Certificate", "Service Management Professional Certificate"],
    resumeSummary: "Operations specialist who makes complex workflows easier to understand, measure, and improve across teams.", interests: ["Process improvement", "Team coordination", "Community service"],
  },
  "HR Officer": {
    skills: ["Employee relations and workplace policy administration", "Human resources operations and record management", "Compensation and benefits coordination", "Learning and development program administration", "Workforce reporting and confidential case handling"],
    certifications: ["Professional Human Resources Management Certificate", "Compensation and Benefits Administration Certificate", "Workplace Relations Professional Certificate"],
    resumeSummary: "Human resources officer committed to fair employee support, accurate records, and thoughtful workplace programs.", interests: ["Employee wellbeing", "Workplace learning", "People analytics"],
  },
  "People Operations Lead": {
    skills: ["People strategy and organizational planning", "Workforce analytics and talent development", "Compensation framework governance", "Employee relations and policy leadership", "Human resources program transformation"],
    certifications: ["Senior Human Resources Leadership Certificate", "Strategic People Operations Certificate", "Compensation Program Governance Certificate"],
    resumeSummary: "People operations leader who builds clear, fair, and human systems for employee growth and organizational health.", interests: ["Organizational development", "Leadership coaching", "Workplace equity"],
  },
};

export function profileForEmployee({ jobTitle, role }) {
  return PROFILE_DATA[jobTitle] ?? (role === "HR" ? PROFILE_DATA["HR Officer"] : PROFILE_DATA["Operations Specialist"]);
}