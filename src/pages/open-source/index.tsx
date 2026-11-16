import { ProjectContributions } from "./components/project-contributions";
import { OPEN_SOURCE_PROJECTS } from "./constants/projects";
import "./open-source.css";

export default function OpenSourcePage() {
  return (
    <main className="open-source-contributions mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 pb-16 pt-10 sm:pt-14">
      <h2 className="text-lg font-normal tracking-tight underline underline-offset-4">Contributions</h2>
      <div className="flex min-w-0 flex-col gap-14">
        {OPEN_SOURCE_PROJECTS.map(project => (
          <ProjectContributions key={project.id} project={project} />
        ))}
      </div>
    </main>
  );
}
