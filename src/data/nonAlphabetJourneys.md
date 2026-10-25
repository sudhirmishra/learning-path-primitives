# Non-Alphabet Learning Journey Proposals

This document outlines proposed non-alphabet learning journeys designed for toddlers and preschoolers using the platform's 7 interactive UI game primitives:
1. **New Word** (`new-word`)
2. **Read** (`read`)
3. **Listen & Find** (`listen-and-find`)
4. **Find** (`find`)
5. **Opposites** (`opposites`)
6. **Match** (`match`)
7. **Think** (`think`)

Following our design principle established in the **Letter A ("Apple")** journey, each journey focuses on **high cognitive repetition around a single primary anchor concept** to reinforce learning without overwhelming early learners.

---

## Journey 1: Colors — "The Color Red" 🍓 (Recommended)
*Colors are immediate visual concepts for early childhood. This journey anchors on the vibrant color Red with a Strawberry / Red Apple theme.*

| Step | Primitive | Content & Visuals | Audio & Interaction |
| :--- | :--- | :--- | :--- |
| **1** | **New Word** | **Red** 🍓<br>Word on left, large bright strawberry on right. | *Audio:* "Red! R-E-D spells Red."<br>*Caption:* "This is the color Red." |
| **2** | **Read** | **Read Along**<br>Illustration: 🍓✨ | *Sentence:* "A strawberry is sweet and red."<br>Live karaoke word-by-word TTS highlighting. |
| **3** | **Listen & Find** | **2 Choices: Red vs Blue**<br>🍓 Red Strawberry vs 🫐 Blue Blueberry | *Audio:* "Can you listen and find the Red fruit?"<br>2 large friendly cards. |
| **4** | **Find** | **Garden Scene Search**<br>Theme: Lush green garden 🌿 | *Instruction:* "Look around the green garden! Can you find the red strawberry?"<br>Target: 🍓 hidden among green leaves 🍃. |
| **5** | **Opposites** | **Red Light vs Green Light**<br>🛑 Stop (Red) vs 🟢 Go (Green) | *Concept:* Stop and Go!<br>Explores real-world color meaning. |
| **6** | **Think** | **2-Choice Riddle**<br>🚒 Red Fire Truck vs 🚓 Blue Police Car | *Prompt:* "Which rescue vehicle is bright red?"<br>Target: 🚒 Fire Truck. |

---

## Journey 2: Animals & Sounds — "The Friendly Dog" 🐶
*Toddlers love animal sounds, simple actions, and pet interactions.*

| Step | Primitive | Content & Visuals | Audio & Interaction |
| :--- | :--- | :--- | :--- |
| **1** | **New Word** | **Dog** 🐶 (Woof!)<br>Word on left, cheerful golden puppy on right. | *Audio:* "Dog! Woof woof goes the dog."<br>*Caption:* "A dog is a friendly pet." |
| **2** | **Read** | **Read Along**<br>Illustration: 🐶🎾 | *Sentence:* "The happy dog wags its tail."<br>Synchronized read-aloud caption. |
| **3** | **Listen & Find** | **2-Choice Animal Sound**<br>🐶 Puppy vs 🐱 Kitten | *Audio:* "Who says 'Woof woof'? Find the dog!" |
| **4** | **Find** | **Backyard Scene**<br>Theme: Backyard / Park 🌳 | *Instruction:* "The puppy is playing outside. Can you find the dog?"<br>Distractors: ⚽ ball, 🌼 flowers, 🪵 bench. |
| **5** | **Opposites** | **Big Dog vs Little Puppy**<br>🐕 Big Dog vs 🐶 Tiny Pup | *Concept:* Big and Little! |
| **6** | **Match** | **Animals to their Treats**<br>2 Pairs | 🐶 Dog ↔ 🦴 Bone<br>🐱 Cat ↔ 🐟 Fish |
| **7** | **Think** | **2-Choice Riddle**<br>🦴 Bone vs 🥕 Carrot | *Prompt:* "What tasty treat does a dog love to chew on?"<br>Target: 🦴 Bone. |

---

## Journey 3: Shapes — "The Round Circle" 🟡
*Focuses on geometry recognition in everyday familiar objects.*

| Step | Primitive | Content & Visuals | Audio & Interaction |
| :--- | :--- | :--- | :--- |
| **1** | **New Word** | **Circle** 🟡<br>Word on left, bright yellow sun / ball on right. | *Audio:* "Circle. Round and round with no corners!"<br>*Caption:* "A circle is round." |
| **2** | **Read** | **Read Along**<br>Illustration: ⚽🌿 | *Sentence:* "The round ball rolls on the green grass."<br>Word-by-word TTS highlighting. |
| **3** | **Listen & Find** | **2 Choices: Circle vs Square**<br>⚽ Round Soccer Ball vs 📦 Square Box | *Audio:* "Can you find the toy that is round like a circle?" |
| **4** | **Find** | **Playroom Scene**<br>Theme: Cozy nursery / playroom 🧸 | *Instruction:* "Look around the playroom! Can you spot the round clock?"<br>Target: ⏰ Round Wall Clock. |
| **5** | **Think** | **2-Choice Real-World Shape Riddle**<br>🍕 Whole Round Pizza vs 📐 Triangle Ruler | *Prompt:* "Which yummy food is shaped like a round circle?"<br>Target: 🍕 Pizza. |

---

## Journey 4: Daily Routines & Emotions — "Bedtime & Sleep" 🌙
*Focuses on daily habits, winding down, and emotional opposites.*

| Step | Primitive | Content & Visuals | Audio & Interaction |
| :--- | :--- | :--- | :--- |
| **1** | **New Word** | **Sleep / Night** 🌙<br>Word on left, glowing crescent moon on right. | *Audio:* "Sleep. Time to rest your eyes."<br>*Caption:* "The moon shines quietly at night." |
| **2** | **Read** | **Read Along**<br>Illustration: 🛏️⭐ | *Sentence:* "I brush my teeth and tuck into bed."<br>Synchronized read-aloud caption. |
| **3** | **Opposites** | **Day vs Night**<br>☀️ Sunny Day vs 🌙 Quiet Night | *Concept:* Daytime is for play, nighttime is for sleep. |
| **4** | **Listen & Find** | **2 Choices: Bedtime Objects**<br>🛏️ Cozy Bed vs 🛝 Playground Slide | *Audio:* "Where do we sleep when it is night time? Find the bed!" |
| **5** | **Find** | **Bedroom Scene Search**<br>Theme: Starry Bedroom 🌌 | *Instruction:* "Can you find the cuddly Teddy Bear on the bed?"<br>Target: 🧸 Teddy Bear. |
| **6** | **Think** | **2-Choice Routine Riddle**<br>👕 Soft Pajamas vs 🎒 Heavy Backpack | *Prompt:* "What do we wear when it is time to sleep?"<br>Target: 👕 Pajamas. |

---

## Implementation Guidelines
1. **Zero Primitive Code Changes**: All journeys should be purely configured as TypeScript data definitions (matching the schema in `src/data/letterAPath.ts`).
2. **Cognitive Repetition**: Keep choices between 2 items for toddlers (avoid 6 options unless explicitly for older kids).
3. **Multi-Modal**: Always supply Audio (TTS / prompt), Visual (emojis / SVG graphics), and Text (ReadAloud captions) for accessibility and dual-coding learning.
