// Create an audio context only when needed
let audioContext: AudioContext | null = null;

export async function playBuzzSound() {
  try {
    // Initialize audio context on first use
    if (!audioContext) {
      audioContext = new AudioContext();
    }

    // Create an oscillator for the buzz sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Configure the oscillator
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(150, audioContext.currentTime);

    // Configure the gain (volume)
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    // Connect the nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Play the sound
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (error) {
    console.error('Error playing buzz sound:', error);
  }
}