import { useState } from 'react';

const EMOJI_OPTIONS = ['✅', '💪', '📚', '🏃', '💧', '🧘', '🥗', '😴', '🎯', '✍️', '🎵', '🌿'];

interface Props {
  onAdd: (name: string, emoji: string) => void;
  onClose: () => void;
}

export default function AddHabitModal({ onAdd, onClose }: Props) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('✅');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), emoji);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>New Habit</h2>
        <form onSubmit={handleSubmit}>
          <div className="emoji-picker">
            {EMOJI_OPTIONS.map(e => (
              <button
                key={e}
                type="button"
                className={`emoji-btn ${emoji === e ? 'selected' : ''}`}
                onClick={() => setEmoji(e)}
              >
                {e}
              </button>
            ))}
          </div>
          <input
            autoFocus
            type="text"
            placeholder="Habit name..."
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={50}
          />
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={!name.trim()}>Add Habit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
