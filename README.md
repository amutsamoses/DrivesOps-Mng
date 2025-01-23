# DriveOps: Streamlining Vehicle Management and Rental Operations

## Project Description

DriveOps is a centralized platform designed to streamline operations for vehicle rental businesses. It tackles challenges in fleet management, booking systems, and customer interactions by automating processes, optimizing resource usage, and enhancing user experience.

## Getting Started

### Prerequisites

Before running the project, ensure the following are installed:

- Node.js (v14 or higher)
- PostgreSQL
- A Git client
- A modern web browser
- Stripe account for payment integration

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/amutsamoses/DrivesOps-Mng
   ```
2. Navigate to the project directory:
   ```bash
   cd driveops
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables (replace placeholders with actual values):
     ```env
     DATABASE_URL=<PostgreSQL Database URL>
     STRIPE_API_KEY=<Stripe API Key>
     JWT_SECRET=<Your JWT Secret>
     NODE_ENV=development
     ```
5. Run database migrations:
   ```bash
   pnpm run migrate
   ```
6. Start the development server:
   ```bash
   pnpm run dev
   ```

### Usage

1. Access the platform at `http://localhost:8000` (default port).
2. Explore the following features:
   - Add, update, and remove vehicles as well as users.
   - **Booking System:** Real-time booking and availability.
   - **Payment Integration:** Secure transactions via Stripe.

## Features

- **Fleet Management:**
  - Easily manage vehicle inventory with intuitive controls.
- **Booking System:**
  - Real-time updates on availability and pricing.
  - Interactive booking forms for customers.
- **Payment Integration:**
  - Secure and flexible payment options powered by Stripe.
- **Authentication:**
  - User authentication and session management with JWT.
- **Scalability:**
  - Serverless architecture ensures smooth scaling.

## Development Workflow

### Branching Strategy

- **Main Branch:** Stable production-ready code.
- **Feature Branches:** For developing new features or fixing bugs.

### Testing

- **Unit Testing:**
  - Mocha and Chai for backend logic.
- **Integration Testing:**
  - Ensures seamless interaction between components.
- **Testing Commands:**
  ```bash
  pnpm run test
  ```

## Contributing

We welcome contributions to DriveOps! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your commit message"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## Deployment

### Production Setup

1. Set the `NODE_ENV` to `production` in the `.env` file.
2. Use a production database URL for `DATABASE_URL`.
3. Deploy the app on a hosting platform like Render or Azure.

### Deployment Commands

- Build the app:
  ```bash
  pnpm run build
  ```
- Start the production server:
  ```bash
  pnpm start
  ```

## License

MIT License

## Authors

- **Kephar Moses**  
  amutsamoses@gmail.com

## Acknowledgments

- **Frameworks and Libraries:** Hono.js, TypeScript, DrizzleORM, and others.
- **Inspiration:** Similar platforms like Fleetio and RentalCars.

## Getting Help

For questions or support:

- Open an issue on GitHub.
- Contact the author directly.
