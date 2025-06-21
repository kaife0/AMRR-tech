# Item Manager - Full Stack Application

A modern, responsive web application for managing items with image uploads, detailed views, and enquiry functionality. Built with React, TypeScript, Node.js, and Express.

## ✨ Features

### Frontend Features
- **Modern UI/UX**: Clean, responsive design with gradient backgrounds and smooth animations
- **Two Main Pages**:
  - **View Items**: Grid layout displaying all items with cover images and descriptions
  - **Add Items**: Comprehensive form for adding new items
- **Item Details**: Modal/lightbox with image carousel, full details, and enquiry button
- **Web3Forms Integration**: Modern contact form service for enquiries with spam protection
- **Enquiry System**: Comprehensive enquiry form with validation and email notifications
- **Image Management**: Support for cover image + up to 5 additional images
- **Form Validation**: Real-time validation with error messages
- **Success Notifications**: Toast notifications for user feedback
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Fallback Data**: Static demo data when backend is unavailable

### Backend Features
- **RESTful API**: Full CRUD operations for items
- **File Upload**: Multer integration for image uploads (up to 5MB per file)
- **Data Persistence**: JSON file storage (easily upgradeable to database)
- **Error Handling**: Comprehensive error handling and validation
- **CORS Support**: Configured for cross-origin requests
- **TypeScript**: Fully typed backend for better development experience

### Bonus Features Implemented
- ✅ **API Integration**: Full backend API with database simulation
- ✅ **Web3Forms Integration**: Contact form service for enquiry submissions
- ✅ **File Upload**: Handle multiple image uploads
- ✅ **Clean Architecture**: Separation of concerns, reusable components
- ✅ **Modern Development**: TypeScript, React Context, custom hooks

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "AMRR tech"
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Configure Web3Forms (required for enquiry functionality)**
   ```bash
   # Create .env.local in the root directory
   echo "VITE_WEB3FORMS_ACCESS_KEY=536c9794-b157-41d4-880b-27cc4da87b2f" > .env.local
   ```

### Running the Application

#### Start the Backend Server
```bash
cd server
npx nodemon src/index.ts
```
The server will start on `http://localhost:3001`

#### Start the Frontend Application
In a new terminal:
```bash
npm run dev
```
The frontend will start on `http://localhost:5173` or `http://localhost:5174`

## 📱 Usage

### Adding Items
1. Navigate to "Add Items" page
2. Fill in the item details:
   - **Item Name**: Required, up to 100 characters
   - **Item Type**: Select from predefined categories (Shirt, Pant, Shoes, Sports Gear, Accessories, Other)
   - **Description**: Required, up to 500 characters
   - **Cover Image**: Required, one image up to 5MB
   - **Additional Images**: Optional, up to 5 additional images
3. Click "Add Item" to save
4. Success notification will appear and redirect to View Items

### Viewing Items
1. Navigate to "View Items" page
2. Browse the grid of items showing cover images and basic info
3. Click any item to open detailed view
4. In the modal:
   - View image carousel with all item photos
   - Read full description and details
   - Click "Enquire" button to open enquiry form
   - Fill out the contact form and submit via Web3Forms

### Web3Forms Configuration
To enable the enquiry functionality:

1. **Create .env.local file in the project root:**
   ```env
   # Web3Forms Configuration
   VITE_WEB3FORMS_ACCESS_KEY=536c9794-b157-41d4-880b-27cc4da87b2f
   ```

2. **Get your own Web3Forms access key (recommended):**
   - Visit [Web3Forms](https://web3forms.com/)
   - Sign up for a free account
   - Get your access key (250 submissions/month free)
   - Replace the key in your `.env.local` file

3. **Web3Forms Features:**
   - ✅ Free plan: 250 submissions/month
   - ✅ Email notifications
   - ✅ Spam protection
   - ✅ File uploads support
   - ✅ Custom redirects
   - ✅ Auto-response emails

## 🏗️ Architecture

### Frontend Structure
```
src/
├── components/          # Reusable UI components
│   ├── Navigation.tsx   # Main navigation bar
│   ├── ItemCard.tsx     # Item display card
│   ├── ImageCarousel.tsx # Image carousel for modal
│   ├── ItemDetailModal.tsx # Item details modal
│   ├── EnquiryForm.tsx  # Web3Forms enquiry form
│   └── SuccessToast.tsx # Success notification
├── pages/              # Main page components
│   ├── ViewItems.tsx   # Items grid page
│   └── AddItem.tsx     # Add item form page
├── context/            # React Context for state management
│   └── ItemContext.tsx # Global item state
├── services/           # API service layer
│   ├── api.ts          # API communication
│   └── web3forms.ts    # Web3Forms integration
├── types/              # TypeScript type definitions
│   └── item.ts         # Item-related types
├── utils/              # Utility functions
│   └── fileUtils.ts    # File handling utilities
└── App.tsx             # Main app component
```

### Backend Structure
```
server/src/
├── routes/             # API route handlers
│   └── items.ts        # Item CRUD operations
├── utils/              # Utility functions
│   └── database.ts     # JSON file database operations
├── types/              # TypeScript type definitions
│   └── item.ts         # Shared type definitions
└── index.ts            # Express server setup
```

### File Storage
- **Uploaded Images**: Stored in `server/uploads/` directory
- **Item Data**: Stored in `server/data/items.json`
- **Static Serving**: Images served at `http://localhost:3001/uploads/:filename`

## 🛠️ Technology Stack

### Frontend
- **React 18**: Latest React with hooks
- **TypeScript**: Type safety and better DX
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **Lucide React**: Modern icon library
- **CSS3**: Custom CSS with flexbox/grid

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **TypeScript**: Type safety for backend
- **Multer**: File upload handling
- **Nodemailer**: Email sending capability
- **UUID**: Unique ID generation
- **CORS**: Cross-origin resource sharing

### Development Tools
- **ESLint**: Code linting
- **Nodemon**: Auto-restart development server
- **ts-node**: TypeScript execution for Node.js

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/items` | Get all items |
| GET | `/api/items/:id` | Get single item |
| POST | `/api/items` | Create new item |
| PUT | `/api/items/:id` | Update item |
| DELETE | `/api/items/:id` | Delete item |
| GET | `/uploads/:filename` | Serve uploaded images |

Note: Enquiry functionality now uses Web3Forms service instead of backend API.

## 📝 Data Model

```typescript
interface Item {
  id: string;
  name: string;
  type: 'Shirt' | 'Pant' | 'Shoes' | 'Sports Gear' | 'Accessories' | 'Other';
  description: string;
  coverImage: string;
  additionalImages: string[];
  createdAt: Date;
}
```

## 🎯 Project Summary

This full-stack application successfully implements all requested features:

### ✅ Core Requirements Met
1. **Two Pages**: "View Items" and "Add Items" pages implemented
2. **Add Item Form**: Complete form with all required fields (name, type, description, cover image, additional images)
3. **Success Message**: "Item successfully added" notification with redirect
4. **Items Display**: Grid layout showing item name and cover image
5. **Item Details**: Modal with full item information and image carousel
6. **Enquire Button**: Functional enquiry system with email integration

### ✅ Bonus Features Implemented
1. **API Integration**: Full RESTful API with Express.js backend
2. **Email Service**: Nodemailer integration for enquiry emails
3. **File Upload**: Multer-based image upload system
4. **Clean Architecture**: Modular, maintainable codebase
5. **Modern Development**: TypeScript, React Context, responsive design

### 🔧 Technical Highlights
- **Type Safety**: Full TypeScript implementation across frontend and backend
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Error Handling**: Comprehensive validation and error management
- **Performance**: Optimized with lazy loading and efficient state management
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Security**: File type validation, size limits, and CORS configuration

The application is production-ready with proper error handling, loading states, and a fallback mechanism when the API is unavailable. The codebase is well-structured, documented, and easily extensible for future enhancements.

## 🔮 Future Enhancements

- **Database Integration**: Replace JSON storage with MongoDB/PostgreSQL
- **User Authentication**: Add user accounts and authorization
- **Advanced Search**: Search and filter functionality
- **Image Optimization**: Automatic image compression and resizing
- **Real-time Updates**: WebSocket integration for live updates
- **Admin Panel**: Advanced item management interface
- **Analytics**: Usage tracking and reporting
- **PWA Support**: Progressive Web App capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Images provided by [Unsplash](https://unsplash.com)
- Icons by [Lucide](https://lucide.dev)
- Inspiration from modern e-commerce and inventory management systems
