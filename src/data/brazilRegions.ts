/** UFs e cidades sugeridas para filtro manual quando não há GPS */

export type BrazilState = { label: string; uf: string };

export const BRAZIL_STATES: BrazilState[] = [
  { label: "Paraná", uf: "PR" },
  { label: "São Paulo", uf: "SP" },
  { label: "Rio de Janeiro", uf: "RJ" },
  { label: "Minas Gerais", uf: "MG" },
  { label: "Santa Catarina", uf: "SC" },
  { label: "Rio Grande do Sul", uf: "RS" },
  { label: "Bahia", uf: "BA" },
  { label: "Goiás", uf: "GO" },
  { label: "Distrito Federal", uf: "DF" },
  { label: "Pernambuco", uf: "PE" },
];

/** Cidades por UF (capitais e polos usuais) para escolha manual de região */
export const BRAZIL_CITIES_BY_UF: Record<string, string[]> = {
  BA: ["Salvador"],
  DF: ["Brasília"],
  GO: ["Goiânia"],
  MG: ["Belo Horizonte"],
  PE: ["Recife"],
  PR: ["Curitiba"],
  RJ: ["Rio de Janeiro"],
  RS: ["Porto Alegre"],
  SC: ["Florianópolis"],
  SP: ["Campinas", "São Paulo"],
};
