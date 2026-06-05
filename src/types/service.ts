export type ServiceOffering = {
  id: string;
  name: string;
  categoryId: string;
  durationMinutes: number;
  priceFrom: number;
  currency: string;
  description?: string;
  /** Palavras-chave opcionais para descoberta na busca (além do nome). */
  keywords?: readonly string[];
  /** Profissionais habilitados para este serviço */
  professionalIds: readonly string[];
  active: boolean;
};
