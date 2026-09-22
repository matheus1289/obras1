# 🏗️ ObraControl — Sistema de Controle de Gastos de Obra

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Design](https://img.shields.io/badge/Mobile--First-Native%20Feel-amber?style=for-the-badge)
![License](https://img.shields.io/badge/Licen%C3%A7a-MIT-green?style=for-the-badge)

O **ObraControl** é um sistema web moderno, simples e extremamente produtivo desenvolvido para o gerenciamento de custos de construção e reformas. Permite acompanhar em tempo real os gastos com **mão de obra**, **materiais**, **ferramentas**, **serviços** e outras despesas da obra, garantindo que o orçamento planejado não seja ultrapassado.

---

## ✨ Funcionalidades

- 📊 **Dashboard Interativo**:
  - **Barra de Progresso do Orçamento**: Acompanhamento em tempo real do limite financeiro definido com alertas visuais.
  - **Cards de KPIs por Categoria**: Visualização dos custos acumulados com mão de obra, materiais, ferramentas, serviços e outros.
  - **Gráfico de Gastos por Categoria**: Visualização analítica em gráfico de barras construído com a Canvas API.
  - **Últimos Lançamentos**: Acesso rápido às despesas adicionadas recentemente.

- 📝 **Gerenciamento de Lançamentos (CRUD)**:
  - Adição, edição e remoção de gastos com validação de campos em tempo real.
  - Campos para Data, Categoria, Descrição, Valor e Responsável.

- 🔎 **Filtros Avançados e Histórico**:
  - Filtragem por **categoria** e por **período (data inicial e final)**.
  - Resumo dinâmico com contagem de registros e soma dos totais filtrados.

- 📥 **Exportação de Dados**:
  - Exportação de todo o histórico em formato **CSV** pronto para abertura no Excel ou Google Sheets.

- 📱 **Experiência Mobile First (Nativa)**:
  - **Bottom Navigation Bar**: Barra de navegação fixa estilo aplicativo mobile (iOS/Android).
  - **Bottom Sheet Modal**: Formulário de adição deslizante na parte inferior para facilitado manuseio em telas touch.

- 💾 **Persistência Local**:
  - Todos os dados são armazenados localmente no navegador (`localStorage`), funcionando 100% offline.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Descrição / Uso |
| :--- | :--- |
| **HTML5 Semântico** | Estruturação acessível com tags semânticas e atributos ARIA |
| **CSS3 Avançado** | Design System customizado (CSS Variables, Flexbox, Grid Layout, Glassmorphism) |
| **JavaScript (ES6+)** | Lógica da aplicação organizada no padrão de Módulos (IIFE) |
| **Canvas API** | Renderização dinâmica do gráfico de barras no Dashboard |
| **LocalStorage API** | Persistência de dados offline no navegador |
| **Font Awesome 6** | Iconografia moderna e intuitiva |
| **Google Fonts** | Tipografia refinada (*Syne* para títulos e *DM Sans* para interface) |

---

## 📚 O Que Aprendi Durante o Desenvolvimento

Durante a construção deste projeto, refinei conceitos fundamentais de desenvolvimento web frontend:

1. **Arquitetura Modular em Vanilla JavaScript (IIFE)**:
   - Aprendi a organizar o código em módulos encapsulados (`Storage`, `Dashboard`, `Form`, `Table`, `App`) sem utilizar frameworks pesados ou ferramentas de build (Webpack/Vite), mantendo o código limpo, legível e de fácil manutenção.

2. **Design de Interface Responsiva & Mobile-First**:
   - Implementação de layouts fluidos que se adaptam perfeitamente desde telas de smartphones pequenos (320px) até monitores ultrawide.
   - Criação de componentes nativos de apps mobile como **Bottom Sheets** e **Bottom Navigation Bar** com micro-interações refinadas.

3. **Manipulação de Estado e Persistência no Browser**:
   - Tratamento de operações CRUD (Create, Read, Update, Delete) diretamente no `localStorage` com controle de erros e sincronização reativa entre as telas.

4. **Visualização de Dados com Canvas API**:
   - Desenhando gráficos de barras customizados diretamente em elemento `<canvas>` sem dependências externas obrigatórias.

5. **Acessibilidade e Boas Práticas (UX/UI)**:
   - Uso de feedback visual imediato (*Toasts*, modais de confirmação de exclusão) e prevenção de bugs comuns em mobile (como o zoom automático em campos de texto no iOS).

---

## 📁 Estrutura de Arquivos do Projeto

```text
nova-project/
├── index.html              # Estrutura principal da aplicação
├── README.md               # Documentação do projeto
├── css/
│   ├── global/
│   │   ├── reset.css       # Reset CSS e box-sizing
│   │   ├── variables.css   # Variáveis de cores, fontes e espaçamentos
│   │   └── base.css        # Tipografia, botões e utilitários globais
│   └── sections/
│       ├── header.css      # Topo fixo e Bottom Nav móvel
│       ├── dashboard.css   # Cards de orçamento, estatísticas e gráfico
│       ├── table.css       # Tabela de lançamentos e filtros
│       ├── form.css        # Formulários e área de configurações
│       └── modal.css       # Overlay, Bottom Sheet e Toast de notificações
└── js/
    ├── storage.js          # Módulo de persistência no LocalStorage
    ├── main.js             # Orquestrador da aplicação e navegação
    └── sections/
        ├── dashboard.js    # Lógica de renderização do Dashboard
        ├── form.js         # Manipulação e validações do formulário
        └── table.js        # Lógica de filtros e tabela de dados
```

---

## 🚀 Como Executar o Projeto

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/obracontrol.git
   ```

2. **Acesse a pasta do projeto**:
   ```bash
   cd obracontrol
   ```

3. **Abra o arquivo `index.html`**:
   - Basta dar um duplo clique no arquivo `index.html` ou abri-lo diretamente em qualquer navegador moderno (Chrome, Edge, Firefox, Safari).
   - Não é necessário instalar o Node.js nem rodar servidores locais.

---

## 📝 Licença

Este projeto está sob a licença [MIT](./LICENSE). Sinta-se livre para usar, estudar e aprimorar!

---

<p center="align">
  Desenvolvido com 💛 para o controle produtivo de obras e reformas.
</p>
