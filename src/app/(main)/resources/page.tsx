const resources = [
  {
    section: "Job Hunting Meditation",
    items: [
      {
        icon: "🧘",
        title: "Job hunting meditation",
        description: "Get the job in 3 steps: concentration, sensory clarity, equanimity",
        tag: "Mental reset",
        url: "https://www.career-stories.com/2020/05/26/meditation-for-job-seekers-2/",
      },
      {
        icon: "🌿",
        title: "Mindfulness for stress",
        description: "Breathing, body scans, mindful walking, and handling rejection calmly",
        tag: "Mental reset",
        url: "https://diversejobsmatter.co.uk/blog/mindfulness-practices-for-stress-reduction-a-jobseeker-s-guide/",
      },
      {
        icon: "✨",
        title: "Manifest your dream job",
        description: "Guided visualization to attract success",
        tag: "Mental reset",
        url: "https://insighttimer.com/blog/manifest-your-dream-job-guided-visualization",
      },
      {
        icon: "🎯",
        title: "10 visualization techniques",
        description: "Practical techniques to achieve your goals",
        tag: "Guide",
        url: "https://clickup.com/blog/visualization-techniques/",
      },
      {
        icon: "🎧",
        title: "Job affirmations — 21 days",
        description: "Positive affirmation meditation to attract job success",
        tag: "Video",
        url: "https://youtu.be/sg0EKLJgjMc?si=W5uDOAQlu3eKQ1jf",
      },
    ],
  },
  {
    section: "Meditation General",
    items: [
      {
        icon: "🏅",
        title: "Flow in sports",
        description: "Stay present, refocus after distractions, build flow state",
        tag: "Video",
        url: "https://www.youtube.com/watch?v=v17g7qimnfc",
      },
      {
        icon: "🌊",
        title: "Get into flow state",
        description: "Visualization and mental rehearsal for high-pressure scenarios",
        tag: "Video",
        url: "https://www.youtube.com/watch?v=K37dir8bj98",
      },
      {
        icon: "🌱",
        title: "Grounding exercises",
        description: "Harvard Health guide to manage anxiety and stay present",
        tag: "Mental health",
        url: "https://www.health.harvard.edu/mindscape/for-young-people/what-creates-mental-wellness/try-grounding-exercises",
      },
    ],
  },
  {
    section: "Job Hunting Resources",
    items: [
      {
        icon: "📄",
        title: "Resume with AI — 100 jobs",
        description: "Real experiment applying to 100 jobs with an AI-built resume",
        tag: "Video",
        url: "https://www.youtube.com/watch?v=9Cto83YVxiE",
      },
      {
        icon: "🤖",
        title: "Automate your job search",
        description: "Fully automated workflow: scraping listings and submitting applications",
        tag: "Video",
        url: "https://www.youtube.com/watch?v=LtzZRgfW4ok",
      },
      {
        icon: "🎤",
        title: "AI interview tool review",
        description: "Hands-on review of an AI mock interview tool for prep",
        tag: "Video",
        url: "https://www.youtube.com/watch?v=KzKRKvH7uSo",
      },
      {
        icon: "📝",
        title: "Resume-Now AI builder",
        description: "Create recruiter-friendly resumes quickly using AI",
        tag: "Tool",
        url: "https://www.resume-now.com",
      },
      {
        icon: "🔁",
        title: "LoopCV",
        description: "AI job-search automation — search roles, send applications, email recruiters",
        tag: "Tool",
        url: "https://www.loopcv.pro",
      },
      {
        icon: "🚀",
        title: "JobCopilot",
        description: "Find matching jobs, tailor resumes, auto-apply with one-time setup",
        tag: "Tool",
        url: "https://jobcopilot.com",
      },
      {
        icon: "✉️",
        title: "Cover letter — Teal",
        description: "Generate cover letters from your resume and the job listing",
        tag: "Tool",
        url: "https://www.tealhq.com/tool/cover-letter-generator",
      },
      {
        icon: "💬",
        title: "Interviewer.AI",
        description: "Mock interviews, conversational AI interviews, and assessments",
        tag: "Practice",
        url: "https://interviewer.ai",
      },
    ],
  },
];

const tagStyles: Record<string, string> = {
  "Mental reset": "bg-[#E1F5EE] text-[#0F6E56]",
  "Mental health": "bg-[#faeeda] text-[#854F0B]",
  "Resilience": "bg-[#FBEAF0] text-[#993556]",
  "Guide": "bg-[#E6F1FB] text-[#185FA5]",
  "Practice": "bg-[#EAF3DE] text-[#3B6D11]",
  "Video": "bg-[#EEEDFE] text-[#534AB7]",
  "Tool": "bg-[#FAECE7] text-[#993C1D]",
};

export default function ResourcesPage() {
  return (
    <div className="px-6 py-8 max-w-5xl">
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-1">Learn • Resources</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Resources</h1>
        <p className="text-sm text-gray-500">
          Frameworks, guides, and mental tools to sharpen your preparation
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {resources.map((group) => (
          <div key={group.section}>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              {group.section}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.items.map((item) => (
                <a key={item.title} href={item.url} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-2 bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 hover:bg-gray-50 transition-colors">
                  <span className="text-2xl">{item.icon}</span>
                  <p className="font-semibold text-gray-900 text-sm leading-snug">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed flex-1">
                    {item.description}
                  </p>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full w-fit mt-1 ${tagStyles[item.tag] ?? "bg-gray-100 text-gray-600"}`}>
                    {item.tag}
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
