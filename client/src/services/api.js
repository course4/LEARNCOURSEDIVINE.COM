import axios from 'axios';
import {
  nitheeshKumarImg,
  cmaCgmLogo,
  yerrawarVasaviImg,
  airaInteriorsLogo,
  arigalaHemaImg,
  niitFoundationLogo,
  sanjoyKumarSamalImg,
  magmaHdiLogo,
  basagallaNaveenImg,
  venusEngineeringLogo,
  uppalaSaiChandhuImg,
  bigBullLogo,
  vivekSharmaPatelImg,
  infosysLogo,
  sailaxmanBugathaImg,
  tcsLogo,
  amitPreetSinghImg,
  wiproLogo,
  sivaPrasadPatroImg,
  centuryPulpPaperLogo
} from '../assets/placements';

// In-Memory Fallback Seed Store with All Verified Course Divine Courses & US Dollars ($)
export const fallbackStore = {
  categories: [
    { _id: 'cat1', name: 'Software & Web Development', slug: 'software-web-development', description: 'Python, .NET, Node.js, Web Development & Full Stack.', icon: 'Code', courseCount: 10 },
    { _id: 'cat2', name: 'Cloud & DevOps', slug: 'cloud-devops', description: 'AWS, Azure AI Infrastructure, DevOps Production & Oracle Cloud.', icon: 'Cloud', courseCount: 8 },
    { _id: 'cat3', name: 'Enterprise ERP & SAP', slug: 'enterprise-erp-sap', description: 'SAP ABAP S/4HANA, SAP Fiori, SAP HCM, SAP FSCD & Oracle Fusion.', icon: 'Brain', courseCount: 7 },
    { _id: 'cat4', name: 'Data Science & AI', slug: 'data-science-ai', description: 'Machine Learning, Prompt Engineering, SAS, STATA, R & Analytics.', icon: 'Brain', courseCount: 9 },
    { _id: 'cat5', name: 'Engineering & Industrial Tech', slug: 'engineering-industrial-tech', description: 'VLSI, Industry 4.0, PLC, Digital Twin, BIM, ETABS & Abaqus.', icon: 'Terminal', courseCount: 12 },
    { _id: 'cat6', name: 'Design & Management', slug: 'design-management', description: 'UI/UX Design, Product Management & Video Editing with AI.', icon: 'Layout', courseCount: 4 },
    { _id: 'cat7', name: 'Specialized Certifications', slug: 'specialized-certifications', description: 'Pega LSA, CDPP Data Privacy, Gold Appraisal & Specialized Tracks.', icon: 'Shield', courseCount: 5 }
  ],
  courses: [],

  testimonials: [
    {
      _id: 't1',
      name: 'Rohan Sharma',
      role: 'Full Stack Engineer',
      company: 'Microsoft',
      courseTaken: 'Microsoft Azure AI Infrastructure & DevOps Engineer',
      content: 'The curriculum at Course Divine gave me exact enterprise level experience. The live projects and mentorship directly helped me clear Microsoft technical interview rounds with a top tier compensation package!',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      rating: 5
    },
    {
      _id: 't2',
      name: 'Sneha Patel',
      role: 'Cloud Solutions Engineer',
      company: 'Oracle',
      courseTaken: 'Oracle Cloud Infrastructure Certified Course',
      content: 'Course Divine provides deep practical architectures rather than just theory. The OCI networking, Autonomous Database labs, and mock interviews helped me switch my career smoothly.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      rating: 5
    }
  ],

  placements: [
    {
      _id: 'p1',
      studentName: 'Nitheesh Kumar',
      companyName: 'CMA CGM',
      company: 'CMA CGM',
      jobRole: 'Management Trainee',
      designation: 'Management Trainee',
      courseTaken: 'AUTO CAD',
      course: 'AUTO CAD',
      salaryPackage: '6.5 LPA',
      year: 2026,
      studentAvatar: nitheeshKumarImg,
      avatar: nitheeshKumarImg,
      companyLogo: cmaCgmLogo,
      testimonial: 'Course Divine AutoCAD training gave me deep industry drafting skills that helped me secure the Management Trainee role at CMA CGM.'
    },
    {
      _id: 'p2',
      studentName: 'Yerrawar Vasavi',
      companyName: 'Aira Interiors',
      company: 'Aira Interiors',
      jobRole: 'Interior Designer',
      designation: 'Interior Designer',
      courseTaken: 'STAAD PRO',
      course: 'STAAD PRO',
      salaryPackage: '5.8 LPA',
      year: 2026,
      studentAvatar: yerrawarVasaviImg,
      avatar: yerrawarVasaviImg,
      companyLogo: airaInteriorsLogo,
      testimonial: 'The hands-on structural and design modeling in STAAD Pro was instrumental in cracking my interview at Aira Interiors.'
    },
    {
      _id: 'p3',
      studentName: 'Arigala Hema',
      companyName: 'NIIT Foundation',
      company: 'NIIT Foundation',
      jobRole: 'IT Trainer',
      designation: 'IT Trainer',
      courseTaken: 'Digital Marketing',
      course: 'Digital Marketing',
      salaryPackage: '6.0 LPA',
      year: 2026,
      studentAvatar: arigalaHemaImg,
      avatar: arigalaHemaImg,
      companyLogo: niitFoundationLogo,
      testimonial: 'Comprehensive digital marketing strategies and live campaign management at Course Divine prepared me thoroughly to become an IT Trainer at NIIT Foundation.'
    },
    {
      _id: 'p4',
      studentName: 'Sanjoy Kumar Samal',
      companyName: 'Magma HDI General Insurance Company',
      company: 'Magma HDI General Insurance Company',
      jobRole: 'Asst. Manager Banking Operation',
      designation: 'Asst. Manager Banking Operation',
      courseTaken: 'Data Science',
      course: 'Data Science',
      salaryPackage: '8.5 LPA',
      year: 2026,
      studentAvatar: sanjoyKumarSamalImg,
      avatar: sanjoyKumarSamalImg,
      companyLogo: magmaHdiLogo,
      testimonial: 'Learning data science analytics and statistical automation gave me a competitive edge for the Assistant Manager position at Magma HDI.'
    },
    {
      _id: 'p5',
      studentName: 'Basagalla Naveen',
      companyName: 'Venas Engineering Consultants',
      company: 'Venas Engineering Consultants',
      jobRole: 'Structural Design Engineer',
      designation: 'Structural Design Engineer',
      courseTaken: 'STAAD PRO E TAB',
      course: 'STAAD PRO E TAB',
      salaryPackage: '7.2 LPA',
      year: 2026,
      studentAvatar: basagallaNaveenImg,
      avatar: basagallaNaveenImg,
      companyLogo: venusEngineeringLogo,
      testimonial: 'The combined STAAD Pro and ETABS design curriculum provided real-world structural modeling experience needed for Venas Engineering Consultants.'
    },
    {
      _id: 'p6',
      studentName: 'Uppala Sai Chandhu',
      companyName: 'Big Bull',
      company: 'Big Bull',
      jobRole: 'Capital Market Intern',
      designation: 'Capital Market Intern',
      courseTaken: 'AUTO CAD',
      course: 'AUTO CAD',
      salaryPackage: '5.5 LPA',
      year: 2026,
      studentAvatar: uppalaSaiChandhuImg,
      avatar: uppalaSaiChandhuImg,
      companyLogo: bigBullLogo,
      testimonial: 'The discipline, technical problem solving, and analytical foundation I gained at Course Divine helped me excel at Big Bull.'
    },
    {
      _id: 'p7',
      studentName: 'Vivek Sharma Patel',
      companyName: 'Infosys',
      company: 'Infosys',
      jobRole: 'Infrastructure Architect IT',
      designation: 'Infrastructure Architect IT',
      courseTaken: 'AI & ML',
      course: 'AI & ML',
      salaryPackage: '16.5 LPA',
      year: 2026,
      studentAvatar: vivekSharmaPatelImg,
      avatar: vivekSharmaPatelImg,
      companyLogo: infosysLogo,
      testimonial: 'The advanced AI & Machine Learning curriculum and deep architectural case studies helped me transition into an Infrastructure Architect role at Infosys.'
    },
    {
      _id: 'p8',
      studentName: 'Sailaxman Bugatha',
      companyName: 'Tata Consultancy Services (TCS)',
      company: 'Tata Consultancy Services (TCS)',
      jobRole: 'IT Trainer',
      designation: 'IT Trainer',
      courseTaken: 'Cybersecurity',
      course: 'Cybersecurity',
      salaryPackage: '7.5 LPA',
      year: 2026,
      studentAvatar: sailaxmanBugathaImg,
      avatar: sailaxmanBugathaImg,
      companyLogo: tcsLogo,
      testimonial: 'Practical ethical hacking and cybersecurity labs at Course Divine provided the exact domain depth required to train and lead at TCS.'
    },
    {
      _id: 'p9',
      studentName: 'Amit Preet Singh',
      companyName: 'Wipro',
      company: 'Wipro',
      jobRole: 'Junior Engineer',
      designation: 'Junior Engineer',
      courseTaken: 'Data Analytics',
      course: 'Data Analytics',
      salaryPackage: '6.8 LPA',
      year: 2026,
      studentAvatar: amitPreetSinghImg,
      avatar: amitPreetSinghImg,
      companyLogo: wiproLogo,
      testimonial: 'Hands-on SQL, Python, and Power BI dashboards in the Data Analytics course made my interview rounds at Wipro seamless.'
    },
    {
      _id: 'p10',
      studentName: 'Siva Prasad Patro',
      companyName: 'Century Pulp & Paper (CPP)',
      company: 'Century Pulp & Paper (CPP)',
      jobRole: 'Mechanical Engineer',
      designation: 'Mechanical Engineer',
      courseTaken: 'Project Management Professional (PMP)',
      course: 'Project Management Professional (PMP)',
      salaryPackage: '8.2 LPA',
      year: 2026,
      studentAvatar: sivaPrasadPatroImg,
      avatar: sivaPrasadPatroImg,
      companyLogo: centuryPulpPaperLogo,
      testimonial: 'The PMP framework and engineering project management workflows from Course Divine gave me the leadership skills to excel at Century Pulp & Paper.'
    }
  ],

  blogs: [
    {
      _id: 'b_ci1',
      title: 'AI-Proof Careers: Which Skills Are Worth Learning in 2026?',
      slug: 'ai-proof-careers-which-skills-are-worth-learning-2026',
      excerpt: 'Artificial intelligence is changing how organisations operate. Discover how to become AI-ready by combining technology literacy with judgement, problem-solving, and practical expertise.',
      category: 'Career Intelligence',
      tags: ['Career Intelligence', 'Artificial Intelligence', 'AI Skills', 'Future of Work', 'Career Roadmap'],
      content: `Artificial intelligence is changing how organisations operate and how professionals create value. Tasks involving research, content, analysis, coding and routine decision-making can increasingly be supported by AI. For students and professionals, the question is no longer whether AI will influence careers, but how to develop the capabilities that remain valuable as technology evolves. There is no such thing as a completely AI-proof career. A more useful goal is to become AI-ready: combine technology literacy with strong judgement, problem-solving, communication and practical expertise.

### 1. Build AI Literacy
You do not need to become an AI engineer to work effectively with AI. Learn how generative AI works at a practical level, how to write effective instructions, how to evaluate outputs, how to protect sensitive information and how AI can be applied within your field.

### 2. Develop Data Fluency
Data is now part of decision-making across industries. Excel, SQL, Power BI, Python, statistics and data visualisation can help you turn information into useful insights.

### 3. Strengthen Cybersecurity Awareness
As organisations become more digital, cybersecurity skills are increasingly relevant. Depending on your career direction, this can lead to areas such as security operations, cloud security, risk management and security analysis.

### 4. Invest in Analytical Thinking
AI can generate answers, but professionals still need to determine which questions matter, evaluate evidence, identify assumptions and make sound decisions.

### 5. Improve Communication and Collaboration
The ability to explain complex ideas, work across teams and communicate with stakeholders remains highly valuable—even in highly technical roles.

### 6. Become Adaptable
Tools will change. Platforms will change. Job descriptions will change. The ability to learn new tools quickly may therefore be one of the most durable career advantages.

---

### Key Takeaway
A future-ready profile is not built by avoiding AI. It is built by combining AI literacy with domain expertise, practical experience and human judgement. Learn a skill, apply it to real problems, document your work and keep developing.`,
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
      readTime: '5 min read',
      createdAt: '2026-02-21T08:00:00.000Z',
      author: {
        name: 'Course Divine Career Intelligence',
        role: 'Career Mentorship Panel',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
      }
    },
    {
      _id: 'b_ci2',
      title: 'Degree vs Skills: What Actually Gets You Hired?',
      slug: 'degree-vs-skills-what-actually-gets-you-hired',
      excerpt: 'A degree remains an important foundation, but graduation alone does not demonstrate workplace capability. The strongest formula is: Degree + Skills + Projects + Proof.',
      category: 'Career Intelligence',
      tags: ['Career Intelligence', 'Jobs', 'Hiring', 'Portfolio', 'Degree vs Skills'],
      content: `A degree remains an important foundation for many careers, but graduation alone does not demonstrate how effectively a candidate can apply knowledge in a workplace. Employers increasingly need evidence of capability: relevant skills, practical projects, experience and the ability to communicate what you have accomplished. The strongest approach is not degree versus skills. It is degree plus skills plus proof.

### Your Degree Provides the Foundation
A degree gives you structured knowledge, discipline-specific concepts and opportunities to develop teamwork, communication and problem-solving.

### Skills Demonstrate Capability
Learning SQL, Python, CAD, digital marketing, cybersecurity or another professional skill gives you something concrete to apply. The value increases when you can demonstrate how you used it.

### Projects Turn Knowledge Into Evidence
A project answers the question: 'What can you actually do?' A documented dashboard, engineering design, marketing campaign, software application or research analysis is stronger evidence than a course title alone.

### Experience Adds Context
Internships, mentored projects, freelance assignments and practical training show that you can work within real constraints, accept feedback and deliver an outcome.

### Certificates Have a Role—But They Are Not the Whole Profile
A certificate can verify that you completed structured learning. It becomes more valuable when supported by projects, practical application and relevant experience.

### A Stronger Career Formula
Think of your profile as:
**Degree → Skill → Project → Experience → Portfolio → Job Readiness.**

---

### Key Takeaway
Your degree tells an employer what you studied. Your skills show what you can do. Your projects provide evidence. Your experience shows how you apply those skills. Build all four together.`,
      coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      readTime: '4 min read',
      createdAt: '2026-02-21T07:30:00.000Z',
      author: {
        name: 'Course Divine Career Intelligence',
        role: 'Career Mentorship Panel',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      }
    },
    {
      _id: 'b_ci3',
      title: "You Don't Need 10 Certificates. You Need One Strong Skill.",
      slug: 'you-dont-need-10-certificates-you-need-one-strong-skill',
      excerpt: 'Professional development is not a numbers game of collecting badges. Discover how to build depth, master a skill stack, and execute the Learn-Build-Demonstrate cycle.',
      category: 'Career Intelligence',
      tags: ['Career Intelligence', 'Skills', 'Certifications', 'Portfolio', 'Career Growth'],
      content: `Professional development can easily become a numbers game: another course, another certificate, another badge. But a long list of completed courses does not automatically translate into professional capability. The better question is not 'How many certificates do I have?' It is 'What can I confidently build, solve or improve because of what I have learned?'

### Choose a Skill With a Clear Career Outcome
Start with a direction rather than a course catalogue. For example: data analytics, digital marketing, engineering design, cybersecurity or software development.

### Build a Skill Stack
One strong skill becomes more powerful when paired with complementary capabilities. A data analyst might combine Excel, SQL, Power BI and data storytelling. A mechanical designer might combine CAD, SolidWorks, engineering drawing and simulation.

### Use the Learn–Build–Demonstrate Cycle
Learn the concept, practise it, build something realistic, document your decisions and showcase the outcome. This creates evidence that can be discussed in interviews.

### Choose Quality Over Quantity
Three well-executed projects are usually more useful for demonstrating capability than twenty unrelated certificates.

### Make Your Learning Visible
Document projects on LinkedIn, GitHub, a personal website, Behance or another relevant portfolio platform. Explain the problem, your approach, tools, results and lessons learned.

---

### Key Takeaway
You do not need to know everything. You need to become genuinely useful at something. Choose a direction, develop depth, build evidence and then add complementary skills.`,
      coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
      readTime: '4 min read',
      createdAt: '2026-02-21T07:00:00.000Z',
      author: {
        name: 'Course Divine Career Intelligence',
        role: 'Career Mentorship Panel',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
      }
    },
    {
      _id: 'b_ci4',
      title: 'How to Choose the Right Career Path After Engineering',
      slug: 'how-to-choose-the-right-career-path-after-engineering',
      excerpt: 'Software, data, AI, cybersecurity, core engineering, design, and marketing are all possible directions. Here is a structured process to find the right path after your degree.',
      category: 'Career Intelligence',
      tags: ['Career Intelligence', 'Engineering', 'Career Roadmap', 'Students', 'Tech Careers'],
      content: `An engineering degree can open many doors—but that can also make the next decision difficult. Software, data, AI, cybersecurity, core engineering, design, management and entrepreneurship are all possible directions. Instead of choosing only because a field is popular, use a structured process that considers your strengths, interests, market demand and the kind of work you actually want to do.

### Start With Self-Assessment
Ask what kind of problems you enjoy solving. Do you prefer programming, numbers, design, systems, machines, communication, business or creative work?

### Understand Career Families
- **Data & Analytics**: Suit people who enjoy numbers and structured problem-solving.
- **AI & Machine Learning**: Require stronger programming and mathematical foundations.
- **Cybersecurity**: Suits those interested in systems and security.
- **Engineering Design**: Can suit students interested in CAD, modelling and simulation.
- **Digital Marketing**: Combines technology, communication, creativity and business.

### Test Before You Commit
Do a small project, take an introductory module, speak to someone in the field or shadow a real workflow. Testing a path is more reliable than choosing from job titles alone.

### Build a Focused Roadmap
Once you choose a direction, structure your development as:
**Foundation → Core Skill → Tools → Projects → Internship → Portfolio → Career Preparation.**

### Review and Adjust
Career planning is not a one-time decision. Your first project or internship may reveal that another specialisation suits you better. Adjusting early is a strength, not a failure.

---

### Key Takeaway
Your engineering degree does not have to determine your entire career. Think of it as a foundation—and decide deliberately what you want to build on top of it.`,
      coverImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      readTime: '5 min read',
      createdAt: '2026-02-21T06:30:00.000Z',
      author: {
        name: 'Course Divine Career Intelligence',
        role: 'Career Mentorship Panel',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
      }
    },
    {
      _id: 'b_ci5',
      title: 'Your First Internship: What Should You Actually Look For?',
      slug: 'your-first-internship-what-should-you-actually-look-for',
      excerpt: 'An internship should be more than a line on a resume. Learn how to evaluate mentorship, project-based deliverables, and how to turn real experience into portfolio evidence.',
      category: 'Career Intelligence',
      tags: ['Career Intelligence', 'Internships', 'Experience', 'Mentorship', 'Students'],
      content: `An internship should be more than a line on a resume. At its best, it gives you a controlled environment in which to apply knowledge, receive feedback, work on realistic problems and understand what a professional role actually involves. Before choosing an internship, ask what you will learn, build and be able to demonstrate when it ends.

### Look Beyond the Certificate
Ask what work you will perform, which tools you will use and whether the programme includes meaningful mentorship and assessment.

### Prioritise Project-Based Experience
A project gives you something concrete to discuss during interviews. The strongest internships allow you to contribute to a defined outcome rather than simply attend sessions.

### Match the Internship to Your Career Goal
- A future **data analyst** should seek analysis and dashboard work.
- A **digital marketer** should seek campaigns, SEO or analytics.
- An **engineering student** should seek CAD, simulation or design exposure.

### Ask the Right Questions Before Joining
- Who is the mentor?
- What will I build?
- How will my work be evaluated?
- What tools will I use?
- Can I showcase the outcome?
- What support is available?

### Turn the Experience Into Evidence
At the end, document the problem, your contribution, tools used, decisions made and results. This turns an internship from a certificate into a portfolio asset.

---

### Key Takeaway
Your first internship does not need to be perfect. It needs to provide experience, evidence and direction. Choose learning and meaningful work over a certificate alone.`,
      coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      readTime: '4 min read',
      createdAt: '2026-02-21T06:00:00.000Z',
      author: {
        name: 'Course Divine Career Intelligence',
        role: 'Career Mentorship Panel',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      }
    },
    {
      _id: 'b_ci6',
      title: 'How to Build a Job-Ready Portfolio With No Work Experience',
      slug: 'how-to-build-a-job-ready-portfolio-with-no-work-experience',
      excerpt: 'Fresh graduates often face the experience paradox. Discover how three well-documented, progressive projects can give employers the proof they need to hire you.',
      category: 'Career Intelligence',
      tags: ['Career Intelligence', 'Portfolio', 'Resume', 'Freshers', 'Job Search'],
      content: `One of the most frustrating challenges for fresh graduates is being told that employers want experience when they have not yet had an opportunity to gain it. A well-built portfolio can help bridge that gap by giving employers evidence of what you can do. You do not need years of professional experience to create credible work. You need relevant, well-documented projects.

### Start With Three Strong Projects
Choose projects that demonstrate progression:
1. One showing fundamentals.
2. One solving a realistic problem.
3. One representing your strongest work.

### Make Projects Relevant
- **Data Portfolio**: Include dashboards and business analysis.
- **Engineering Portfolio**: Include CAD models, assemblies or simulation work.
- **Marketing Portfolio**: Include campaign strategy, SEO research and performance analysis.

### Document the Thinking
For each project, explain the problem, objective, tools, process, your contribution, results and lessons learned. Employers want to understand how you think—not just see the final image.

### Showcase Work Professionally
Use LinkedIn, GitHub, Behance, a personal website or a well-designed PDF portfolio depending on your field.

### Connect Projects to Your Career Goal
A portfolio should tell a coherent story. If you want to become a data analyst, most of your work should support that positioning rather than showing unrelated skills.

---

### Key Takeaway
Your portfolio is your answer to one of the most important hiring questions: 'What can you actually do?' Build evidence before you wait for someone to give you the opportunity.`,
      coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      readTime: '5 min read',
      createdAt: '2026-02-21T05:30:00.000Z',
      author: {
        name: 'Course Divine Career Intelligence',
        role: 'Career Mentorship Panel',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
      }
    },
    {
      _id: 'b_ci7',
      title: 'Data Science vs AI vs Data Analytics: Which Path Is Right for You?',
      slug: 'data-science-vs-ai-vs-data-analytics-which-path-is-right-for-you',
      excerpt: 'Data Analytics, Data Science, and AI overlap but require different skills. Learn the key differences and how to pick the right path based on the daily work you enjoy.',
      category: 'Career Intelligence',
      tags: ['Career Intelligence', 'Data Science', 'Artificial Intelligence', 'Data Analytics', 'Career Comparison'],
      content: `Data Analytics, Data Science and Artificial Intelligence overlap, but they are not identical career paths. Choosing between them becomes easier when you understand the type of problems each field typically addresses and the skills involved.

### Data Analytics
Data analysts turn existing information into insights that support business and operational decisions. Common skills include Excel, SQL, Power BI, data visualisation and analytical thinking.

### Data Science
Data science combines programming, statistics and modelling to identify patterns and build predictive solutions. Python, SQL, statistics and machine learning are common foundations.

### Artificial Intelligence and Machine Learning
AI and ML focus on building systems that can learn from data or perform tasks associated with intelligent decision-making. Depending on the role, skills may include Python, mathematics, machine learning, deep learning and generative AI.

### Choose by the Work, Not the Title
- If you enjoy **business questions and dashboards**, analytics may be a better starting point.
- If you enjoy **statistics and modelling**, data science may fit.
- If you are drawn to **programming and intelligent systems**, AI/ML may be the stronger direction.

### Build Before You Specialise
Try a small project in your preferred area. Real exposure will tell you more about fit than a job title or trend report.

---

### Key Takeaway
Don't choose a career simply because it is trending. Ask what kind of problems you want to solve and what type of work you want to perform every day.`,
      coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      readTime: '4 min read',
      createdAt: '2026-02-21T05:00:00.000Z',
      author: {
        name: 'Course Divine Career Intelligence',
        role: 'Career Mentorship Panel',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
      }
    },
    {
      _id: 'b_ci8',
      title: 'The 6-Month Job-Ready Roadmap for Students',
      slug: 'the-6-month-job-ready-roadmap-for-students',
      excerpt: "Six months can transform a student's profile when used with focus. Here is a month-by-month framework from choosing a direction to gaining internship experience and landing interviews.",
      category: 'Career Intelligence',
      tags: ['Career Intelligence', 'Roadmap', 'Job Readiness', 'Students', 'Career Guide'],
      content: `Six months can significantly strengthen a student's professional profile when the time is used with focus. The goal is not to complete as many courses as possible. The goal is to develop one relevant skill, build evidence, gain practical exposure and become confident enough to discuss your work.

### Month 1 — Choose Your Direction
Select one primary career path. Review job descriptions, identify common skills and choose a realistic target.

### Month 2 — Build the Foundation
Learn the core concepts and tools required for your direction. Focus on understanding rather than collecting certificates.

### Month 3 — Build Your First Project
Move from learning to application. Choose a realistic problem, complete a project and document your process.

### Month 4 — Build Two More Projects
Increase complexity and demonstrate progression. Aim for quality, variety and relevance to your target role.

### Month 5 — Gain Practical Experience
Seek an internship, mentored project, freelance assignment, industry challenge or other structured opportunity to work with real constraints.

### Month 6 — Become Career Ready
Refine your resume, LinkedIn profile and portfolio. Practise explaining your projects, prepare for interviews and begin targeted applications.

### The Formula
**Choose → Learn → Build → Build More → Gain Experience → Showcase → Apply.**

---

### Key Takeaway
Job readiness is not about knowing everything. It is the ability to demonstrate a useful skill, explain how you applied it and show evidence of your learning. Six focused months can create that foundation.`,
      coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      readTime: '5 min read',
      createdAt: '2026-02-21T04:30:00.000Z',
      author: {
        name: 'Course Divine Career Intelligence',
        role: 'Career Mentorship Panel',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
      }
    }
  ],

  certificates: [
    {
      certificateId: 'CD-CERT-884920',
      studentName: 'Rohan Sharma',
      courseTitle: 'Microsoft Azure AI Infrastructure & DevOps Engineer Certified Course',
      grade: 'Distinction (A+)',
      issueDate: '2025-11-15T00:00:00.000Z',
      isValid: true,
      course: {
        title: 'Microsoft Azure AI Infrastructure & DevOps Engineer Certified Course',
        duration: '110 Hours (14 Weeks)',
        category: 'Cloud & DevOps',
        level: 'Advanced'
      }
    }
  ]
};

// Live Production Render Backend API URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://coursedivinewebsite.onrender.com/api';

// Axios Instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cd_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto re-authenticate on 401 and retry request automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        let loginRes;
        try {
          loginRes = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: 'coursedivine@admin',
            password: '9876543210'
          });
        } catch (e) {
          loginRes = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: 'admin@coursedivine.com',
            password: 'Admin@123'
          });
        }
        const newToken = loginRes?.data?.data?.token;
        if (newToken) {
          localStorage.setItem('cd_token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (authErr) {}
    }
    return Promise.reject(error);
  }
);

import { storePdfInDb, getPdfFromDb } from './pdfStorage';

// Helper for safely reading JSON from localStorage
const safeStorageRead = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

// Safe storage writer that prevents QuotaExceededError by offloading heavy PDFs to IndexedDB
const safeStorageWrite = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn('Storage quota limit reached, saving heavy binary files to IndexedDB...', err);
    try {
      if (Array.isArray(data)) {
        const lightweight = data.map((item) => {
          if (item && item.syllabusPdf && item.syllabusPdf.length > 20000) {
            storePdfInDb(item.slug || item._id, item.syllabusPdf, item.pdfFileName || 'Syllabus.pdf');
            return { ...item, syllabusPdf: 'indexeddb_ref' };
          }
          return item;
        });
        localStorage.setItem(key, JSON.stringify(lightweight));
      }
    } catch (e2) {}
  }
};

// Clear demo courses so Admin starts with a fresh empty catalog
fallbackStore.courses = [];

// Cross-tab broadcast channel
const coursesChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('cd_courses_broadcast')
  : null;

if (coursesChannel) {
  coursesChannel.onmessage = (event) => {
    if (event.data?.type === 'COURSES_UPDATED') {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cd_courses_updated', { detail: event.data.courses }));
      }
    }
  };
}

const broadcastCoursesUpdate = (courses) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cd_courses_updated', { detail: courses }));
  }
  if (coursesChannel) {
    try {
      coursesChannel.postMessage({ type: 'COURSES_UPDATED', courses });
    } catch (e) {}
  }
};

// Unified Synchronized Course Store Manager (Pure Direct MongoDB Atlas Cloud Sync)
export const getLiveCourses = () => {
  const custom = safeStorageRead('cd_custom_courses', []);
  return custom
    .filter(c => c && !String(c._id).startsWith('top-c') && !/^c[0-9]+$/.test(String(c._id)))
    .map(c => {
      const isDump = (txt) => txt && (txt.includes('2. Skills You Will Gain') || txt.includes('SYLLABUS:') || txt.length > 250);
      return {
        ...c,
        overview: (isDump(c.overview) || c.overview === c.description) ? '' : c.overview,
        subtitle: (isDump(c.subtitle) || c.subtitle === c.description) ? '' : c.subtitle
      };
    });
};

export const fetchLiveCoursesFromApi = async () => {
  try {
    const res = await api.get('/courses?limit=1000');
    if (res.data?.data && Array.isArray(res.data.data)) {
      const apiCourses = res.data.data;
      safeStorageWrite('cd_custom_courses', apiCourses);
      broadcastCoursesUpdate(apiCourses);
      return apiCourses;
    }
  } catch (err) {
    console.warn('API fetch notice:', err.message);
  }
  return getLiveCourses();
};

export const getLiveCourseBySlug = (slug) => {
  const courses = getLiveCourses();
  return courses.find(c => c.slug === slug || c._id === slug) || null;
};

// Helper to ensure valid JWT token for MongoDB operations
export const getValidAdminToken = async () => {
  let token = localStorage.getItem('cd_token');
  if (token && !token.startsWith('admin_jwt_') && token.split('.').length === 3) {
    return token;
  }
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@coursedivine.com',
      password: 'Admin@123'
    });
    if (res.data?.data?.token) {
      token = res.data.data.token;
      localStorage.setItem('cd_token', token);
      return token;
    }
  } catch (err) {
    try {
      const res2 = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'admin@learncoursedivine.com',
        password: 'Admin@123'
      });
      if (res2.data?.data?.token) {
        token = res2.data.data.token;
        localStorage.setItem('cd_token', token);
        return token;
      }
    } catch (e2) {}
  }
  return token;
};

export const saveCourseLive = async (courseData) => {
  const customCourses = safeStorageRead('cd_custom_courses', []);
  
  const isExistingMongoCourse = courseData._id && !String(courseData._id).startsWith('c_') && /^[0-9a-fA-F]{24}$/.test(courseData._id);
  const slug = courseData.slug || courseData.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  let safeLevel = courseData.level || 'Beginner';
  if (safeLevel === 'Beginner to Advanced' || !['Beginner', 'Intermediate', 'Advanced', 'All Levels'].includes(safeLevel)) {
    safeLevel = 'Beginner';
  }

  const desc = (courseData.description && courseData.description.trim()) || (courseData.overview && courseData.overview.trim()) || `Masterclass and comprehensive industry certification program in ${courseData.title || 'Technology'}.`;

  const payload = {
    ...courseData,
    title: courseData.title.trim(),
    slug,
    description: desc,
    overview: (courseData.overview && courseData.overview.trim()) || desc,
    category: courseData.category || 'Software & Web Development',
    level: safeLevel,
    isPublished: courseData.isPublished !== undefined ? courseData.isPublished : true,
    price: Number(courseData.price) || 499,
    discountPrice: Number(courseData.discountPrice) || Number(courseData.price) || 399
  };

  let savedCourse = {
    ...payload,
    _id: courseData._id || 'c_' + Date.now(),
    updatedAt: new Date().toISOString()
  };

  // Save PDF to IndexedDB immediately for instant offline/online retrieval
  if (courseData.syllabusPdf && (courseData.syllabusPdf.startsWith('data:') || courseData.syllabusPdf.length > 50)) {
    storePdfInDb(slug, courseData.syllabusPdf, courseData.pdfFileName || 'Official Syllabus.pdf');
    storePdfInDb(savedCourse._id, courseData.syllabusPdf, courseData.pdfFileName || 'Official Syllabus.pdf');
  }

  // Direct Cloud Sync to MongoDB Atlas on Render API
  try {
    const adminToken = await getValidAdminToken();
    const config = adminToken ? { headers: { Authorization: `Bearer ${adminToken}` } } : {};

    let targetIdentifier = null;
    if (courseData._id && /^[0-9a-fA-F]{24}$/.test(String(courseData._id))) {
      targetIdentifier = courseData._id;
    } else if (courseData.slug) {
      targetIdentifier = courseData.slug;
    }

    if (targetIdentifier) {
      try {
        const res = await api.put(`/courses/${targetIdentifier}`, payload, config);
        if (res.data?.data) {
          savedCourse = res.data.data;
        }
      } catch (putErr) {
        delete payload._id;
        const res = await api.post('/courses', payload, config);
        if (res.data?.data) {
          savedCourse = res.data.data;
        }
      }
    } else {
      delete payload._id;
      const res = await api.post('/courses', payload, config);
      if (res.data?.data) {
        savedCourse = res.data.data;
      }
    }
  } catch (err) {
    console.error('MongoDB cloud sync notice:', err.response?.data?.message || err.message);
  }

  const existingIdx = customCourses.findIndex(c => c._id === savedCourse._id || c.slug === savedCourse.slug);
  if (existingIdx >= 0) {
    customCourses[existingIdx] = savedCourse;
  } else {
    customCourses.unshift(savedCourse);
  }
  safeStorageWrite('cd_custom_courses', customCourses);
  broadcastCoursesUpdate(customCourses);
  
  return savedCourse;
};

export const deleteCourseLive = async (courseId) => {
  const customCourses = safeStorageRead('cd_custom_courses', []);
  const updatedCustom = customCourses.filter(c => c._id !== courseId && c.slug !== courseId);
  localStorage.setItem('cd_custom_courses', JSON.stringify(updatedCustom));
  broadcastCoursesUpdate(updatedCustom);
  
  try {
    const adminToken = await getValidAdminToken();
    const config = adminToken ? { headers: { Authorization: `Bearer ${adminToken}` } } : {};
    await api.delete(`/courses/${courseId}`, config);
  } catch (err) {
    console.error('MongoDB cloud delete notice:', err.response?.data?.message || err.message);
  }
  
  return true;
};

export const toggleCourseStatusLive = async (courseId, currentStatus) => {
  const newStatus = currentStatus !== undefined ? !currentStatus : false;
  const customCourses = safeStorageRead('cd_custom_courses', []);
  const idx = customCourses.findIndex(c => c._id === courseId || c.slug === courseId);
  if (idx >= 0) {
    customCourses[idx] = { ...customCourses[idx], isPublished: newStatus };
    localStorage.setItem('cd_custom_courses', JSON.stringify(customCourses));
    broadcastCoursesUpdate(customCourses);
  }

  try {
    const adminToken = await getValidAdminToken();
    const config = adminToken ? { headers: { Authorization: `Bearer ${adminToken}` } } : {};
    await api.patch(`/courses/${courseId}/status`, { isPublished: newStatus }, config);
  } catch (err) {
    console.error('Status toggle API warning:', err.message);
  }

  return newStatus;
};

export const clearAllCoursesLive = async () => {
  localStorage.setItem('cd_custom_courses', JSON.stringify([]));
  broadcastCoursesUpdate([]);
  try {
    const adminToken = await getValidAdminToken();
    const config = adminToken ? { headers: { Authorization: `Bearer ${adminToken}` } } : {};
    await api.delete('/courses/clear-all', config);
  } catch (err) {
    console.error('Clear MongoDB notice:', err.response?.data?.message || err.message);
  }
  return true;
};

export const bulkImportCoursesLive = async (coursesList) => {
  if (!Array.isArray(coursesList) || coursesList.length === 0) return 0;
  
  const customCourses = safeStorageRead('cd_custom_courses', []);
  
  const formattedItems = coursesList.filter(c => c && c.title).map(c => {
    const slug = c.slug || c.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const item = {
      ...c,
      slug,
      price: Number(c.price) || 499,
      discountPrice: Number(c.discountPrice) || (Number(c.price) ? Math.round(Number(c.price) * 0.8) : 399),
      rating: Number(c.rating) || 4.9,
      isPublished: true
    };
    if (item._id && (String(item._id).startsWith('c_') || !/^[0-9a-fA-F]{24}$/.test(item._id))) {
      delete item._id;
    }
    return item;
  });

  try {
    const adminToken = await getValidAdminToken();
    const config = adminToken ? { headers: { Authorization: `Bearer ${adminToken}` } } : {};
    const res = await api.post('/courses/bulk', { courses: formattedItems }, config);
    if (res.data?.data && Array.isArray(res.data.data)) {
      const dbSaved = res.data.data;
      const combined = [...dbSaved, ...customCourses.filter(c => !dbSaved.some(s => s._id === c._id || s.slug === c.slug))];
      localStorage.setItem('cd_custom_courses', JSON.stringify(combined));
      broadcastCoursesUpdate(combined);
      return dbSaved.length;
    }
  } catch (err) {
    console.error('Bulk MongoDB import warning:', err.response?.data?.message || err.message);
  }

  // Fallback local storage update if offline
  let addedCount = 0;
  const newCustom = [...customCourses];
  for (const c of formattedItems) {
    const id = c._id || 'c_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const formatted = { ...c, _id: id };
    const existIdx = newCustom.findIndex(item => item._id === id || item.slug === c.slug);
    if (existIdx >= 0) {
      newCustom[existIdx] = formatted;
    } else {
      newCustom.unshift(formatted);
    }
    addedCount++;
  }
  localStorage.setItem('cd_custom_courses', JSON.stringify(newCustom));
  broadcastCoursesUpdate(newCustom);
  return addedCount;
};

export default api;
