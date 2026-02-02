import Container from "@/components/common/Container";
import { DBProjectList } from "@/components/projects/DBProjectList";
import { ProjectList } from "@/components/projects/ProjectList";
import { Separator } from "@/components/ui/separator";
import { generateMetadata as getMetadata } from "@/config/Meta";
import { projects } from "@/config/Projects";
import { getProjectsFromDB } from "@/lib/projects-db";
import { Metadata } from "next";

export const metadata: Metadata = {
  ...getMetadata("/projects"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function ProjectsPage() {
  // Fetch projects from Supabase
  const dbProjects = await getProjectsFromDB();

  // Sort config projects by order
  const sortedProjects = [...projects].sort(
    (a, b) => (a.order || 999) - (b.order || 999),
  );

  // Use DB projects if available, otherwise fallback to config
  const hasDBProjects = dbProjects.length > 0;

  return (
    <Container className="py-10 sm:py-16">
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="space-y-3 text-center sm:space-y-4">
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Projects
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-sm sm:text-lg">
            My projects and work across different technologies and domains.
          </p>
        </div>

        <Separator />

        {/* Projects from Supabase */}
        {hasDBProjects ? (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold sm:text-2xl">
                All Projects
                <span className="text-muted-foreground ml-2 text-xs font-normal sm:text-sm">
                  ({dbProjects.length}{" "}
                  {dbProjects.length === 1 ? "project" : "projects"})
                </span>
              </h2>
            </div>

            <DBProjectList projects={dbProjects} />
          </div>
        ) : (
          /* Fallback to config projects if no DB projects */
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold sm:text-2xl">
                All Projects
                {sortedProjects.length > 0 && (
                  <span className="text-muted-foreground ml-2 text-xs font-normal sm:text-sm">
                    ({sortedProjects.length}{" "}
                    {sortedProjects.length === 1 ? "project" : "projects"})
                  </span>
                )}
              </h2>
            </div>

            <ProjectList projects={sortedProjects} />
          </div>
        )}
      </div>
    </Container>
  );
}
