import airflowLogo from "../assets/airflow.svg";

export interface Contribution {
  number: number;
  title: string;
  url: string;
  description: string;
  status: "merged" | "open" | "closed";
  date: string;
}

export interface OpenSourceProject {
  id: string;
  name: string;
  repository: string;
  url: string;
  description: string;
  logo: string;
  contributions: Contribution[];
}

// Curated from the public PR on 2026-11-16. Add further verified contributions here.
export const OPEN_SOURCE_PROJECTS: OpenSourceProject[] = [
  {
    id: "apache-airflow",
    name: "Apache Airflow",
    repository: "apache/airflow",
    url: "https://github.com/apache/airflow",
    description: "A platform for developing, scheduling, and monitoring workflows in Python.",
    logo: airflowLogo,
    contributions: [
      {
        number: 58549,
        title: "Add Neo4jSensor to Neo4j Provider",
        url: "https://github.com/apache/airflow/pull/58549",
        description: "A sensor that polls Neo4j with Cypher until a condition is met, with unit tests and provider documentation.",
        status: "merged",
        date: "2025-11-22",
      },
    ],
  },
];
