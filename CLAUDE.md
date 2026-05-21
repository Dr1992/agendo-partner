# Agendô — convenções para assistentes (IA)

Este ficheiro concentra as regras que estavam em `.cursor/rules/`. No Cursor, `.cursor/rules/agendo-conventions.mdc` apenas **remete para este documento** para manter `alwaysApply`. Texto da UI e stacks seguem português (pt-BR) onde aplicável.

---

## Inline styles proibidos

- **Nunca** usar objetos de estilo inline no JSX: `style={{ prop: value }}` é proibido em ecrãs, componentes e navegadores de `app/src/` e `agendo-partner/src/`.
- Todos os estilos devem ser declarados em `StyleSheet.create(...)`, no arquivo `styles/index.ts` da pasta do ecrã/componente (ver secção "Organização de estilos"), ou num `StyleSheet.create` local no topo do ficheiro para navegadores/utilitários que não são ecrã nem componente.
- **Exceção única:** valores **dinâmicos** que dependem de variáveis de runtime e não podem ser pré-computados em `StyleSheet.create` (ex.: `{ width: viewportWidth }`, `{ top: insets.top }`). Mesmo nesses casos, os valores estáticos da mesma regra CSS devem estar no `StyleSheet` e o inline deve conter apenas a parte dinâmica.

---

## Cores e tema (`app/src/`)

- **Não** usar literais de cor soltas (`'#fff'`, `'rgb(...)'`) em UI; usar **tokens do tema** (`theme.background`, `theme.accent`, `theme.surface`, `theme.border`, `theme.textPrimary`, `theme.textMuted`, `palette` / `alpha` em `theme/colors` quando for o padrão do projeto).
- Manter consistência com ecrãs e componentes existentes.

---

## Texto na UI

### Regra

- **Nunca** importar `Text` de `react-native` em ecrãs, componentes ou estilos de UI da pasta `app/src/`.
- **Sempre** usar o componente `Text` de `app/src/components/Text` (import relativo ao ficheiro, ex.: `../../components/Text` ou `../Text`), com uma **`variant`** adequada (`body`, `listTitle`, `caption`, etc.) e `style` quando for preciso composição local.
- **Exceção única:** o ficheiro que implementa o wrapper, `app/src/components/Text/Text.tsx`, que continua a usar `Text as RNText` de `react-native` por definição.

### Porquê

Tipografia, cores e hierarquia ficam centralizadas no tema e variantes; evita regressões de acessibilidade e consistência visual.

### Ao editar ou criar código

1. Se aparecer `import { … Text … } from 'react-native'`, remover `Text` desse import e adicionar import do componente `Text`.
2. Associar cada uso a uma `variant`; complementar com `getFooStyles(theme)` / `StyleSheet` em **`styles/index.ts`** (pasta `styles/` ao lado do `.tsx`; ver secção “Organização de estilos” abaixo).

---

## Alertas e confirmações (`AlertDialog`)

- **Não** usar **`Alert.alert`** de `react-native` na pasta **`app/src/`** (UI da app). O alerta nativo não segue o tema nem o padrão visual do produto.
- Usar **`AlertDialog`** de **`app/src/components/AlertDialog/AlertDialog`**: `title`, `message`, array **`buttons`** com tipo **`AlertDialogButton`** (`label`, **`variant`**: `'primary' | 'secondary' | 'destructive'`, **`onPress`**), **`visible`** (ou render condicional), **`onRequestClose`** para fechar (backdrop / botão físico Android).
- O **`AlertDialog`** não abre um segundo `Modal` local: sincroniza com o átomo global e o **`RootAlertDialogHost`** (montado em **`AppProviders`**, após o conteúdo) desenha **um único** `Modal` na raiz. Em muitos dispositivos Android, **qualquer** segundo `Modal` (incluindo esse host) continua **por baixo** do primeiro (`AppSheetModal`, etc.). Nesses casos usar **`AlertDialogInlineOverlay`** (`app/src/components/AlertDialog/AlertDialog`): o mesmo conteúdo que o `AlertDialogSurface`, em **`position: 'absolute'`** **dentro** do mesmo modal/sheet (ver **`ExploreAddressFlowModal`**). Para confirmações densas só no corpo do sheet, um overlay local dedicado (como convites pendentes) também é válido.
- Para confirmções destrutivas: **`secondary`** (Cancelar) + **`destructive`** (confirmar), espelhando ecrãs como **`EstablishmentServiceFormScreen`**.

---

## Nomes de variáveis (clareza semântica)

- Em **qualquer camada** do código (UI, hooks, `utils/`, API, tipos, etc.) **não** usar nomes vagos ou de uma letra que não digam o papel do valor (`d`, `q`, `r`, `x`, `n`, `tmp`, `buf`, `obj`, etc.). O nome deve deixar claro **o quê** é, no contexto da função ou módulo (`daySlot`, `distanceMeters`, `searchText`, `pendingInviteCount`, `selectedDayKey`).
- Parâmetros de callbacks (`map`, `filter`, `reduce`) e variáveis locais seguem a mesma regra: preferir `daySlot`, `rawIso`, `previousPage` a `d`, `s`, `p`.
- **Exceções muito restritas:** índices em laços de algoritmo denso (`i`, `j`) e símbolos em expressões matemáticas curtas **só** quando a convenção melhora a leitura frente a um nome longo; em `map`/`forEach` sobre coleções com semântica (dias, utilizadores, linhas), usar sempre nome descritivo em vez de `d` ou `x`.

---

## Modais e overlays (`Modal` / sheets)

- **Não** importar **`Modal`** de **`react-native`** diretamente em ecrãs ou componentes de UI em **`app/src/`** para folhas, escolhas ou painéis sobrepostos ao fluxo principal — evita scrims, animações e cabeçalhos inconsistentes.
- Para **bottom sheets** (scrim, painel com cantos superiores arredondados, corpo com scroll): **`AppSheetModal`** (`app/src/components/AppSheetModal/AppSheetModal`): **`title`**, **`onRequestClose`**, **`visible`**, **`headerStart`** / **`headerEnd`** quando não quiseres o X por defeito, **`size`** ou **`maxHeightPx`**, **`contentPaddingH`** (ex.: `0` quando o conteúdo já define margens). **`PickerModal`** e modais semelhantes devem compor **`AppSheetModal`** internamente.
- **Exceção:** os únicos sítios onde **`Modal`** do React Native é aceite são os que **centralizam** esse uso (**`AppSheetModal.tsx`**, **`AlertDialog.tsx`**) — uma única camada de infraestrutura.

---

## Organização de estilos

### Regra

Em **`app/src/screens/`** e **`app/src/components/`**:

- Os estilos (`StyleSheet`, `getFooStyles(theme)`, etc.) devem viver em **`styles/index.ts`** dentro de uma pasta **`styles/`** ao lado do ficheiro principal do ecrã ou componente (ex.: `EstablishmentCard/styles/index.ts` + `EstablishmentCard.tsx`).
- **Não** introduzir novos ficheiros `styles.ts` na mesma pasta que o `.tsx` quando estiveres a criar código novo ou a refatorar um módulo.
- O import no `.tsx` deve ser do tipo **`./styles`** ou **`./styles/index`** (conforme o resto do repo), apontando para essa pasta.

### Referência

Seguir o mesmo padrão que **`app/src/components/Text/`**: `Text.tsx` + `styles/index.ts` (+ `index.ts` de barril do componente, se existir).

### Legado

Há pastas com `styles.ts` à raiz ou nomes como `openingHoursEditorStyles.ts` — **não** exige migração imediata de tudo; ao **tocar** nesse ecrã/componente, preferir mover/normalizar para **`styles/index.ts`** quando o diff já estiver a mexer na estrutura.

### Exceções

- Ficheiros que **não** são ecrã nem componente de UI (ex.: `app/src/utils/`, `app/src/hooks/`, `app/src/navigation/`, backend) ficam fora desta convenção.
- Componentes mínimos que só usam composição inline já permitida pela regra de tema — mesmo assim, que `StyleSheet`/`getStyles` não fiquem no `.tsx`; se precisar de ficheiro de estilo, usar **`styles/index.ts`**.

---

## UI de ecrãs

Alinhado ao produto: hierarquia clara, aspecto moderno e contido (não “gritar” com tipografia).

### Hierarquia e títulos

- **Não duplicar** o título do ecrã no conteúdo se o **header nativo** do stack já mostra o mesmo título (ex.: “Editar perfil” só no header; o scroll começa com conteúdo útil).
- Títulos no corpo, quando existirem, devem ser **moderados** (ex.: peso 600–700, tamanho coerente com `Text` `listTitle` / variantes do tema), não competir com o header.
- Textos de apoio longos: **só** quando forem necessários para a tarefa; preferir UI autoexplicativa (rótulos, placeholders curtos). Evitar parágrafos genéricos sob o título.

### Formulários e dados

- Formulários de **dados pessoais / resumo / detalhe**: preferir **linhas com ícone** (Ionicons alinhados ao tema `theme.accent`), rótulo pequeno em maiúsculas ou `fieldLabel`, e valor/campo ao lado ou abaixo do rótulo, dentro de **cartão** (`theme.surface`, borda `theme.border`, cantos arredondados) quando fizer sentido agrupar.
- Campos **só leitura**: manter **`TextInput`** (ou equivalente com a mesma caixa) com **borda e padding iguais aos editáveis**, para não parecer “texto morto”; diferenciar só com **`editable={false}`** e cor de texto **muted**. Evitar blocos repetidos de “não pode ser alterado” em cada campo, salvo requisito legal explícito.
- **Ícones**: tamanho contido (ex. 16–20px no glifo; caixa 28–36px se houver fundo), coerente com `DetailFactsCard` / cartões de lista.
- Botão primário: proporção razoável (`paddingVertical` ~14–16), não ocupar excesso de atenção em relação ao formulário.

### Consistência

- Cumprir **cores/tema** (secção no início deste doc), **`Text` da app com `variant`** (secção “Texto na UI”), e estilos em **`styles/index.ts`** ao lado do ecrã (secção “Organização de estilos”).

### Ao criar ou refatorar um ecrã

1. Verificar se existe **padrão semelhante** no repo (ex.: `DetailFactsCard`, `EstablishmentCard`, `ScreenForm`) e **reutilizar** em vez de reinventar layout.
2. Perguntar: “Este ecrã ficaria aceitável numa app de referência?” — se parecer demo minimalista (só `Text` grande + `TextInput` empilhados), **refinar** com cartão, ícones e hierarquia.
3. Se o ficheiro do ecrã ficar **longo** ou com **muitas condicionais** que decidam blocos inteiros de UI, **extrair** esses blocos para componentes com nomes claros (ver “Componentização” abaixo).

### Componentização (subpastas `components/` por ecrã)

- **Sempre** considerar partir o ecrã em **componentes locais** quando isso **melhore a leitura**: secções distintas (cabeçalho de lista, linhas, cartões, sheets, diálogos, estados de loading/erro/permissão), ou ramificações repetidas de JSX.
- Colocar esses ficheiros numa pasta **`components/`** ao lado do `.tsx` principal do ecrã (ex.: `EstablishmentCollaboratorsScreen/components/`), com **`index.ts`** de reexport quando o ecrã importar vários blocos.
- **Não** micro-fragmentar só por hábito: cada componente deve corresponder a um **pedaço de UI ou fluxo** que faça sentido nomear e testar mentalmente; o ecrã principal fica com **orquestração**, dados dos hooks e **composição** dos blocos.
- Estilos: seguir **`styles/index.ts`** por componente quando o bloco tiver estilo próprio; se o ecrã já expõe um `get…Styles(theme)` partilhado, pode passar-se como prop (`screenStyles`, etc.) como em ecrãs já refatorados no repo.
- Referência no código: ecrãs como **`EstablishmentCollaboratorsScreen`** e **`BookingScheduleScreen`** com pasta `components/` dedicada.

---

## Arquitetura por funcionalidade (View / hooks / fetch)

Objetivo: **separar renderização**, **regras de negócio e comportamento da tela**, **agregação de dados** e **integração com API** em camadas claras. Ecãs legados podem migrar aos poucos; ao **criar** código novo ou **refatorar** um ecrã com lógica espessa, seguir esta estrutura.

### Estrutura de pastas (por feature / ecrã)

```
Feature/
├── View/
│   └── FeatureView.tsx          # opcional: algumas features mantêm `FeatureScreen.tsx` na raiz da pasta do ecrã — equivalente à View
├── hooks/
│   ├── useFeature.ts            # orquestração da tela (compõe fetch + rules quando fizer sentido)
│   └── useFeatureRules.ts       # regras de negócio / UI behaviour (enabled, derivados, fluxos)
├── fetch/
│   ├── useFetchFeatureData.ts   # agregador: chama várias queries, merge, shape, mapping para a View
│   ├── useFetchCurrentWeek.ts   # só integração query/API (+ queryOptions quando aplicável)
│   └── useFetchGames.ts
├── styles/
│   └── index.ts
├── utils/
│   └── …                        # opcional
└── types/
    └── index.ts                 # opcional
```

**Nota:** O nome **`useFetchFeatureData`** (ou `useFetchData` no contexto da feature) é o **hook agregador**. Hooks como **`useFetchCurrentWeek`** ficam **finos**: `queryOptions` + `useQuery`, sem regras de apresentação.

### Fluxo de dependências

```
View
 ├── useFetchFeatureData   → useFetchCurrentWeek, useFetchGames, …
 ├── useFeatureRules
 └── styles
```

- **View:** apenas JSX, componentes visuais e estrutura. Consome dados e callbacks já preparados. Evitar condicionais longas e regras de negócio; exceções **pequenas** são aceitáveis quando extrair não melhora a legibilidade.
- **`styles/`:** estilos dedicados, importados pela View (alinhado à secção “Organização de estilos”).
- **`useFeatureRules`:** habilitar/desabilitar ações, estados derivados, regras de exibição, fluxos (alertas, navegação condicional), lógica reutilizável **da tela**. Não misturar chamadas HTTP aqui.
- **`fetch/useFetch…Data` (agregador):** orquestra hooks de API, combina resultados, faz **data shaping** antes de expor à View.
- **`fetch/useFetchXxx` (granular):** apenas integração com API/React Query; pode exportar `useXxxQueryOptions` para composição e testes. **Sem** regras de UI.

### Fronteira React Query (obrigatório)

- A pasta **`app/src/api/public/`** é a camada HTTP pura: funções simples com URL/método (`apiAuthGet`, `apiAuthPost`, etc.), sem `@tanstack/react-query`.
- O pacote **`@tanstack/react-query`** deve ser importado **somente** em ficheiros de **`app/src/hooks/api/`**.
- Ficheiros de feature em **`screens/**/fetch/`** devem consumir hooks da camada `hooks/api` (ex.: `useFetchPartnerEstablishment`) em vez de chamar `useQuery`/`useMutation` diretamente.
- Em **componentes reutilizáveis** (não-screen), é aceitável consumir `useFetch*` de `hooks/api` diretamente quando for apenas 1 query simples; criar `fetch/` local é opcional.
- Transformação de shape/retorno específico do ecrã continua na própria feature (`screens/**/fetch/` e `screens/**/hooks/`), mantendo `api/public` simples.

### Padrão ilustrativo (API fina + agregador)

Hooks granulares expõem opções de query reutilizáveis e um `useQuery` fino; o agregador compõe vários destes quando necessário.

### Migração

Não é obrigatório mover ficheiros legados de uma vez. Ao tocar num ecrã com lógica misturada no `.tsx`, preferir extrair para **`hooks/`** e **`fetch/`** conforme acima e deixar o ficheiro do ecrã principal como **View fina**.

#### Estado no repositório (rolling)

**Camada `fetch/` da feature** — Todas as queries HTTP/React Query devem passar por `fetch/use…Data.ts` (agregador ou fino) na pasta do ecrã; a View não deve importar `useFetch*` de `hooks/api/` nem declarar `useQuery` inline.

**Ecrãs com `fetch/` + orquestração em `hooks/` onde aplicável:**  
`EstablishmentDetailScreen`, `AppointmentsListScreen`, `AppointmentDetailScreen`, `CategoryPickerScreen`, `ServiceSelectScreen`, `PartnerHomeScreen`, `EstablishmentServicesScreen`, `InviteStaffScreen`, `PendingInviteLinkServicesScreen`, `EstablishmentHubScreen`, `StaffAgendaDetailScreen`, `StaffAgendaCalendarScreen` (`fetch/` + `hooks/useStaffAgendaCalendarScreen.tsx`), `EstablishmentCollaboratorsScreen`, `EstablishmentListScreen`, `BookingConfirmScreen`, `BookingScheduleScreen`, `EstablishmentEditScreen`, `EstablishmentServiceFormScreen`, `EstablishmentRegisterScreen`.

**`ProfileScreen`:** `fetch/useProfileAgendaData.ts`; o restante do ecrã pode extrair-se para `hooks/useProfileRules` num refactor futuro.

**Hooks em `hooks/api/`** (queries partilháveis): incluem `useFetchCustomerAppointments`, `useFetchStaffAgendaEstablishments`, `useFetchCustomerAppointment`, `useFetchPartnerEstablishments`, `useFetchEstablishmentDetail`, categorias, estabelecimentos por categoria, etc. Cada `useFetch…` vive num único ficheiro com as respetivas **`…QueryOptions`**, **`…QueryKey`** e tipos auxiliares (não há ficheiro `useFetch…QueryOptions.ts` separado).

**Onde ainda há `useMutation` na View** (próximo passo: `hooks/use…Rules`): formulários partner densos — `EstablishmentCollaboratorsScreen`, `EstablishmentEditScreen`, `EstablishmentServiceFormScreen`. É aceitável temporariamente; ao tocar nesses ficheiros, mover mutações e diálogos para `hooks/`.

### Agentes Cursor

**Não** é necessário criar um “agente” dedicado só para isto: esta secção em **`claude.md`** (e a regra que a referencia) já orienta IAs e humanos. Um agente ou skill extra só faz sentido se quiseres automatizar revisões de PR com checklist próprio.

### Pós-alterações de código

- Sempre rodar TypeScript (`npx tsc --noEmit`) e Prettier (`npx prettier --check .`) após qualquer alteração no código para garantir que não há erros de tipo e que o código está formatado corretamente.
