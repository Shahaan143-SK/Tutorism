import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Trophy, BookMarked, Calendar } from "lucide-react"

const students = [
  {
    id: "1",
    name: "Alex Chen",
    avatar: "/male-student-asian-young.jpg",
    major: "Computer Science",
    level: "Undergraduate",
    bio: "Passionate about AI and machine learning. Building cool projects and learning every day.",
    interests: ["AI", "Web Development", "Mobile Apps"],
    coursesCompleted: 12,
    achievements: ["Dean's List", "Hackathon Winner"],
    joinedDate: "February 2024",
  },
  {
    id: "2",
    name: "Emma Thompson",
    avatar: "/female-student-blonde-young.jpg",
    major: "Data Science",
    level: "Graduate",
    bio: "Data enthusiast working on predictive modeling for healthcare. Love turning data into insights.",
    interests: ["Data Science", "Healthcare AI", "Statistics"],
    coursesCompleted: 8,
    achievements: ["Research Fellow", "Top Performer"],
    joinedDate: "March 2024",
  },
  {
    id: "3",
    name: "Marcus Johnson",
    avatar: "/male-student-african-american.jpg",
    major: "Software Engineering",
    level: "Undergraduate",
    bio: "Full-stack developer in the making. Currently building my first SaaS product.",
    interests: ["Full-Stack Dev", "Startups", "Cloud Computing"],
    coursesCompleted: 15,
    achievements: ["Open Source Contributor"],
    joinedDate: "January 2024",
  },
  {
    id: "4",
    name: "Sophia Martinez",
    avatar: "/female-student-latina.jpg",
    major: "Physics",
    level: "PhD Candidate",
    bio: "Researching quantum computing applications. Teaching assistant for undergraduate physics.",
    interests: ["Quantum Computing", "Physics", "Teaching"],
    coursesCompleted: 6,
    achievements: ["Published Researcher", "Graduate TA"],
    joinedDate: "December 2023",
  },
  {
    id: "5",
    name: "Ryan Park",
    avatar: "/male-student-korean-young.jpg",
    major: "Cybersecurity",
    level: "Graduate",
    bio: "Security researcher focused on network vulnerabilities. CTF competition enthusiast.",
    interests: ["Cybersecurity", "Networking", "Ethical Hacking"],
    coursesCompleted: 10,
    achievements: ["CTF Champion", "Security Certification"],
    joinedDate: "April 2024",
  },
  {
    id: "6",
    name: "Olivia Brown",
    avatar: "/female-student-curly-hair.jpg",
    major: "UX Design",
    level: "Undergraduate",
    bio: "Creating beautiful and accessible user experiences. Passionate about design systems.",
    interests: ["UX Design", "Accessibility", "Prototyping"],
    coursesCompleted: 9,
    achievements: ["Design Award Winner"],
    joinedDate: "May 2024",
  },
]

export default function StudentsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex gradient-bg p-4 rounded-2xl mb-4">
            <Users className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Our <span className="gradient-text">Learning Community</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Join thousands of students who are transforming their education with AI-powered tutoring. Connect, learn,
            and grow together.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Active Students", value: "2,500+", icon: Users },
            { label: "Courses Completed", value: "15,000+", icon: BookMarked },
            { label: "Achievements", value: "5,000+", icon: Trophy },
            { label: "Countries", value: "50+", icon: Calendar },
          ].map((stat) => (
            <Card key={stat.label} className="text-center bg-card/80 backdrop-blur border-border/50">
              <CardContent className="pt-6">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Students Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <Card
              key={student.id}
              className="group hover:shadow-xl transition-all duration-300 border-border/50 bg-card/80 backdrop-blur"
            >
              <CardHeader className="text-center pb-4">
                <img
                  src={student.avatar || "/placeholder.svg"}
                  alt={student.name}
                  className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-primary/20 mb-3"
                />
                <CardTitle className="text-lg">{student.name}</CardTitle>
                <CardDescription>
                  {student.major} · {student.level}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">{student.bio}</p>

                <div className="flex flex-wrap justify-center gap-1.5">
                  {student.interests.map((interest) => (
                    <Badge key={interest} variant="outline" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-center gap-4 text-sm text-muted-foreground border-t border-border pt-4">
                  <div className="flex items-center gap-1">
                    <BookMarked className="h-4 w-4 text-primary" />
                    {student.coursesCompleted} courses
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-accent" />
                    {student.achievements.length} badges
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-1.5">
                  {student.achievements.map((achievement) => (
                    <Badge key={achievement} className="gradient-bg text-xs text-primary-foreground">
                      {achievement}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
