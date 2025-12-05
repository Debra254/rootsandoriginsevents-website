# RootsandOrigins Events Website

A modern, responsive event ticket website with black and gold theme, featuring Paystack payment integration for ticket sales.

## Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Black & Gold Theme**: Luxury aesthetic with smooth animations
- **Payment Integration**: Paystack integration for M-Pesa, card payments
- **Interactive Carousel**: Event flyers with autoplay and manual controls
- **Gallery Lightbox**: Click to enlarge party photos
- **Contact Form**: Customer inquiries and feedback
- **Smooth Navigation**: Sticky header with smooth scrolling

## Pages/Sections

1. **Home**: Hero section with call-to-action
2. **Upcoming Events**: Grid of upcoming events with details
3. **Packages**: Three ticket tiers (Single, Couple, Group) with payment buttons
4. **Gallery**: Photo gallery with lightbox effect
5. **Contact**: Contact form for customer inquiries
6. **About Us**: Company information and values
7. **My Events**: Carousel displaying event flyers with ticket purchase

## Setup Instructions

### 1. Replace Images
Add your images to the `assets/` folder:
- `logo.png` - Your company logo
- `hero.jpg` - Main hero background image
- `crowd1.jpg`, `crowd2.jpg` - Party/event photos
- `flyer1.jpg`, `flyer2.jpg` - Event flyers

### 2. Configure Paystack
1. Sign up at [paystack.com](https://paystack.com)
2. Get your public key from the dashboard
3. Replace `YOUR_PAYSTACK_PUBLIC_KEY` in `script.js` with your actual key
4. For server verification, replace `YOUR_PAYSTACK_SECRET_KEY` in `verify-payment.js`

**Test Keys** (for development):
- Public: `pk_test_xxxxxxxxxxxxx`
- Secret: `sk_test_xxxxxxxxxxxxx`

**Live Keys** (for production):
- Public: `pk_live_xxxxxxxxxxxxx`
- Secret: `sk_live_xxxxxxxxxxxxx`

### 3. Deployment Options

#### Option A: GitHub Pages (Free, Static Only)
1. Create GitHub repository
2. Upload all files
3. Go to Settings → Pages
4. Select main branch as source
5. Visit `https://yourusername.github.io/repository-name`

#### Option B: Netlify (Free, Easy)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your project folder
3. Get instant URL like `https://yoursite.netlify.app`
4. Add custom domain later if needed

#### Option C: Vercel (Free, with Server Support)
1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Deploy with one click
4. Supports both static and server functions

### 4. Server Setup (Optional)
For payment verification and advanced features:

```bash
# Install dependencies
npm install

# Start server
npm start

# Visit http://localhost:3000
```

## Payment Flow

1. Customer clicks "Buy Ticket" button
2. Paystack popup opens for payment
3. Customer enters payment details (M-Pesa, card, etc.)
4. Payment processed by Paystack
5. Success callback shows confirmation with reference
6. (Optional) Server verifies payment with Paystack API

## Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
  --bg: #0a0a0a;        /* Background color */
  --gold: #cda34b;      /* Gold accent color */
  --muted: #aaa;        /* Muted text color */
  --card-bg: #0f0f0f;   /* Card background */
}
```

### Ticket Prices
Update prices in `index.html`:
```html
<button class="pay-btn" data-amount="2000" data-plan="Single Ticket">
```

### Event Information
Edit event details in the HTML sections for upcoming events and carousel slides.

## Security Notes

- Always use test keys during development
- Verify payments server-side before issuing tickets
- Use HTTPS in production (automatic with Netlify/Vercel)
- Never expose secret keys in client-side code

## Support

For Paystack integration help:
- [Paystack Documentation](https://paystack.com/docs)
- [Paystack JavaScript Library](https://paystack.com/docs/payments/accept-payments)

## License

MIT License - feel free to customize for your events business.