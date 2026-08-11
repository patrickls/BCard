
**Status:** Rascunho | **Owner:** [A DEFINIR] | **Versão:** 0.1

---

## 1. Sumário Executivo

- Estudantes de inglês memorizam verbos irregulares de forma passiva (listas, decoreba), sem um momento de autoteste que force recuperação ativa da informação.
- Propomos um painel web de flashcards em formato "post-it": o estudante preenche tradução, passado e particípio de 3 verbos por rodada e recebe correção automática instantânea ao virar o card.
- Métrica de sucesso: [A DEFINIR] — projeto ainda não tem baseline de uso real; a métrica-alvo inicial proposta é % de rodadas em que o estudante inicia uma nova rodada após concluir a anterior (proxy de engajamento/retenção de sessão).

## 2. Problema e Evidências

Estudantes de inglês frequentemente relatam dificuldade em fixar verbos irregulares porque o método mais comum — ler listas estáticas — não exige recuperação ativa (active recall), técnica com evidência consolidada na literatura de aprendizagem (efeito de teste / testing effect).

**Nível de evidência deste PRD:** não há dados quantitativos próprios (entrevistas, tickets, analytics) — este é um projeto novo, sem base de usuários. As afirmações acima se apoiam em conhecimento geral sobre técnicas de estudo, não em pesquisa própria.

> [A DEFINIR] Validar com pelo menos 5 entrevistas ou um piloto informal com estudantes reais antes de expandir o escopo além do MVP.

## 3. Persona Afetada + JTBD

**Persona principal:** Estudante de inglês nível básico/intermediário, estudando de forma autônoma (não necessariamente em curso formal), com português como língua nativa.

- **JTBD:** Quando estou revisando vocabulário de inglês por conta própria, preciso testar ativamente se lembro a conjugação de um verbo irregular, para identificar rapidamente o que ainda não sei e focar meu estudo nisso.

**Personas secundárias:** [A DEFINIR] — ex.: professores de inglês que queiram usar o painel como atividade em sala.

## 4. Solução Proposta

### O que fazemos

- Painel com 3 cards por rodada, sorteados de um banco fixo de verbos irregulares.
- Cada card mostra o verbo em português na frente.
- Ao lado do card, 3 campos: tradução (infinitivo em inglês), passado (simple past), particípio passado (past participle).
- Ao clicar/tocar no card (ou Enter/Espaço), ele vira e revela o gabarito.
- Cada um dos 3 campos recebe marcação automática de certo (✓) ou errado (✗), comparando a resposta do estudante com o gabarito (normalizando maiúsculas/minúsculas, espaços e prefixo "to ").
- Botão "Nova rodada" sorteia outros 3 verbos e limpa os campos.
- Placar da rodada atual (X/9 acertos), visível apenas durante a sessão.
- Tocar no card virado novamente permite reeditar as respostas e conferir de novo.

### O que NÃO fazemos (escopo negativo)

- Não persistimos progresso entre sessões (sem login, sem histórico de desempenho ao longo do tempo) nesta fase.
- Não aceitamos respostas alternativas/sinônimos (ex.: "dreamed" vs "dreamt") no MVP — apenas uma forma canônica por verbo.
- Não incluímos cadastro de verbos pelo usuário nesta fase — banco é fixo, definido pelo time.
- Não incluímos gamificação (streaks, ranking, conquistas) no MVP.
- Não incluímos áudio/pronúncia nesta fase.

### Trade-offs

- Priorizamos simplicidade e velocidade de entrega de um MVP funcional sobre personalização (banco de verbos configurável) e sobre acompanhamento longitudinal de progresso.
- Ao não persistir dados, evitamos qualquer necessidade de autenticação ou tratamento de dados pessoais na v1 — reduz escopo técnico e de compliance, ao custo de o estudante não conseguir ver evolução histórica.

## 5. Requisitos Funcionais

|#|User Story|Prioridade|
|---|---|---|
|RF01|Como estudante, quero ver 3 verbos em português sorteados automaticamente, para começar a praticar sem precisar configurar nada.|MUST|
|RF02|Como estudante, quero preencher tradução, passado e particípio de cada verbo, para testar minha memória antes de ver a resposta.|MUST|
|RF03|Como estudante, quero virar o card ao clicar/tocar nele, para conferir o gabarito quando estiver pronto.|MUST|
|RF04|Como estudante, quero ver marcação automática de certo/errado em cada campo, para saber exatamente o que errei sem precisar comparar manualmente.|MUST|
|RF05|Como estudante, quero iniciar uma nova rodada com outros verbos, para continuar praticando sem recarregar a página.|MUST|
|RF06|Como estudante, quero poder editar minhas respostas depois de ver o gabarito, para tentar de novo antes de trocar de rodada.|SHOULD|
|RF07|Como estudante, quero ver quantos acertos tive na rodada atual, para ter uma noção rápida do meu desempenho.|SHOULD|
|RF08|Como estudante, quero navegar e responder pelo teclado (Tab, Enter/Espaço para virar o card), para usar o painel sem depender do mouse.|SHOULD|
|RF09|Como professor, quero cadastrar meus próprios verbos no banco, para adaptar o conteúdo à turma.|COULD (v2)|
|RF10|Como estudante, quero ver meu histórico de acertos entre sessões, para acompanhar minha evolução.|COULD (v2)|

**Fluxo principal:** Acessa o painel → 3 cards são sorteados → preenche os 3 campos de cada card → clica no card → vê certo/errado → repete para os outros 2 cards → clica em "Nova rodada" → recomeça.

**Fluxo alternativo:** Estudante vira o card sem preencher nada → todos os campos aparecem como errados (em branco não conta como acerto) → estudante toca de novo para reabrir e preencher.

## 6. Edge Cases e Requisitos Não-Funcionais

**Edge cases:**

- Campo vazio ao virar o card → tratado como resposta incorreta (não gera erro, apenas marca ✗).
- Resposta com diferenças de capitalização ou espaços (" Ran ", "RAN") → deve ser normalizada e considerada correta.
- Resposta com "to " antes do verbo na tradução (ex.: "to run" em vez de "run") → deve ser aceita.
- Verbo com duas formas possíveis no português ("ser / estar") → já tratado no banco atual como um único card; [A DEFINIR] se isso deve virar dois cards separados no futuro.
- Sorteio não deve repetir o mesmo verbo duas vezes na mesma rodada (já garantido pela lógica de seleção sem reposição).
- Usuário clica em "Nova rodada" no meio de uma rodada não finalizada → perde as respostas em andamento sem confirmação. [A DEFINIR] se deve haver um aviso de confirmação.

**Requisitos não-funcionais:**

- **Performance:** interação de virar o card deve responder em <100ms (client-side, sem chamada de rede).
- **Responsividade:** layout deve funcionar em telas a partir de ~360px de largura (mobile), reorganizando os cards em coluna única.
- **Acessibilidade:** cards devem ser focáveis e acionáveis via teclado (Tab + Enter/Espaço); estado de foco deve ser visível; respeitar `prefers-reduced-motion` para o efeito de flip.
- **Dados/privacidade:** nenhum dado pessoal é coletado ou armazenado nesta fase (sem login, sem persistência) — não há requisitos de LGPD aplicáveis ao MVP. Isso muda caso RF10 (histórico) seja implementado futuramente.

## 7. Critérios de Aceite

- DADO que o painel é carregado, QUANDO a página abre, ENTÃO 3 cards com verbos distintos são exibidos, cada um com 3 campos de input vazios ao lado.
- DADO um card com respostas preenchidas corretamente nos 3 campos, QUANDO o estudante clica no card, ENTÃO o card vira E os 3 campos exibem marcação de acerto (✓).
- DADO um card com pelo menos uma resposta incorreta ou vazia, QUANDO o estudante clica no card, ENTÃO o card vira E o(s) campo(s) incorreto(s) exibem marcação de erro (✗), mantendo os corretos com ✓.
- DADO uma resposta com variação de maiúsculas/minúsculas, espaços extras, ou prefixo "to " na tradução, QUANDO comparada ao gabarito, ENTÃO deve ser considerada correta.
- DADO um card já virado (mostrando o gabarito), QUANDO o estudante clica nele novamente, ENTÃO o card volta para a frente E os campos voltam a ser editáveis.
- DADO qualquer estado do painel, QUANDO o estudante clica em "Nova rodada", ENTÃO 3 novos verbos são sorteados, todos os cards voltam à frente, e todos os campos são limpos.
- DADO que 1, 2 ou 3 cards já foram virados, QUANDO o estudante observa o placar, ENTÃO o placar exibe corretamente "X/9" somando apenas os campos dos cards já conferidos.
- DADO acesso via teclado, QUANDO o estudante navega com Tab até um card e pressiona Enter ou Espaço, ENTÃO o card vira exatamente como no clique do mouse.

## 8. Métricas de Sucesso

> Como o produto ainda não foi lançado, não há baseline real. As métricas abaixo são propostas para instrumentação futura — os valores de baseline e target são [A DEFINIR] após os primeiros dados de uso.

- **Primária:** [A DEFINIR] — proposta: % de sessões em que o estudante completa pelo menos 1 rodada inteira (3 cards virados), de baseline [A DEFINIR] para target [A DEFINIR], em [A DEFINIR] semanas após o lançamento.
- **Secundária 1:** Número médio de rodadas por sessão (proxy de engajamento). Baseline [A DEFINIR], target [A DEFINIR].
- **Secundária 2:** Taxa média de acerto por rodada (proxy de dificuldade do banco de verbos — muito alta pode indicar banco fácil demais, muito baixa pode indicar frustração). Baseline [A DEFINIR], target [A DEFINIR].
- **Como medir:** requer instrumentação de analytics (evento por rodada concluída, evento por card virado) — não implementada no MVP atual. Ferramenta e owner: [A DEFINIR].

## 9. Riscos e Mitigações

|Risco|Tipo|Prob.|Impacto|Mitigação|
|---|---|---|---|---|
|Banco de 30 verbos é pequeno demais e o estudante decora a ordem/repetição em vez do conteúdo|Produto|Média|Médio|Expandir banco de verbos em v2; monitorar repetição percebida via feedback qualitativo|
|Validação exata de string rejeita respostas corretas com pequenas variações não previstas (plural, sinônimo)|Técnico|Média|Médio|Mapear variações aceitáveis por verbo (ex.: "dreamed/dreamt") na v2; hoje mitigado parcialmente pela normalização de case/espaços/"to "|
|Sem persistência, o estudante perde a noção de evolução e abandona o hábito de uso recorrente|Produto|Média|Alto|Priorizar RF10 (histórico) como próxima entrega caso engajamento de sessão única se mostre positivo|
|Ausência de dados reais de uso pode levar a decisões de v2 baseadas em suposição, não evidência|Negócio|Alta|Médio|Rodar piloto informal com um pequeno grupo de estudantes antes de expandir escopo|

## 10. Timeline e Dependências

**Fases:**

- **Fase 0 — MVP (concluído/protótipo funcional):** painel com banco fixo de 30 verbos, flip com correção automática, nova rodada, placar de sessão. Sem persistência.
- **Fase 1 — Validação:** piloto informal com estudantes reais, coleta de feedback qualitativo. Estimativa: [A DEFINIR].
- **Fase 2 — Instrumentação:** adicionar analytics básico para medir as métricas da Seção 8. Estimativa: [A DEFINIR].
- **Fase 3 — Expansão (candidatos, sujeitos a validação da Fase 1):** banco de verbos maior, aceitar respostas alternativas, histórico de progresso (RF10), cadastro de verbos por professor (RF09). Estimativa: [A DEFINIR] com eng.

**Dependências:**

- Internas: nenhuma equipe externa envolvida até o momento — projeto individual/solo.
- Externas: nenhuma integração de terceiros no MVP atual.

**Marcos:**

- M1: Protótipo funcional navegável — ✅ concluído (este documento descreve o estado atual).
- M2: Piloto com estudantes reais realizado — [A DEFINIR].
- M3: Decisão de expansão de escopo baseada em dados do piloto — [A DEFINIR].

---

## Checklist de Qualidade

- [x] Sumário executivo compreensível em 30s
- [ ] Evidências citadas com fonte _(pendente — projeto sem dados próprios ainda)_
- [x] Escopo negativo definido
- [ ] Métricas com baseline E target _(pendente — [A DEFINIR] até instrumentação)_
- [x] Edge cases cobertos
- [x] Riscos identificados com mitigação