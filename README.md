# Mini dsc Clone: Real-time Chat and Video Communication

Your Discord Clone is a feature-rich real-time chat and voice communication application inspired by the popular platform, Discord. Built using cutting-edge technologies, it provides users with a seamless and interactive communication experience.

## Key Features

- Real-time text messaging with channels and direct messages
- Voice and video calling with low-latency audio
- User authentication and account management
- User-friendly interface with customizable themes
- Emoji support for adding personality to conversations
- Role-based access control for server management
- Rich media sharing, including images, videos(not yet), and links
- Notification system for staying up-to-date with messages
- Scalable architecture for handling a growing user base

## Technologies Used

- Fullstack: NextJS.14, Typescript
- Frontend: React.js, Zustand, Socket.io
- Backend: Node.js, Socket.io, Prisma
- Database: mySQL
- Authentication: Clerk
- Styling: Tailwind, shadCN
- Deployment: still in work

## Channels

Application supports three types of channels: audio, video, and text. Users can communicate with each other through these channels, providing a rich and interactive communication experience.

## Realtime Communication

When information arrives via sockets that a new message has arrived, the user retrieves it from the database. I have not used direct communication via sockets here for security reasons.

## Deployment

Not finished, still in progress.