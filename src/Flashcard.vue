<template>
  <div v-if="verb && noun" class="card">
    <div class="verb">{{ verb.infinitive }}</div>
    <div class="verb-english">{{ verb.meaning }}</div>

    <table>
      <thead>
        <tr>
          <th>Pronoun</th>
          <th>Conjugation</th>
          <th>Français</th>
          <th>English</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(conj, pronoun) in verb.conjugations" :key="pronoun">
          <td>{{ pronoun }}</td>
          <td>{{ conj }}</td>
          <td>{{ pronoun }} {{ conj }} {{ noun.article }} {{ noun.word }}</td>
          <td>{{ noun.english[pronoun] }}</td>
          <td>
            <div
              class="audio"
              @click="
                playAudio(`${pronoun} ${conj} ${noun.article} ${noun.word}`)
              "
              title="Écouter"
            >
              💬
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else class="loading">Loading flashcards…</div>
  <div class="buttons-verb-noun">
    <div class="next-btn" @click="nextCard">Next Verb</div>
    <div class="next-btn" @click="nextNoun">Next Noun</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const verb = ref(null);
const noun = ref(null);
let allVerbs = [];

async function loadData() {
  const res = await fetch("/public/data/flashcards.json");
  const data = await res.json();
  allVerbs = data.verbs;
  nextCard();
}

function nextNoun() {
  if (!verb.value) return;
  const verbNouns = verb.value.nouns;
  noun.value = verbNouns[Math.floor(Math.random() * verbNouns.length)];
}

function nextCard() {
  verb.value = allVerbs[Math.floor(Math.random() * allVerbs.length)];
  nextNoun();
}

async function playAudio(text) {
  try {
    const res = await fetch(`/.netlify/functions/voice?text=${encodeURIComponent(text)}`);
    if (!res.ok) throw new Error("Serverless TTS error");

    const blob = await res.blob();
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    audio.play();
  } catch (err) {
    console.warn(
      "Serverless TTS failed, using browser SpeechSynthesis fallback:",
      err
    );

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "fr-FR";
      utterance.rate = 0.9;
      const voices = speechSynthesis.getVoices();
      const frenchVoice = voices.find((v) => v.lang.startsWith("fr"));
      if (frenchVoice) utterance.voice = frenchVoice;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    } else {
      console.error("Browser does not support SpeechSynthesis API.");
    }
  }
}


onMounted(loadData);
</script>

<style scoped>
* {
  font-family: "Roboto Mono", monospace;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: normal;
}

.card {
  background: #4a70a9;
  max-width: 900px;
  margin: 2rem auto;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: #efece3;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
  border-radius: 0.8rem;
  overflow: hidden;
}

.verb {
  font-size: 35px;
  margin-bottom: 0rem;
  text-transform: uppercase;
}

.verb-english {
  font-size: 14px;
  margin-bottom: 1.5rem;
  font-style: italic;
}

th {
  background-color: rgba(255, 255, 255, 0.1);
  font-weight: 600;
  padding: 0.8rem;
  border-bottom: 2px solid #efece3;
  text-align: center;
}

td {
  padding: 0.7rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

tbody tr:nth-child(odd) {
  background-color: rgba(255, 255, 255, 0.05);
}

tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transition: background-color 0.2s;
}

.buttons-verb-noun {
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 900px;
  margin: 1rem auto;
}

.audio {
  border: 1px solid #efece3;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #efece3;
  padding: 0.3rem 0.6rem;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s;
}

.next-btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  background-color: #efece3;
  color: #4a70a9;
  font-weight: 600;
  transition: 0.2s;
}

.next-btn:hover {
  background-color: rgb(175, 175, 175);
  color: #4a70a9;
  cursor: pointer;
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

@media (max-width: 800px) {
  .card,
  .buttons-verb-noun {
    max-width: 100%;
    margin: 1rem auto;
    padding: 1rem;
  }

  .card {
    font-size: 11px;
  }

  .buttons-verb-noun {
    flex-direction: row;
    justify-content: space-around;
    gap: 0rem;
    max-width: 50%;
    margin: 0.5rem auto;
  }

  .next-btn {
    width: auto;
    min-width: 80px;
    padding: 0.4rem 0.8rem;
    font-size: 14px;
  }

  .verb {
    font-size: 20px;
  }

  .verb-english {
    font-size: 11px;
  }
}
</style>
