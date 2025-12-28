export const templates = {
  modern: `
    <div class="max-w-4xl mx-auto p-8 font-sans text-gray-800">
        <div class="grid grid-cols-3 gap-8">
            <div class="col-span-2">
                <h1 class="text-4xl font-bold text-gray-900 uppercase tracking-wider">Awais [Last Name]</h1>
                <p class="text-lg text-blue-600 mt-2 font-medium">Computer Science Student</p>
                <div class="mt-6">
                    <h2 class="text-xl font-bold text-gray-900 uppercase border-b-2 border-gray-200 pb-2 mb-4">Experience</h2>
                    <div class="mb-4">
                        <h3 class="text-lg font-bold">Senior Developer</h3>
                        <p class="text-gray-500 text-sm">Tech Corp | 2023 - Present</p>
                        <ul class="list-disc list-inside mt-2 text-sm text-gray-700">
                            <li>Led a team of 5 developers.</li>
                            <li>Optimized backend performance by 40%.</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-span-1 bg-gray-50 p-6 rounded-lg">
                <div class="text-sm space-y-3 mb-6">
                    <div class="flex items-center gap-2">📍 Lahore, Pakistan</div>
                    <div class="flex items-center gap-2">📧 awais@example.com</div>
                </div>
                <h2 class="text-lg font-bold uppercase mb-4">Skills</h2>
                <div class="flex flex-wrap gap-2">
                    <span class="px-2 py-1 bg-white border rounded text-xs">React</span>
                    <span class="px-2 py-1 bg-white border rounded text-xs">Next.js</span>
                    <span class="px-2 py-1 bg-white border rounded text-xs">Python</span>
                </div>
            </div>
        </div>
    </div>
  `,

  minimalist: `
    <div class="max-w-3xl mx-auto p-10 font-serif text-gray-900">
        <div class="text-center border-b border-black pb-6 mb-8">
            <h1 class="text-3xl font-bold uppercase tracking-widest">Awais [Last Name]</h1>
            <p class="mt-2 text-sm">Lahore, Pakistan • awais@example.com • github.com/awais</p>
        </div>
        <div class="mb-8">
            <h2 class="text-sm font-bold uppercase tracking-widest border-b border-gray-300 mb-4">Professional Experience</h2>
            <div class="mb-4">
                <div class="flex justify-between items-baseline">
                    <h3 class="font-bold">Software Engineer</h3>
                    <span class="text-sm italic">2023 - Present</span>
                </div>
                <p class="text-sm mb-2">Company Name, Location</p>
                <ul class="list-disc list-inside text-sm leading-relaxed">
                    <li>Developed scalable web applications using Next.js and TypeScript.</li>
                    <li>Implemented CI/CD pipelines to streamline deployment.</li>
                </ul>
            </div>
        </div>
        <div>
            <h2 class="text-sm font-bold uppercase tracking-widest border-b border-gray-300 mb-4">Education</h2>
            <div class="flex justify-between items-baseline">
                <h3 class="font-bold">BS Computer Science</h3>
                <span class="text-sm">2021 - 2025</span>
            </div>
            <p class="text-sm">COMSATS University, Lahore</p>
        </div>
    </div>
  `,

  executive: `
    <div class="max-w-4xl mx-auto font-sans">
        <header class="bg-gray-900 text-white p-10">
            <h1 class="text-5xl font-bold">AWAIS [LAST]</h1>
            <p class="text-xl text-gray-400 mt-2">FULL STACK DEVELOPER</p>
        </header>
        <div class="p-10">
            <section class="mb-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span class="w-2 h-8 bg-blue-600"></span> EXPERIENCE
                </h2>
                <div class="pl-4 border-l-2 border-gray-200 ml-1">
                    <div class="mb-6 pl-4 relative">
                        <div class="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-white"></div>
                        <h3 class="text-xl font-bold">Lead Engineer</h3>
                        <p class="text-gray-500 mb-2">Innovate Inc. | 2024 - Present</p>
                        <p class="text-gray-700">Driving technical strategy and overseeing architecture for enterprise solutions.</p>
                    </div>
                </div>
            </section>
            <section>
                 <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span class="w-2 h-8 bg-blue-600"></span> SKILLS
                </h2>
                <div class="flex gap-4 text-gray-700 font-medium">
                    <span>Project Management</span> • <span>System Design</span> • <span>Cloud Architecture</span>
                </div>
            </section>
        </div>
    </div>
  `,

  creative: `
    <div class="max-w-4xl mx-auto flex font-sans min-h-[1000px]">
        <div class="w-1/3 bg-purple-900 text-white p-8">
            <div class="mb-10">
                <h1 class="text-3xl font-bold leading-tight">Awais [Last Name]</h1>
                <p class="text-purple-300 mt-2">Creative Developer</p>
            </div>
            <div class="mb-8">
                <h3 class="text-sm font-bold uppercase tracking-wider text-purple-300 mb-4">Contact</h3>
                <div class="space-y-2 text-sm">
                    <p>📍 Lahore, Pakistan</p>
                    <p>📧 awais@example.com</p>
                    <p>🌐 awais.dev</p>
                </div>
            </div>
            <div>
                <h3 class="text-sm font-bold uppercase tracking-wider text-purple-300 mb-4">Skills</h3>
                <div class="flex flex-wrap gap-2">
                    <span class="px-2 py-1 bg-purple-800 rounded text-xs">UI/UX</span>
                    <span class="px-2 py-1 bg-purple-800 rounded text-xs">React</span>
                    <span class="px-2 py-1 bg-purple-800 rounded text-xs">Figma</span>
                </div>
            </div>
        </div>
        <div class="w-2/3 p-8 bg-white">
            <section class="mb-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6 uppercase tracking-wider border-b-2 border-purple-100 pb-2">Profile</h2>
                <p class="text-gray-600 leading-relaxed">Passionate developer with a knack for building beautiful and functional user interfaces. Specializing in modern web technologies.</p>
            </section>
             <section>
                <h2 class="text-2xl font-bold text-gray-800 mb-6 uppercase tracking-wider border-b-2 border-purple-100 pb-2">Experience</h2>
                <div class="mb-6">
                    <h3 class="text-xl font-bold text-gray-800">Frontend Lead</h3>
                    <p class="text-purple-600 font-medium mb-2">Design Studio | 2023 - Present</p>
                    <p class="text-gray-600">Spearheaded the redesign of the company's flagship product, improving user engagement by 30%.</p>
                </div>
            </section>
        </div>
    </div>
  `,

  tech: `
    <div class="max-w-4xl mx-auto p-8 font-mono text-gray-800 bg-gray-50">
        <header class="border-b-2 border-gray-400 pb-6 mb-8 flex justify-between items-end">
            <div>
                <h1 class="text-4xl font-bold text-black">&lt;Awais /&gt;</h1>
                <p class="text-gray-600 mt-2">Full_Stack_Developer</p>
            </div>
            <div class="text-right text-xs text-gray-500">
                <p>const location = "Lahore";</p>
                <p>const email = "awais@example.com";</p>
            </div>
        </header>

        <div class="grid grid-cols-1 gap-8">
            <section>
                <h2 class="text-xl font-bold text-black mb-4 flex items-center gap-2">
                    <span class="text-blue-600">function</span> Experience() {
                </h2>
                <div class="ml-4 pl-4 border-l border-gray-300 space-y-6">
                    <div>
                        <h3 class="font-bold text-lg">SeniorDev @ TechCorp</h3>
                        <p class="text-xs text-gray-500 mb-2">2023 - Present</p>
                        <p class="text-sm">return "Built scalable microservices using Node.js and Docker.";</p>
                    </div>
                </div>
                <div class="mt-4 text-black font-bold">}</div>
            </section>

             <section>
                <h2 class="text-xl font-bold text-black mb-4 flex items-center gap-2">
                    <span class="text-blue-600">const</span> skills = [
                </h2>
                <div class="ml-8 flex flex-wrap gap-2 text-sm text-green-700">
                    <span>"Python",</span>
                    <span>"Next.js",</span>
                    <span>"PostgreSQL",</span>
                    <span>"AWS"</span>
                </div>
                <div class="mt-2 text-black font-bold">];</div>
            </section>
        </div>
    </div>
  `,

  classic: `
    <div class="max-w-3xl mx-auto p-12 font-serif text-gray-900">
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold uppercase border-b-2 border-gray-900 inline-block pb-2 mb-4">Awais [Last Name]</h1>
            <p class="text-sm">Lahore, Pakistan | awais@example.com | (123) 456-7890</p>
        </div>

        <section class="mb-6">
            <h2 class="text-sm font-bold uppercase bg-gray-100 p-1 mb-3">Summary</h2>
            <p class="text-sm leading-relaxed">Dedicated professional with a strong background in computer science. Committed to delivering high-quality software solutions.</p>
        </section>

        <section class="mb-6">
            <h2 class="text-sm font-bold uppercase bg-gray-100 p-1 mb-3">Experience</h2>
            <div class="mb-4">
                <div class="flex justify-between font-bold text-sm">
                    <span>Software Engineer</span>
                    <span>2023 - Present</span>
                </div>
                <div class="text-sm italic mb-1">Corporate Solutions Inc.</div>
                <ul class="list-disc list-inside text-sm">
                    <li>Analyze user requirements and design software solutions.</li>
                    <li>Collaborate with cross-functional teams.</li>
                </ul>
            </div>
        </section>

        <section>
            <h2 class="text-sm font-bold uppercase bg-gray-100 p-1 mb-3">Education</h2>
            <div class="flex justify-between font-bold text-sm">
                <span>BS Computer Science</span>
                <span>2021 - 2025</span>
            </div>
            <div class="text-sm">COMSATS University, Lahore</div>
        </section>
    </div>
  `,
};
