import { COMPANY_CATEGORIES } from "./constants/companies";

export default function CoolCompaniesPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <div className="space-y-12">
        {COMPANY_CATEGORIES.map((category) => (
          <section key={category.id} className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                {category.label}
              </h2>
              {category.description ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {category.description}
                </p>
              ) : null}
            </div>
            <ul className="divide-y divide-border rounded-lg border border-border bg-card/30">
              {category.companies.map((company) => (
                <li key={company.url}>
                  <a
                    href={company.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col gap-0.5 px-4 py-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                  >
                    <span className="font-medium text-foreground">
                      {company.name}
                    </span>
                    <span className="min-w-0 shrink text-sm text-muted-foreground">
                      {company.note ?? company.url}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
