# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - Production Release

### Added
- **Dynamic AI Recommendations:** 8-dimensional cosine similarities across vibe, pace, genre_type, emotional_tone, era, complexity, and presentation.
- **Serendipity Engine:** Dynamic randomization weight to strictly tied mathematical matches breaking rigid algorithmic loops and surfacing Hidden Gems.
- **Offline-First Storage:** Local-first architecture fetching, caching, and running recommendation logic purely within client memory allowing for 0 API latency discovery UI updates.
- **Themes & UI Design Systems:** Integrated theme adaptation mapping contextual color variables dynamically for 4 total visual modes (Matte, Batman, Experimental, Editorial).

### Changed
- Migrated out from traditional strict backend dependency over to a localized Singleton design reducing database calls to `0` after initial instantiation.
- Redesigned Mode selection logic fixing stale-state React closures to immediately update the discovery feed.

### Fixed
- Re-architectured `diversifyResults` sorting array truncation bug that sometimes prevented displaying a full 40 movie grid.
- Fixed genre variable scoping ReferenceErrors preventing crashes when accessing `item.imdb` parsing floats. 
