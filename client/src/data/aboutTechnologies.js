import { Code2, Database, Shield, GitBranch } from 'lucide-react';

export const technologies = [
    {
      name: "Frontend Framework",
      items: ["React 18.3", "JavaScript", "React Router Dom", "Tailwind CSS"],
      icon: Code2,
      description: "Modern frontend stack for building responsive user interfaces"
    },
    {
      name: "Backend Framework",
      items: ["Node.js", "Express", "MongoDB", "Firebase"],
      icon: Database,
      description: " Back-end uses Mongoose for elegant MongoDB object modeling in Node.js."
    },
    {
      name: "State Management",
      items: ["React Hooks", "Redux Toolkit" , "Context API"],
      icon: GitBranch,
      description: "Efficient state management using React's built-in features"
    },
    {
      name: "Authentication",
      items: ["JSON Web Token", "Google OAuth", "Secure Sessions"],
      icon: Shield,
      description: " Delivering secure user experiences, seamless sign-ins. "
    }
  ];
  
 