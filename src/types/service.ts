export type ServiceOffering = {
  id: string;
  name: string;
  categoryId: string;
  durationMinutes: number;
  priceFrom: number;
  currency: string;
  description?: string;
  /** Profissionais habilitados para este serviço */
  professionalIds: readonly string[];
  active: boolean;
};
