import { BookCheck, Copy, Code } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const createdLinks: {
  title: string;
  icon: React.FC;
  hash: string;
  badge?: number;
}[] = [
  {
    title: "MCQ Assessments",
    icon: Copy,
    hash: "mcqcreated",
  },
  {
    title: "Code Assessments",
    icon: Code,
    hash: "codecreated",
  },
];

const links: {
  title: string;
  icon: React.FC;
  hash: string;
  badge?: number;
}[] = [
  {
    title: "Assessments Taken",
    icon: BookCheck,
    hash: "taken",
  },
];

const Sidebar = ({
  active = 0,
  setActive,
}: {
  active: number;
  setActive: (number: number) => void;
}) => {
  return (
    <div className="hidden md:block w-[30%]">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 lg:h-[60px] items-center">
          <a className="flex gap-2 font-semibold">
            <span className="">Assessments</span>
          </a>
        </div>
        <div className="flex-1">
          <nav className="grid items-start text-sm font-medium">
            {links.map((link) => (
              <a
                key={link.title}
                href={`#${link.hash}`}
                className={`flex items-center gap-3 rounded-lg py-4 text-muted-foreground transition-all hover:text-primary ${
                  active === links.indexOf(link) ? "text-primary" : ""
                }`}
                onClick={() => setActive(links.indexOf(link))}
              >
                {/* @ts-expect-error icon is a component */}
                <link.icon className="h-4 w-4" />
                {link.title}
                {link.badge && (
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    {link.badge}
                  </Badge>
                )}
              </a>
            ))}
          </nav>

          <p className="mt-10 text-xs mb-3 opacity-50">Created Assessments</p>
          <nav className="grid items-start text-sm font-medium">
            {createdLinks.map((link) => (
              <a
                key={link.title}
                href={`#${link.hash}`}
                className={`flex items-center gap-3 rounded-lg py-4 text-muted-foreground transition-all hover:text-primary ${
                  active === createdLinks.indexOf(link) + 1
                    ? "text-primary "
                    : ""
                }`}
                onClick={() => setActive(createdLinks.indexOf(link) + 1)}
              >
                {/* @ts-expect-error icon is a component */}
                <link.icon className="h-4 w-4" />
                {link.title}
                {link.badge && (
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    {link.badge}
                  </Badge>
                )}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
