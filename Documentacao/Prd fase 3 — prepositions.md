**Status:** Rascunho | **Owner:** [A DEFINIR] | **Versão:** 0.2

**Nota de versão (2026-08-21):** um 4º tipo de card ("Tipo D — in/on/at") foi implementado após a v0.1 deste PRD, o que confirma o risco já sinalizado na Seção 9 ("adicionar um 4º tipo quebra a premissa de 1 card de cada tipo por rodada"). A Seção 4 ("Sorteio e cobertura de tipos") e os RFs/critérios de aceite relacionados foram atualizados para refletir a decisão tomada. Ver também a linha correspondente na Seção 9.

**Depende de:** PRD — Painel de Flashcards de Verbos Irregulares, v0.2 (RF01–RF12) e PRD Fase 2 — Trava de Respostas e Gamificação de Sessão (RF13–RF17)

**Renomeia:** a funcionalidade descrita no PRD v0.2 passa a ser referenciada como seção **"Verbs"** dentro do sistema (com título do painel atualizado para **"Verbs Dashboard"**).

  

---

  

## 1. Sumário Executivo

  

- O sistema hoje cobre apenas verbos irregulares. Preposições são outra fonte clássica de erro para falantes de português aprendendo inglês — em especial "to" vs. "for", porque o português usa "para" para os dois casos sem distinção, e o estudante não tem hoje nenhum mecanismo de autoteste específico para isso.

- Propomos uma segunda seção do sistema, "Prepositions", acessível por um novo menu lateral (Verbs / Prepositions), reaproveitando a mecânica de flashcard e a gamificação de sessão já validadas em Verbs, mas com 4 tipos de card de formato distinto (tradução composta, uso obrigatório, uso contextual de "to"/"for", e completar frase com "in"/"on"/"at") em vez de um formato único.

- Métrica de sucesso: [A DEFINIR] — mesma limitação dos PRDs anteriores (sem baseline de uso real). Proposta preliminar na Seção 8.

  

## 2. Problema e Evidências

  

- Preposições em inglês não têm correspondência 1:1 com o português, e a interferência da língua nativa (ex.: "para" cobrindo tanto "to" quanto "for") é um erro recorrente relatado informalmente por estudantes de inglês básico/intermediário.

- **Nível de evidência deste PRD:** igual aos dois anteriores — nenhuma das decisões de conteúdo ou de regra de validação vem de dado quantitativo ou entrevista. São decisões de produto do owner. A lista de preposições, palavras e frases usadas nos cards também não foi validada com estudantes reais.

  

> [A DEFINIR] Validar com uso real se os 3 tipos de card cobrem os erros que o estudante de fato comete, ou se faltam categorias (ex.: preposições de tempo — "in the morning" vs. "at night" — não estão cobertas nesta fase).

  

## 3. Persona Afetada + JTBD

  

Mesma persona do PRD v0.2 (estudante autônomo de inglês básico/intermediário, português como língua nativa). JTBD adicional desta fase:

  

- **JTBD:** Quando estou revisando preposições em inglês, preciso testar ativamente se sei aplicar a preposição correta em diferentes tipos de contexto (tradução direta, uso obrigatório após certas palavras, a escolha entre "to" e "for", e o uso de "in"/"on"/"at" em frases de lugar e tempo), para identificar e corrigir os erros que cometo por interferência do português.

  

## 4. Solução Proposta

  

### O que fazemos

  

**Estrutura geral do sistema:**

- Menu lateral com duas opções: **Verbs** e **Prepositions**.

- A funcionalidade existente (PRD v0.2 + Fase 2) passa a ser rotulada "Verbs" na navegação, sem mudança de comportamento.

- O sistema abre por padrão na página **Verbs** (home).

- **Nota de contexto (informada pelo owner):** existem alterações feitas diretamente em código pelo time de desenvolvimento que não estão representadas em nenhum dos PRDs anteriores — em especial, **já existe um banco de dados em produção, com uma tabela que abriga o conteúdo de Verbs**. Este documento não cria uma estrutura de banco do zero; a estrutura de Prepositions deve ser um **complemento à estrutura já existente**.

- **Modelo conceitual da extensão (NÃO VALIDADO CONTRA O SCHEMA REAL — pendente de revisão com o time de dev):** como o schema atual não foi compartilhado neste documento, a descrição abaixo é conceitual, não uma definição de colunas real:

  - Prepositions precisa de um novo conjunto de entidades de conteúdo, análogo ao que já existe para Verbs, mas heterogêneo o suficiente (3 tipos de card com formatos de frente/verso diferentes) para exigir mais de uma tabela ou um campo discriminador de tipo — a escolha entre "uma tabela por tipo de card" (mais próxima do padrão simples que Verbs provavelmente já usa) e "uma tabela única com campo `type` + colunas heterogêneas/JSON" depende de como a tabela de Verbs está modelada hoje, o que este documento não sabe.

  - Cada item do Tipo C precisa carregar, além do par pergunta/resposta, um campo de **texto de explicação** associado (Grupo 1 ou Grupo 2) — esse é o único requisito de schema deste PRD que não tem equivalente conhecido na estrutura atual de Verbs.

  - Segue valendo a decisão de escopo já registrada: a extensão abriga apenas conteúdo estático (cards, textos, gabaritos) — nenhuma tabela de progresso/sessão de usuário é criada, mantendo a arquitetura "sem login, sem persistência de resposta" tanto para Verbs quanto para Prepositions.

- **Risco explícito:** qualquer decisão de schema tomada aqui é especulativa até ser confrontada com a tabela real de Verbs. Este PRD não deve ser usado como fonte de verdade de schema — serve para alinhar requisito de produto; o desenho de tabela final é do time de eng, com o schema atual como ponto de partida.

  

**Prepositions — 4 tipos de card:**

  

A nota original trazia 4 tipos de card. Os tipos 3 e 4 originais ("quando usar to ou for" e "quando usar to") foram **fundidos por decisão do owner** em um único tipo (Tipo C, com duas regras de explicação por item). Posteriormente, um novo card independente — **Tipo D, "in/on/at"** — foi adicionado, cobrindo justamente a categoria de preposições de lugar/tempo que a Seção "O que NÃO fazemos" da v0.1 deste PRD listava como fora de escopo (ver nota nessa seção).

  

| Tipo | Frente do card | Verso do card | Formato da resposta |
|---|---|---|---|
| **Tipo A (#1)** | Número "#1" + Significado em português (ex.: "Em") + Label "Qual a preposição em inglês (tradução)" | Gabarito + certo/errado, padrão de Verbs | Composta quando há mais de uma preposição válida (ver regra abaixo) |
| **Tipo B (#2)** | Número "#2" + Palavra em inglês (ex.: "Good") + Label "Qual preposição deve ser utilizada (uso obrigatório)" | Gabarito + certo/errado, padrão de Verbs | Simples (1 preposição) |
| **Tipo C (#3)** | Número "#3" + Frase em português (ex.: "Eu estou indo para Miami.") + Label "Traduza a frase usando TO ou FOR" | Gabarito + certo/errado + **texto de explicação específico do item** quando errado | Frase completa em inglês |
| **Tipo D (#4)** | Número "#4" + Título fixo "in / on / at" + Subtítulo "Complete a frase" + frase em inglês com lacuna no meio (input de 2 caracteres) | Gabarito (frase completa com a preposição correta) + certo/errado + **texto de explicação específico do item, exibido sempre** (certo ou errado — diferente do Tipo C, que só mostra a explicação ao errar) | Simples (1 preposição: in, on ou at) |

  

**Tipo A — conteúdo (9 fronts):**

`in, on, at = Em` · `of, from = De, a partir de` · `to = Para, a` · `for = Para, por` · `by = Por` · `about = Sobre` · `with = Com` · `without = Sem` · `like = Como`

  

**Regra de validação do Tipo A (decisão confirmada):** quando o gabarito tem mais de uma preposição válida (grupos "in/on/at" e "of/from"), a resposta do estudante precisa conter **todas** as opções do grupo para ser considerada correta. Especificamente:

- Comparação por **conjunto, não por sequência** — "on, in, at" é equivalente a "in, on, at" (ordem não importa).

- **Parsing tolerante de separador** — qualquer caractere não-alfabético (`,`, `|`, `/`, espaço, `;` etc.) é aceito como separador entre os itens, em vez de uma lista fixa de separadores reconhecidos.

- Resposta incompleta (faltando 1 dos N itens do grupo) marca o campo inteiro como incorreto — não há crédito parcial, mantendo o padrão binário certo/errado do resto do sistema.

- **UI & Comunicação clara:** o cabeçalho exibe a numeração `#1` (mesmo padrão visual de Verbs) e o campo de input traz o label orientativo `"Qual a preposição em inglês (tradução)"`, além de pista visual no placeholder (ex.: "digite todas as opções, separadas por vírgula") e dica para respostas compostas.

  

**Tipo B — conteúdo (4 fronts):**

`Good = at` · `Interested = in` · `Sorry = for` · `Thank = for`

  

**Confirmado pelo owner:** o cabeçalho exibe a numeração `#2` e a frente exibe a palavra em inglês com o label orientativo de campo **"Qual preposição deve ser utilizada (uso obrigatório)"**, padronizando a estrutura visual com os demais cards.

  

**Confirmado pelo owner:** o cabeçalho exibe a numeração `#3` e a frente exibe a frase em português com o label orientativo de campo **"Traduza a frase usando TO ou FOR"**, aplicado aos 12 itens independente do grupo de origem (regra "to vs for" ou regra "presença de objeto"). O item continua carregando individualmente apenas o texto de explicação exibido ao errar (Grupo 1 ou Grupo 2, ver conteúdo abaixo).

  

**Tipo C — conteúdo (12 itens combinados, cada um com sua própria explicação de erro):**

  

Grupo 1 — regra "to vs. for" (8 frases, herdadas do card 3 original). Texto de explicação exibido ao errar:

> "Quando der pra usar 'para' e 'a-ao' o TO deve ser usado, quando não couber o 'a-ao', deve ser o 'FOR'"

  

Grupo 2 — regra "presença de objeto" (4 frases, herdadas do card 4 original). Texto de explicação exibido ao errar:

> "Caso exista um objeto na frase é necessário utilização da preposição."

  

Ambos os grupos compartilham a mesma estrutura de card (número "#3", label "Traduza a frase usando TO ou FOR") e o mesmo formato de front/back — a diferença está apenas em qual texto de explicação aparece no verso ao errar, e isso é uma propriedade **do item**, não do tipo de card. O schema de conteúdo precisa carregar esse campo por item.

  

**Tipo D — conteúdo (22 itens, agrupados em 9 regras):**

Frase em inglês com lacuna (`___`) marcando onde a preposição entra, mais a preposição correta (`in`, `on` ou `at`) e o texto de explicação da regra — mesmo padrão de "grupo + explicação por grupo" do Tipo C, mas com 9 grupos em vez de 2:

1. Local da cidade (at) — 3 frases (ex.: "I am ___ the bus station")
2. Time/Moment/Instant (at) — 2 frases
3. Ideia de proximidade (at) — 2 frases
4. Bom ou ruim em algo (at) — 2 frases
5. Meios de transporte, exceto carro que usa "in" (on) — 2 frases
6. Dias (on) — 2 frases
7. Sobre, em cima (on) — 2 frases
8. Elétrico/eletrônico (on) — 4 frases
9. Wildcard/dentro, "coringa" quando nenhuma outra regra se aplica (in) — 3 frases

**Diferença de comportamento em relação ao Tipo C (decisão do owner, 2026-08-21):** no Tipo D, tanto a frase completa (gabarito) quanto o texto de explicação da regra são exibidos **sempre** que o card é virado, acertando ou errando — não só ao errar como no Tipo C. Essa é uma característica exclusiva do Tipo D; os demais tipos (A, B, C) mantêm o comportamento original (explicação só ao errar, quando aplicável).

  

**Sorteio e cobertura de tipos — decisão confirmada (2026-08-21, substitui a suposição da v0.1):**

Com a adição do Tipo D, Prepositions passou a ter 4 tipos de card, mas o tamanho da rodada continuou em 3 cards (não escalou para 4) — exatamente o risco antecipado na Seção 9 da v0.1 ("adicionar um 4º tipo quebra a premissa de 1 card de cada tipo por rodada"). A decisão tomada, confirmada pelo owner:

- **Cada rodada sorteia 3 dos 4 tipos disponíveis**, sempre distintos entre si (nunca 2 cards do mesmo tipo na mesma rodada) — o 4º tipo fica de fora daquela rodada.
- O sorteio de **quais** 3 tipos aparecem é **aleatório puro a cada rodada**, sem memória entre rodadas e sem garantia de cobertura — por acaso, um tipo pode ficar de fora de várias rodadas seguidas, ou aparecer em várias seguidas. Não há um ciclo de justiça entre tipos (diferente da regra de não-repetição *dentro* de cada tipo, que segue garantida — ver abaixo).
- Esta decisão prioriza simplicidade de implementação sobre garantia de cobertura equilibrada entre tipos; **[A DEFINIR]** se isso deve evoluir para um ciclo justo entre tipos (ex.: garantir que todos os 4 tipos apareçam a cada 4 rodadas) caso o owner observe na prática que um tipo fica de fora com frequência perceptível.

  

**Regra de não repetição (herdada de RF12, confirmada pelo owner):** dentro de cada tipo de card, um item já exibido não é sorteado de novo até que todos os demais itens daquele tipo já tenham aparecido pelo menos uma vez. O ciclo é **independente por tipo** (mesma lógica de "por lista" em Verbs, aplicada a "por tipo" aqui) e só avança nas rodadas em que aquele tipo é de fato sorteado para aparecer — um tipo que fica de fora de várias rodadas simplesmente não avança seu próprio ciclo enquanto isso. Nota de escala: o Tipo B tem só 4 itens — o ciclo se esgota a cada 4 vezes que o Tipo B é sorteado, o que pode ficar perceptível/repetitivo mais rápido que os outros tipos (9, 12 e 22 itens).

  

**Gamificação e trava de respostas (herdadas do Fase 2, RF13–RF17):**

- Trava pós-flip (RF13): mesmo comportamento em Prepositions — campo travado após virar o card, só libera com Nova Rodada.

- Contador de sessão e modal de conclusão (RF14–RF17): mesma mecânica (X rodadas, Y acertos, Z campos, 4 níveis de mensagem).

- **Sessão independente (confirmado pelo owner):** o contador de sessão de Prepositions não compartilha estado com o de Verbs. Trocar de aba no menu lateral não afeta o contador da outra seção.

  

### O que NÃO fazemos (escopo negativo)

  

- Não persistimos progresso do usuário em nenhuma das duas seções — decisão mantida do PRD v0.2, banco de dados serve só para conteúdo estático.

- Não implementamos login/autenticação.

- Não implementamos cadastro de conteúdo pelo usuário/professor nesta fase (análogo ao RF09/COULD de Verbs) — bancos de Verbs e Prepositions continuam fixos, definidos pelo time.

- Não unificamos pontuação/sessão entre Verbs e Prepositions.

- Não trazemos o seletor de escopo Lista 1/Lista 2/Todos (RF11) para dentro de Prepositions — os 3 tipos de card já cumprem um papel de sub-categorização. [A DEFINIR] se isso deve mudar quando o banco de preposições crescer.

- ~~Não cobrimos preposições de tempo/lugar (in/on/at aplicado a datas e locais, por exemplo) nesta fase~~ — **coberto a partir da v0.2** pelo Tipo D (in/on/at), com 22 frases agrupadas em 9 regras (local, tempo, proximidade, meios de transporte, dias, superfície, elétrico/eletrônico e o caso "coringa"). Continua fora do escopo desta fase qualquer preposição de tempo/lugar além de in/on/at (ex.: "since", "until", "between").

- Não aceitamos crédito parcial em respostas compostas do Tipo A — resposta incompleta é erro total do campo.

  

### Trade-offs

  

- Estender a estrutura de banco já existente (em vez de propor uma nova) mantém consistência com o que já está em produção, mas o custo desse trade-off é adiado para a Fase 3.a: sem o schema real em mãos, o esforço de "estender" pode ser maior ou menor do que parece aqui — este PRD não consegue estimar isso com precisão.

- Fundir os cards 3 e 4 do documento original simplifica a experiência do estudante (uma categoria a menos para entender) e reduz a superfície de UI, ao custo de mover a complexidade para o modelo de dados: a explicação de erro agora é atributo do item, não do tipo de card — qualquer novo item do Tipo C precisa vir com sua regra de explicação associada, ou o sistema não sabe o que exibir.

- ~~Garantir 1 card de cada tipo por rodada (em vez de sorteio livre) reduz variância de experiência (estudante sempre pratica os 3 formatos), mas cria acoplamento entre "número de tipos de card" e "tamanho da rodada" (hoje 3=3 por coincidência). Se um 4º tipo de card for adicionado no futuro, essa regra quebra e precisa ser redesenhada — sinalizado aqui para não virar descoberta tardia em v2.~~ — **Realizado na v0.2:** o Tipo D foi adicionado e a regra quebrou exatamente como previsto. Resolução adotada: manter a rodada em 3 cards e sortear 3 dos 4 tipos por rodada (aleatório puro, sem repetir tipo dentro da rodada, sem garantia de cobertura entre rodadas — ver Seção 4). O trade-off agora é o oposto do original: variância de experiência é maior (um tipo pode não aparecer por várias rodadas seguidas), mas o tamanho da rodada não precisou escalar junto com o número de tipos.

  

## 5. Requisitos Funcionais

  

| # | User Story | Prioridade |

|---|---|---|

| RF18 | Como estudante, quero acessar um menu lateral com as opções Verbs e Prepositions, para navegar entre as duas seções do sistema. | MUST |

| RF19 | Como estudante, quero que o sistema abra na seção Verbs por padrão, para manter o comportamento que já conheço como ponto de entrada. | MUST |

| RF20 | Como time de produto, queremos que o conteúdo de Prepositions resida na mesma estrutura de banco de dados já usada por Verbs (estendida conforme necessário para os 3 tipos de card), para manter um padrão único de armazenamento de conteúdo entre as duas seções, em vez de hardcoded no front como a nota original sugeria. | MUST |

| RF21 | Como estudante, quero responder cards de tradução de preposições que aceitam múltiplas respostas válidas (quando aplicável), para refletir corretamente que um mesmo sentido em português pode corresponder a mais de uma preposição em inglês. | MUST |

| RF22 | Como estudante, quero responder cards de uso obrigatório de preposição após uma palavra específica, para praticar combinações fixas comuns do inglês. | MUST |

| RF23 | Como estudante, quero responder cards sobre o uso de "to" ou "for" em frases traduzidas do português, e ver uma explicação específica da regra quando erro, para entender o motivo do erro e não só que errei. | MUST |

| RF24 | Como estudante, quero que cada rodada em Prepositions inclua 3 cards de tipos distintos entre os 4 disponíveis (nunca 2 cards do mesmo tipo na mesma rodada), para praticar múltiplos formatos a cada rodada sem depender de a rodada crescer junto com o número de tipos de card. *(Atualizado na v0.2 — a redação original garantia 1 card de cada um dos então 3 tipos; deixou de ser possível manter essa garantia com 4 tipos e rodada de tamanho 3, ver Seção 4.)* | MUST |

| RF28 | Como estudante, quero responder cards que pedem para completar uma frase em inglês com "in", "on" ou "at" no meio dela, e ver a frase completa com a explicação da regra sempre que virar o card (acertando ou errando), para entender a regra mesmo quando acerto por intuição/sorte. | MUST |

| RF25 | Como estudante, quero que o sorteio dentro de cada tipo de card não repita um item até que eu tenha visto todos os outros itens daquele tipo, para garantir cobertura completa antes de qualquer repetição. | MUST |

| RF26 | Como estudante, quero que o card trave após virado em Prepositions, com o mesmo comportamento já existente em Verbs (RF13), para que meu placar reflita o que eu realmente sabia. | MUST |

| RF27 | Como estudante, quero um contador de sessão e uma mensagem de resultado em Prepositions, com a mesma mecânica já existente em Verbs (RF14–RF17), mas com contagem independente da sessão de Verbs. | MUST |

  

**Fluxo principal:** Estudante acessa o sistema → cai em Verbs (home) → clica em "Prepositions" no menu lateral → uma rodada de 3 cards é sorteada (3 dos 4 tipos disponíveis — A, B, C, D —, sempre distintos entre si) → preenche os campos → vira cada card → recebe correção (e explicação, se Tipo C e errado, ou sempre se Tipo D) → clica em "Nova rodada" → repete → opcionalmente clica em "Concluir estudos" para ver o resumo da sessão de Prepositions (independente da sessão de Verbs).

  

**Fluxo alternativo (resposta composta incompleta — Tipo A):** Estudante digita só 1 das 3 preposições esperadas (ex.: só "in" para o grupo in/on/at) → ao virar o card, o campo é marcado como incorreto (não há crédito parcial) → estudante só pode tentar de novo naquele item numa rodada futura em que ele seja sorteado novamente (mesma trava de RF13).

  

**Fluxo alternativo (troca entre Verbs e Prepositions com sessão em andamento):** Estudante está no meio de uma sessão em Verbs (contador X/Y/Z acumulado) → navega para Prepositions → contador de Verbs permanece intacto mas oculto → contador de Prepositions começa do zero → ao voltar para Verbs, o contador anterior reaparece exatamente como estava.

  

## 6. Edge Cases e Requisitos Não-Funcionais

  

**Edge cases:**

  

- Resposta composta (Tipo A) com item duplicado (ex.: "in, on, at, on") → [A DEFINIR] recomendação: normalizar removendo duplicatas antes de comparar como conjunto, para não penalizar o estudante por digitar a mesma opção duas vezes.

- Resposta composta (Tipo A) com todos os itens certos mas um com erro de digitação (ex.: "in, on, att") → conta como erro total do campo, mesma lógica binária do restante do sistema — sem normalização de erro de digitação além do já existente (case/espaço/prefixo "to ").

- Tipo B com banco de apenas 4 itens → ciclo de não-repetição se esgota a cada 4 rodadas; sinalizado como candidato a expansão de conteúdo em v2, não é bug, mas pode ficar perceptivelmente repetitivo mais cedo que os outros tipos.

- Tipo C (fundido) errado → sistema precisa exibir a explicação correta associada àquele item específico (grupo "to vs for" ou grupo "objeto na frase") — item sem esse campo preenchido no banco não deve quebrar a UI; [A DEFINIR] comportamento de fallback (ex.: não exibir texto de explicação, só o gabarito) se o campo estiver vazio.

- Estudante conclui sessão de Prepositions (Concluir estudos) enquanto tem sessão em andamento em Verbs → apenas a sessão de Prepositions é resumida/resetada; sessão de Verbs não é afetada (decorre diretamente da independência confirmada de sessões).

- Rodada sorteia o Tipo D, mas o item digitado pelo estudante não corresponde a nenhuma das 3 opções esperadas (ex.: digita "of" em vez de in/on/at) → mesma lógica binária certo/errado do resto do sistema; a explicação da regra é exibida do mesmo jeito (Tipo D sempre exibe, ver Seção 4), então o estudante ainda vê por que a resposta certa era outra.

- Z = 0 ao clicar em "Concluir estudos" dentro de Prepositions → mesmo comportamento de Verbs (Fase 2): botão desabilitado até pelo menos 1 campo ter sido corrigido na sessão de Prepositions.

  

**Requisitos não-funcionais:**

  

- **Performance:** mesma exigência de <100ms para flip e correção, client-side, sem chamada de rede — leitura do conteúdo do banco pode ser pré-carregada no boot da aplicação para não introduzir latência na interação.

- **Acessibilidade:** herda os padrões de Verbs — cards focáveis via teclado, foco visível, `prefers-reduced-motion` respeitado; o novo menu lateral precisa ser navegável por teclado e ter estado ativo/selecionado anunciado por leitor de tela.

- **Dados/privacidade:** sem mudança em relação aos PRDs anteriores — banco de dados armazena apenas conteúdo estático, nenhum dado pessoal é coletado ou persistido, sem requisito de LGPD aplicável.

- **Schema real não documentado:** Verbs já persiste em banco de dados hoje (implementado diretamente em código pelo time de dev, fora do que os PRDs anteriores descrevem) — não há migração de "hardcoded para banco" pendente nesta fase, diferente do que o RF20 original sugeria antes desta correção. O que falta é validar o schema real com o time de dev antes de desenhar a extensão de Prepositions (ver Seção 4).

  

## 7. Critérios de Aceite

  

- DADO o sistema carregado, QUANDO o estudante observa o menu lateral, ENTÃO as opções "Verbs" e "Prepositions" estão visíveis E "Verbs" está selecionada por padrão.

- DADO um card do Tipo A com gabarito composto (ex.: "Em" → in/on/at), QUANDO o estudante digita as 3 opções em qualquer ordem, separadas por qualquer separador não-alfabético, ENTÃO o campo é marcado como correto.

- DADO um card do Tipo A com gabarito composto, QUANDO falta ao menos 1 das opções esperadas, ENTÃO o campo inteiro é marcado como incorreto.

- DADO um card do Tipo C, QUANDO o estudante erra a resposta, ENTÃO o texto de explicação exibido corresponde exatamente à regra daquele item específico (grupo "to/for" ou grupo "objeto na frase"), não uma mensagem genérica do tipo de card.

- DADO uma rodada sorteada em Prepositions, QUANDO o estudante observa os 3 cards, ENTÃO eles são de 3 tipos distintos entre os 4 disponíveis (A, B, C, D) — nunca 2 cards do mesmo tipo na mesma rodada. *(Atualizado na v0.2 — não há garantia de que um tipo específico apareça em toda rodada.)*

- DADO um card do Tipo D, QUANDO o estudante vira o card, ENTÃO a frase completa com a preposição correta E o texto de explicação da regra são exibidos, independente de a resposta estar certa ou errada.

- DADO um tipo de card com N itens no banco, QUANDO rodadas sucessivas são sorteadas dentro de Prepositions, ENTÃO nenhum item daquele tipo se repete até que os N itens já tenham sido exibidos ao menos uma vez.

- DADO um card em Prepositions já virado, QUANDO o estudante tenta editar os campos, ENTÃO nenhuma alteração é aceita (mesma trava de RF13).

- DADO uma sessão em andamento em Verbs, QUANDO o estudante navega para Prepositions e volta para Verbs, ENTÃO o contador de sessão de Verbs está intacto E o de Prepositions foi zerado/independente durante a visita.

- DADO Z = 0 na sessão de Prepositions, QUANDO o estudante observa o botão "Concluir estudos" dentro dessa seção, ENTÃO o botão está desabilitado (mesmo comportamento de Verbs/Fase 2).

  

## 8. Métricas de Sucesso

  

> Sem baseline real — mesma limitação dos dois PRDs anteriores, produto não instrumentado.

  

- **Primária:** [A DEFINIR] — proposta: % de sessões que acessam Prepositions pelo menos uma vez (proxy de adoção da nova seção em relação a Verbs), de baseline [A DEFINIR] para target [A DEFINIR].

- **Secundária 1:** Taxa de acerto por tipo de card (A/B/C) — se o Tipo C (to/for) tiver taxa de erro muito mais alta que A e B, confirma a hipótese de que essa é a maior dificuldade real (motivo original da feature) e pode justificar expandir esse tipo primeiro em v2.

- **Secundária 2:** Distribuição de campo incorreto por "resposta incompleta" vs. "resposta errada" no Tipo A — ajuda a distinguir se o erro é de desconhecimento do conteúdo ou de incompreensão da mecânica (não perceber que precisa digitar múltiplas opções), o que aponta para problema de UX em vez de conteúdo.

- **Como medir:** requer instrumentação de analytics — não implementada em nenhuma fase anterior. Ferramenta e owner: [A DEFINIR].

  

## 9. Riscos e Mitigações

  

| Risco | Tipo | Prob. | Impacto | Mitigação |

|---|---|---|---|---|

| Estudante não percebe que o campo do Tipo A espera múltiplas respostas e erra por incompreensão da mecânica, não por desconhecimento | Produto | Média | Médio | Placeholder/instrução explícita no campo (ex.: "digite todas as opções, separadas por vírgula") antes do lançamento |

| Banco pequeno no Tipo B (4 itens) gera repetição perceptível em poucas rodadas | Produto | Média | Baixo | Expandir lista de palavras com preposição obrigatória em v2 |

| Fusão dos cards 3/4 originais sob um único rótulo de card pode confundir o estudante sobre qual regra se aplica antes de errar | Produto | Baixa | Médio | O texto de explicação só aparece após o erro (não antes), o que mitiga confusão prévia; copy final do rótulo do card precisa ser genérica o bastante para cobrir as duas regras — [A DEFINIR] |

| ~~Regra "1 card de cada tipo por rodada" está acoplada ao número atual de tipos (3) — adicionar um 4º tipo no futuro quebra essa premissa~~ — **Materializado em 2026-08-21** com a adição do Tipo D. Resolvido sorteando 3 dos 4 tipos por rodada (aleatório puro, ver Seção 4). Risco residual: sem garantia de cobertura entre rodadas, um tipo pode ficar de fora perceptivelmente por acaso | Técnico | Baixa (validar na prática se a variância incomoda) | Baixo (produto, não técnico) | Se o owner observar na prática que falta de cobertura incomoda, evoluir para um ciclo justo entre tipos (ex.: garantir os 4 tipos a cada 4 rodadas) |

| Conteúdo (preposições, palavras, frases) não foi validado com estudantes reais — pode não refletir os erros mais comuns de fato | Negócio | Alta | Médio | Mesma recomendação herdada dos PRDs anteriores: validar com piloto informal antes de expandir o banco |

| Schema real de Verbs não documentado neste PRD — modelo conceitual de extensão proposto na Seção 4 pode não bater com a estrutura real em produção | Técnico | Média-Alta | Médio | Validar com o time de dev antes de iniciar a Fase 3.a; não iniciar implementação de schema a partir só deste documento |

  

## 10. Timeline e Dependências

  

**Fases:**

  

- **Fase 3.0 — Validação de schema:** confrontar o modelo conceitual da Seção 4 com a estrutura real de banco já usada por Verbs (levantamento com o time de dev, sem código novo). Pré-requisito da Fase 3.a. Estimativa: [A DEFINIR].

- **Fase 3.a — Infraestrutura:** menu lateral, rename de Verbs, extensão da estrutura de banco de dados existente para abrigar o conteúdo de Prepositions. Estimativa: [A DEFINIR] com eng.

- **Fase 3.b — Cards de Prepositions:** implementação dos 3 tipos de card, sorteio garantindo 1 de cada tipo por rodada, não-repetição por tipo. Estimativa: [A DEFINIR] com eng.

- **Fase 3.c — Reaproveitamento de gamificação:** trava pós-flip e contador de sessão/modal aplicados a Prepositions, com sessão independente de Verbs. Estimativa: [A DEFINIR], menor esforço por reaproveitar lógica já existente do Fase 2.

  

**Dependências:**

  

- Internas: depende de RF13–RF17 (Fase 2) já estarem em produção, já que Prepositions reaproveita diretamente essa lógica.

- Externas: nenhuma.

  

**Marcos:**

  

- M1: Infraestrutura (menu + banco de dados) em produção — [A DEFINIR].

- M2: Cards de Prepositions (Tipos A, B, C) funcionais — [A DEFINIR].

- M3: Gamificação de sessão ativa em Prepositions — [A DEFINIR].

  

---

  

## Checklist de Qualidade

  

- [x] Sumário executivo compreensível em 30s

- [ ] Evidências citadas com fonte _(pendente — decisão de owner, sem dado de uso real)_

- [x] Escopo negativo definido

- [ ] Métricas com baseline E target _(pendente — sem instrumentação de analytics)_

- [x] Edge cases cobertos

- [x] Riscos identificados com mitigação
