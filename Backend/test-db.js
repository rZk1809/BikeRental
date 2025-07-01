import mongoose from 'mongoose';
import Bike from './models/Bike.js';
import User from './models/User.js';
import Booking from './models/Booking.js';
import bcrypt from 'bcrypt';
import 'dotenv/config';

// Connect to database
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI.includes('/bike-rental') 
            ? process.env.MONGODB_URI 
            : `${process.env.MONGODB_URI}/bike-rental`;
            
        await mongoose.connect(mongoUri);
        console.log('Database Connected for testing');
    } catch (error) {
        console.log(error.message);
    }
};

// Sample bikes data
const sampleBikes = [
    {
        brand: "Honda",
        model: "CBR 600RR",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        year: 2023,
        category: "Sport",
        seating_capacity: 2,
        fuel_type: "Petrol",
        transmission: "Manual",
        pricePerDay: 75,
        location: "Chennai",
        description: "High-performance sport bike perfect for thrill seekers. Features advanced suspension and powerful engine.",
        isAvailable: true
    },
    {
        brand: "Yamaha",
        model: "MT-07",
        image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500",
        year: 2023,
        category: "Naked",
        seating_capacity: 2,
        fuel_type: "Petrol",
        transmission: "Manual",
        pricePerDay: 65,
        location: "Bangalore",
        description: "Versatile naked bike with excellent handling and comfort for city rides and weekend adventures.",
        isAvailable: true
    },
    {
        brand: "Kawasaki",
        model: "Ninja 400",
        image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=500",
        year: 2022,
        category: "Sport",
        seating_capacity: 2,
        fuel_type: "Petrol",
        transmission: "Manual",
        pricePerDay: 55,
        location: "Mumbai",
        description: "Perfect entry-level sport bike with great fuel efficiency and sporty styling.",
        isAvailable: true
    },
    {
        brand: "Harley Davidson",
        model: "Street 750",
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500",
        year: 2023,
        category: "Cruiser",
        seating_capacity: 2,
        fuel_type: "Petrol",
        transmission: "Manual",
        pricePerDay: 95,
        location: "Delhi",
        description: "Classic cruiser with iconic Harley styling. Perfect for long rides and weekend touring.",
        isAvailable: true
    },
    {
        brand: "BMW",
        model: "G 310 R",
        image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500",
        year: 2023,
        category: "Naked",
        seating_capacity: 2,
        fuel_type: "Petrol",
        transmission: "Manual",
        pricePerDay: 70,
        location: "Chennai",
        description: "Premium German engineering with excellent build quality and modern features.",
        isAvailable: true
    },
    {
        brand: "Ducati",
        model: "Monster 821",
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500",
        year: 2023,
        category: "Naked",
        seating_capacity: 2,
        fuel_type: "Petrol",
        transmission: "Manual",
        pricePerDay: 85,
        location: "Bangalore",
        description: "Italian masterpiece with aggressive styling and thrilling performance for urban adventures.",
        isAvailable: true
    },
    {
        brand: "Suzuki",
        model: "GSX-R750",
        image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=500",
        year: 2023,
        category: "Sport",
        seating_capacity: 2,
        fuel_type: "Petrol",
        transmission: "Manual",
        pricePerDay: 80,
        location: "Mumbai",
        description: "Track-focused superbike with razor-sharp handling and explosive acceleration.",
        isAvailable: true
    },
    {
        brand: "KTM",
        model: "Duke 390",
        image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500",
        year: 2023,
        category: "Naked",
        seating_capacity: 2,
        fuel_type: "Petrol",
        transmission: "Manual",
        pricePerDay: 60,
        location: "Delhi",
        description: "Lightweight and agile street fighter with modern technology and aggressive design.",
        isAvailable: true
    },
    {
        brand: "Triumph",
        model: "Street Triple R",
        image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500",
        year: 2023,
        category: "Naked",
        seating_capacity: 2,
        fuel_type: "Petrol",
        transmission: "Manual",
        pricePerDay: 90,
        location: "Chennai",
        description: "British engineering excellence with distinctive triple-cylinder sound and premium components.",
        isAvailable: true
    },
    {
        brand: "Aprilia",
        model: "RS 660",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        year: 2023,
        category: "Sport",
        seating_capacity: 2,
        fuel_type: "Petrol",
        transmission: "Manual",
        pricePerDay: 88,
        location: "Bangalore",
        description: "Modern supersport with advanced electronics and race-derived technology.",
        isAvailable: true
    },
    {
        brand: "Honda",
        model: "CB650R",
        image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500",
        year: 2023,
        category: "Naked",
        seating_capacity: 2,
        fuel_type: "Petrol",
        transmission: "Manual",
        pricePerDay: 72,
        location: "Mumbai",
        description: "Neo-sports cafe styling with smooth inline-four engine and comfortable ergonomics.",
        isAvailable: true
    },
    {
        brand: "Yamaha",
        model: "R6",
        image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=500",
        year: 2023,
        category: "Sport",
        seating_capacity: 2,
        fuel_type: "Petrol",
        transmission: "Manual",
        pricePerDay: 92,
        location: "Delhi",
        description: "Pure-bred supersport with MotoGP-derived technology and track-focused performance.",
        isAvailable: true
    },
    {
        brand: "Kawasaki",
        model: "Z900",
        image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500",
        year: 2023,
        category: "Naked",
        seating_capacity: 2,
        fuel_type: "Petrol",
        transmission: "Manual",
        pricePerDay: 78,
        location: "Chennai",
        description: "Powerful naked bike with aggressive styling and smooth four-cylinder performance.",
        isAvailable: true
    },
    {
        brand: "BMW",
        model: "S1000RR",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        year: 2023,
        category: "Sport",
        seating_capacity: 2,
        fuel_type: "Petrol",
        transmission: "Manual",
        pricePerDay: 120,
        location: "Bangalore",
        description: "Flagship superbike with cutting-edge technology and race-winning performance.",
        isAvailable: true
    },
    {
        brand: "Harley Davidson",
        model: "Iron 883",
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500",
        year: 2023,
        category: "Cruiser",
        seating_capacity: 2,
        fuel_type: "Petrol",
        transmission: "Manual",
        pricePerDay: 85,
        location: "Mumbai",
        description: "Classic Sportster with authentic Harley heritage and customizable style.",
        isAvailable: true
    }
];

// Test function
const testDatabase = async () => {
    await connectDB();

    try {
        // Create or find admin user
        let adminUser = await User.findOne({ email: 'admin@bikerental.com' });

        if (!adminUser) {
            const hashedPassword = await bcrypt.hash('admin123456', 10);
            adminUser = await User.create({
                name: 'Admin User',
                email: 'admin@bikerental.com',
                password: hashedPassword,
                role: 'admin',
                isEmailVerified: true,
                authProvider: 'local'
            });
            console.log('Created admin user: admin@bikerental.com / admin123456');
        } else {
            console.log('Admin user already exists');
        }

        // Clear existing bikes
        await Bike.deleteMany({});
        console.log('Cleared existing bikes');

        // Add admin ID to sample bikes
        const bikesWithAdmin = sampleBikes.map(bike => ({
            ...bike,
            admin: adminUser._id
        }));

        // Add sample bikes
        const bikes = await Bike.insertMany(bikesWithAdmin);
        console.log(`Added ${bikes.length} sample bikes linked to admin user`);

        // Test fetching bikes
        const fetchedBikes = await Bike.find({ isAvailable: true });
        console.log(`Successfully fetched ${fetchedBikes.length} bikes from database`);

        // Test fetching admin bikes
        const adminBikes = await Bike.find({ admin: adminUser._id });
        console.log(`Admin user has ${adminBikes.length} bikes`);

        // Create a test user for bookings
        let testUser = await User.findOne({ email: 'test@example.com' });
        if (!testUser) {
            const hashedPassword = await bcrypt.hash('test123', 10);
            testUser = await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: hashedPassword,
                role: 'user',
                isEmailVerified: true,
                authProvider: 'local'
            });
            console.log('Created test user: test@example.com / test123');
        }

        // Clear existing bookings and users (except admin)
        await Booking.deleteMany({});
        await User.deleteMany({ role: { $ne: 'admin' } });

        // Create sample bookings for both test user and any existing users
        if (bikes.length > 0) {
            // Find your actual user
            const yourUser = await User.findOne({ email: 'rgk1809@gmail.com' });

            // Helper function to calculate days
            const calculateDays = (pickup, returnDate) => {
                const timeDiff = new Date(returnDate) - new Date(pickup);
                return Math.max(1, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
            };

            const sampleBookings = [
                // Bookings for test user
                {
                    bike: bikes[0]._id,
                    user: testUser._id,
                    admin: adminUser._id,
                    pickupDate: new Date('2025-07-01'),
                    returnDate: new Date('2025-07-03'),
                    status: 'confirmed',
                    price: bikes[0].pricePerDay * calculateDays('2025-07-01', '2025-07-03')
                },
                {
                    bike: bikes[1]._id,
                    user: testUser._id,
                    admin: adminUser._id,
                    pickupDate: new Date('2025-07-05'),
                    returnDate: new Date('2025-07-07'),
                    status: 'pending',
                    price: bikes[1].pricePerDay * calculateDays('2025-07-05', '2025-07-07')
                }
            ];

            // Add bookings for your user if found
            if (yourUser && bikes.length >= 4) {
                console.log(`Creating bookings for user: ${yourUser.email}`);
                console.log(`Available bikes: ${bikes.length}`);
                console.log(`Bike 2 price: ${bikes[2].pricePerDay}, Bike 3 price: ${bikes[3].pricePerDay}`);

                sampleBookings.push(
                    {
                        bike: bikes[2]._id,
                        user: yourUser._id,
                        admin: adminUser._id,
                        pickupDate: new Date('2025-07-10'),
                        returnDate: new Date('2025-07-12'),
                        status: 'confirmed',
                        price: bikes[2].pricePerDay * calculateDays('2025-07-10', '2025-07-12')
                    },
                    {
                        bike: bikes[3]._id,
                        user: yourUser._id,
                        admin: adminUser._id,
                        pickupDate: new Date('2025-07-15'),
                        returnDate: new Date('2025-07-17'),
                        status: 'pending',
                        price: bikes[3].pricePerDay * calculateDays('2025-07-15', '2025-07-17')
                    }
                );
                console.log(`Added bookings for user: ${yourUser.email}`);
            } else if (yourUser) {
                console.log(`Not enough bikes to create bookings for ${yourUser.email}`);
            }

            await Booking.insertMany(sampleBookings);
            console.log(`Created ${sampleBookings.length} sample bookings`);
        }

        console.log('\n✅ Database test completed successfully!');
        console.log('📧 Admin Login: admin@bikerental.com / admin123456');
        console.log('👤 Test User Login: test@example.com / test123');
        console.log('You can now login and test the complete system!');

    } catch (error) {
        console.error('Database test failed:', error);
    } finally {
        mongoose.connection.close();
    }
};

testDatabase();
