import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Star, Users, Clock } from "lucide-react"

const tutors = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    avatar: "/female-professor-professional-headshot.jpg",
    title: "AI & Machine Learning Expert",
    bio: "PhD in Computer Science from MIT with over 10 years of teaching experience. Specializes in making complex AI concepts accessible to all learners.",
    subjects: ["Machine Learning", "Data Science", "Python", "Deep Learning"],
    rating: 4.9,
    students: 1250,
    experience: "10+ years",
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    avatar: "/male-professor-asian-headshot.jpg",
    title: "Mathematics & Statistics Guru",
    bio: "Former research scientist at Google with expertise in statistical modeling and quantitative analysis. Makes math fun and intuitive.",
    subjects: ["Statistics", "Calculus", "Linear Algebra", "Probability"],
    rating: 4.8,
    students: 980,
    experience: "8 years",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    avatar: "/female-scientist-latina-headshot.jpg",
    title: "Web Development Specialist",
    bio: "Full-stack developer turned educator. Passionate about helping students build real-world projects and launch their tech careers.",
    subjects: ["React", "Node.js", "TypeScript", "Next.js"],
    rating: 4.95,
    students: 2100,
    experience: "12 years",
  },
  {
    id: "4",
    name: "James Williams",
    avatar: "/male-teacher-african-american-headshot.jpg",
    title: "Physics & Engineering Mentor",
    bio: "NASA aerospace engineer who loves explaining the wonders of physics. Brings real-world engineering problems into every lesson.",
    subjects: ["Physics", "Engineering", "Mechanics", "Thermodynamics"],
    rating: 4.85,
    students: 750,
    experience: "15 years",
  },
]

export default function TutorsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex gradient-bg p-4 rounded-2xl mb-4">
            <BookOpen className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Meet Our <span className="gradient-text">Expert Tutors</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Learn from world-class educators with years of experience in their fields. Our tutors are passionate about
            helping you succeed.
          </p>
        </div>

        {/* Tutors Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {tutors.map((tutor) => (
            <Card
              key={tutor.id}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-border/50 bg-card/80 backdrop-blur"
            >
              <CardHeader className="pb-4">
                <div className="flex gap-4">
                  <div className="relative">
                    <img
                      src={tutor.avatar || "/placeholder.svg"}
                      alt={tutor.name}
                      className="w-24 h-24 rounded-2xl object-cover ring-4 ring-primary/20"
                    />
                    <div className="absolute -bottom-2 -right-2 gradient-bg px-2 py-1 rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-primary-foreground font-medium">
                        <Star className="h-3 w-3 fill-current" />
                        {tutor.rating}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{tutor.name}</CardTitle>
                    <CardDescription className="text-primary font-medium">{tutor.title}</CardDescription>
                    <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {tutor.students.toLocaleString()} students
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {tutor.experience}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{tutor.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map((subject) => (
                    <Badge key={subject} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                      {subject}
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
