export type ServiceCategory = {
  id: string;
  label: string;
  /** Fragmento guardado na API, resolvido em getCategoryIonicon (ex.: "briefcase"). */
  icon: string;
  description: string;
};
