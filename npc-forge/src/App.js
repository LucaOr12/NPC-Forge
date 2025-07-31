import './App.scss';
import { useState } from 'react';
import NavBar from './NavBar.jsx';
function App() {
  const [npc, setNpc] = useState(null);
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(false);
  const apiKey = process.env.REACT_APP_OPENROUTER_API_KEY;


  const extractJSON = (text) => {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)```/i);
    if (jsonMatch && jsonMatch[1]) {
      return jsonMatch[1].trim();
    }
    return text.trim();
  };

  const generateNPC = async () => {
    setLoading(true);

    const prompt = `You are a creative NPC generator for a Dungeons & Dragons game.  
Generate a detailed NPC with the following fields as a JSON object:

- name: a fantasy-style name with a nickname or title  
- race: a fantasy race (e.g. Human, Elf, Tiefling, Dwarf, etc.)  
- role: the NPC’s social role or occupation (e.g. merchant, beggar, blacksmith, thief)  
- goal: the main ambition or objective of the NPC  
- flaw: a personal weakness or character flaw  
- secret: a hidden truth or secret about the NPC  
- catchphrase: a typical phrase or saying the NPC often uses, in quotes  

Make the NPC vivid and believable. Output only the JSON object, nothing else.

Example output:

{
  "name": "Drenra the Lame",
  "race": "Tiefling",
  "role": "Beggar",
  "goal": "Join the Thieves' Guild",
  "flaw": "Lies compulsively",
  "secret": "Illegitimate child of a noble",
  "catchphrase": "Oh, but you strangers trust too easily..."
}`;

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-small-3.2-24b-instruct:free',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 200,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error ${response.status}: ${response.statusText || ''} - ${errorText}`);
      }

      const data = await response.json();
      const npcJsonString = data.choices[0].message.content;
      const cleanedJson = extractJSON(npcJsonString);
      const npcData = JSON.parse(cleanedJson);
      setNpc(npcData);
    } catch (error) {
      console.error('Failed to generate NPC:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`theme-${theme}`}>
      <NavBar theme={theme} />
      <div className="container">
        <h1>NPC FORGE</h1>
        <p>Forge your unique NPCs in seconds</p>

        <button className="button-forge" onClick={generateNPC} disabled={loading}>
          {loading ? 'Forging...' : 'Forge NPC'}
        </button>

        <button className="theme-toggle" onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
        </button>

        {npc && (
          <div className="npc-card" key={npc.name}>
            <h2>{npc.name}</h2>
            <p><strong>Race:</strong> {npc.race}</p>
            <p><strong>Role:</strong> {npc.role}</p>
            <p><strong>Goal:</strong> {npc.goal}</p>
            <p><strong>Flaw:</strong> {npc.flaw}</p>
            <p><strong>Secret:</strong> {npc.secret}</p>
            <p><strong>Catchphrase:</strong> <em>"{npc.catchphrase}"</em></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

