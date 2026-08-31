# LLM Usage at Scale

## AI Harness Engineering

### Co-work Agent Team

Challenge: How can I go to bed and my agent teams do work for me reliably?

```mermaid
flowchart LR
    %% Node definitions
    A["Agent Team"]

    subgraph ROLES["Roles and Communication"]
        direction LR
        B["Worker"]
        C["Reviewer"]
        D["Researcher"]
        E["Supervisor"]
        B <--> C <--> D <--> E
    end

    subgraph PROCESS["Process"]
        direction LR
        F["Tickets"]
        G["Proposal"]
        H["Implement"]
        I["Review"]
        J["Document"]
        F --> G --> H --> I --> J
    end

    subgraph RELIABILITY["Reliability"]
        direction LR
        K["Hooks"]
        L["Rules"]
        M["Long Session Management"]
        K <--> L <--> M
    end

    subgraph PROCEDURES["Procedures"]
        direction LR
        Q["Cold Start"]
        N["Check in"]
        O["Handover"]
        P["Check out"]
        Q --> N --> O --> P
    end

    %% Arrow connections
    A --> ROLES
    A --> PROCESS
    A --> RELIABILITY
    A --> PROCEDURES
```

### Skill Management

Challenge: How can I manage skills when there are 50+

```mermaid
flowchart LR
    %% Node definitions
    A["Skill Management"]

    subgraph DEPENDENCIES["Dependencies"]
        direction LR
        B["Core"]
        C["General"]
        D["Workflow"]
        B --> C --> D
    end

    subgraph SEGREGATION["Segregation"]
        direction LR
        E["Operational - Running Harness"]
        F["Authoring - Harness write to Projects"]
        G["Projects - Projects using skills"]
    end

    %% Arrow connections
    A --> DEPENDENCIES
    A --> SEGREGATION
```

### Skill Optimisation

Challenge: How can we optimize skills, keep it shorter and runs more reliably

```mermaid
flowchart LR
    %% Node definitions
    A["Skill Optimisation"]

    subgraph DIAGNOSING["Skill Diagnosing"]
        direction LR
        B["Prompt Caching"]
        C["Wasteful Tool Calls"]
        D["Speed and Cost"]
        B <--> C <--> D
    end

    subgraph CLEANING["Skill Cleaning"]
        direction LR
        E["Structure"]
        F["Length"]
        G["Violations"]
        E <--> F <--> G
    end

    subgraph RESPONSIBILITY["Skill Responsibility"]
        direction LR
        H["LLM vs Code"]
        I["LLM to Code"]
        H --> I
    end

    %% Arrow connections
    A --> DIAGNOSING
    A --> CLEANING
    A --> RESPONSIBILITY
```

## LLM Processing for Millions of Files

### Whole UK Investment Data Processing

Challenge: How can we process data for an unfamiliar domain (e.g. how do we know if a company received investment?)

```mermaid
flowchart LR
    %% Node definitions
    A["Unfamiliar Domain Research"]

    subgraph RESEARCH["RESEARCH"]
        direction LR
        B["Taxonomy Research"]
        C["Decision Tree Research"]
        D["Formula Simplification"]
        B --> C --> D
    end

    %% Arrow connections
    A --> RESEARCH
```

### PDF Discovery and Processing Pipeline

Challenge: Can we make sure we have all the data first

```mermaid
flowchart LR
    %% Node definitions
    A["Data Discovery"]
    B["API Harvest"]
    C["PDF Download"]
    D["PDF Conversion"]
    E["Investment Analysis"]

    %% Arrow connections
    A --> B --> C --> D --> E
```

### PDF Extracted Text to Tables (LLM with Code)

Challenge: At 5 min per record, processing millions via LLM is impossible

Visualisation: "Text -> Table"

```mermaid
flowchart LR
    %% Node definitions
    A["File Classification"]

    subgraph RESEARCH["RESEARCH"]
        direction LR
        B["Domain Taxonomy Research"]
        C["Create Dimension Combinations"]
        B --> C
    end

    subgraph DIMENSIONS["RESULT"]
        D["Type"]
        E["Format"]
        F["Generation"]
    end

    %% Arrow connections
    A --> RESEARCH
    C --> DIMENSIONS
```

```mermaid
flowchart LR
    %% Node definitions
    A["File Split"]

    subgraph RESEARCH["RESEARCH"]
        direction LR
        B["File Structure Mass Analysis"]
        C["Split Algorithm Research"]
        D["Articulate Decision Tree"]
        B --> C --> D
    end

    E["Slice to Shards"]

    %% Arrow connections
    A --> RESEARCH
    D --> E
```

```mermaid
flowchart LR
    %% Node definitions
    A["File Extract"]

    subgraph RESEARCH["RESEARCH"]
        direction LR
        B["Shard Structure Mass Analysis"]
        C["Data Census and Normalisation Research"]
        D["Extraction Algorithm Research"]
        E["Articulate Decision Tree"]
        B --> C --> D --> E
    end

    F["Extract Fields"]

    %% Arrow connections
    A --> RESEARCH
    E --> F
```

## LLM Summary for Millions of Websites (Scale & Speed)

Challenge: How can we finish processing millions of long text with LLM very fast and accurate

```mermaid
flowchart LR
    %% Node definitions
    A["Web Text"]
    B["Clean Text"]
    C["Prompt Engineering"]
    D["Summary - 1.5s/site"]
    E["Similarity Analysis"]

    %% Arrow connections
    A --> B --> C --> D --> E
```

---

## LLM Assisted Automation Pipelines

### UI and Test Automation at Scale

Challenge: How can I handle UI and Test Automation at Scale, and adapt UI changes in isolation

```mermaid
flowchart LR
%% Node definitions
    A["UI Automation"]

    subgraph ELEMENT["ELEMENT"]
        direction LR
        G["Screen"]
        H["Panel"]
        I["Button"]
        G --- H --- I
    end

    subgraph FLOW["FLOW"]
        direction LR
        D["Flow"]
        E["Task"]
        F["Wrapper"]
        D --- E --- F
    end

%% Arrow connections
    A --- ELEMENT
    A --- FLOW
```

Application:

- Automation Testing: How can I handle Playwright Test Automation at Scale, especially when app is under dev
- Game Play: How can I collect daily game reward automatically

### Videos to Knowledge Base

Challenge: How can I consume knowledge quickly if a video has content relevant to me

```mermaid
flowchart LR
    %% Node definitions
    A["Video Transcript Download"]
    B["Convert to Human Friendly Content"]
    C["Relevant Analysis"]

    %% Arrow connections
    A --> B --> C
```

### Automation - Handle UK Tax Return

Challenge: Handle Tax Return Automatically with Accuracy and Idempotency

```mermaid
flowchart LR
%% Node definitions
    A["Gmail Inbox"]
    B["Local Folder"]
    C["File Normalisation"]
    D["File Grouping"]
    E["Data Extraction"]
    F["Data Verification"]
    G["Report Generation"]
%% Arrow connections
    A --> B --> C --> D --> E --> F --> G
```

---

## 10 Million Records Search

### Similarity Search at Scale (Vector DB)

Challenge: How can we create a vdb that stores >10 million records?

```mermaid
flowchart LR
%% Node definitions
    A["Similarity search at scale"]
    B["vdb choice"]
    C[">50gb"]
    D[">10m rows"]
    E["Creation Speed"]
    F["Query Speed"]
%% Arrow connections
    A --> B --> C
    B --> D
    B --> E
    B --> F
```

### Smart Search at Scale (Micro Services)

Challenge: How can we handle Smart Search with >10 million records

```mermaid
flowchart LR
%% Node definitions
    A["UI"]
    B["Load Balancer (Ngnix)"]
    C["API * n (Fast API)"]
    D["Cache (Redis)"]
    E["Database"]
%% Arrow connections
    A --> B --> C --> D --> E
```

---

## Knowledge Sharing

Content Creator: 200+ Videos, 6k+ Subscribers (mid 2026)
