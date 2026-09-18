## What to achieve

the game character was generated based on

```text
    +-------+
    |--   --|
    +-------+
    ---+|+---
       | |
```

on the asset creation page, we need to allow
using such a ASCII diagram to create a .md file for the asset, then you can convert the .md into a js version, then the ui can display it

the flow can be:

- i can just same make 3 options -> 3 .md files created
- hit ui reload draft button -> i can choose one of the 3 options to copy into the canvas
- edit canvas and hit save -> save to another .md file
- come back to claude code to generate
- hit ui reload asset button

```text
  ___     ___     ___     ___   ___         
 |_1_|   |_2_|   |_3_|   |_L_| |_R_|       
 +-------------------+   +-------------------+  
 |                   |   |                   |  
 |       Canvas      |   |      Preview      |  
 |                   |   |                   |  
 |                   |   |                   |  
 +-------------------+   +-------------------+  
  ___             ___     ___             ___   
 |_R_|           |_S_|   |_R_|           |_S_|  
```

- You have refresh and save at the bottom
- Canvas have 3 options on the top
- Preview have L/R rotation on the top because it's 3D
- We need to allow scaling/sizing definition somewhere
