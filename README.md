# FlipOn Customer Website

A customer-facing website built with Next.js for booking and service discovery. This platform allows customers to browse services, view details, book appointments, and manage their bookings.

## Features

- **Service Listing**: Browse services with category-based presentation
- **Service Details**: View detailed information about each service
- **Booking Flow**: Multi-step appointment booking process
- **Customer Details Form**: Collect customer information during booking
- **Booking Confirmation**: Confirmation screen with booking details
- **Mobile Responsive**: Fully responsive design for all devices
- **API Integration**: Connected to flipon-backend for data management

## Tech Stack

- **Frontend**: Next.js 14, React 18
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Inline SVG icons
- **Deployment**: Ready for Vercel/Netlify deployment

## Color Palette

- **Primary**: Prussian Blue (#003153)
- **Accent Yellow**: #FFD700
- **Accent Red**: #DC143C
- **Accent Blue**: #4169E1
- **Accent Gold**: #FFB300

## Project Structure

```
customer-website/
|-- app/
|   |-- book/[id]/           # Booking flow pages
|   |-- confirmation/        # Booking confirmation
|   |-- services/[id]/       # Service details pages
|   |-- globals.css          # Global styles
|   |-- layout.js            # Root layout
|   |-- page.js              # Homepage
|-- components/
|   |-- Footer.js            # Footer component
|   |-- Header.js            # Header component
|   |-- Hero.js              # Hero section
|   |-- ServiceCard.js       # Service card component
|   |-- ServiceCategories.js # Service categories section
|-- utils/
|   |-- api.js               # API integration utilities
|-- .env.local               # Environment variables
|-- package.json             # Dependencies and scripts
|-- tailwind.config.js       # Tailwind configuration
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Integration

The website integrates with the `flipon-backend` API for:

- **Services**: Fetching service listings and details
- **Bookings**: Creating and managing appointments
- **Customers**: Managing customer information
- **Authentication**: User login and registration

### API Endpoints

- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking details
- `POST /api/customers` - Create new customer

## Pages

### Homepage (`/`)
- Hero section with call-to-action
- Service categories with filtering
- Featured services display

### Service Details (`/services/[id]`)
- Detailed service information
- Requirements and process steps
- Pricing and availability
- Book appointment button

### Booking Flow (`/book/[id]`)
- Step 1: Select date and time
- Step 2: Customer details form
- Step 3: Booking confirmation

### Booking Confirmation (`/confirmation`)
- Booking success message
- Booking details summary
- Next steps and important information
- Download receipt option

## Responsive Design

The website is fully responsive with:
- Mobile-first approach
- Breakpoints for tablet and desktop
- Touch-friendly interface elements
- Optimized navigation for all devices

## Deployment

### Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Set environment variables in Netlify dashboard

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:3001/api)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
