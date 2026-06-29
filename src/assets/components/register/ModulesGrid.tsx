import ModuleCard, { type ModuleCardModel } from "./ModuleCard";

interface Props {
  modules: ModuleCardModel[];
}

export default function ModulesGrid({ modules }: Props) {
  return (
    <section>
      <h3 className="rr-section-title">Available Registration & Review Modules</h3>
      <div className="rr-modules-grid">
        {modules.map((m) => (
          <ModuleCard key={m.title} {...m} />
        ))}
      </div>
    </section>
  );
}

