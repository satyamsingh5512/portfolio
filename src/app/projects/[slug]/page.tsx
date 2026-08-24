import Container from "@/components/common/Container";
import { ProjectContent } from "@/components/projects/ProjectContent";
import { ProjectNavigation } from "@/components/projects/ProjectNavigation";
import { ProjectViewCounter } from "@/components/projects/ProjectViewCounter";
import ArrowLeft from "@/components/svgs/ArrowLeft";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/Meta";
import PortfolioViewModel from "@/lib/models/PortfolioView";
import { connectToDatabase } from "@/lib/mongodb";
import {
  getProjectCaseStudyBySlug,
  getProjectCaseStudySlugs,
  getProjectNavigation,
  getRelatedProjectCaseStudies,
} from "@/lib/project";
import { Metadata } from "next";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";

interface ProjectCaseStudyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static paths for all project case studies
export async function generateStaticParams() {
  const slugs = getProjectCaseStudySlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

// Generate metadata for each project case study
export async function generateMetadata({
  params,
}: ProjectCaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getProjectCaseStudyBySlug(slug);

  if (!caseStudy || !caseStudy.frontmatter.isPublished) {
    return {
      title: "Project Not Found",
      robots: { index: false, follow: false },
    };
  }

  const { title, description, image, technologies } = caseStudy.frontmatter;

  return {
    metadataBase: new URL(siteConfig.url),
    title: `${title} - Project Case Study`,
    description,
    keywords: [
      title,
      "project case study",
      ...technologies,
      "portfolio",
      "software engineering",
    ].join(", "),
    openGraph: {
      type: "article",
      url: `${siteConfig.url}/projects/${slug}`,
      title: `${title} - Project Case Study`,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - Project Case Study`,
      description,
      images: [image],
    },
    alternates: {
      canonical: `${siteConfig.url}/projects/${slug}`,
    },
  };
}

export default async function ProjectCaseStudyPage({
  params,
}: ProjectCaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = await getProjectCaseStudyBySlug(slug);

  if (!caseStudy || !caseStudy.frontmatter.isPublished) {
    notFound();
  }

  const navigation = await getProjectNavigation(slug);
  const relatedProjects = await getRelatedProjectCaseStudies(slug, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: caseStudy.frontmatter.title,
    description: caseStudy.frontmatter.description,
    image: caseStudy.frontmatter.image,
    url: `${siteConfig.url}/projects/${slug}`,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    keywords: caseStudy.frontmatter.technologies.join(", "),
    ...(caseStudy.frontmatter.live && {
      sameAs: [caseStudy.frontmatter.live],
    }),
  };

  // Fetch initial portfolio view count from MongoDB
  let initialViews = 0;
  try {
    await connectToDatabase();
    initialViews = await PortfolioViewModel.countDocuments({
      contentType: "project",
      slug,
    });
  } catch {
    // Non-fatal: fall back to 0 so the page still renders
  }

  return (
    <Container as="main" className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="space-y-12">
        {/* Back Button */}
        <div>
          <Button variant="ghost" asChild className="group">
            <Link href="/projects" className="flex items-center space-x-2">
              <ArrowLeft className="size-4" />
              <span>Back to Projects</span>
            </Link>
          </Button>
        </div>

        {/* Project Content */}
        <ProjectContent
          frontmatter={caseStudy.frontmatter}
          content={caseStudy.content}
        />

        {/* View Counter — counted in portfolio only, not in blog */}
        <div className="flex justify-end">
          <ProjectViewCounter slug={slug} initialViews={initialViews} />
        </div>

        {/* Project Navigation */}
        <ProjectNavigation
          previous={navigation.previous}
          next={navigation.next}
        />

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="space-y-6">
            <Separator />
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Related Projects</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {relatedProjects.map((project) => (
                  <div
                    key={project.slug}
                    className="group bg-card hover:bg-muted/50 rounded-lg border p-6 transition-colors"
                  >
                    <Link href={`/projects/${project.slug}`}>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <h3 className="group-hover:text-primary text-lg font-semibold">
                            {project.frontmatter.title}
                          </h3>
                          <div className="text-xs">
                            <div
                              className={`inline-block rounded px-2 py-1 text-xs font-medium ${
                                project.frontmatter.status === "completed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : project.frontmatter.status === "in-progress"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                              }`}
                            >
                              {project.frontmatter.status
                                .charAt(0)
                                .toUpperCase() +
                                project.frontmatter.status.slice(1)}
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground line-clamp-2 text-sm">
                          {project.frontmatter.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {project.frontmatter.technologies
                            .slice(0, 3)
                            .map((tech) => (
                              <span
                                key={tech}
                                className="bg-muted rounded px-2 py-1 text-xs"
                              >
                                {tech}
                              </span>
                            ))}
                          {project.frontmatter.technologies.length > 3 && (
                            <span className="bg-muted rounded px-2 py-1 text-xs">
                              +{project.frontmatter.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Back to Projects CTA */}
        <div className="text-center">
          <Separator className="mb-8" />
          <Button asChild size="lg">
            <Link href="/projects">View All Projects</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
