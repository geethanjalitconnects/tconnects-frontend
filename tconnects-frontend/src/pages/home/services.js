import {
  BookOpen,
  Briefcase,
  FileText,
  GraduationCap,
  Laptop,
  MessagesSquare,
  Users,
} from "lucide-react";

// The seven VConnects services. Order matches the points on the 3D ribbons.
export const SERVICES = [
  { name: "Jobs", to: "/jobs", Icon: Briefcase },
  { name: "Internships", to: "/internships", Icon: GraduationCap },
  { name: "Freelance", to: "/freelancers", Icon: Laptop },
  { name: "Mentorship", to: "/mentorship", Icon: Users },
  { name: "Resume Making", to: "/resume", Icon: FileText },
  { name: "Courses", to: "/courses", Icon: BookOpen },
  { name: "Mock Interviews", to: "/mock-interview", Icon: MessagesSquare },
];
