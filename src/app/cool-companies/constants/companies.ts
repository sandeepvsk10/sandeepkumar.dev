export type CompanyCategoryId = "photonics";

export interface CoolCompanyLink {
  name: string;
  url: string;
  /** Short note shown under the title (e.g. page type). */
  note?: string;
}

export interface CompanyCategory {
  id: CompanyCategoryId;
  label: string;
  description?: string;
  companies: CoolCompanyLink[];
}

export const COMPANY_CATEGORIES: CompanyCategory[] = [
  {
    id: "photonics",
    label: "Photonics",
    description:
      "Companies and projects working on optical interconnects, PICs, and photonic computing.",
    companies: [
      {
        name: "Lightmatter",
        url: "https://lightmatter.co/people/careers/",
        note: "Careers — silicon photonics / AI infrastructure",
      },
      {
        name: "Akhetonics",
        url: "https://www.akhetonics.com/blog-posts/connect-a-pic",
        note: "Connect-A-PIC — open-source PIC design & simulation",
      },
    ],
  },
];
