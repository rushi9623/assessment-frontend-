import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from './store';
import { shuffle } from '../utils/utils';

export interface GameState {
  deck: string[];
  deckRevealed: boolean[];
  gameWon: boolean;
  gameOver: boolean;
  diffuserDiscovered: boolean;
  score: number;
  gamesLost: number;
  username: string;
  leaderboard: User[];
}

const initialState: GameState = {
  deck: shuffle(['😼', '🙅‍♂️', '🔀', '💣', '😼']),
  deckRevealed: [false, false, false, false, false],
  gameWon: false,
  gameOver: false,
  diffuserDiscovered: false,
  score: 0,
  gamesLost: 0,
  username: '',
  leaderboard: [],
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setUsername: (state, action) => {
      console.log('Setting username:', action.payload.name); // Debugging
      state.username = action.payload.name;
    },
    gameOver: (state) => {
      state.gameOver = true;
      state.gamesLost += 1;
    },
    revealCard: (state, action) => {
      state.deckRevealed[action.payload.index] = true;
    },
    restartGame: (state) => {
      state.gameOver = false;
      state.gameWon = false;
      state.diffuserDiscovered = false;
      state.deckRevealed = [false, false, false, false, false];
      state.deck = shuffle(['😼', '🙅‍♂️', '🔀', '💣', '😼']);
    },
    drawCard: (state, action) => {
      const index = action.payload.index;
      const cardType = action.payload.cardType;

      switch (cardType) {
        case '😼':
          state.deck = state.deck.filter((_, i) => i !== index);
          state.deckRevealed = state.deckRevealed.filter((_, i) => i !== index);
          break;

        case '💣':
          if (state.diffuserDiscovered) {
            state.gameWon = true;
            state.score += 1; // Update winning count
          } else {
            state.gameOver = true;
            state.gamesLost += 1;
          }
          break;

        case '🙅‍♂️':
          state.deck = state.deck.filter((_, i) => i !== index);
          state.deckRevealed = state.deckRevealed.filter((_, i) => i !== index);
          state.diffuserDiscovered = true;
          state.gameWon = true;
          state.score += 1; // Update winning count
          break;

        case '🔀':
          state.gameOver = false;
          state.gameWon = false;
          state.diffuserDiscovered = false;
          state.deckRevealed = [false, false, false, false, false];
          state.deck = shuffle(['😼', '🙅‍♂️', '🔀', '💣', '😼']);
          break;

        default:
          state.deck = shuffle(state.deck);
          break;
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(getLeaderboard.fulfilled, (state, action) => {
      console.log('Leaderboard data received:', action.payload); // Debugging
      state.leaderboard = action.payload;
    });

    builder.addCase(getLeaderboard.rejected, (state, action) => {
      console.error('getLeaderboard Error:', action.error);
    });

    builder.addCase(getScore.fulfilled, (state, action) => {
      console.log('getScore:', action.payload); // Debugging
      state.score = action.payload.score;
    });

    builder.addCase(getScore.rejected, (state, action) => {
      console.error('getScore Error:', action.error);
    });

    builder.addCase(updateScore.fulfilled, (state, action) => {
      state.score = action.payload.score;
    });

    builder.addCase(updateScore.rejected, (state, action) => {
      console.error('updateScore Error:', action.error);
    });
  },
});

export const getLeaderboard = createAsyncThunk(
  'leaderboard',
  async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/leaderboard`, {
        mode: 'cors',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('getLeaderboard Fetch Error:', error);
      throw error;
    }
  }
);

export const getScore = createAsyncThunk<any, User>(
  'score',
  async (user: User) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/getScore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user.username }),
        mode: 'cors',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('getScore Fetch Error:', error);
      throw error;
    }
  }
);

export const updateScore = createAsyncThunk<any, User>(
  'updatescore',
  async (user: User) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/updateScore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user.username, score: user.score + 1 }),
        mode: 'cors',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('updateScore Fetch Error:', error);
      throw error;
    }
  }
);

export const { gameOver, restartGame, drawCard, revealCard, setUsername } = gameSlice.actions;
export default gameSlice.reducer;
