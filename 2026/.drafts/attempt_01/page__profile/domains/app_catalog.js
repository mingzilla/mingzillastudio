// To add an app: append an entry here and put its image in assets/. Nothing else changes.
// media: { poster, alt, playSrc } playable in an iframe | { poster, alt, href } link out.
class AppCatalog {
  static all() {
    return [
      {
        id: 'simzilla', nav: 'Simzilla', title: 'Simzilla — LLM Driven Game World',
        headline: 'Built in 2 Days',
        challenge: 'How much of a playable world can be built in 2 days?',
        what: 'Multiple players play in the same world at the same time. NPCs have mood, emotion and an impression about other NPCs, animals and the world around them — and the LLM drives their decisions and who they chat to.',
        result: { strong: '2 days', text: 'idea to a playable multiplayer world' },
        media: {
          poster: './assets/05__simzilla.jpg',
          alt: 'Simzilla low-poly village with player characters, houses, trees and sheep',
          playSrc: 'https://simzilla.mingzillastudio.co.uk/index.html?player=demo',
        },
      },
    ];
  }
}
