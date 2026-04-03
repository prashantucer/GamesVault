export const mockGames = [
  {
    id: 'g-1',
    title: 'Cyberpunk 2077',
    genre: ['Action', 'RPG'],
    platform: ['PC', 'PS5', 'Xbox'],
    price: 4999,
    salePrice: null,
    cover: '/assets/images/games/cyberpunk.jpg',
    screenshots: ['/assets/images/games/cyberpunk.jpg'],
    rating: 4.8,
    isNew: true,
    developer: 'CD Projekt RED',
    publisher: 'CD Projekt',
    releaseDate: 'Dec 10, 2020',
    desc: 'Enter a dystopian future where body modification is everything. Play as a mercenary outlaw going after a one-of-a-kind implant that is the key to immortality.',
    sysReqs: {
      min: { os: 'Windows 10 64-bit', cpu: 'Intel Core i7-6700K / AMD Ryzen 5 1600', ram: '12 GB RAM', gpu: 'NVIDIA GTX 1060 6GB / AMD RX 580 8GB', storage: '70 GB SSD' },
      rec: { os: 'Windows 10/11 64-bit', cpu: 'Intel Core i7-8700K / AMD Ryzen 5 3600', ram: '16 GB RAM', gpu: 'NVIDIA RTX 2060 Super / AMD RX 5700 XT', storage: '70 GB SSD' }
    }
  },
  {
    id: 'g-2',
    title: 'Elden Ring',
    genre: ['Action', 'RPG'],
    platform: ['PC', 'PS5'],
    price: 5999,
    salePrice: 3999,
    cover: '/assets/images/games/eldenring.jpg',
    screenshots: [],
    rating: 4.9,
    isNew: false,
    developer: 'FromSoftware',
    publisher: 'Bandai Namco Entertainment',
    releaseDate: 'Feb 25, 2022',
    desc: 'Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.',
    sysReqs: {
      min: { os: 'Windows 10/11 64-bit', cpu: 'Intel Core i5-8400 / AMD Ryzen 3 3300X', ram: '12 GB RAM', gpu: 'NVIDIA GTX 1060 3GB / AMD RX 580 4GB', storage: '60 GB SSD' },
      rec: { os: 'Windows 10/11 64-bit', cpu: 'Intel Core i7-8700K / AMD Ryzen 5 3600X', ram: '16 GB RAM', gpu: 'NVIDIA GTX 1070 8GB / AMD RX Vega 56 8GB', storage: '60 GB SSD' }
    }
  },
  {
    id: 'g-3',
    title: "No Man's Sky",
    genre: ['Action', 'RPG'],
    platform: ['PC', 'Xbox'],
    price: 2999,
    salePrice: null,
    cover: '/assets/images/games/nomanssky.jpg',
    screenshots: [],
    rating: 4.5,
    isNew: true,
    developer: 'Hello Games',
    publisher: 'Hello Games',
    releaseDate: 'Aug 12, 2016',
    desc: 'Explore the infinite universe. Mine, trade, fight, and survive in an uncharted galaxy with billions of procedurally generated planets.',
    sysReqs: {
      min: { os: 'Windows 10 64-bit', cpu: 'Intel Core i3-8100 / AMD Ryzen 5 1600', ram: '8 GB RAM', gpu: 'NVIDIA GTX 1060 3GB / AMD RX 470 4GB', storage: '15 GB available' },
      rec: { os: 'Windows 10 64-bit', cpu: 'Intel Core i5-6600K / AMD Ryzen 5 2600X', ram: '16 GB RAM', gpu: 'NVIDIA GTX 1080 8GB / AMD Fury X 4GB', storage: '15 GB SSD' }
    }
  },
  {
    id: 'g-4',
    title: 'Need for Speed Unbound',
    genre: ['Racing', 'Action'],
    platform: ['PC', 'PS5', 'Xbox'],
    price: 3999,
    salePrice: 1499,
    cover: '/assets/images/games/nfs_unbound.jpg',
    screenshots: [],
    rating: 4.3,
    isNew: false,
    developer: 'Criterion Games',
    publisher: 'Electronic Arts',
    releaseDate: 'Dec 2, 2022',
    desc: 'Experience pure street racing culture. Build your dream car and dominate the neon-lit streets.',
    sysReqs: {
      min: { os: 'Windows 10 64-bit', cpu: 'Intel Core i7-4790 / AMD Ryzen 5 1500X', ram: '8 GB RAM', gpu: 'NVIDIA GTX 1060 3GB / AMD RX 480 4GB', storage: '50 GB SSD' },
      rec: { os: 'Windows 10/11 64-bit', cpu: 'Intel Core i7-8700K / AMD Ryzen 5 3600', ram: '16 GB RAM', gpu: 'NVIDIA RTX 2070 / AMD RX 5700 XT', storage: '50 GB SSD' }
    }
  },
  {
    id: 'g-5',
    title: 'Dead Space',
    genre: ['Action', 'Horror'],
    platform: ['PC', 'PS5'],
    price: 2499,
    salePrice: null,
    cover: '/assets/images/games/deadspace.jpg',
    screenshots: [],
    rating: 4.6,
    isNew: false,
    developer: 'Motive Studio',
    publisher: 'Electronic Arts',
    releaseDate: 'Jan 27, 2023',
    desc: 'You are the only survivor in a deep-space station. Something is hunting you. Survive.',
    sysReqs: {
      min: { os: 'Windows 10/11 64-bit', cpu: 'Intel Core i5-8600 / AMD Ryzen 5 2600X', ram: '16 GB RAM', gpu: 'NVIDIA GTX 1070 / AMD RX 5700', storage: '50 GB SSD' },
      rec: { os: 'Windows 10/11 64-bit', cpu: 'Intel Core i7-8700 / AMD Ryzen 5 3600X', ram: '16 GB RAM', gpu: 'NVIDIA RTX 2070 / AMD RX 6700 XT', storage: '50 GB SSD' }
    }
  },
  {
    id: 'g-6',
    title: 'Battlefield 2042',
    genre: ['Shooter', 'Action'],
    platform: ['PC', 'PS5', 'Xbox'],
    price: 4999,
    salePrice: null,
    cover: '/assets/images/games/bf2042.jpg',
    screenshots: [],
    rating: 4.1,
    isNew: true,
    developer: 'DICE',
    publisher: 'Electronic Arts',
    releaseDate: 'Nov 19, 2021',
    desc: 'Return to the battlefield in the most chaotic, large-scale combat simulator ever created.',
    sysReqs: {
      min: { os: 'Windows 10 64-bit', cpu: 'Intel Core i5-6600K / AMD Ryzen 5 3600', ram: '8 GB RAM', gpu: 'NVIDIA GTX 1050 Ti / AMD RX 570', storage: '100 GB SSD' },
      rec: { os: 'Windows 10 64-bit', cpu: 'Intel Core i7-4790 / AMD Ryzen 7 3700X', ram: '16 GB RAM', gpu: 'NVIDIA RTX 3060 / AMD RX 6600 XT', storage: '100 GB SSD' }
    }
  },
  {
    id: 'g-7',
    title: 'Ghost of Tsushima',
    genre: ['Action', 'RPG'],
    platform: ['PC', 'PS5'],
    price: 3499,
    salePrice: 1999,
    cover: '/assets/images/games/ghost.jpg',
    screenshots: [],
    rating: 4.4,
    isNew: false,
    developer: 'Sucker Punch Productions',
    publisher: 'Sony Interactive Entertainment',
    releaseDate: 'May 16, 2024',
    desc: 'Master the arts of stealth and assassination in a mystical feudal era.',
    sysReqs: {
      min: { os: 'Windows 10 64-bit', cpu: 'Intel Core i3-7100 / AMD Ryzen 5 1600', ram: '8 GB RAM', gpu: 'NVIDIA GTX 960 4GB / AMD RX 5500 XT 4GB', storage: '75 GB SSD' },
      rec: { os: 'Windows 10/11 64-bit', cpu: 'Intel Core i7-8750H / AMD Ryzen 7 3700X', ram: '16 GB RAM', gpu: 'NVIDIA GTX 1070 8GB / AMD RX 5700 8GB', storage: '75 GB SSD' }
    }
  },
  {
    id: 'g-8',
    title: 'Silent Hill 2',
    genre: ['Horror', 'Action'],
    platform: ['PC', 'PS5'],
    price: 3999,
    salePrice: null,
    cover: '/assets/images/games/silenthills.jpg',
    screenshots: [],
    rating: 4.8,
    isNew: true,
    developer: 'Bloober Team',
    publisher: 'Konami Digital Entertainment',
    releaseDate: 'Oct 8, 2024',
    desc: 'Return to the fog-shrouded town of Silent Hill in this faithful and terrifying remake. James Sunderland searches for his dead wife, only to find monsters that mirror his darkest guilt.',
    sysReqs: {
      min: { os: 'Windows 10/11 64-bit', cpu: 'AMD Ryzen 5 2600X / Intel Core i7-8700', ram: '12 GB RAM', gpu: 'AMD RX 5700 / NVIDIA RTX 2080', storage: '50 GB SSD' },
      rec: { os: 'Windows 10/11 64-bit', cpu: 'AMD Ryzen 5 5600X / Intel Core i7-8700K', ram: '12 GB RAM', gpu: 'AMD RX 6800 XT / NVIDIA RTX 3080', storage: '50 GB SSD' }
    }
  }
];

export const getFeaturedGames = () => mockGames.slice(0, 4);
export const getNewReleases = () => mockGames.filter(g => g.isNew).slice(0, 4);
export const getDeals = () => mockGames.filter(g => g.salePrice !== null);
export const getGameById = (id) => mockGames.find(g => g.id === id);
