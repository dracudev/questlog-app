import { PrismaClient, UserRole, GameStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Cleaning existing data...');
    await prisma.userAchievement.deleteMany();
    await prisma.achievement.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.userSession.deleteMany();
    await prisma.gameListEntry.deleteMany();
    await prisma.gameList.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.like.deleteMany();
    await prisma.review.deleteMany();
    await prisma.follow.deleteMany();
    await prisma.gameGenre.deleteMany();
    await prisma.gamePlatform.deleteMany();
    await prisma.game.deleteMany();
    await prisma.publisher.deleteMany();
    await prisma.developer.deleteMany();
    await prisma.genre.deleteMany();
    await prisma.platform.deleteMany();
    await prisma.user.deleteMany();
  }

  // Create Genres
  console.log('🎯 Creating genres...');
  const genres = await Promise.all([
    prisma.genre.create({
      data: {
        name: 'Action',
        slug: 'action',
        description: 'Fast-paced games with physical challenges',
      },
    }),
    prisma.genre.create({
      data: {
        name: 'Adventure',
        slug: 'adventure',
        description: 'Exploration and puzzle-solving games',
      },
    }),
    prisma.genre.create({
      data: {
        name: 'Role-Playing',
        slug: 'rpg',
        description: 'Character development and story-driven games',
      },
    }),
    prisma.genre.create({
      data: {
        name: 'Strategy',
        slug: 'strategy',
        description: 'Tactical and strategic thinking games',
      },
    }),
    prisma.genre.create({
      data: {
        name: 'Simulation',
        slug: 'simulation',
        description: 'Real-world activity simulation games',
      },
    }),
    prisma.genre.create({
      data: {
        name: 'Puzzle',
        slug: 'puzzle',
        description: 'Logic and problem-solving games',
      },
    }),
    prisma.genre.create({
      data: {
        name: 'Sports',
        slug: 'sports',
        description: 'Athletic competition simulation games',
      },
    }),
    prisma.genre.create({
      data: {
        name: 'Racing',
        slug: 'racing',
        description: 'Vehicle racing and driving games',
      },
    }),
    prisma.genre.create({
      data: {
        name: 'Shooter',
        slug: 'shooter',
        description: 'Combat games focusing on ranged weapons',
      },
    }),
    prisma.genre.create({
      data: {
        name: 'Indie',
        slug: 'indie',
        description: 'Independent developer games',
      },
    }),
  ]);

  // Create Platforms
  console.log('🎮 Creating platforms...');
  const platforms = await Promise.all([
    prisma.platform.create({
      data: {
        name: 'PC',
        slug: 'pc',
        abbreviation: 'PC',
      },
    }),
    prisma.platform.create({
      data: {
        name: 'PlayStation 5',
        slug: 'playstation-5',
        abbreviation: 'PS5',
      },
    }),
    prisma.platform.create({
      data: {
        name: 'Xbox Series X/S',
        slug: 'xbox-series-x-s',
        abbreviation: 'XBOX',
      },
    }),
    prisma.platform.create({
      data: {
        name: 'Nintendo Switch',
        slug: 'nintendo-switch',
        abbreviation: 'NSW',
      },
    }),
    prisma.platform.create({
      data: {
        name: 'PlayStation 4',
        slug: 'playstation-4',
        abbreviation: 'PS4',
      },
    }),
    prisma.platform.create({
      data: {
        name: 'Xbox One',
        slug: 'xbox-one',
        abbreviation: 'XONE',
      },
    }),
    prisma.platform.create({
      data: {
        name: 'iOS',
        slug: 'ios',
        abbreviation: 'iOS',
      },
    }),
    prisma.platform.create({
      data: {
        name: 'Android',
        slug: 'android',
        abbreviation: 'AND',
      },
    }),
  ]);

  // Create Developers
  console.log('👨‍💻 Creating developers...');
  const developers = await Promise.all([
    prisma.developer.create({
      data: {
        name: 'CD Projekt RED',
        slug: 'cd-projekt-red',
        description: 'Polish video game developer known for The Witcher series and Cyberpunk 2077',
        country: 'Poland',
        foundedYear: 1994,
        website: 'https://www.cdprojektred.com',
      },
    }),
    prisma.developer.create({
      data: {
        name: 'FromSoftware',
        slug: 'fromsoftware',
        description: 'Japanese developer known for challenging action RPGs',
        country: 'Japan',
        foundedYear: 1986,
        website: 'https://www.fromsoftware.jp',
      },
    }),
    prisma.developer.create({
      data: {
        name: 'Naughty Dog',
        slug: 'naughty-dog',
        description: 'American developer known for cinematic action-adventure games',
        country: 'United States',
        foundedYear: 1984,
        website: 'https://www.naughtydog.com',
      },
    }),
    prisma.developer.create({
      data: {
        name: 'Nintendo EPD',
        slug: 'nintendo-epd',
        description: "Nintendo's internal development division",
        country: 'Japan',
        foundedYear: 2015,
        website: 'https://www.nintendo.com',
      },
    }),
    prisma.developer.create({
      data: {
        name: 'Indie Studio',
        slug: 'indie-studio',
        description: 'Sample indie game developer for showcase features',
        country: 'Various',
        foundedYear: 2020,
      },
    }),
  ]);

  // Create Publishers
  console.log('🏢 Creating publishers...');
  const publishers = await Promise.all([
    prisma.publisher.create({
      data: {
        name: 'CD Projekt',
        slug: 'cd-projekt',
        description: 'Polish video game publisher and distributor',
      },
    }),
    prisma.publisher.create({
      data: {
        name: 'Bandai Namco Entertainment',
        slug: 'bandai-namco',
        description: 'Japanese multinational video game publisher',
      },
    }),
    prisma.publisher.create({
      data: {
        name: 'Sony Interactive Entertainment',
        slug: 'sony-interactive',
        description: "Sony's video game division",
      },
    }),
    prisma.publisher.create({
      data: {
        name: 'Nintendo',
        slug: 'nintendo',
        description: 'Japanese multinational video game company',
      },
    }),
  ]);

  // Create Sample Users
  console.log('👤 Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 12);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@questlog.com',
        username: 'admin',
        displayName: 'Administrator',
        password: hashedPassword,
        role: UserRole.ADMIN,
        bio: 'System administrator and gaming enthusiast',
      },
    }),
    prisma.user.create({
      data: {
        email: 'john@example.com',
        username: 'johndoe',
        displayName: 'John Doe',
        password: hashedPassword,
        bio: 'Passionate gamer and indie game enthusiast. Love discovering hidden gems and supporting small developers.',
        location: 'San Francisco, CA',
      },
    }),
    prisma.user.create({
      data: {
        email: 'sarah@example.com',
        username: 'sarahgamer',
        displayName: 'Sarah Chen',
        password: hashedPassword,
        bio: 'RPG fanatic and speedrunner. Always looking for the next great adventure.',
        location: 'Toronto, Canada',
      },
    }),
    prisma.user.create({
      data: {
        email: 'mike@example.com',
        username: 'retrogamer',
        displayName: 'Mike Rodriguez',
        password: hashedPassword,
        bio: "Retro gaming collector and reviewer. If it's from the 90s, I've probably played it.",
        location: 'Austin, TX',
      },
    }),
  ]);

  // Create Sample Games
  console.log('🎮 Creating games...');
  const games = await Promise.all([
    prisma.game.create({
      data: {
        title: 'The Witcher 3: Wild Hunt',
        slug: 'the-witcher-3-wild-hunt',
        description:
          'The Witcher 3: Wild Hunt is a story-driven, next-generation open world role-playing game set in a visually stunning fantasy universe full of meaningful choices and impactful consequences.',
        summary:
          'An epic open-world RPG following Geralt of Rivia on his quest to find his adopted daughter.',
        releaseDate: new Date('2015-05-19'),
        status: GameStatus.RELEASED,
        developerId: developers[0].id,
        publisherId: publishers[0].id,
        averageRating: 9.2,
        reviewCount: 3,
        rawgId: 3328,
        steamId: 292030,
        genres: {
          create: [
            { genreId: genres.find((g) => g.slug === 'rpg')!.id },
            { genreId: genres.find((g) => g.slug === 'adventure')!.id },
            { genreId: genres.find((g) => g.slug === 'action')!.id },
          ],
        },
        platforms: {
          create: [
            { platformId: platforms.find((p) => p.slug === 'pc')!.id },
            { platformId: platforms.find((p) => p.slug === 'playstation-4')!.id },
            { platformId: platforms.find((p) => p.slug === 'xbox-one')!.id },
            { platformId: platforms.find((p) => p.slug === 'nintendo-switch')!.id },
          ],
        },
      },
    }),
    prisma.game.create({
      data: {
        title: 'Elden Ring',
        slug: 'elden-ring',
        description:
          'THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.',
        summary:
          "FromSoftware's largest and most ambitious game yet, featuring an open world created in collaboration with George R.R. Martin.",
        releaseDate: new Date('2022-02-25'),
        status: GameStatus.RELEASED,
        developerId: developers[1].id,
        publisherId: publishers[1].id,
        averageRating: 9.5,
        reviewCount: 2,
        rawgId: 326243,
        steamId: 1245620,
        genres: {
          create: [
            { genreId: genres.find((g) => g.slug === 'rpg')!.id },
            { genreId: genres.find((g) => g.slug === 'action')!.id },
            { genreId: genres.find((g) => g.slug === 'adventure')!.id },
          ],
        },
        platforms: {
          create: [
            { platformId: platforms.find((p) => p.slug === 'pc')!.id },
            { platformId: platforms.find((p) => p.slug === 'playstation-5')!.id },
            { platformId: platforms.find((p) => p.slug === 'xbox-series-x-s')!.id },
            { platformId: platforms.find((p) => p.slug === 'playstation-4')!.id },
          ],
        },
      },
    }),
    prisma.game.create({
      data: {
        title: 'The Last of Us Part II',
        slug: 'the-last-of-us-part-ii',
        description:
          'Five years after their dangerous journey across the post-pandemic United States, Ellie and Joel have settled down in Jackson, Wyoming.',
        summary:
          "A gripping post-apocalyptic adventure focusing on Ellie's journey of revenge and redemption.",
        releaseDate: new Date('2020-06-19'),
        status: GameStatus.RELEASED,
        developerId: developers[2].id,
        publisherId: publishers[2].id,
        averageRating: 8.8,
        reviewCount: 1,
        steamId: 1888930,
        genres: {
          create: [
            { genreId: genres.find((g) => g.slug === 'action')!.id },
            { genreId: genres.find((g) => g.slug === 'adventure')!.id },
          ],
        },
        platforms: {
          create: [
            { platformId: platforms.find((p) => p.slug === 'playstation-4')!.id },
            { platformId: platforms.find((p) => p.slug === 'playstation-5')!.id },
            { platformId: platforms.find((p) => p.slug === 'pc')!.id },
          ],
        },
      },
    }),
    prisma.game.create({
      data: {
        title: 'Super Mario Odyssey',
        slug: 'super-mario-odyssey',
        description:
          'Explore incredible places far from the Mushroom Kingdom as you join Mario and his new ally Cappy on a massive, globe-trotting 3D adventure.',
        summary:
          "Mario's latest 3D platforming adventure featuring innovative cap-throwing mechanics.",
        releaseDate: new Date('2017-10-27'),
        status: GameStatus.RELEASED,
        developerId: developers[3].id,
        publisherId: publishers[3].id,
        averageRating: 9.0,
        reviewCount: 1,
        genres: {
          create: [
            { genreId: genres.find((g) => g.slug === 'adventure')!.id },
            { genreId: genres.find((g) => g.slug === 'action')!.id },
          ],
        },
        platforms: {
          create: [{ platformId: platforms.find((p) => p.slug === 'nintendo-switch')!.id }],
        },
      },
    }),
    prisma.game.create({
      data: {
        title: 'Indie Puzzle Adventure',
        slug: 'indie-puzzle-adventure',
        description:
          'A charming indie puzzle adventure game showcasing innovative gameplay mechanics and beautiful hand-drawn art.',
        summary: 'Perfect example of indie game creativity and innovation.',
        releaseDate: new Date('2023-03-15'),
        status: GameStatus.RELEASED,
        developerId: developers[4].id,
        averageRating: 7.8,
        reviewCount: 0,
        genres: {
          create: [
            { genreId: genres.find((g) => g.slug === 'puzzle')!.id },
            { genreId: genres.find((g) => g.slug === 'indie')!.id },
            { genreId: genres.find((g) => g.slug === 'adventure')!.id },
          ],
        },
        platforms: {
          create: [
            { platformId: platforms.find((p) => p.slug === 'pc')!.id },
            { platformId: platforms.find((p) => p.slug === 'nintendo-switch')!.id },
          ],
        },
      },
    }),
  ]);

  // Create Sample Reviews
  console.log('📝 Creating reviews...');
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        title: 'A Masterpiece of Open World Design',
        content:
          "The Witcher 3 sets the gold standard for open-world RPGs. Every quest feels meaningful, every character has depth, and the world feels truly alive. The DLCs are worth the price of admission alone. Geralt's final adventure is one that will stay with you long after the credits roll.",
        rating: 9.5,
        userId: users[1].id,
        gameId: games[0].id,
        isPublished: true,
      },
    }),
    prisma.review.create({
      data: {
        title: 'Incredible but overwhelming',
        content:
          'While The Witcher 3 is undeniably a great game, I found myself overwhelmed by the sheer amount of content. The main story is excellent, but the side quests, while well-written, can feel endless. Still, this is a minor complaint for what is otherwise an exceptional RPG experience.',
        rating: 8.5,
        userId: users[2].id,
        gameId: games[0].id,
        isPublished: true,
      },
    }),
    prisma.review.create({
      data: {
        title: 'The King of RPGs',
        content:
          'Having played RPGs for over 20 years, I can confidently say The Witcher 3 is among the greatest ever made. The attention to detail, the moral complexity of choices, and the sheer scale of the world make this a must-play for any RPG fan.',
        rating: 10.0,
        userId: users[3].id,
        gameId: games[0].id,
        isPublished: true,
      },
    }),
    prisma.review.create({
      data: {
        title: "FromSoftware's Magnum Opus",
        content:
          "Elden Ring takes everything great about the Souls formula and places it in a breathtaking open world. The sense of discovery is unparalleled, and every boss fight feels like an epic encounter. This is easily FromSoftware's best work.",
        rating: 9.8,
        userId: users[1].id,
        gameId: games[1].id,
        isPublished: true,
      },
    }),
    prisma.review.create({
      data: {
        title: 'Beautiful but Brutal',
        content:
          'Elden Ring is stunning and the open world design is brilliant, but the difficulty can be punishing for newcomers to the series. The lack of clear direction might frustrate some players, but for those who enjoy exploration and challenge, this is perfect.',
        rating: 8.9,
        userId: users[2].id,
        gameId: games[1].id,
        isPublished: true,
      },
    }),
    prisma.review.create({
      data: {
        title: 'Emotional Powerhouse',
        content:
          "The Last of Us Part II is a bold sequel that isn't afraid to challenge players emotionally. While controversial, I found the story compelling and the gameplay refined. It's a game that demands to be experienced, even if it leaves you emotionally drained.",
        rating: 9.2,
        userId: users[1].id,
        gameId: games[2].id,
        isPublished: true,
      },
    }),
    prisma.review.create({
      data: {
        title: 'Pure Nintendo Magic',
        content:
          'Super Mario Odyssey reminds you why Nintendo is the king of platformers. The cap mechanics are ingenious, the worlds are creative and full of secrets, and the whole experience just radiates joy. A perfect game for players of all ages.',
        rating: 9.3,
        userId: users[2].id,
        gameId: games[3].id,
        isPublished: true,
      },
    }),
  ]);

  // Create Some Follows
  console.log('🤝 Creating follows...');
  await Promise.all([
    prisma.follow.create({
      data: {
        followerId: users[1].id,
        followingId: users[2].id,
      },
    }),
    prisma.follow.create({
      data: {
        followerId: users[1].id,
        followingId: users[3].id,
      },
    }),
    prisma.follow.create({
      data: {
        followerId: users[2].id,
        followingId: users[1].id,
      },
    }),
    prisma.follow.create({
      data: {
        followerId: users[2].id,
        followingId: users[3].id,
      },
    }),
    prisma.follow.create({
      data: {
        followerId: users[3].id,
        followingId: users[1].id,
      },
    }),
  ]);

  // Create Some Likes
  console.log('❤️ Creating likes...');
  await Promise.all([
    prisma.like.create({
      data: {
        userId: users[2].id,
        reviewId: reviews[0].id,
      },
    }),
    prisma.like.create({
      data: {
        userId: users[3].id,
        reviewId: reviews[0].id,
      },
    }),
    prisma.like.create({
      data: {
        userId: users[1].id,
        reviewId: reviews[1].id,
      },
    }),
    prisma.like.create({
      data: {
        userId: users[3].id,
        reviewId: reviews[3].id,
      },
    }),
  ]);

  // Create Some Comments
  console.log('💬 Creating comments...');
  await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Totally agree! The Blood and Wine DLC is practically a full game on its own.',
        userId: users[2].id,
        reviewId: reviews[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Great review! I had similar feelings about the overwhelming amount of content.',
        userId: users[1].id,
        reviewId: reviews[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          'FromSoftware really outdid themselves with this one. The boss designs are incredible.',
        userId: users[2].id,
        reviewId: reviews[3].id,
      },
    }),
  ]);

  // Create Some Game Lists
  console.log('📋 Creating game lists...');
  const gameLists = await Promise.all([
    prisma.gameList.create({
      data: {
        name: 'All-Time Favorites',
        description: 'Games that have left a lasting impact on me',
        userId: users[1].id,
        isPublic: true,
      },
    }),
    prisma.gameList.create({
      data: {
        name: 'Want to Play',
        description: "Games on my backlog that I'm excited to try",
        userId: users[1].id,
        isPublic: true,
      },
    }),
    prisma.gameList.create({
      data: {
        name: 'RPG Masterpieces',
        description: 'The best RPGs ever made',
        userId: users[2].id,
        isPublic: true,
      },
    }),
  ]);

  // Create Game List Entries
  console.log('📝 Creating game list entries...');
  await Promise.all([
    prisma.gameListEntry.create({
      data: {
        gameListId: gameLists[0].id,
        gameId: games[0].id,
        order: 1,
        notes: 'The gold standard for open-world RPGs',
      },
    }),
    prisma.gameListEntry.create({
      data: {
        gameListId: gameLists[0].id,
        gameId: games[1].id,
        order: 2,
        notes: 'Challenging but incredibly rewarding',
      },
    }),
    prisma.gameListEntry.create({
      data: {
        gameListId: gameLists[2].id,
        gameId: games[0].id,
        order: 1,
        notes: 'Simply the best RPG experience available',
      },
    }),
    prisma.gameListEntry.create({
      data: {
        gameListId: gameLists[2].id,
        gameId: games[1].id,
        order: 2,
        notes: 'Revolutionary take on the RPG formula',
      },
    }),
  ]);

  // Create Sample Achievements (for future features)
  console.log('🏆 Creating achievements...');
  const achievements = await Promise.all([
    prisma.achievement.create({
      data: {
        name: 'First Steps',
        description: 'Write your first game review',
        points: 10,
        icon: '📝',
      },
    }),
    prisma.achievement.create({
      data: {
        name: 'Social Butterfly',
        description: 'Follow 10 other users',
        points: 25,
        icon: '🦋',
      },
    }),
    prisma.achievement.create({
      data: {
        name: 'Prolific Reviewer',
        description: 'Write 50 game reviews',
        points: 100,
        icon: '✍️',
      },
    }),
    prisma.achievement.create({
      data: {
        name: 'Curator',
        description: 'Create your first game list',
        points: 15,
        icon: '📚',
      },
    }),
    prisma.achievement.create({
      data: {
        name: 'Popular',
        description: 'Get 100 likes on your reviews',
        points: 50,
        icon: '⭐',
      },
    }),
  ]);

  // Award some achievements to users
  console.log('🎖️ Awarding achievements...');
  await Promise.all([
    prisma.userAchievement.create({
      data: {
        userId: users[1].id,
        achievementId: achievements[0].id,
      },
    }),
    prisma.userAchievement.create({
      data: {
        userId: users[1].id,
        achievementId: achievements[3].id,
      },
    }),
    prisma.userAchievement.create({
      data: {
        userId: users[2].id,
        achievementId: achievements[0].id,
      },
    }),
    prisma.userAchievement.create({
      data: {
        userId: users[3].id,
        achievementId: achievements[0].id,
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Users: ${users.length}`);
  console.log(`- Games: ${games.length}`);
  console.log(`- Reviews: ${reviews.length}`);
  console.log(`- Genres: ${genres.length}`);
  console.log(`- Platforms: ${platforms.length}`);
  console.log(`- Developers: ${developers.length}`);
  console.log(`- Publishers: ${publishers.length}`);
  console.log(`- Achievements: ${achievements.length}`);
  console.log(`- Game Lists: ${gameLists.length}`);

  console.log('\n🔐 Test Credentials:');
  console.log('Admin: admin@questlog.com / password123');
  console.log('User: john@example.com / password123');
  console.log('User: sarah@example.com / password123');
  console.log('User: mike@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
