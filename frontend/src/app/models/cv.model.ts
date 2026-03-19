export interface Cv {
  profile: {
    fullName: string;
    headline: string;
    location: string;
    email: string;
    phone: string;
    avatarUrl: string;
  };
  skills: Array<{ name: string; percent: number }>;
  languages: Array<{ name: string; percent: number }>;
  workExperience: Array<{
    title: string;
    company: string;
    from: string;
    to: string;
    details: string;
  }>;
  education: Array<{
    school: string;
    from: string;
    to: string;
    details: string;
  }>;
  social: {
    twitter: string;
    linkedin: string;
    github: string;
  };
}

