
interface UniversityQuery {
  country?: string;
  continent?: string;
  name?: string;
  established_year?: number;
  program?: string;
  page?: string; // Pagination parameter
  limit?: string; // Pagination parameter
}

interface UniversityFilters {
  country?: string;
  continent?: string;
  name?: RegExp;
  established_year?: number;
  programs_offered?: { $regex: RegExp };
}

export class UnknownFilterError extends Error {
  constructor(filter: string) {
    super(`Unknown filter parameter: ${filter}`);
    this.name = "UnknownFilterError";
  }
}

const validFilters: Set<string> = new Set([
  'country',
  'continent',
  'name',
  'established_year',
  'program'
]);

export const universityFilterUtils = (query: UniversityQuery): UniversityFilters => {
  const filters: UniversityFilters = {};

  // Validate query parameters but ignore pagination parameters
  Object.keys(query).forEach((key) => {
    if (!validFilters.has(key) && key !== 'page' && key !== 'limit') {
      throw new UnknownFilterError(key);
    }
  });

  // Build filters
  if (query.country) {
    filters.country = query.country.trim().toLowerCase();
  }
  if (query.continent) {
    filters.continent = query.continent.trim().toLowerCase();
  }
  if (query.name) {
    filters.name = new RegExp(query.name.trim().toLowerCase(), 'i');
  }
  if (query.established_year) {
    filters.established_year = query.established_year;
  }
  if (query.program) {
    filters.programs_offered = { $regex: new RegExp(query.program.trim().toLowerCase(), 'i') };
  }

  return filters;
};