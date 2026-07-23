const sampleListings = [
  {
    title: "Boys PG Near JIIT Noida",
    description:
      "Comfortable and fully furnished PG for boys with Wi-Fi, study table, attached bathroom, and 24x7 water supply. Walking distance from college in a safe locality.",
    image: {
      filename: "listingimage",
      url: "/images/room1.jpg",
    },
    price: 8500,
    location: "Sector 62",
    country: "Uttar Pradesh",
  },
  {
    title: "Shared Apartment for Students",
    description:
      "Spacious shared apartment ideal for students, featuring Wi-Fi, shared kitchen, laundry facility, and CCTV security. Close to college and public transport.",
    image: {
      filename: "listingimage",
      url: "/images/room2.jpg",
    },
    price: 6500,
    location: "Knowledge Park",
    country: "Uttar Pradesh",
  },
  {
    title: "Budget Student PG",
    description:
      "Affordable PG accommodation with fully furnished rooms, power backup, 24x7 water, and mess facility. A safe locality just a short walk from campus.",
    image: {
      filename: "listingimage",
      url: "/images/room3.jpg",
    },
    price: 5000,
    location: "Vijay Nagar",
    country: "Madhya Pradesh",
  },
  {
    title: "Furnished Studio Room",
    description:
      "Fully furnished studio room with attached bathroom, study table, Wi-Fi, and power backup. Ideal for students looking for a private, safe living space.",
    image: {
      filename: "listingimage",
      url: "/images/room4.jpg",
    },
    price: 9500,
    location: "MP Nagar",
    country: "Madhya Pradesh",
  },
  {
    title: "Private Room for Students",
    description:
      "Private furnished room with attached bathroom, Wi-Fi, study table, and CCTV surveillance. Located in a safe locality close to college.",
    image: {
      filename: "listingimage",
      url:"/images/room1.jpg",
    },
    price: 4800,
    location: "Kothrud",
    country: "Maharashtra",
  },
  {
    title: "Girls Hostel Near Metro Station",
    description:
      "Secure girls hostel with CCTV, 24x7 water, Wi-Fi, and mess facility. Just a few minutes walk from the metro station and college.",
    image: {
      filename: "listingimage",
      url: "/images/room1.jpg",
    },
    price: 7000,
    location: "Indirapuram",
    country: "Uttar Pradesh",
  },
  {
    title: "Student Flat Near College",
    description:
      "Fully furnished student flat with shared kitchen, laundry, Wi-Fi, and power backup. Located within walking distance from college in a safe locality.",
    image: {
      filename: "listingimage",
      url: "/images/room7.jpg",
    },
    price: 5500,
    location: "Kota Talwandi",
    country: "Rajasthan",
  },
  {
    title: "Hostel with Mess Facility",
    description:
      "Well-maintained hostel offering mess facility, Wi-Fi, 24x7 water, power backup, and CCTV security. Located in a safe locality close to major colleges.",
    image: {
      filename: "listingimage",
      url: "/images/room8.jpg",
    },
    price: 8000,
    location: "Whitefield",
    country: "Karnataka",
  },
  {
    title: "Boys PG Near JIIT Noida",
    description:
      "Fully furnished PG for boys with attached bathroom, study table, Wi-Fi, and laundry service. Safe locality within walking distance from college.",
    image: {
      filename: "listingimage",
      url: "/images/room9.jpg",
    },
    price: 7500,
    location: "Hinjawadi",
    country: "Maharashtra",
  },
  {
    title: "Girls Hostel Near Metro Station",
    description:
      "Comfortable girls hostel with mess facility, CCTV, 24x7 water, and Wi-Fi. Located in a safe locality close to the metro station and college.",
    image: {
      filename: "listingimage",
      url: "/images/room10.jpg",
    },
    price: 7200,
    location: "Civil Lines",
    country: "Delhi",
  },
  {
    title: "Shared Apartment for Students",
    description:
      "Well-furnished shared apartment with shared kitchen, laundry, Wi-Fi, and power backup. Conveniently located near college in a safe locality.",
    image: {
      filename: "listingimage",
      url: "/images/room11.jpg",
    },
    price: 6800,
    location: "Sector 62",
    country: "Uttar Pradesh",
  },
  {
    title: "Furnished Studio Room",
    description:
      "Independent furnished studio room with attached bathroom, study table, Wi-Fi, and CCTV security. Great choice for students seeking privacy.",
    image: {
      filename: "listingimage",
      url: "/images/room12.jpg",
    },
    price: 12000,
    location: "Knowledge Park",
    country: "Uttar Pradesh",
  },
  {
    title: "Budget Student PG",
    description:
      "Affordable and clean PG with fully furnished rooms, Wi-Fi, mess facility, and 24x7 water supply. Safe locality near college.",
    image: {
      filename: "listingimage",
      url: "/images/room13.jpg",
    },
    price: 5200,
    location: "Vijay Nagar",
    country: "Madhya Pradesh",
  },
  {
    title: "Private Room for Students",
    description:
      "Spacious private room with attached bathroom, study table, Wi-Fi, and power backup. Located in a safe locality close to campus.",
    image: {
      filename: "listingimage",
      url: "/images/room1.jpg",
    },
    price: 9000,
    location: "MP Nagar",
    country: "Madhya Pradesh",
  },
  {
    title: "Student Flat Near College",
    description:
      "Fully furnished flat with shared kitchen, laundry, Wi-Fi, and CCTV security. Just a short walk from college in a safe locality.",
    image: {
      filename: "listingimage",
      url: "/images/room15.jpg",
    },
    price: 6800,
    location: "Kothrud",
    country: "Maharashtra",
  },
  {
    title: "Hostel with Mess Facility",
    description:
      "Budget-friendly hostel with mess facility, Wi-Fi, 24x7 water, and CCTV surveillance. Conveniently located near college.",
    image: {
      filename: "listingimage",
      url: "/images/room2.jpg",
    },
    price: 6000,
    location: "Kota Talwandi",
    country: "Rajasthan",
  },
  {
    title: "Furnished Studio Room",
    description:
      "Modern furnished studio room with attached bathroom, study table, Wi-Fi, and power backup. Ideal for students in a safe locality.",
    image: {
      filename: "listingimage",
      url: "/images/room1.jpg",
    },
    price: 9800,
    location: "Whitefield",
    country: "Karnataka",
  },
  {
    title: "Boys PG Near JIIT Noida",
    description:
      "Well-maintained PG for boys with attached bathroom, Wi-Fi, study table, and mess facility. Walking distance from college in a safe locality.",
    image: {
      filename: "listingimage",
      url: "/images/room18.jpg",
    },
    price: 8200,
    location: "Hinjawadi",
    country: "Maharashtra",
  },
  {
    title: "Girls Hostel Near Metro Station",
    description:
      "Secure and comfortable girls hostel with CCTV, mess facility, Wi-Fi, and 24x7 water. Close to metro station and college.",
    image: {
      filename: "listingimage",
      url: "/images/room3.jpg",
    },
    price: 7800,
    location: "Civil Lines",
    country: "Delhi",
  },
  {
    title: "Shared Apartment for Students",
    description:
      "Comfortable shared apartment with shared kitchen, laundry, Wi-Fi, and CCTV. Located in a safe locality close to college.",
    image: {
      filename: "listingimage",
      url: "/images/room1.jpg",
    },
    price: 7000,
    location: "Indirapuram",
    country: "Uttar Pradesh",
  },
  {
    title: "Budget Student PG",
    description:
      "Simple and affordable PG with fully furnished rooms, Wi-Fi, 24x7 water, and power backup. Safe locality near college.",
    image: {
      filename: "listingimage",
      url: "/images/room2.jpg",
    },
    price: 4700,
    location: "Kota Talwandi",
    country: "Rajasthan",
  },
  {
    title: "Student Flat Near College",
    description:
      "Fully furnished student flat with shared kitchen, laundry, Wi-Fi, and CCTV security. Walking distance from college in a safe locality.",
    image: {
      filename: "listingimage",
      url: "/images/room3.jpg",
    },
    price: 9200,
    location: "MP Nagar",
    country: "Madhya Pradesh",
  },
  {
    title: "Private Room for Students",
    description:
      "Cozy private room with attached bathroom, study table, Wi-Fi, and 24x7 water supply. Located in a safe locality close to campus.",
    image: {
      filename: "listingimage",
      url: "/images/room1.jpg",
    },
    price: 4500,
    location: "Vijay Nagar",
    country: "Madhya Pradesh",
  },
  {
    title: "Hostel with Mess Facility",
    description:
      "Reliable hostel offering mess facility, Wi-Fi, laundry, and CCTV security. Located in a safe locality near college.",
    image: {
      filename: "listingimage",
      url: "/images/room1.jpg",
    },
    price: 6900,
    location: "Whitefield",
    country: "Karnataka",
  },
  {
    title: "Furnished Studio Room",
    description:
      "Centrally located furnished studio room with attached bathroom, Wi-Fi, study table, and power backup. Perfect for students.",
    image: {
      filename: "listingimage",
      url:"/images/room1.jpg"
    },
    price: 10500,
    location: "Hinjawadi",
    country: "Maharashtra",
  },
  {
    title: "Boys PG Near JIIT Noida",
    description:
      "Comfortable PG for boys with attached bathroom, Wi-Fi, study table, and mess facility. Close to college in a safe locality.",
    image: {
      filename: "listingimage",
      url: "/images/room7.jpg",
    },
    price: 7900,
    location: "Sector 62",
    country: "Uttar Pradesh",
  },
  {
    title: "Shared Apartment for Students",
    description:
      "Well-furnished shared apartment with shared kitchen, laundry facility, Wi-Fi, and CCTV security. Near college in a safe locality.",
    image: {
      filename: "listingimage",
      url: "/images/room8.jpg",
    },
    price: 7300,
    location: "Knowledge Park",
    country: "Uttar Pradesh",
  },
  {
    title: "Budget Student PG",
    description:
      "Clean and affordable PG accommodation with fully furnished rooms, Wi-Fi, mess facility, and 24x7 water. Safe locality near campus.",
    image: {
      filename: "listingimage",
      url: "/images/room9.jpg",
    },
    price: 5300,
    location: "Vijay Nagar",
    country: "Madhya Pradesh",
  },
  {
    title: "Student Flat Near College",
    description:
      "Furnished flat with shared kitchen, laundry, Wi-Fi, and power backup. Located a short walk from college in a safe locality.",
    image: {
      filename: "listingimage",
      url: "/images/room10.jpg",
    },
    price: 6200,
    location: "MP Nagar",
    country: "Madhya Pradesh",
  },
];

module.exports = { data: sampleListings };