import en from "../locales/en.json";
import pt from "../locales/pt.json";
import { resolveLocale } from "../useLocale";

type Json = Record<string, unknown>;

/**
 * Pares de namespace (pt, en) verificados quanto à paridade de chaves.
 * `translation` é o namespace padrão (pt.json/en.json na raiz de locales/);
 * os demais ficam em locales/pt/<ns>.json e locales/en/<ns>.json.
 */
const NAMESPACE_PAIRS: { name: string; pt: Json; en: Json }[] = [
  { name: "translation", pt: pt as Json, en: en as Json },
  ...(
    [
      "components",
      "onboarding",
      "booking",
      "partner",
      "team",
      "staff",
      "navigation",
    ] as const
  ).map((name) => ({
    name,
    pt: require(`../locales/pt/${name}.json`) as Json,
    en: require(`../locales/en/${name}.json`) as Json,
  })),
];

/** Achata um objeto aninhado em chaves com ponto: { a: { b: 1 } } -> ['a.b']. */
function flattenKeys(obj: Json, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value !== null && typeof value === "object"
      ? flattenKeys(value as Json, path)
      : [path];
  });
}

function flattenEntries(obj: Json, prefix = ""): [string, unknown][] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value !== null && typeof value === "object"
      ? flattenEntries(value as Json, path)
      : ([[path, value]] as [string, unknown][]);
  });
}

describe("i18n locale resources", () => {
  it.each(NAMESPACE_PAIRS)(
    'namespace "$name": pt e en têm exatamente o mesmo conjunto de chaves',
    ({ pt: ptNs, en: enNs }) => {
      const ptKeys = flattenKeys(ptNs).sort();
      const enKeys = flattenKeys(enNs).sort();

      const missingInEn = ptKeys.filter((k) => !enKeys.includes(k));
      const missingInPt = enKeys.filter((k) => !ptKeys.includes(k));

      expect(missingInEn).toEqual([]);
      expect(missingInPt).toEqual([]);
    },
  );

  it.each(NAMESPACE_PAIRS)(
    'namespace "$name": nenhum valor de tradução é string vazia',
    ({ pt: ptNs, en: enNs }) => {
      for (const locale of [ptNs, enNs]) {
        for (const [key, value] of flattenEntries(locale)) {
          expect(typeof value).toBe("string");
          expect((value as string).trim().length).toBeGreaterThan(0);
          void key;
        }
      }
    },
  );
});

describe("resolveLocale", () => {
  it("respeita o override explícito", () => {
    expect(resolveLocale("en")).toBe("en");
    expect(resolveLocale("pt")).toBe("pt");
  });

  it("com override null, cai num idioma suportado", () => {
    expect(["pt", "en"]).toContain(resolveLocale(null));
  });
});
